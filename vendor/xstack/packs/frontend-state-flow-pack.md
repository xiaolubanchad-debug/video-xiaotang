# frontend-state-flow-pack

Use this pack when a change affects a user-facing page, component, workflow, or mutation flow.

## Purpose

Prevent the most common frontend quality failures in AI-assisted implementation:

- only handling the happy path
- forgetting loading, empty, or error states
- missing retry behavior
- stale UI after mutation
- broken permission-denied or access-limited states

## State checklist

### Entry state

- What does the UI show before data arrives?
- Is the initial state intentional or just blank?
- Does the user understand what is happening?

### Loading state

- Is loading visible?
- Is loading scoped correctly to the affected area?
- Can the user still navigate safely if loading is slow?

### Empty state

- If there is no data, does the UI explain what that means?
- Does the empty state suggest a next action when appropriate?

### Success state

- After data loads or a mutation succeeds, is the result obvious?
- Does the UI reflect the updated state immediately and correctly?

### Error state

- If the request fails, does the user get a clear message?
- Is the error actionable?
- Does the UI avoid trapping the user in a dead end?

### Retry behavior

- Can the user retry without refreshing the whole page?
- Does retry clear stale error state?

### Refresh and revisit behavior

- If the page is refreshed, does the state recover cleanly?
- If the user returns later, is the experience still coherent?

### Permission or access-limited state

- If access is denied or partial, is the UI explicit and safe?
- Are hidden controls still impossible to trigger through alternate paths?

## Review cues

Look for these common failure patterns:

- spinner only, no fallback or explanation
- blank page when data is empty
- optimistic update without rollback or correction path
- success toast with stale underlying UI
- form button disabled forever after one failure
- generic “Something went wrong” with no next step

## Best fit

Read this pack from:

- `implement-feature`
- `review-change`
- `qa-release`
- `design-review`
