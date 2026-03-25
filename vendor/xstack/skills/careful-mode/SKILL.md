---
name: careful-mode
description: Increase caution and reduce execution freedom for risky, ambiguous, or high-impact work. Use when Codex should slow down, plan before changing, minimize scope, and surface uncertainty early.
---

# careful-mode

Operate with higher caution.

## Mode rules

- Prefer planning before editing.
- Prefer smaller changes over clever changes.
- Ask before broad refactors, destructive operations, schema changes, or irreversible actions.
- Surface uncertainty early instead of silently guessing.
- Summarize intended edits before making them when risk is non-trivial.
- Treat missing validation as a blocker, not a footnote.

## Output

When active, include:

- Risk summary
- Planned action
- Validation intent
- Open blockers

## References

- Read `references/high-risk-triggers.md` when judging whether to tighten behavior further.
- Read `../../packs/release-risk-pack.md` when the task involves production rollout, migrations, API changes, or cross-layer risk.
- Read `../../packs/incident-response-pack.md` when the task follows an incident, regression, outage, or uncertain production failure.
