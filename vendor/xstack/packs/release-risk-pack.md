# release-risk-pack

Use this pack when deciding whether a web-app change is ready to deploy, especially if it affects user flows, APIs, permissions, migrations, caching, or operational visibility.

## Purpose

Separate “the code seems fine” from “this is ready to ship.” This pack helps Codex evaluate release readiness across frontend, backend, and operational concerns.

## Release risk checklist

### User-facing behavior

- Does the changed flow work in happy, empty, loading, error, and permission-denied states?
- Are support or operator teams likely to need a heads-up?

### Backend and API behavior

- Are API changes backward compatible or coordinated?
- Are errors and edge cases understood well enough for production?

### Data and migration risk

- Does the release depend on schema, migration, or backfill steps?
- Is rollout order safe?
- Is rollback or mitigation realistic?

### Caching and async behavior

- Could stale cache, delayed jobs, or eventual consistency create visible issues?
- Are post-release anomalies likely to be detectable quickly?

### Permissions and security

- Does the change alter access rules, object scope, or user visibility?
- Have high-risk paths been explicitly checked?

### Observability and supportability

- If the release fails, will logs, metrics, or errors make the failure understandable?
- Is there a specific thing to watch after deploy?

## Review cues

Look for these common failure patterns:

- migration exists but rollout order is hand-waved
- UI path tested but backend fallback behavior was not
- API changed but callers were assumed rather than verified
- high-risk permissions changed without targeted validation
- no one knows what metric or log to watch after deploy

## Best fit

Read this pack from:

- `qa-release`
- `document-release`
- `review-change`
- `careful-mode`
