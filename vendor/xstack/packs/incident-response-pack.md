# incident-response-pack

Use this pack when investigating a production issue, regression, outage, data inconsistency, or environment-specific failure.

## Purpose

Improve incident triage and root-cause narrowing for real systems.

AI agents often jump too quickly from symptom to patch. This pack forces stronger operational reasoning:

- when did the issue start?
- what changed?
- who is affected?
- is it environment-specific?
- what evidence reduces uncertainty fastest?
- what mitigations are possible before a full fix?

## Incident response checklist

### Timeline

- When was the issue first observed?
- Was there a deploy, config change, migration, data import, or flag change nearby?
- Did anything else change in the same time window?

### Impact

- Who is affected?
- Is the issue global, tenant-specific, user-specific, or route-specific?
- Is it a total failure, degraded behavior, or data correctness problem?

### Reproduction

- Can the problem be reproduced reliably?
- Does reproduction depend on environment, browser, account state, or dataset shape?
- Is the issue only visible under production conditions?

### Evidence

- What logs, traces, metrics, screenshots, reports, or support tickets exist?
- Are there correlated spikes in errors, latency, queue depth, or retries?
- Does the browser console or network trace add useful signal?

### Change correlation

- What changed in code, config, dependencies, data, or flags?
- Which recent changes plausibly affect the broken path?
- Is rollback or feature disablement available?

### Mitigation

- Can the blast radius be reduced before a full fix?
- Can a feature be disabled, traffic rerouted, or a bad path blocked?
- Is there a safer temporary workaround?

## Review cues

Look for these common failure patterns:

- treating coincidence as proof of root cause
- proposing a fix before the symptom is narrowed
- ignoring environment-specific behavior
- missing config or feature-flag drift
- investigating code only while data or operations are the real source
- no mitigation plan while root cause is still uncertain

## Best fit

Read this pack from:

- `investigate-bug`
- `qa-release`
- `careful-mode`
- `document-release`
