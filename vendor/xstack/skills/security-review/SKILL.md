---
name: security-review
description: Review a feature, diff, or design for security risk. Use when Codex should evaluate auth, trust boundaries, input validation, data exposure, privilege changes, abuse cases, or attack surface before release.
---

# security-review

Look for realistic ways the change could be unsafe.

## Workflow

1. Identify assets, trust boundaries, and privileged actions involved.
2. Inspect how input enters the system and where it is validated.
3. Check authentication, authorization, and object-level access control.
4. Review data exposure through APIs, logs, errors, and client-visible state.
5. Consider abuse cases, privilege escalation, and unsafe defaults.
6. Rate the practical severity of findings.
7. Distinguish must-fix issues from hardening suggestions.

## Output

Always include:

- Security surface summary
- Must fix
- Hardening suggestions
- Abuse cases
- Severity assessment

## Notes

- Prefer concrete exploit paths over generic security language.
- Be especially careful with auth, billing, admin actions, uploads, secrets, and cross-tenant data.
- If the change appears low-risk, say so clearly.

## References

- Read `references/auth-checklist.md` for access-control-heavy changes.
- Read `references/data-exposure-checklist.md` when sensitive or user-specific data is involved.
- Read `../../packs/backend-api-pack.md` when the security review involves API contract, object access, or server actions.
- Read `../../packs/fullstack-contract-pack.md` when frontend visibility and backend enforcement may diverge.
- Read `../../packs/auth-permission-pack.md` when the review involves roles, ownership, tenant boundaries, or admin paths.
- Read `../../packs/prisma-pack.md` when data access patterns, relation loading, tenant scoping, or transaction behavior affect the security posture.
- Read `../../packs/nestjs-backend-pack.md` when guards, decorators, providers, or module structure affect auth and permission enforcement.
- Read `../../packs/express-api-pack.md` when Express middleware, route-level auth, or validation placement affects the security posture.
