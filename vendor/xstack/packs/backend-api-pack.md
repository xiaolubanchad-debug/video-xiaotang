# backend-api-pack

Use this pack when a change adds, edits, or relies on backend APIs, server actions, controllers, handlers, RPC methods, or service contracts.

## Purpose

Strengthen backend API work by making Codex check the things that often cause rework:

- ambiguous request or response contracts
- silent breaking changes
- inconsistent error handling
- weak pagination/filter/sort behavior
- permission mistakes at the object level

## API contract checklist

### Request shape

- Are required vs optional fields clear?
- Are field names and semantics consistent with existing conventions?
- Are defaults explicit rather than accidental?

### Response shape

- Does the response contain exactly what the caller needs?
- Are fields named clearly and consistently?
- Could the shape break an existing caller?

### Compatibility

- Is this a breaking change for current clients?
- If fields changed, are dependent callers updated?
- Is versioning or migration strategy needed?

### Error behavior

- Are expected failure modes represented clearly?
- Are status codes or error categories consistent?
- Do errors reveal too much internal detail?

### Collection behavior

- If listing data, are pagination rules clear?
- Are filtering and sorting semantics explicit?
- Can the client predict stable behavior?

### Authorization and object access

- Is the caller allowed to perform this action?
- Is ownership or tenant scope enforced server-side?
- Could a user access another user's or tenant's object?

## Review cues

Look for these common failure patterns:

- field added in backend but not documented in caller assumptions
- optional field that is actually required in practice
- response shape drift across similar endpoints
- pagination implemented differently from adjacent APIs
- client-hidden permissions without server enforcement
- generic 500s for expected user-caused failures

## Best fit

Read this pack from:

- `plan-engineering`
- `review-change`
- `qa-release`
- `security-review`
