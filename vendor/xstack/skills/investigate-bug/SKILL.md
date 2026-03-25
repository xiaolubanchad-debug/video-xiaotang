---
name: investigate-bug
description: Diagnose a bug, incident, regression, or unexplained system behavior before attempting a fix. Use when Codex should gather evidence, narrow hypotheses, identify likely root causes, and define the next most informative checks.
---

# investigate-bug

Diagnose first. Fix second.

## Workflow

1. Restate the observed behavior, expected behavior, and known impact.
2. Identify what evidence already exists: logs, traces, screenshots, reports, diffs, timelines, or reproduction steps.
3. Separate facts from guesses.
4. Form a short list of plausible root-cause hypotheses.
5. Rank hypotheses by likelihood and cost to test.
6. Define the next checks that would most reduce uncertainty.
7. Propose a fix only when the evidence is already strong enough.

## Output

Always include:

- Observed vs expected behavior
- Known evidence
- Hypotheses
- Most likely causes
- Next checks
- Fix readiness

## Notes

- Do not jump to a patch just to appear helpful.
- Prefer narrowing the problem over dumping many speculative causes.
- If reproduction is missing, say what minimum reproduction data is needed.

## References

- Read `references/triage-checklist.md` for a general bug triage pass.
- Read `references/root-cause-patterns.md` when the failure mode is still unclear.
- Read `../../packs/incident-response-pack.md` when the issue is production-facing, environment-specific, operational, or time-correlated with deploy/config/data changes.
