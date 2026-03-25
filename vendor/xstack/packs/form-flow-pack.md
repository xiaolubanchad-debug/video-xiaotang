# form-flow-pack

Use this pack when a change adds or edits a form, wizard, settings screen, modal form, or any user flow that collects input and submits it.

## Purpose

Forms are one of the most common and most fragile parts of web apps. This pack exists to make Codex check the parts that often get skipped:

- field validation
- submit state handling
- server error mapping
- repeat-submit protection
- success and follow-up behavior
- partial or draft-saving expectations

## Form flow checklist

### Field behavior

- Are labels clear and specific?
- Are required vs optional fields obvious?
- Are defaults intentional?
- Does input formatting match user expectations?

### Validation

- Is client-side validation clear and useful?
- Are server-side validation failures mapped back to the right fields or form-level error?
- Does the form avoid vague error messages?

### Submit state

- Does the user see that submission is in progress?
- Are duplicate submissions prevented or handled safely?
- Are controls disabled only as long as necessary?

### Success handling

- After success, does the UI clearly show what happened?
- Is the user redirected, reset, or left in-place intentionally?
- Does the underlying page state update correctly?

### Failure handling

- If submission fails, can the user recover without re-entering everything?
- Is the error message actionable?
- Does the form remain usable after one failed submission?

### Draft and unsaved changes

- If this form is long or high-effort, should draft-saving exist?
- If the user navigates away, is unsaved work handled intentionally?

## Review cues

Look for these common failure patterns:

- submit button stays disabled after error
- top-level error with no field mapping
- success toast but stale page data
- duplicate records from repeated clicks
- modal closes on failure and loses user input
- reset behavior that surprises the user

## Best fit

Read this pack from:

- `implement-feature`
- `review-change`
- `qa-release`
- `design-review`
