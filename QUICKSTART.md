# Quick Start Guide

This guide will help you get the Todo application running locally in under 5 minutes.

## Prerequisites

Ensure you have the following installed:
- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Maven 3.8+** - [Download](https://maven.apache.org/)
- **Git** - [Download](https://git-scm.com/)

Optional:
- **Docker** - [Download](https://www.docker.com/) (for containerized deployment)

## Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-app
```

### 2. Start the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify backend is running:**
```bash
curl http://localhost:8080/actuator/health
```

### 3. Start the Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Use the Application

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create a new account
3. Fill in the registration form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123 (or stronger)
4. You'll be automatically logged in
5. Start creating todos!

## Docker Quick Start

If you prefer using Docker:

```bash
# Build and start all services
docker-compose up --build

# Access the application
open http://localhost:3000
```

To stop:
```bash
docker-compose down
```

## API Endpoints

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:tododb`
  - Username: `sa`
  - Password: (leave empty)

## Testing the API with cURL

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Save the token from the response!

### Create a Todo
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Todo",
    "description": "This is a test todo",
    "completed": false,
    "priority": "HIGH"
  }'
```

### Get All Todos
```bash
curl -X GET http://localhost:8080/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Running Tests

### Backend Tests
```bash
cd backend

# Unit tests
mvn test

# Integration tests
mvn verify

# Test coverage report
mvn jacoco:report
# Open target/site/jacoco/index.html
```

### Frontend Tests
```bash
cd frontend

# Unit tests
npm test

# E2E tests (requires backend running)
npm run test:e2e
```

## Troubleshooting

### Backend won't start
- **Check Java version**: `java -version` (should be 17+)
- **Check port 8080**: Make sure nothing else is using it
- **Clean build**: `mvn clean install`

### Frontend won't start
- **Check Node version**: `node -v` (should be 18+)
- **Clear cache**: `rm -rf node_modules package-lock.json && npm install`
- **Check port 3000**: Make sure nothing else is using it

### Database issues
- H2 is in-memory, data is lost on restart (this is expected)
- Check H2 console at http://localhost:8080/h2-console

### CORS errors
- Ensure backend is running on port 8080
- Check `cors.allowed-origins` in `backend/src/main/resources/application.properties`

### Authentication errors
- Check JWT_SECRET in environment variables
- Token expires after 1 hour - login again
- Clear localStorage if issues persist

## Environment Variables

### Backend (Optional)
```bash
export JWT_SECRET=your-secret-key-change-in-production
export JWT_EXPIRATION=3600000
```

### Frontend (Optional)
```bash
export REACT_APP_API_URL=http://localhost:8080
```

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Review [SECURITY.md](SECURITY.md) for security best practices
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the [Swagger API documentation](http://localhost:8080/swagger-ui.html)
- Deploy to AWS using [Terraform](terraform/README.md)

## Default Ports

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend  | 8080 | http://localhost:8080 |
| H2 Console | 8080 | http://localhost:8080/h2-console |

## Quick Commands Reference

```bash
# Backend
cd backend
mvn spring-boot:run          # Run backend
mvn test                     # Run tests
mvn clean install            # Build

# Frontend
cd frontend
npm start                    # Run frontend
npm test                     # Run tests
npm run build                # Build for production

# Docker
docker-compose up            # Start all services
docker-compose down          # Stop all services
docker-compose logs -f       # View logs

# Testing
cd backend && mvn verify     # Backend integration tests
cd frontend && npm run test:e2e  # Frontend E2E tests
```

## Support

If you encounter any issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review application logs
3. Open an issue on GitHub
4. Check existing issues for solutions

Happy coding! 🚀
