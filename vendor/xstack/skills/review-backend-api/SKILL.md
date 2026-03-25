---
name: review-backend-api
description: Review a backend API, handler, server action, service endpoint, or API-related diff for contract clarity, compatibility, authorization, data safety, and release risk. Use when Codex should evaluate whether a backend change is actually production-ready.
---

# review-backend-api

Review backend behavior like a production-minded API engineer.

## Workflow

1. Reconstruct the intended contract and caller expectations.
2. Inspect request shape, response shape, error behavior, and permissions.
3. Check whether the change is backward compatible or requires coordination.
4. Check object-level access, tenant scope, and policy enforcement when relevant.
5. Check whether schema, migration, or old-data assumptions create hidden risk.
6. Separate must-fix contract or safety issues from lower-priority cleanup.
7. Conclude with a practical readiness judgment.

## Output

Always include:

- API summary
- Must fix
- Should improve
- Contract risks
- Access or data risks
- Readiness judgment

## Review standard

- Prefer concrete failure modes over abstract backend critique.
- Treat compatibility and authorization mistakes as first-class defects.
- Distinguish implementation cleanup from production risk.
- If the API is solid, say so plainly.

## References

- Read `../../packs/backend-api-pack.md` for contract, error, and collection-behavior checks.
- Read `../../packs/auth-permission-pack.md` when the review involves roles, ownership, tenant boundaries, or admin actions.
- Read `../../packs/db-migration-pack.md` when persistence, migrations, or old-data assumptions are involved.
- Read `../../packs/release-risk-pack.md` when deciding whether the change is safe to ship.
- Read `../../packs/fullstack-contract-pack.md` when frontend callers depend on the API behavior.
- Read `../../packs/nextjs-app-pack.md` when the backend-facing change is implemented through Next.js route handlers, server actions, or mixed app-layer boundaries.
- Read `../../packs/prisma-pack.md` when the backend-facing change depends on Prisma schema, query shape, transactions, or relation handling.
- Read `../../packs/nestjs-backend-pack.md` when the backend-facing change depends on NestJS DTOs, guards, providers, exception behavior, or controller/service/module structure.
- Read `../../packs/trpc-pack.md` when the backend-facing change depends on tRPC routers, procedures, Zod schemas, middleware, or output shape coordination.
- Read `../../packs/express-api-pack.md` when the backend-facing change depends on Express route design, middleware ordering, validation placement, or response consistency.
- Read `../security-review/references/auth-checklist.md` when access control is central to the review.
- Read `../security-review/references/data-exposure-checklist.md` when user or tenant data may leak.
- Read `references/readiness-template.md` when a more formal backend review report is useful.
