# data exposure checklist

## Output surfaces

- API responses
- Logs
- Error messages
- Analytics events
- Cached client state
- Browser-rendered markup

## Questions

- Is sensitive data returned unnecessarily?
- Are secrets or internal identifiers leaked?
- Are errors too revealing?
- Could one tenant see another tenant's data?
- Could deleted or hidden records still be fetched?
