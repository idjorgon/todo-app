# Contributing to Todo App

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear use case
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Update documentation
7. Commit with clear messages (`git commit -m 'Add amazing feature'`)
8. Push to your fork (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Development Guidelines

#### Backend (Java/Spring Boot)
- Follow Java code conventions
- Use Lombok for boilerplate reduction
- Write unit tests for services
- Write integration tests for controllers
- Maintain > 80% code coverage
- Use meaningful variable names
- Add Javadoc for public methods

#### Frontend (React/TypeScript)
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Write unit tests with Jest
- Write E2E tests with Playwright
- Use CSS modules or styled-components
- Maintain > 80% code coverage

#### Testing
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test edge cases and error conditions
- Mock external dependencies

#### Security
- Never commit secrets or credentials
- Validate all user inputs
- Follow OWASP guidelines
- Run security scans before PR
- Update dependencies regularly

#### Documentation
- Update README for feature changes
- Add inline comments for complex logic
- Update API documentation (Swagger)
- Include migration guides for breaking changes

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

Example: `feat: add user profile endpoint`

### Review Process

1. Automated checks must pass (tests, linting, security)
2. At least one approval required
3. All comments must be resolved
4. Squash commits before merge
5. Delete branch after merge

## Development Setup

See README.md for detailed setup instructions.

## Questions?

Open a discussion or reach out to maintainers.

Thank you for contributing! 🎉
