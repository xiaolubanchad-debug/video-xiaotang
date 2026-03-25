---
name: document-release
description: Turn completed changes into release notes, changelog entries, operator updates, or stakeholder summaries. Use when Codex should explain what changed, why it matters, what to watch after release, and any required follow-up.
---

# document-release

Explain the release clearly to the right audience.

## Workflow

1. Identify the intended audience: users, operators, developers, or stakeholders.
2. Summarize what changed in outcome terms before implementation details.
3. Note behavior changes, migrations, rollout concerns, and follow-up actions.
4. Avoid overclaiming confidence or impact.
5. Keep the output concise and useful.

## Output

Always include:

- Audience
- What changed
- Why it matters
- Operator or support notes
- Follow-up items

## Notes

- Do not dump commit history.
- Prefer behavior-oriented language over internal jargon.
- If there are user-visible risks, say what to monitor.

## References

- Read `references/release-note-templates.md` when the audience or format is unclear.
- Read `../../packs/fullstack-contract-pack.md` when the release note needs to explain cross-layer frontend/backend changes.
- Read `../../packs/release-risk-pack.md` when the release note should call out rollout concerns, operator watchpoints, or post-deploy checks.
- Read `../../packs/incident-response-pack.md` when documenting incident follow-up, mitigation, or recovery notes.
