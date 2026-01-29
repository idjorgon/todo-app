# E2E Testing Guide

## Running E2E Tests Locally

### Prerequisites
1. **Backend must be running** on port 8080
2. **Node dependencies installed** in frontend

### Option 1: Automated (Playwright handles frontend)

This is the easiest way - Playwright will automatically start the frontend:

```bash
# Terminal 1: Start the backend
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@17  # macOS with Homebrew
mvn spring-boot:run

# Terminal 2: Run E2E tests (Playwright starts frontend automatically)
cd frontend
npm run test:e2e
```

### Option 2: Manual (you control both servers)

If you want more control or to debug:

```bash
# Terminal 1: Start backend
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
mvn spring-boot:run

# Terminal 2: Start frontend
cd frontend
npm start

# Terminal 3: Run E2E tests
cd frontend
npm run test:e2e
```

### Running in UI Mode (Interactive)

Great for debugging and seeing tests in action:

```bash
# With backend running:
cd frontend
npx playwright test --ui
```

### Running Specific Tests

```bash
# Run only one test file
npx playwright test todo.spec.ts

# Run tests in headed mode (see the browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug
```

### View Test Report

After tests run:

```bash
cd frontend
npx playwright show-report
```

## Troubleshooting

### Backend not responding
- Verify backend is running: `curl http://localhost:8080/api/health` or check logs
- Wait 30+ seconds after starting backend for it to fully initialize

### Frontend won't start
- Check port 3000 is available: `lsof -ti:3000`
- Kill existing process: `kill $(lsof -ti:3000)`
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`

### Tests timing out
- Increase timeout in test or playwright.config.ts
- Backend might be slow to start - check logs
- Network issues - verify both servers are accessible

### "Browser not found" error
```bash
cd frontend
npx playwright install chromium
```

## Test Structure

E2E tests are in `frontend/e2e/todo.spec.ts` and test:
- ✅ User registration flow
- ✅ Full todo CRUD operations (create, read, update, delete)
- ✅ Authentication and logout
- ✅ Protected route redirects

Each test is independent and can run in isolation.
