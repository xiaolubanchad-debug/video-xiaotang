---
name: review-change
description: Review a code change, diff, branch, or proposed implementation for bugs, regressions, maintainability problems, and release risk. Use when Codex should act like a careful reviewer rather than an author.
---

# review-change

Review the change as an adversarial but fair engineer.

## Workflow

1. Inspect the diff or changed files first.
2. Reconstruct the intended behavior change.
3. Look for correctness issues before style concerns.
4. Check edge cases, error handling, state transitions, and contract drift.
5. Separate must-fix findings from lower-priority suggestions.
6. Note missing tests or weak validation.
7. Keep the review concise, specific, and evidence-based.

## Output

Always include:

- Summary
- Must fix
- Should fix
- Test gaps
- Risk assessment

## Review standard

- Prefer concrete failure modes over vague discomfort.
- Point to affected files, functions, flows, or assumptions.
- If no serious problems are found, say so clearly.
- Do not invent issues to make the review look thorough.

## References

- Read `references/common-risk-patterns.md` for a checklist of frequent failure modes.
- Read `references/review-template.md` when a formal report format is useful.
- Read `../../packs/backend-api-pack.md` when reviewing API or backend-contract changes.
- Read `../../packs/db-migration-pack.md` when reviewing persistence or migration changes.
- Read `../../packs/fullstack-contract-pack.md` when reviewing features that span UI and backend.
- Read `../../packs/frontend-state-flow-pack.md` when reviewing user-facing stateful flows.
- Read `../../packs/form-flow-pack.md` when reviewing forms or submit-heavy user flows.
- Read `../../packs/auth-permission-pack.md` when reviewing access-control or tenant-scoped changes.
- Read `../../packs/release-risk-pack.md` when reviewing production-sensitive or multi-layer changes.
