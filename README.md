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

GitHub Actions workflow includes:
- Build and test backend
- Build and test frontend

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
