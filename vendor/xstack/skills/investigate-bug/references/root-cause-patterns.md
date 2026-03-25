# root cause patterns

Use this list to generate and test hypotheses.

## Application logic

- Bad branching condition
- Missing null handling
- Incorrect state transition
- Partial update path

## Integration

- Changed API contract
- Timeout or retry behavior
- Third-party dependency drift
- Queue or webhook mismatch

## Data

- Invalid seed or migrated data
- Old records violating new assumptions
- Cache inconsistency
- Read/write ordering problem

## Environment

- Config mismatch
- Feature flag state
- Permission difference
- Resource exhaustion or rate limiting
