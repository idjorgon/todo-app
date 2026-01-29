# Terraform AWS Infrastructure for Todo App

This directory contains Terraform configuration for deploying the Todo application to AWS.

## Architecture

The infrastructure includes:
- **VPC**: Custom VPC with public and private subnets across 2 AZs
- **ECS Fargate**: Container orchestration for backend and frontend
- **Application Load Balancer**: Traffic distribution with health checks
- **CloudWatch**: Centralized logging and monitoring
- **IAM**: Least-privilege roles for ECS tasks
- **Security Groups**: Network isolation and access control

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform >= 1.0 installed
3. Docker images pushed to a container registry (ECR, Docker Hub, etc.)

## Setup

1. Copy the example tfvars file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Update `terraform.tfvars` with your values:
   - AWS region and availability zones
   - Docker image URIs
   - JWT secret (use a secure random string)
   - Optional: ACM certificate ARN for HTTPS

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Review the execution plan:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

## Outputs

After successful deployment, Terraform will output:
- `application_url`: URL to access your application
- `alb_dns_name`: Load balancer DNS name
- `ecs_cluster_name`: ECS cluster name
- `vpc_id`: VPC identifier

## Cost Estimation

Approximate monthly costs (us-east-1):
- NAT Gateway: ~$32
- Application Load Balancer: ~$18
- ECS Fargate (2 tasks each): ~$30-60
- **Total**: ~$80-110/month

## Security Best Practices

✅ **Implemented:**
- Private subnets for application containers
- Security groups with least-privilege access
- HTTPS support (optional, requires ACM certificate)
- CloudWatch logging enabled
- Container Insights for monitoring
- IAM roles with minimal permissions

⚠️ **Production Recommendations:**
- Enable AWS WAF on the ALB
- Use AWS Secrets Manager for sensitive data
- Enable S3 backend for Terraform state with encryption
- Use DynamoDB for state locking
- Enable VPC Flow Logs
- Set up CloudWatch alarms
- Implement backup strategy
- Use AWS RDS instead of H2 in-memory database

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

## Terraform State Management

For production, use remote state:

1. Create S3 bucket and DynamoDB table:
   ```bash
   aws s3 mb s3://your-terraform-state-bucket
   aws dynamodb create-table \
     --table-name terraform-state-lock \
     --attribute-definitions AttributeName=LockID,AttributeType=S \
     --key-schema AttributeName=LockID,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

2. Uncomment the backend configuration in `main.tf`

3. Run `terraform init -migrate-state`

## Scaling

Adjust scaling in the ECS service configuration:
- Modify `desired_count` in `ecs.tf`
- Implement auto-scaling based on CPU/memory metrics
- Increase ALB capacity if needed

## Monitoring

Access CloudWatch Logs:
```bash
aws logs tail /ecs/todo-app/backend --follow
aws logs tail /ecs/todo-app/frontend --follow
```

## Troubleshooting

1. **Service not starting**: Check CloudWatch logs for errors
2. **Health check failures**: Verify security groups and target group health check paths
3. **Connection timeouts**: Ensure NAT Gateway and route tables are correctly configured
4. **High costs**: Review NAT Gateway usage, consider VPC endpoints
