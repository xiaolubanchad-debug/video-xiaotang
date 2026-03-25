---
name: implement-feature
description: Implement a planned feature, bugfix, or refactor with disciplined code changes. Use when Codex should make focused edits, preserve intent, avoid unnecessary scope creep, and validate the result before handing off.
---

# implement-feature

Make the change carefully and prove it works.

## Workflow

1. Confirm the goal and plan before editing.
2. Inspect nearby code and existing patterns.
3. Make the smallest coherent change set that solves the task.
4. Avoid unrelated refactors unless required for correctness.
5. Keep naming, structure, and style consistent with the repository.
6. Run the most relevant validation available.
7. Summarize what changed, why, and how it was verified.

## Guardrails

- Stop and ask if requirements are still ambiguous.
- Stop and ask before destructive changes, broad rewrites, or irreversible data operations.
- Do not overwrite unrelated user changes.
- If validation cannot be run, say exactly what remains unverified.

## Output

Always include:

- What changed
- Files or areas touched
- Validation run
- Remaining risks or follow-ups

## References

- Read `references/change-discipline.md` when a task risks scope creep.
- Read `references/handoff-template.md` when preparing a final implementation summary.
- Read `../../packs/frontend-state-flow-pack.md` when implementing user-facing pages, components, or mutation flows.
- Read `../../packs/form-flow-pack.md` when implementing forms, wizards, settings, or modal submissions.
- Read `../../packs/component-consistency-pack.md` when implementing repeated UI patterns, shared controls, or design-system-adjacent work.
- Read `../../packs/nextjs-app-pack.md` when implementing work inside a Next.js app, especially around App Router, route handlers, or server actions.
- Read `../../packs/prisma-pack.md` when implementing Prisma schema, relations, transactions, or database-heavy Node flows.
- Read `../../packs/nestjs-backend-pack.md` when implementing NestJS controllers, services, DTOs, guards, providers, or module-layer logic.
- Read `../../packs/trpc-pack.md` when implementing tRPC routers, procedures, Zod schemas, middleware, or mutation/query coordination.
- Read `../../packs/express-api-pack.md` when implementing Express routes, middleware chains, request validation, or response/error handling.
- Read `../../packs/db-migration-pack.md` when implementing schema or migration-related changes.
