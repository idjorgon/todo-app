# AWS Deployment Guide

This guide provides comprehensive steps to deploy the Todo application to AWS using GitHub Actions CI/CD pipeline.

## Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [One-Time AWS Setup](#one-time-aws-setup)
- [GitHub Actions Deployment Steps](#github-actions-deployment-steps)
- [Complete Deployment Flow](#complete-deployment-flow)
- [Cost Considerations](#cost-considerations)
- [Cleanup](#cleanup)

## Prerequisites

### AWS Account Setup

1. **Create an AWS Account**
   - Sign up at [aws.amazon.com](https://aws.amazon.com)

2. **Create an IAM User with Programmatic Access**
   - Navigate to IAM → Users → Add User
   - Select "Access key - Programmatic access"
   - Attach the following policies:
     - `AmazonECS_FullAccess`
     - `AmazonEC2ContainerRegistryFullAccess`
     - `IAMFullAccess`
     - `AmazonVPCFullAccess`
     - `ElasticLoadBalancingFullAccess`
   - Save the Access Key ID and Secret Access Key

3. **Install AWS CLI** (for manual setup steps)
   ```bash
   # macOS
   brew install awscli
   
   # Configure AWS CLI
   aws configure
   ```

## GitHub Secrets Configuration

Navigate to your repository → **Settings** → **Secrets and variables** → **Actions**, and add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key from IAM user | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key from IAM user | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `JWT_SECRET` | Secure random string for JWT token signing (minimum 256 bits) | Use: `openssl rand -base64 32` |

## One-Time AWS Setup

Before running the GitHub Actions pipeline, complete these manual setup steps:

### 1. Create ECR Repositories

```bash
# Create backend repository
aws ecr create-repository \
  --repository-name todo-backend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true

# Create frontend repository
aws ecr create-repository \
  --repository-name todo-frontend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true
```

### 2. Configure Terraform Backend (Recommended)

Create an S3 bucket and DynamoDB table for Terraform state management:

```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://your-terraform-state-bucket-name --region us-east-1

# Enable versioning on the bucket
aws s3api put-bucket-versioning \
  --bucket your-terraform-state-bucket-name \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Update `terraform/main.tf` to include the backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket-name"
    key            = "todo-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

### 3. Update Terraform Variables

Create `terraform/terraform.tfvars` based on `terraform/terraform.tfvars.example` with your specific values.

## GitHub Actions Deployment Steps

Add the following jobs to `.github/workflows/ci-cd.yml` to enable AWS deployment:

### Step 1: Build and Push Docker Images

Add this job after the existing test jobs:

```yaml
  build-and-push:
    name: Build and Push Docker Images
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test, e2e-test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: todo-backend
          IMAGE_TAG: ${{ github.sha }}
        working-directory: ./backend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Build, tag, and push frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: todo-frontend
          IMAGE_TAG: ${{ github.sha }}
        working-directory: ./frontend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Output image URIs
        id: image-uris
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          echo "backend-image=$ECR_REGISTRY/todo-backend:${{ github.sha }}" >> $GITHUB_OUTPUT
          echo "frontend-image=$ECR_REGISTRY/todo-frontend:${{ github.sha }}" >> $GITHUB_OUTPUT
```

### Step 2: Terraform Infrastructure Deployment

```yaml
  terraform-deploy:
    name: Deploy Infrastructure with Terraform
    runs-on: ubuntu-latest
    needs: [build-and-push]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Terraform Init
        working-directory: ./terraform
        run: terraform init

      - name: Terraform Plan
        working-directory: ./terraform
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          TF_VAR_backend_image: ${{ steps.login-ecr.outputs.registry }}/todo-backend:${{ github.sha }}
          TF_VAR_frontend_image: ${{ steps.login-ecr.outputs.registry }}/todo-frontend:${{ github.sha }}
          TF_VAR_jwt_secret: ${{ secrets.JWT_SECRET }}
          TF_VAR_aws_region: ${{ secrets.AWS_REGION }}
        run: terraform plan -out=tfplan

      - name: Terraform Apply
        working-directory: ./terraform
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          TF_VAR_backend_image: ${{ steps.login-ecr.outputs.registry }}/todo-backend:${{ github.sha }}
          TF_VAR_frontend_image: ${{ steps.login-ecr.outputs.registry }}/todo-frontend:${{ github.sha }}
          TF_VAR_jwt_secret: ${{ secrets.JWT_SECRET }}
          TF_VAR_aws_region: ${{ secrets.AWS_REGION }}
        run: terraform apply -auto-approve tfplan

      - name: Get Application URL
        working-directory: ./terraform
        run: |
          echo "Application URL: $(terraform output -raw application_url)"
```

### Step 3: Update ECS Services

Force ECS to deploy the new Docker images:

```yaml
  update-ecs-services:
    name: Update ECS Services
    runs-on: ubuntu-latest
    needs: [terraform-deploy]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Update backend service
        run: |
          aws ecs update-service \
            --cluster todo-app-cluster \
            --service todo-app-backend-service \
            --force-new-deployment

      - name: Update frontend service
        run: |
          aws ecs update-service \
            --cluster todo-app-cluster \
            --service todo-app-frontend-service \
            --force-new-deployment

      - name: Wait for services to stabilize
        run: |
          aws ecs wait services-stable \
            --cluster todo-app-cluster \
            --services todo-app-backend-service todo-app-frontend-service
```

### Step 4: Smoke Tests

Run post-deployment health checks:

```yaml
  smoke-tests:
    name: Run Smoke Tests
    runs-on: ubuntu-latest
    needs: [update-ecs-services]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Get ALB URL
        id: get-url
        run: |
          ALB_DNS=$(aws elbv2 describe-load-balancers \
            --names todo-app-alb \
            --query 'LoadBalancers[0].DNSName' \
            --output text)
          echo "alb-url=http://$ALB_DNS" >> $GITHUB_OUTPUT

      - name: Test backend health
        run: |
          for i in {1..30}; do
            if curl -f "${{ steps.get-url.outputs.alb-url }}/actuator/health"; then
              echo "Backend is healthy"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 10
          done
          exit 1

      - name: Test frontend availability
        run: |
          for i in {1..30}; do
            if curl -f "${{ steps.get-url.outputs.alb-url }}"; then
              echo "Frontend is available"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 10
          done
          exit 1
```

## Complete Deployment Flow

When you push to the `main` branch, the pipeline executes in this order:

1. **backend-test** → Run backend unit and integration tests
2. **frontend-test** → Run frontend linting and unit tests  
3. **e2e-test** → Run end-to-end Playwright tests (depends on backend-test)
4. **build-and-push** → Build Docker images and push to Amazon ECR (only on main branch)
5. **terraform-deploy** → Provision/update AWS infrastructure using Terraform
6. **update-ecs-services** → Force ECS services to deploy new Docker images
7. **smoke-tests** → Verify deployment health with HTTP checks

### Deployment Architecture

The Terraform configuration will create:

- **VPC** with public and private subnets across 2 availability zones
- **Application Load Balancer** (ALB) for traffic distribution
- **ECS Fargate Cluster** for container orchestration
- **ECS Services** for backend and frontend containers
- **Security Groups** for network security
- **CloudWatch Logs** for application logging
- **NAT Gateway** for outbound internet access from private subnets

### Environment Variables

The backend service will be configured with:
- `SPRING_PROFILES_ACTIVE=prod`
- `JWT_SECRET` (from GitHub Secrets)
- Database connection settings (if configured)

## Cost Considerations

Based on the infrastructure defined in `terraform/README.md`, approximate monthly costs in the `us-east-1` region:

| Resource | Estimated Cost |
|----------|---------------|
| NAT Gateway (2 AZs) | ~$32/month |
| Application Load Balancer | ~$18/month |
| ECS Fargate (Backend - 2 tasks, 0.5 vCPU, 1GB RAM) | ~$15-30/month |
| ECS Fargate (Frontend - 2 tasks, 0.25 vCPU, 0.5GB RAM) | ~$10-20/month |
| CloudWatch Logs | ~$2-5/month |
| Data Transfer | Variable |
| **Total** | **~$80-110/month** |

### Cost Optimization Tips

1. **Reduce NAT Gateways**: Use a single NAT Gateway instead of one per AZ (reduces HA)
2. **Use Smaller Task Sizes**: Adjust CPU/memory based on actual usage
3. **Implement Auto-Scaling**: Scale down during off-peak hours
4. **Use Spot Instances**: Consider Fargate Spot for non-production environments
5. **Set CloudWatch Log Retention**: Limit log retention to 7-30 days

## Monitoring and Logging

### CloudWatch Logs

View application logs:

```bash
# Backend logs
aws logs tail /ecs/todo-app-backend --follow

# Frontend logs
aws logs tail /ecs/todo-app-frontend --follow
```

### ECS Service Status

Check deployment status:

```bash
# List running tasks
aws ecs list-tasks --cluster todo-app-cluster

# Describe backend service
aws ecs describe-services \
  --cluster todo-app-cluster \
  --services todo-app-backend-service

# View service events
aws ecs describe-services \
  --cluster todo-app-cluster \
  --services todo-app-backend-service \
  --query 'services[0].events[:10]'
```

### Access Application

After successful deployment, get the application URL:

```bash
cd terraform
terraform output application_url
```

Or via AWS CLI:

```bash
aws elbv2 describe-load-balancers \
  --names todo-app-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text
```

## Troubleshooting

### Common Issues

1. **ECR Repository Not Found**
   - Ensure ECR repositories were created in the correct region
   - Verify repository names match: `todo-backend` and `todo-frontend`

2. **Terraform State Conflicts**
   - If using S3 backend, ensure only one deployment runs at a time
   - Check DynamoDB lock table for stale locks

3. **ECS Tasks Failing to Start**
   - Check CloudWatch logs for container errors
   - Verify IAM roles have necessary permissions
   - Ensure security groups allow required traffic

4. **Health Checks Failing**
   - Verify backend health endpoint: `/actuator/health`
   - Check frontend is serving on correct port
   - Review ALB target group health status

### Debug Commands

```bash
# Check task failures
aws ecs describe-tasks \
  --cluster todo-app-cluster \
  --tasks <task-id>

# View stopped tasks
aws ecs list-tasks \
  --cluster todo-app-cluster \
  --desired-status STOPPED

# Check ALB target health
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

## Cleanup

To destroy all AWS resources and stop incurring costs:

### Option 1: Manual Cleanup

```bash
cd terraform
terraform destroy
```

When prompted, type `yes` to confirm.

### Option 2: Add Destroy Workflow (Optional)

Create `.github/workflows/destroy-infrastructure.yml`:

```yaml
name: Destroy AWS Infrastructure

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "destroy" to confirm'
        required: true

jobs:
  destroy:
    name: Destroy Infrastructure
    runs-on: ubuntu-latest
    if: github.event.inputs.confirm == 'destroy'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: Terraform Init
        working-directory: ./terraform
        run: terraform init

      - name: Terraform Destroy
        working-directory: ./terraform
        run: terraform destroy -auto-approve
```

### Manual ECR Cleanup

ECR repositories may need manual deletion:

```bash
# Delete all images in backend repository
aws ecr batch-delete-image \
  --repository-name todo-backend \
  --image-ids "$(aws ecr list-images --repository-name todo-backend --query 'imageIds[*]' --output json)" || true

# Delete all images in frontend repository
aws ecr batch-delete-image \
  --repository-name todo-frontend \
  --image-ids "$(aws ecr list-images --repository-name todo-frontend --query 'imageIds[*]' --output json)" || true

# Delete repositories
aws ecr delete-repository --repository-name todo-backend --force
aws ecr delete-repository --repository-name todo-frontend --force
```

## Security Best Practices

1. **Secrets Management**
   - Never commit AWS credentials to Git
   - Rotate access keys regularly
   - Use GitHub Secrets for sensitive data

2. **IAM Permissions**
   - Follow principle of least privilege
   - Use separate IAM users for different environments
   - Enable MFA for production access

3. **Network Security**
   - Keep ECS tasks in private subnets
   - Use security groups to restrict traffic
   - Enable VPC Flow Logs for monitoring

4. **Container Security**
   - Scan Docker images for vulnerabilities
   - Use non-root users in containers
   - Keep base images updated

5. **Terraform State**
   - Enable S3 bucket encryption
   - Enable versioning on state bucket
   - Restrict access to state files

## Next Steps

1. **Custom Domain**: Configure Route 53 and ACM for HTTPS
2. **Database**: Add RDS PostgreSQL/MySQL for persistent storage
3. **Caching**: Implement ElastiCache Redis for session management
4. **CDN**: Add CloudFront for static asset delivery
5. **Monitoring**: Set up CloudWatch alarms and dashboards
6. **CI/CD Enhancements**: Add approval steps for production deployments
7. **Blue/Green Deployment**: Implement zero-downtime deployments
8. **Backup Strategy**: Configure automated RDS backups

## Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
