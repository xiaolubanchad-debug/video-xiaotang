# auth checklist

## Authentication

- Is identity reliably established?
- Are anonymous and authenticated paths clearly separated?
- Are session assumptions valid?

## Authorization

- Are role checks applied server-side?
- Is object ownership verified?
- Could a user act on another user's resource?
- Are admin-only actions protected everywhere they appear?

## Privilege changes

- Does this introduce a broader default permission?
- Can a user escalate through hidden parameters or stale state?
- Can client-only checks be bypassed?
