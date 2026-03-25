# performance risk patterns

- N+1 queries
- Repeated serialization or parsing
- Expensive work inside render loops
- Cache invalidation causing hot-path misses
- Large payload growth
- Unbounded retries or polling
- Extra network round-trips
- Hidden synchronous work on critical paths
