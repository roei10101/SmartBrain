# Security

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's
[private vulnerability reporting](https://github.com/roei10101/SmartBrain/security/advisories/new)
and include steps to reproduce. You can expect a first response within a few days.

## How secrets are handled

- No credential is stored in the repository. Everything is read from the environment
  (`.env.example` lists the variables) and the application refuses to start without them.
- Passwords are hashed with bcrypt; API access uses short-lived signed JWTs.
- Every query is scoped to the authenticated user, and the test suite checks that one user cannot
  read or change another user's data.
- Earlier commits contained a development database password. It was a local default, has been
  removed from the code, and must not be reused anywhere.
