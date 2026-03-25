# common risk patterns

Use this list to sharpen review quality.

## Correctness

- Off-by-one logic
- Wrong null or empty handling
- Incomplete state updates
- Hidden coupling to caller assumptions

## Reliability

- Missing retries or timeout handling where required
- Unhandled async failures
- Partial writes or inconsistent persistence

## API and contract drift

- Changed shape without caller updates
- Optional vs required mismatch
- Serialization or parsing mismatch

## Security and access

- Missing authorization checks
- Trusting client input too early
- Sensitive data leaking through logs or errors

## Frontend UX and state

- Loading state traps
- Error state dead ends
- Stale UI after optimistic update
- Missing empty-state handling
