# Chapter6 DOM/event boundary checkpoint — 2026-10-02

Source/test SHA: `c4f80e091b5b5a728667eaf5dd2704e7b0bfc4c8`.
Baseline preserved: `4d980e200346ecf287157b8d0838731ddf32d727`.

This checkpoint adds an independently usable DOM/event execution bridge and parent grader. It adds **no lessons or application UI**, and course completion stays **18/24 = 75%**. Native DOM lives in an opaque iframe; learner code runs only in its dedicated Blob Worker. The learner receives a limited facade, not native DOM or jsdom. The first native fixture is a test fixture, not accepted educational content.

Reproduce using existing Playwright/browser software:

```sh
npm run verify:agent
npm run test:execution
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/dom-browser.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/javascript-browser.mjs
```

The last command normally writes Chapter5 evidence to its existing default directory. For this checkpoint it was run from a separate task-owned directory with `docs` linked to the fixed candidate, then its evidence copied into `chapter5-regression/`. This preserves all original Chapter5 evidence. No dependency was installed and each browser/server was task-owned and closed in `finally`. Heavy tests were sequential.

## Supported educational contract

- Simple ID querySelector on at most8 configured, independent targets; absent ID returns null. Other selectors/properties/APIs fail clearly.
- textContent/value getters and primitive string/number/boolean writes; writes stringify and truncate at160 UTF-16 code units. Object/null/undefined writes are rejected. Worker cache reflects requested writes immediately; native input normalization is reflected in the next event/snapshot. This is not a general synchronous DOM getter guarantee.
- click/input function listeners without options, capture, once or removal. Duplicate type/callback is ignored. Callback `this`, target and currentTarget are the selected element; currentTarget becomes null after dispatch/failure. Registration during dispatch starts with the next event.
- Native Promise callbacks are awaited serially within the same result deadline; other returns are ignored. Exceptions fail the whole run. These differ from native DOM's Promise/exception dispatch semantics and must be stated before teaching.
- Native steps support enabled type=button buttons and editable text inputs/textareas. Disabled/inert/readonly, duplicate-ID, nested-target and overlong initial-value fixtures are rejected. No bubbling/default-action/event-cancellation model is taught by this bridge.

## Browser evidence

`browser-results.json` and `browser.log` retain Chromium151 results from real DOM/native click/input event execution, served at a repository-relative prefix.

- Five snapshots show count0→1→2, duplicate callback invoked once per click, currentTarget cleanup, Unicode/HTML-looking input copied faithfully and empty input reset.
- Parent grading accepts the correct program and rejects a fixed answer; expected values are never supplied to the Worker. Snapshots are read by trusted frame code from native nodes, not accepted as guest-supplied grades.
- Four unsupported fixture cases and five unsupported API cases rejected. Forced iframe-creation failure releases the shared slot; abort during creation removes the frame and releases the slot.
- Worker parent/localStorage/child constructors unavailable; IndexedDB denied. fetch/WebSocket/importScripts probes produce zero prohibited requests. Guessed private commands and synthetic Worker message events are ignored.
- Browser tooling inspected the actual iframe: HTML-looking output was text, img nodes0; the parent application's attempt to read the opaque frame document raised SecurityError.
- Cancellation/reset/navigation-harness cases wait for a real click callback to enter, then abort its delayed continuation. A fresh run has fresh DOM state; late work does not overwrite it. These are consumer-level AbortSignal/reset/history simulations, **not Chapter6 application UI acceptance**.
- Four rapid cycles reject128 combined DOM/Chapter5 starts during the shared reservation. Cancel response0.1–4ms;150ms timeout response152.1ms. Idle async workers disappear by the first400ms sample; infinite-loop Worker remains at400ms and disappears2036ms after response. Post-grace renderer CPU0 seconds/500ms. Reverse reservation (Chapter5 blocks DOM) also passes.

`controller.log`:8/8 including stale callback rejection and abort during factory creation. `verify-agent.log`: Pages generation/source synchronization. `source-manifest.json`: fixed-source hashes and unchanged lesson IDs/data, progress, application UI and prior browser test.

## Remaining scope and limits

The independent fixed-SHA source review found no blocking finding, including educational semantics. Chapter6 content, UI integration, user reset/navigation bindings and course-progress acceptance remain unimplemented. Existing Chapter5 browser regression passed all3 lessons×375/768/1280px, semantic/negative/boundary/lifecycle/restore/reset/escaped-output cases; native shutdown and CPU were also verified. It is recorded separately in `chapter5-regression/`. The original verified baseline evidence is unchanged. Safari, manual accessibility and actual published Pages remain unverified. No main merge/publication.

The two-second result deadline remains separate from native shutdown latency. Both execution types use one shared slot, no queue, one-second acknowledgement fallback and five-second post-frame reservation. This bounds creation/backlog in the observed environment; it is not a universal native termination or hard per-Worker memory guarantee, and page reload recreates the module slot. Operation/listener/code/fixture/state bounds are application-level restrictions, not OS resource isolation.
