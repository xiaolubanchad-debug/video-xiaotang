# nestjs-backend-pack

Use this pack when a task targets a NestJS backend, especially one involving controllers, services, modules, DTOs, pipes, guards, interceptors, providers, or route-level auth and validation behavior.

## Purpose

Make xstack more effective on real NestJS backends by focusing on the framework-specific places where AI-generated code often looks correct but produces weak architecture or risky behavior:

- controller/service/module boundaries that become muddy
- DTO and validation pipe usage that compiles but does not express the real contract
- guards, decorators, or interceptors that hide auth and permission behavior
- provider injection that works locally but creates unclear dependency structure
- exception handling and error shaping that feel framework-valid but product-inconsistent
- queue, async, or side-effect behavior that lacks release and runtime judgment

## NestJS checklist

### Controller / service / module structure

- Does this logic belong in a controller, service, provider, or module-level abstraction?
- Is the controller thin enough, or is business logic leaking into it?
- Are modules organized in a way that matches the domain boundary?

### DTOs and validation

- Are DTOs expressing the request/response contract clearly?
- Are validation rules explicit and in the right layer?
- Could transformations or defaults create hidden behavior?

### Guards, decorators, and auth flow

- Are guards enforcing access where they need to?
- Is role, ownership, or tenant scope behavior explicit enough?
- Could auth rules be split across decorators, guards, and services in a confusing way?

### Providers and dependency structure

- Are dependencies injected in a way that is understandable and testable?
- Is a provider doing too much?
- Does the module graph make the dependency direction reasonable?

### Exceptions and response behavior

- Are exceptions mapped intentionally?
- Do errors and success responses match the contract expected by callers?
- Is framework-level exception handling hiding product-level inconsistency?

### Async work and side effects

- Are background jobs, events, or side effects placed in the right layer?
- Is failure visibility good enough for production?
- Are transaction, retry, or eventual consistency assumptions explicit?

## Review cues

Look for these common failure patterns:

- controllers getting fat while services stay thin but meaningless
- DTOs that validate syntax but not actual business expectations
- guards used, but object-level ownership still missing deeper in the flow
- providers injected everywhere without clear boundary discipline
- exception filters or interceptors masking inconsistent route behavior
- async side effects added without operational visibility or rollout thinking

## Best fit

Read this pack from:

- `plan-engineering`
- `implement-feature`
- `review-backend-api`
- `security-review`
- `qa-release`
