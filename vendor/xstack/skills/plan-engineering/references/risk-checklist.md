# engineering risk checklist

Use this checklist when planning changes with non-trivial impact.

## Data and persistence

- Does the change alter schemas, migrations, or stored data?
- Can it break backward compatibility?
- Is there a rollback path?

## APIs and contracts

- Does it change request or response shape?
- Will clients need coordination?
- Are there versioning implications?

## Auth and permissions

- Does it widen access?
- Are role checks enforced in all relevant paths?
- Could error messages leak sensitive data?

## Cross-cutting behavior

- Does it affect caching, logging, metrics, or jobs?
- Does it change shared UI state or routing?
- Could it impact performance or availability?
