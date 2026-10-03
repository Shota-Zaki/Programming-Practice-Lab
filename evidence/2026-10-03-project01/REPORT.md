# project01: profile-site design and structure

Product verification SHA: `7fa8c0a1af448328c4178204142ee5d460945e02`, based on remote work `e674abd61de4317dc713f730be24b8067c1f5339`.

Scope: one approved Chapter 7 lesson. Read the content, compare incomplete starter HTML with the structural example, edit three files, inspect structure at 375/768/1280, and export the same snapshot. Only project01 static structure can earn history. project02/03 native DOM/event/storage execution and trusted result transport remain unavailable. No native learner execution acceptance is claimed.

Existing workspace records are retained. New/reset work uses project01 starter files. Project01 history uses its own key; editing/cancel/reset/movement/reload returns the current result to unchecked without silently deleting historical completion. Separate confirmed history reset keeps code, old 21 lessons and native artifact storage untouched. Corrupt history is retained until that reset; controlled storage faults are distinguished from actual quota exhaustion.

Independent review rejected initial `8777e43` for effective fieldset disabling, closed details, hidden root CSS and explicit Tab-order false passes. `47eb4af` corrected those, but review found sanitized-away data attributes could hide controls in the source while passing measurement. Final product preserves supported inert attributes/root/wrappers and rejects unsupported elements/attributes before completion. No CSP/sandbox permissions were added. The displayed preview remains script-free; learner app.js bytes are never evaluated.

Verification artifacts:

- `unit.log`: 21 tests, including execution/controller, UTF-8 snapshots/hash/cancellation, project history/storage compatibility.
- `lesson/results.json`: 3 widths, starter fail/example pass, Tab/label operation, native disabled, no learner evaluation, history/edit/reload/move/reset, 40 semantic wrong answers and one valid fieldset equivalent, controlled denied/quota/corrupt history.
- `workspace/results.json`: 35 observations, 30 actual downloaded files with byte/hash readback, three-file restoration, resource/CSS denial, limits, controlled digest cancellation/faults, confirmations and disposable browser-process restart.
- `regression.log`: existing 21 lessons × 3 widths, grading negatives, preview/cancellation/timeout, old-v1 and storage regression.
- `verify-agent.log`: build/Pages/generated-docs drift gate.
- Selected lesson/preview/workspace/regression PNGs provide visual readback at all three widths.

Environment: isolated task-owned Windows checkout; Node 24.19.0, Playwright 1.63.0 installed only in task-owned test-tools, existing Chromium 153.0.8010.12. No browser sandbox disabling, persistent access, service restart, GitHub Actions, main merge or deploy. This is local Chromium evidence; real Pages, Safari, manual screen-reader audit and native learner execution are unrun.

Publication is held for parent fresh policy/remote-head/trigger checks. Remote work was read back as baseline e674abd before delivery; it has not received these commits. Final review and acceptance state are recorded in the current task-list section. A final evidence-only checkpoint has identical src/docs/tests to the verified product SHA.
