# validation patterns

Choose validation methods that match the change.

## Small localized change

- Run targeted tests
- Exercise the changed path manually if fast
- Check lint or typecheck if relevant

## Multi-module backend change

- Run affected unit and integration tests
- Verify serialization and contract behavior
- Confirm logs or errors remain useful

## Frontend behavior change

- Run targeted tests if present
- Validate the primary user flow manually
- Check empty, loading, and error states

## Data or migration change

- Validate on representative sample data where possible
- Confirm backward compatibility assumptions
- Define rollback or recovery steps
