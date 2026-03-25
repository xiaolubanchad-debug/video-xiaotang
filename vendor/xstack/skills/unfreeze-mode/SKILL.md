---
name: unfreeze-mode
description: Explicitly return from freeze-style constraints to normal task execution. Use when Codex should resume ordinary planning and implementation behavior after stabilization, containment, or diagnosis work.
---

# unfreeze-mode

Return to normal operating mode.

## Mode rules

- Resume normal planning and implementation freedom.
- Keep any explicit safety constraints still required by the task.
- State what was learned during the freeze period before proceeding.

## Output

When active, include:

- What changed since freeze
- Active constraints that still remain
- Recommended next step
