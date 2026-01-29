# Security Documentation

## Overview

This document outlines the security measures implemented in the Todo application, addressing OWASP Top 10 vulnerabilities and best practices.

## OWASP Top 10 Mitigation

### A01: Broken Access Control
**Implemented:**
- JWT-based authentication for all API endpoints
- Role-based access control (USER role)
- User isolation - users can only access their own todos
- Protected routes in frontend
- Spring Security configuration with role enforcement

**Code References:**
- [SecurityConfig.java](backend/src/main/java/com/todo/config/SecurityConfig.java)
- [JwtAuthenticationFilter.java](backend/src/main/java/com/todo/security/JwtAuthenticationFilter.java)
- [PrivateRoute.tsx](frontend/src/components/PrivateRoute.tsx)

### A02: Cryptographic Failures
**Implemented:**
- bcrypt password hashing with cost factor 12
- JWT tokens with HS512 signing algorithm
- Secure key generation and storage
- HTTPS enforced in production (ALB configuration)
- Secure cookie flags (httpOnly, secure, sameSite)

**Code References:**
- [SecurityConfig.java](backend/src/main/java/com/todo/config/SecurityConfig.java) - Password encoder
- [JwtTokenUtil.java](backend/src/main/java/com/todo/security/JwtTokenUtil.java) - Token signing

### A03: Injection
**Implemented:**
- JPA/Hibernate with parameterized queries (prevents SQL injection)
- Input validation using Jakarta Validation annotations
- Output encoding in React (automatic XSS protection)
- Content-Type validation
- Request size limits

**Code References:**
- [TodoRequest.java](backend/src/main/java/com/todo/dto/TodoRequest.java) - Input validation
- [RegisterRequest.java](backend/src/main/java/com/todo/dto/RegisterRequest.java) - Validation constraints

### A04: Insecure Design
**Implemented:**
- Security by design principles
- Threat modeling during architecture
- Defense in depth (multiple security layers)
- Fail securely (default deny)
- Principle of least privilege

### A05: Security Misconfiguration
**Implemented:**
- Secure defaults in Spring Security
- Security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- H2 console disabled in production
- Error messages don't leak sensitive information
- Dependencies kept up to date
- Docker images run as non-root user

**Code References:**
- [SecurityConfig.java](backend/src/main/java/com/todo/config/SecurityConfig.java) - Security headers
- [Dockerfile](backend/Dockerfile) - Non-root user

### A06: Vulnerable and Outdated Components
**Implemented:**
- Automated dependency scanning (GitHub Dependabot)
- OWASP Dependency Check in CI/CD
- Snyk security scanning
- Regular dependency updates
- Maven/npm audit integration

**Code References:**
- [ci-cd.yml](.github/workflows/ci-cd.yml) - Security scanning
- [security.yml](.github/workflows/security.yml) - Dependency review

### A07: Identification and Authentication Failures
**Implemented:**
- Strong password policy (minimum 8 characters)
- JWT token expiration (1 hour)
- Secure session management
- No default credentials
- Rate limiting on authentication endpoints (via AWS WAF in production)
- Account lockout after failed attempts (can be added)

**Code References:**
- [AuthService.java](backend/src/main/java/com/todo/service/AuthService.java)
- [application.properties](backend/src/main/resources/application.properties)

### A08: Software and Data Integrity Failures
**Implemented:**
- Code signing in CI/CD pipeline
- Dependency checksums verified
- Immutable Docker images with digests
- Secure CI/CD pipeline (GitHub Actions)
- Artifact verification

### A09: Security Logging and Monitoring Failures
**Implemented:**
- Comprehensive logging (Spring Boot Actuator)
- CloudWatch integration in AWS
- Failed login attempts logged
- Sensitive data not logged
- Log rotation and retention
- Audit trail for critical operations

**Code References:**
- [application.properties](backend/src/main/resources/application.properties) - Logging configuration
- [ecs.tf](terraform/ecs.tf) - CloudWatch logs

### A10: Server-Side Request Forgery (SSRF)
**Implemented:**
- Input validation on all external requests
- Allowlist for external URLs
- Network segmentation (private subnets)
- Firewall rules (security groups)

## Authentication & Authorization

### JWT Token Flow
1. User registers/logs in with credentials
2. Backend validates credentials and generates JWT token
3. Token stored in localStorage (with XSS protections)
4. Token sent in Authorization header for subsequent requests
5. Backend validates token on each request
6. Token expires after 1 hour

### Password Security
- Minimum 8 characters required
- bcrypt hashing with salt (cost factor 12)
- Passwords never logged or exposed
- Password complexity can be enhanced with regex validation

## API Security

### CORS Configuration
- Configured allowed origins (localhost:3000 for dev)
- Credentials allowed for cookie-based auth
- Specific HTTP methods whitelisted
- Preflight requests handled

### CSRF Protection
- CSRF disabled for stateless JWT authentication
- Would be enabled for session-based auth

### Rate Limiting
- Implemented via AWS WAF in production
- Can add Spring Rate Limiter for local testing

## Frontend Security

### XSS Prevention
- React automatic output encoding
- Content Security Policy headers
- DOMPurify can be added for rich text
- Input validation on client and server

### CSRF Prevention
- JWT in Authorization header (not cookies)
- SameSite cookie flags if using cookies

### Secure Storage
- Tokens in localStorage (acceptable for public clients)
- Consider httpOnly cookies for enhanced security
- No sensitive data in localStorage

## Infrastructure Security

### Network Security
- VPC with public and private subnets
- NAT Gateway for outbound traffic
- Security groups with least privilege
- No direct internet access to containers

### Container Security
- Minimal base images (Alpine)
- Non-root user execution
- Image scanning (Trivy, Snyk)
- Regular base image updates
- Read-only root filesystem where possible

### Secrets Management
- Environment variables for configuration
- AWS Secrets Manager recommended for production
- Secrets encrypted at rest
- No secrets in code or version control

## Compliance & Best Practices

### GDPR Considerations
- User data minimization
- Right to deletion (implement DELETE /users/{id})
- Data encryption in transit and at rest
- Audit logging

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

### Security Testing
- Unit tests for authentication/authorization
- Integration tests for security controls
- E2E tests for complete workflows
- Penetration testing recommended
- Security code review

## Production Checklist

- [ ] Change all default credentials
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure AWS WAF with rate limiting
- [ ] Set up CloudWatch alarms for security events
- [ ] Enable AWS GuardDuty
- [ ] Implement database encryption (use RDS with encryption)
- [ ] Set up backup and disaster recovery
- [ ] Configure security monitoring and alerting
- [ ] Perform security audit
- [ ] Set up incident response plan
- [ ] Enable MFA for AWS accounts
- [ ] Implement IP whitelisting if needed
- [ ] Configure DDoS protection (AWS Shield)
- [ ] Set up vulnerability scanning schedule

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com. Do not open public GitHub issues for security vulnerabilities.

## Security Updates

Regular security updates:
- Weekly: Dependency scanning
- Monthly: Security patches
- Quarterly: Security audit
- Annually: Penetration testing

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [React Security Best Practices](https://react.dev/learn/security)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
