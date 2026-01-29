# Todo Application - Full Stack

A modern, full-stack todo application built with Spring Boot and React. Features JWT authentication, comprehensive testing (unit, integration, and E2E), and automated CI/CD pipeline with GitHub Actions.

## Architecture

- **Backend**: Java 17 Spring Boot with H2 in-memory database
- **Frontend**: React 18 with TypeScript and Redux Toolkit
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Security**: Input validation, CORS, CSRF protection
- **Testing**: Unit tests (JUnit, Jest), Integration tests, E2E tests (Playwright)
- **CI/CD**: Automated GitHub Actions pipeline

## Project Structure

```
todo-app/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── services/
│   │   └── tests/
│   ├── package.json
│   └── Dockerfile
├── terraform/             # AWS infrastructure
├── .github/
│   └── workflows/
└── README.md
```

## Features

### Backend
- RESTful API endpoints for todos
- JWT authentication and authorization
- Password encryption with bcrypt
- Input validation and sanitization
- CORS and CSRF protection
- H2 in-memory database with JPA
- Comprehensive error handling
- API documentation with OpenAPI/Swagger

### Frontend
- React with TypeScript
- Redux for state management
- Protected routes
- JWT token management
- Form validation
- Responsive design
- Accessibility (WCAG)

### Security (OWASP Top 10)
- ✅ A01: Broken Access Control - JWT authentication, role-based access
- ✅ A02: Cryptographic Failures - bcrypt password hashing, HTTPS
- ✅ A03: Injection - Prepared statements, input validation
- ✅ A04: Insecure Design - Security by design principles
- ✅ A05: Security Misconfiguration - Secure defaults, headers
- ✅ A06: Vulnerable Components - Dependency scanning
- ✅ A07: Authentication Failures - Strong password policy, JWT
- ✅ A08: Software/Data Integrity - Checksums, code signing
- ✅ A09: Logging Failures - Comprehensive logging
- ✅ A10: SSRF - Input validation, allowlisting

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+
- Docker (optional)

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### Running Tests

**Backend Tests:**
```bash
cd backend
mvn test                    # Unit tests
mvn verify                  # Integration tests
```

**Frontend Tests:**
```bash
cd frontend
npm test                    # Unit tests
npm run test:e2e           # E2E tests
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### AWS Deployment

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Todos
- `GET /api/todos` - Get all todos (authenticated)
- `GET /api/todos/{id}` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## Environment Variables

### Backend
```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600000
DB_URL=jdbc:h2:mem:tododb
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:8080
```

## CI/CD Pipeline

Automated GitHub Actions workflow (`.github/workflows/ci-cd.yml`) with three main jobs:

### Current Pipeline

1. **Backend Tests** (JUnit + Maven)
   - Unit tests with Mockito
   - Integration tests with Spring Test
   - Code coverage reporting with JaCoCo
   
2. **Frontend Tests** (Jest + ESLint)
   - Linting with ESLint
   - Unit tests with React Testing Library
   - Code coverage reporting
   
3. **E2E Tests** (Playwright)
   - Full user flow testing
   - Automated browser testing
   - Test artifact uploads

**Triggers**: Push/PR to `main` or `develop` branches, manual workflow dispatch

### Suggested Enhancements

#### Short Term (Easy Wins)
- [ ] **Branch Protection Rules** - Require PR reviews and passing tests before merge
- [ ] **Build Caching** - Cache Maven/npm dependencies to speed up builds (~30-50% faster)
- [ ] **Parallel Job Execution** - Run backend and frontend tests in parallel
- [ ] **Status Badges** - Add workflow status badges to README
- [ ] **Test Reports** - Publish test results as GitHub Actions summaries
- [ ] **Slack/Discord Notifications** - Alert team on build failures

#### Medium Term (Quality & Security)
- [ ] **Code Quality Gates** - Add SonarCloud or CodeClimate integration
- [ ] **Security Scanning** - Implement Snyk, Trivy, or OWASP Dependency Check
- [ ] **Performance Testing** - Add JMeter or k6 load tests
- [ ] **Database Migrations** - Add Flyway/Liquibase migration validation
- [ ] **Environment Deployments** - Deploy to dev/staging on branch pushes
- [ ] **Semantic Versioning** - Auto-generate version numbers and changelogs

#### Long Term (Production Ready)
- [ ] **Docker Image Publishing** - Push to GitHub Container Registry or Docker Hub
- [ ] **Multi-Environment Deployments** - dev → staging → production pipeline
- [ ] **Infrastructure as Code** - Terraform plan/apply automation for AWS
- [ ] **Smoke Tests** - Post-deployment health checks
- [ ] **Rollback Strategy** - Automated rollback on failed deployments
- [ ] **Blue-Green Deployments** - Zero-downtime deployment strategy
- [ ] **Monitoring Integration** - Datadog, New Relic, or CloudWatch alerts
- [ ] **Feature Flags** - LaunchDarkly or similar for controlled rollouts

#### Advanced (Enterprise Scale)
- [ ] **Multi-Region Deployments** - Global CDN and geo-distributed services
- [ ] **Chaos Engineering** - Automated resilience testing
- [ ] **Contract Testing** - Pact or Spring Cloud Contract for API contracts
- [ ] **Compliance Checks** - SOC2, HIPAA, GDPR validation gates
- [ ] **Artifact Scanning** - Binary vulnerability scanning
- [ ] **Scheduled Testing** - Nightly regression test runs

## Getting Started with GitHub

### Initial Setup

1. **Create GitHub Repository**
   ```bash
   # Initialize git
   git init
   git add .
   git commit -m "Initial commit: Full-stack todo app"
   
   # Add remote (replace YOUR-USERNAME)
   git remote add origin https://github.com/YOUR-USERNAME/todo-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Verify Workflow**
   - Navigate to the **Actions** tab in your GitHub repository
   - Watch the CI/CD pipeline execute automatically
   - All tests should pass on first run (no secrets required)

3. **Enable Branch Protection** (Recommended)
   - Go to Settings → Branches → Add rule
   - Branch name pattern: `main`
   - Enable: "Require status checks to pass before merging"
   - Select: `backend-test`, `frontend-test`, `e2e-test`

For detailed E2E testing instructions, see [E2E_TESTING_GUIDE.md](E2E_TESTING_GUIDE.md)

## Security Features

1. **Authentication**: JWT tokens with secure signing
2. **Password Security**: bcrypt hashing with salt
3. **Input Validation**: Backend and frontend validation
4. **HTTPS**: SSL/TLS encryption in production
5. **CORS**: Configured for allowed origins
6. **CSRF**: Token-based protection
7. **SQL Injection**: Prevented via JPA/Hibernate
8. **XSS**: React auto-escaping, Content Security Policy
9. **Rate Limiting**: API throttling
10. **Security Headers**: HSTS, X-Frame-Options, etc.

## Testing Strategy

- **Unit Tests**: Individual component/function testing
- **Integration Tests**: API endpoint testing with TestContainers
- **E2E Tests**: Full user flow testing with Playwright
- **Coverage**: Minimum 80% code coverage

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request
