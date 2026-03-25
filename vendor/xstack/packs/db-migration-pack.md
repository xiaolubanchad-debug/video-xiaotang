# db-migration-pack

Use this pack when a change affects schemas, migrations, indexes, constraints, seed data, or assumptions about old records.

## Purpose

Reduce release risk for backend changes that touch persistence.

AI agents often reason correctly about the desired schema but underweight rollout order, old data, lock risk, and rollback reality. This pack exists to force those questions.

## Migration checklist

### Backward compatibility

- Can old code still run against the new schema during rollout?
- Can new code tolerate old data until migration completes?

### Rollout order

- Is there a safe sequence for deploy → migrate → switch behavior?
- Does the change require multiple deployment steps?

### Rollback path

- If the release fails, can the system recover safely?
- Is the migration reversible, or at least operationally mitigated?

### Existing data assumptions

- Do old rows violate the new expectations?
- Are null values, duplicates, or malformed historical records possible?

### Indexes and large-table risk

- Could this create long locks or expensive rebuilds?
- Is the migration safe for production-sized data?

### Defaults and constraints

- Are new defaults correct for both old and new records?
- Could stricter constraints break valid-but-legacy data?

## Review cues

Look for these common failure patterns:

- schema and code merged in one unsafe step
- migration assumes a clean dataset that does not exist in reality
- non-null added without backfill plan
- index added without considering table size
- rollback described vaguely but not actually possible

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-change`
- `qa-release`
