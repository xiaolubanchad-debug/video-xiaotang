# nextjs-app-pack

Use this pack when a task targets a Next.js application, especially one using App Router, server components, route handlers, server actions, or mixed client/server boundaries.

## Purpose

Make xstack more effective on real Next.js codebases by focusing on the most common failure points:

- client/server boundary confusion
- incorrect use of server actions or route handlers
- data fetching placed in the wrong layer
- caching or revalidation assumptions that break UX
- auth and permission checks split incorrectly across client and server
- routing and loading states that feel correct in code but fail in product behavior

## Next.js checklist

### Client vs server boundary

- Is this component correctly marked as client or server?
- Is browser-only logic leaking into server components?
- Is sensitive logic incorrectly pushed into the client?

### Data fetching and mutations

- Is data fetched in the right layer?
- Should this be a server action, route handler, or existing backend API call?
- Does the mutation path update the UI correctly after completion?

### Routing and UX states

- Are loading, empty, error, and not-found states intentional?
- Does navigation preserve a coherent experience?
- Are route params, search params, and layouts used consistently?

### Caching and revalidation

- Are caching assumptions explicit?
- Does the flow require revalidation, refresh, or cache busting?
- Could stale data create a misleading UI?

### Auth and permissions

- Are permission checks enforced server-side where needed?
- Is the UI showing actions the server will reject?
- Are tenant or user-scoped reads and writes protected?

## Review cues

Look for these common failure patterns:

- using client components where server components would be simpler and safer
- server actions without clear UI reconciliation after mutation
- route handlers duplicating logic that belongs elsewhere
- stale data after mutation because revalidation was forgotten
- auth checks implied by UI only, not enforced on the server
- loading and error states treated as framework details instead of user experience

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-frontend-flow`
- `review-backend-api`
- `qa-release`
