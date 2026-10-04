# Security

## Security Goals

The application should protect:

- User accounts
- Passwords
- Sessions/tokens
- Business data
- Database credentials
- Server access
- Production infrastructure

## Authentication

Requirements:

- Passwords must be hashed.
- Never store plaintext passwords.
- Login must validate credentials securely.
- Protected endpoints must require authentication.
- Authentication secrets must not be committed.

## Authorization

Backend authorization is mandatory.

Roles:

- Admin
- Manager
- Staff

Hiding a button in React is not sufficient authorization.

The backend must verify permissions before performing protected operations.

## Input Validation

Validate:

- Request bodies
- Query parameters
- Path parameters
- User-provided strings
- Numeric values
- Business rules

## Secrets

Secrets must be supplied through environment/configuration mechanisms.

Never commit production secrets to GitHub.

## HTTPS

Production must use HTTPS.

## SSH

Use SSH keys.

Avoid password-based server login where possible.

## Firewall

Only expose ports that are actually required.

Expected public services should be limited to the required web/SSH access.

PostgreSQL should not be unnecessarily exposed directly to the public Internet.

## CORS

Configure CORS intentionally.

Do not use unrestricted CORS in production without understanding the security implications.

## Rate Limiting

Authentication and other sensitive endpoints should have appropriate rate limiting.

## Security Headers

Configure appropriate HTTP security headers through the production web server/application configuration.

## Database Security

- Use a dedicated database user.
- Use strong credentials.
- Restrict network access.
- Use least privilege where practical.
- Back up the database.
- Test restoration.

## Docker Security

- Avoid running containers with unnecessary privileges.
- Keep images updated.
- Do not expose unnecessary ports.
- Keep secrets outside images.

## Security Review

Before calling the project production-ready, review:

- Authentication
- Authorization
- Input validation
- Secrets
- SSH
- Firewall
- HTTPS
- CORS
- Rate limiting
- Database exposure
- Docker configuration
- Backups
