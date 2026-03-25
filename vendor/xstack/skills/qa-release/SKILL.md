---
name: qa-release
description: Evaluate whether a change is ready to ship. Use when Codex should verify test coverage, manual validation paths, regression risk, rollout concerns, and release readiness after implementation or review.
---

# qa-release

Check whether the change is actually ready to ship.

## Workflow

1. Identify the user-visible or system-visible behaviors that changed.
2. Map the primary happy path and the most likely failure paths.
3. Review what validation has already been run.
4. Identify missing tests, manual checks, and regression hotspots.
5. Call out rollout, migration, observability, and rollback concerns when relevant.
6. Conclude with a clear readiness judgment.

## Output

Always include:

- Scope under test
- Validation already done
- Required manual checks
- Regression hotspots
- Release concerns
- Ship recommendation

## Notes

- Treat missing validation as real risk.
- Be especially careful with auth, billing, stateful workflows, migrations, and UI flows.
- If evidence is incomplete, recommend conditional rather than unconditional ship.

## References

- Read `references/manual-qa-checklist.md` when the change is user-facing.
- Read `references/release-gates.md` when deciding whether to recommend ship.
- Read `../../packs/frontend-state-flow-pack.md` when validating a user-facing flow.
- Read `../../packs/form-flow-pack.md` when validating forms, submissions, settings, or modal flows.
- Read `../../packs/component-consistency-pack.md` when release readiness depends on consistent repeated UI patterns across a page or flow.
- Read `../../packs/backend-api-pack.md` when release readiness depends on API behavior or contract stability.
- Read `../../packs/db-migration-pack.md` when release readiness depends on schema, migration, or old-data safety.
- Read `../../packs/fullstack-contract-pack.md` when the release spans frontend and backend behavior.
- Read `../../packs/auth-permission-pack.md` when the release changes access rules, object scope, or tenant visibility.
- Read `../../packs/release-risk-pack.md` when deciding whether a change is safe to ship.
- Read `../../packs/incident-response-pack.md` when release readiness depends on understanding a recent incident, regression, or environment-specific failure.
- Read `../../packs/nextjs-app-pack.md` when release readiness depends on Next.js routing, caching, revalidation, or client/server boundary behavior.
- Read `../../packs/prisma-pack.md` when release readiness depends on Prisma schema changes, migration safety, or database query behavior.
- Read `../../packs/nestjs-backend-pack.md` when release readiness depends on NestJS validation, guards, exception behavior, or async side-effect wiring.
- Read `../../packs/trpc-pack.md` when release readiness depends on tRPC schema changes, client/server contract stability, or query/mutation coordination.
- Read `../../packs/express-api-pack.md` when release readiness depends on Express middleware behavior, response consistency, or route-level side effects.
