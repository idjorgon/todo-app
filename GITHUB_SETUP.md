# GitHub Setup & Workflow Testing Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Fill in the details:
   - **Repository name**: `todo-app`
   - **Description**: "Full-stack todo application with Spring Boot and React"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

## Step 2: Initialize Git and Push to GitHub

Run these commands in your terminal from the project root:

```bash
# Navigate to project directory
cd /Users/ivan.djorgon/Library/CloudStorage/OneDrive-Slalom/Desktop/bitbucket/todo-app

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack todo app with CI/CD pipeline"

# Add GitHub remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/todo-app.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify the Workflow

Once pushed, the CI/CD workflow will automatically trigger. To view it:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see "CI/CD Pipeline" workflow running
4. Click on the workflow run to see progress

### Expected Workflow Jobs:

✅ **backend-test** - Runs Maven tests and generates coverage  
✅ **frontend-test** - Runs ESLint and Jest unit tests  
✅ **frontend-e2e-test** - Runs Playwright E2E tests (needs backend running)

## Step 4: Trigger Workflow Manually

To test the workflow without pushing code:

1. Go to **Actions** tab
2. Click **CI/CD Pipeline** in the left sidebar
3. Click **Run workflow** button on the right
4. Select branch (main) and click **Run workflow**

## Step 5: Test with a Pull Request

```bash
# Create a new branch
git checkout -b feature/test-workflow

# Make a small change (e.g., update README)
echo "\n## Test Change" >> README.md

# Commit and push
git add README.md
git commit -m "Test: Verify CI/CD pipeline"
git push -u origin feature/test-workflow
```

Then on GitHub:
1. Click **Pull requests** → **New pull request**
2. Select `feature/test-workflow` → `main`
3. Create the pull request
4. The workflow will automatically run for the PR

## Troubleshooting

### If backend tests fail:
- Ensure Java 17 is properly configured in GitHub Actions
- Check Maven dependency resolution

### If frontend tests fail:
- Verify `package-lock.json` exists and is committed
- Check that all npm dependencies install correctly

### If E2E tests fail:
- This is normal if backend takes longer than 30s to start
- Increase `sleep` time in workflow if needed
- E2E tests require both backend and frontend to work

## Workflow Configuration

The workflow triggers on:
- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop` branches
- **Manual** trigger via workflow_dispatch

No secrets or external services required - the workflow runs completely self-contained!
