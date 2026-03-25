# auth-permission-pack

Use this pack when a change affects authentication, authorization, roles, ownership checks, admin actions, tenant boundaries, or user visibility rules.

## Purpose

Permission mistakes are among the highest-value bugs to catch early. This pack strengthens both design and review by forcing explicit checks around who can do what, on which resource, under which conditions.

## Authorization checklist

### Identity and session

- Is user identity established reliably?
- Are anonymous, authenticated, and elevated paths clearly separated?
- Do session assumptions still hold after this change?

### Role and policy

- Which roles can perform the action?
- Are permissions enforced server-side?
- Are hidden UI controls incorrectly relied on as protection?

### Ownership and object access

- Is resource ownership or tenant scope checked?
- Could a user act on another user's or tenant's record?
- Are list endpoints scoped correctly as well as detail endpoints?

### Admin and high-risk actions

- Are admin-only actions protected everywhere they appear?
- Are destructive or high-impact actions confirmed or audited appropriately?
- Does the change widen privileges by default?

### Visibility and leakage

- Could the UI imply access the backend will reject?
- Could the backend return data for resources the user should not see?
- Are permission failures distinguishable from missing resources where appropriate?

## Review cues

Look for these common failure patterns:

- frontend hides an action but backend still allows it
- detail route checks ownership but list route leaks records
- admin path protected in one controller but not another
- tenant scoping enforced in read path but not write path
- permission denied becomes generic 404 or 500 without intentional policy

## Best fit

Read this pack from:

- `plan-engineering`
- `review-change`
- `qa-release`
- `security-review`
