# trpc-pack

Use this pack when a task targets a tRPC codebase, especially one involving routers, procedures, Zod schemas, middleware, context, client/server type contracts, or mutation/query coordination in a full-stack TypeScript app.

## Purpose

Make xstack more effective on real tRPC applications by focusing on the framework-specific places where end-to-end type safety can hide product or architecture mistakes:

- procedures that are type-safe but poorly shaped for real product flows
- Zod schemas that validate syntax but not business intent
- middleware and context behavior that obscure auth or tenant rules
- mutation/query coordination that leaves stale client state or weak invalidation
- server return shapes that are technically safe but awkward for the UI
- router organization that works in code but creates poor domain boundaries

## tRPC checklist

### Router and procedure design

- Is this logic in the right router or procedure boundary?
- Does the procedure shape match the real product action?
- Are public, protected, and admin-facing procedures clearly separated?

### Input and output schemas

- Do Zod schemas reflect real business constraints, not just field syntax?
- Are output shapes stable and useful for callers?
- Could small schema changes break client assumptions even though types still compile?

### Middleware and context

- Is auth or tenant logic placed in middleware, context, or procedure code intentionally?
- Could hidden middleware behavior make access control hard to reason about?
- Is request-scoped data being passed clearly enough?

### Query and mutation behavior

- Does the mutation return enough information for the client to reconcile state?
- Are invalidation, refetch, or cache update assumptions explicit?
- Could the UI become stale even though the mutation succeeds?

### Full-stack contract

- Does the client rely on states or fields the server does not consistently provide?
- Are error flows and permission failures understandable to the caller?
- Is end-to-end type safety masking a weak product contract?

## Review cues

Look for these common failure patterns:

- router boundaries organized by convenience instead of domain
- protected procedures with auth in middleware but weak ownership checks deeper down
- schema changes that compile but silently change product behavior
- mutations returning technically valid data that is unusable for UI reconciliation
- cache invalidation left implicit or hand-waved
- “it is type-safe” used as a substitute for release readiness

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-frontend-flow`
- `review-backend-api`
- `qa-release`
