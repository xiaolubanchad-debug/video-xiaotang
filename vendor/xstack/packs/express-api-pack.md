# express-api-pack

Use this pack when a task targets an Express-based Node API, especially one involving routes, middleware, request validation, auth, error handling, service boundaries, or response-shape consistency.

## Purpose

Make xstack more effective on real Express backends by focusing on the places where flexibility often turns into hidden inconsistency:

- route handlers that become too fat
- middleware chains that obscure auth or validation behavior
- request validation that exists but is scattered or weak
- error handling that differs across adjacent endpoints
- service boundaries that are implied but not real
- database side effects and transactions that are hidden behind “simple” handlers

## Express checklist

### Route and handler boundaries

- Is the route handler doing too much?
- Should business logic be moved into a service or helper boundary?
- Are similar endpoints following similar structure?

### Middleware and validation

- Is validation happening in a clear, consistent place?
- Are auth, tenant, or ownership checks explicit enough?
- Could middleware ordering create surprising behavior?

### Error and response behavior

- Are success and error responses consistent across related endpoints?
- Are expected user-caused failures distinguishable from server failures?
- Is the response shape stable enough for callers?

### Auth and permissions

- Are permissions enforced server-side?
- Are object-level access and tenant scope checked consistently?
- Could a route be reachable through a path that bypasses expected middleware?

### Side effects and data access

- Is data access shaped in a way that is understandable and safe?
- Should this route use a transaction or stronger write coordination?
- Are retries, idempotency, or partial failure behavior being assumed rather than designed?

## Review cues

Look for these common failure patterns:

- route handlers growing into ad hoc controllers and services at once
- validation spread across middleware, route code, and database assumptions
- auth middleware present but ownership checks still missing deeper in the flow
- inconsistent status codes or error payloads across similar routes
- “simple” route updates hiding multiple side effects or write paths
- transaction safety assumed but not enforced

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-backend-api`
- `security-review`
- `qa-release`
