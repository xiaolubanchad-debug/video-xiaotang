# component-consistency-pack

Use this pack when a change affects multiple UI components, page sections, repeated controls, settings screens, tables, modals, cards, or design-system-adjacent elements.

## Purpose

Improve product feel by checking whether adjacent pieces of UI still behave and look like they belong to the same system.

AI-assisted frontend work often produces interfaces that are individually functional but collectively inconsistent. This pack exists to catch those mismatches.

## Consistency checklist

### Visual hierarchy

- Do headings, section titles, and supporting text follow a clear hierarchy?
- Are primary vs secondary actions visually differentiated?
- Does spacing reflect importance and grouping?

### Repeated controls

- Do similar buttons look and behave similarly?
- Are destructive actions styled consistently?
- Are links, buttons, and menu actions used intentionally rather than interchangeably?

### Forms and inputs

- Are labels, helper text, validation messages, and input spacing consistent?
- Do similar fields use similar patterns across the page or flow?

### Tables, cards, and list rows

- Do repeated data containers share the same visual grammar?
- Are action placements predictable?
- Is density consistent across similar views?

### Modals, drawers, and dialogs

- Do overlays follow a consistent title, body, and action structure?
- Are cancel/close behaviors predictable?
- Are dangerous or irreversible actions signposted the same way everywhere?

### Copy and tone

- Are labels and messages written in the same voice?
- Do similar actions use similar verbs?
- Are generic placeholder phrases leaking into the UI?

## Review cues

Look for these common failure patterns:

- one button style used for multiple semantic roles
- spacing changes arbitrarily between adjacent sections
- one form uses inline errors while another uses top-level only without reason
- tables, cards, and modals each feel like they came from different systems
- duplicate actions placed differently in similar contexts
- vague AI-sounding labels like “Manage”, “Proceed”, or “Optimize” without context

## Best fit

Read this pack from:

- `design-review`
- `review-frontend-flow`
- `implement-feature`
- `qa-release`
