# Independent exact-candidate review

Reviewer: separate `/root/project01_review` agent. Review scope: immutable candidate vs baseline, PPL only, bounded read-only validation. No independent edits or publication.

- `8777e43f120b54bf19d1ea4fc3f05712e7ee0dad`: rejected. Effective fieldset disabling, closed details, hidden html root/class, and explicit tabindex changes could pass after sanitization changed semantics.
- `47eb4af5967007d2a17bd6967df5b82f2a795cd1`: rejected. The original blockers were resolved, but main/body data-hidden selectors still passed because attributes were stripped.
- `7fa8c0a1af448328c4178204142ee5d460945e02`: no blocking findings. Prior blockers resolved by supported inert attribute/root/wrapper preservation and rejection of unsupported attributes/elements before completion.

Final independent evidence: original four invalid cases, main/body data-hidden and unsupported custom-hidden rejected; valid fieldset and legitimate data-topic/dir=ltr/role=main accepted. 21 unit/controller tests, Pages check and baseline-to-candidate whitespace diff check passed. HEAD unchanged and source/docs clean during review.

Review limits: independent reviewer did not rerun the full 40-negative UI suite or old 21×3 UI regression; implementing agent ran those. Native arbitrary learner execution/Storage acceptance, real Pages, Safari and manual read-aloud remain unverified. These are explicitly unavailable or deferred rather than claimed complete.

The final report checkpoint adds only management documents and evidence to this reviewed product. Publication remains held for parent policy/remote/trigger checks.
