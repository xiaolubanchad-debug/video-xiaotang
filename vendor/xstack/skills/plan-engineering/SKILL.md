---
name: plan-engineering
description: Turn an approved request into a concrete engineering plan before coding. Use when Codex should inspect the codebase, identify affected areas, choose an approach, sequence the work, and define validation before implementation.
---

# plan-engineering

Design the implementation before editing files.

## Workflow

1. Read the request and the current product/bug context.
2. Inspect the relevant code paths before proposing changes.
3. Identify affected modules, data flow, interfaces, state, and external dependencies.
4. Propose the smallest sound approach that satisfies the request.
5. Call out alternatives only when there is a meaningful tradeoff.
6. Break the implementation into ordered steps.
7. Define how success will be validated.
8. Pause for clarification when a critical unknown would likely cause rework.

## Output

Always include:

- Problem summary
- Relevant code areas
- Proposed approach
- Ordered implementation steps
- Risks
- Validation plan
- Open questions

## Notes

- Prefer plans grounded in actual repository structure.
- Avoid hand-wavy architecture language.
- Do not start coding unless the user explicitly asks to proceed.

## References

- Read `references/risk-checklist.md` when the task affects data models, auth, APIs, or cross-cutting behavior.
- Read `references/validation-patterns.md` when the validation strategy is not obvious.
- Read `../../packs/backend-api-pack.md` when the task changes APIs, handlers, server actions, or service contracts.
- Read `../../packs/db-migration-pack.md` when the task changes schemas, migrations, indexes, or assumptions about old data.
- Read `../../packs/fullstack-contract-pack.md` when the task spans frontend and backend behavior.
- Read `../../packs/frontend-state-flow-pack.md` when the task changes user-facing page or mutation states.
- Read `../../packs/auth-permission-pack.md` when the task changes roles, ownership, tenant scope, or access rules.
- Read `../../packs/nextjs-app-pack.md` when the task targets a Next.js app, App Router flow, server action, route handler, or mixed client/server boundary.
- Read `../../packs/prisma-pack.md` when the task affects Prisma schema, relations, migrations, transactions, or database query shape.
- Read `../../packs/nestjs-backend-pack.md` when the task targets a NestJS backend, DTO, guard, provider, controller, service, or module-level design choice.
- Read `../../packs/trpc-pack.md` when the task targets a tRPC router, procedure, Zod schema, middleware, or client/server type contract.
- Read `../../packs/express-api-pack.md` when the task targets an Express API, route/middleware structure, validation placement, or response-shape consistency.
