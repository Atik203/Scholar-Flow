# Security Policy

We take the security of Scholar-Flow seriously. Please follow this policy to report vulnerabilities.

## Supported Versions

We aim to support the latest main branch. Security fixes are prioritized for actively maintained releases.

## Reporting a Vulnerability

- Email the maintainer at <mailto:atikurrahaman0304@gmail.com>.
- Provide a detailed description, steps to reproduce, and potential impact.
- If possible, include a minimal proof of concept.
- Do not disclose the issue publicly until we have released a fix and coordinated a disclosure window.

You should receive an acknowledgment within 72 hours, and a status update within 7 days.

## Handling and Disclosure

1. Triage and validate the report.
1. Determine affected versions and severity.
1. Develop a fix and tests.
1. Coordinate a release and public advisory.

## Best Practices for Contributors

- Keep dependencies updated and avoid introducing vulnerable packages.
- Never commit secrets. Use environment variables and `.env` files excluded from git.
- Validate and sanitize all inputs. Follow the Zod validation guidelines in the backend.
- Use HTTPS and secure cookies in production. Enable Helmet and rate-limiting.
