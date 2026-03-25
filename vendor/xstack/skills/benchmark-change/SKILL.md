---
name: benchmark-change
description: Evaluate a performance-sensitive change or suspected regression. Use when Codex should define what to measure, compare before and after behavior, identify bottlenecks, and judge whether the available evidence supports performance claims.
---

# benchmark-change

Measure performance claims instead of assuming them.

## Workflow

1. Identify the relevant performance dimension: latency, throughput, memory, CPU, bundle size, startup time, or query count.
2. Define the workload or user path being measured.
3. Check whether a trustworthy before/after comparison exists.
4. Call out confounders such as cache state, warmup, sample size, or environment drift.
5. Evaluate whether the current evidence supports the claim.
6. Recommend the next measurement if evidence is weak.

## Output

Always include:

- Metric under discussion
- Measurement setup
- Current evidence
- Confounders
- Conclusion
- Next measurement

## Notes

- Do not present anecdotal speed impressions as benchmark results.
- If no real benchmark exists, say so plainly.
- Prefer a small credible benchmark over a large noisy one.

## References

- Read `references/measurement-checklist.md` for setup quality.
- Read `references/perf-risk-patterns.md` when reviewing likely bottlenecks.
