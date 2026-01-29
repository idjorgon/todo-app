# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-29

### Added
- Initial release of Todo application
- Full-stack architecture with Java Spring Boot backend and React frontend
- JWT-based authentication and authorization
- RESTful API for todo management
- User registration and login
- Todo CRUD operations (Create, Read, Update, Delete)
- Todo filtering by status (completed/active)
- Priority levels for todos (LOW, MEDIUM, HIGH)
- Due date support for todos
- H2 in-memory database
- Redux state management in frontend
- Responsive UI design
- Comprehensive unit tests (backend)
- Integration tests (backend)
- E2E tests with Playwright (frontend)
- GitHub Actions CI/CD pipeline
- Docker containerization
- Docker Compose for local development
- Terraform infrastructure as code for AWS deployment
- Security headers and CORS configuration
- Input validation on backend and frontend
- Password hashing with bcrypt
- OWASP Top 10 security considerations
- OpenAPI/Swagger documentation
- CloudWatch logging integration
- Security scanning in CI/CD (OWASP Dependency Check, Snyk, Trivy)
- Code quality checks

### Security
- JWT token-based authentication
- bcrypt password hashing (cost factor 12)
- Input validation and sanitization
- SQL injection prevention via JPA
- XSS protection via React and CSP headers
- CSRF protection considerations
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Non-root Docker containers
- Network isolation in AWS (VPC, security groups)
- Secrets management support
- Rate limiting support (AWS WAF)

## [Unreleased]

### Planned
- Database migration to PostgreSQL/MySQL
- Email verification for registration
- Password reset functionality
- User profile management
- Todo sharing and collaboration
- Categories/tags for todos
- Search and advanced filtering
- Notifications and reminders
- Mobile app (React Native)
- Real-time updates (WebSockets)
- Offline support (PWA)
- Dark mode
- Internationalization (i18n)
- Accessibility improvements (WCAG 2.1 AA)
- Performance optimizations
- Caching layer (Redis)
- Full-text search (Elasticsearch)
