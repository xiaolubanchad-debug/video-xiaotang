# fullstack-contract-pack

Use this pack when a feature or bugfix spans both frontend and backend, or when a user-facing flow depends on API shape, state semantics, permissions, or server-side behavior.

## Purpose

Reduce the classic full-stack mismatch where:

- the backend returns data the UI does not expect
- the UI expects fields or states the backend does not provide
- error and permission flows are implemented inconsistently
- a feature “works” in isolated pieces but not end to end

## Contract alignment checklist

### Data shape alignment

- Does the UI receive every field it uses?
- Are nullable vs required assumptions aligned?
- Are enum values and status labels consistent across layers?

### Flow alignment

- Does the backend expose the states the UI needs to represent?
- Are success, error, empty, and permission-denied paths aligned?
- Can the frontend distinguish user-correctable failures from system failures?

### Action alignment

- Do mutations return enough data for the UI to update correctly?
- Does the UI rely on side effects the backend does not guarantee?
- Are idempotency and retry expectations compatible?

### Collection alignment

- Do pagination, filtering, and sorting semantics match between UI and API?
- Are cursor/page assumptions explicit?

### Permission alignment

- Does the frontend hide actions the backend would reject anyway?
- Could the UI imply access that the backend denies, or the reverse?

## Review cues

Look for these common failure patterns:

- frontend assumes a field that is not actually returned
- backend returns a success shape that does not help the UI reconcile state
- permission-denied becomes a generic error in one layer
- filter options shown in UI are unsupported or behave differently in API
- enum or status names drift between client and server

## Best fit

Read this pack from:

- `plan-engineering`
- `review-change`
- `qa-release`
- `document-release`
