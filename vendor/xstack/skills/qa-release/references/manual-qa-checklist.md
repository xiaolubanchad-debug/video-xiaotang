# manual qa checklist

Use this list for user-facing changes.

## Core flow

- Happy path works end to end
- Loading state is acceptable
- Error state is understandable
- Empty state behaves correctly

## State transitions

- Refresh does not corrupt state
- Back/forward navigation still works if relevant
- Repeated actions do not duplicate or break data

## Permissions and visibility

- Correct users can access the feature
- Wrong users are denied cleanly
- Hidden controls are not accidentally exposed

## Compatibility

- Existing flows still work
- Links, routes, and API calls remain valid
