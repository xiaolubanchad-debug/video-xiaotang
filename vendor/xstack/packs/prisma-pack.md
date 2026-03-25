# prisma-pack

Use this pack when a task targets Prisma schema, relations, migrations, transactions, query shape, or database access patterns in a Node/TypeScript codebase.

## Purpose

Make xstack more effective on real Node backends that use Prisma by focusing on framework-adjacent failure points that often cause silent bugs or unsafe releases:

- schema changes that look small but break real data
- relation handling that works in code but fails in product behavior
- query shape that overfetches, underfetches, or creates hidden assumptions
- transaction boundaries that are missing or unclear
- tenant scoping, ownership, and filter behavior hidden inside data access
- migrations that pass locally but are risky in production

## Prisma checklist

### Schema and relations

- Are model changes backward compatible enough for rollout?
- Are nullable vs required fields aligned with real data?
- Do relation updates match actual ownership and lifecycle behavior?

### Query shape

- Is the query returning the fields the caller actually needs?
- Does the select/include shape create hidden overfetching or missing data?
- Are relation loads explicit and intentional?

### Transactions and consistency

- Should this write path be transactional?
- Could partial failures leave inconsistent state?
- Are retry assumptions safe?

### Auth, ownership, and tenant scope

- Is tenant or ownership filtering enforced where the data is queried?
- Could one user reach another user's records through relation traversal or weak filters?
- Are list and detail queries scoped consistently?

### Migrations and rollout

- Does the change need migration sequencing or a backfill?
- Could old rows violate new constraints?
- Are index or large-table implications being ignored?

## Review cues

Look for these common failure patterns:

- `include` or `select` shape that drifts away from caller expectations
- relation changes without thinking through historical data
- reads scoped correctly but writes or updates not scoped the same way
- transaction safety assumed but not enforced
- schema change merged as if production data were clean and uniform
- query logic spread across handlers in ways that hide risk

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-backend-api`
- `security-review`
- `qa-release`
