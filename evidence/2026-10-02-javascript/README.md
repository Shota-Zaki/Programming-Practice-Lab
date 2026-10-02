# JavaScript Chapter 5 verification — 2026-10-02

Source/test SHA: `7e7e8fb9ca18a9dbfd04e86366b33e14c8452b14`.

Scope: js01/js02/js03, parent-side numeric semantic grading, opaque iframe Blob Worker host, bounded code/results, cancellation and a single execution slot. Existing lesson IDs and v1 storage remain unchanged. No main merge, deployment or publication.

Reproduce using an already available Playwright/browser installation (no installation required by these scripts):

```sh
npm run verify:agent
npm run test:execution
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/javascript-browser.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs
```

- `controller.log`: 8/8, including real Node Worker infinite-loop interruption and cancellation during host creation.
- `verify-agent.log`: generated Pages validation and exact source/generated synchronization.
- `javascript-results.json` / `javascript-browser.log`: actual Chromium semantic, boundary, interruption and UI checks. Runs served under `/Programming-Practice-Lab/` to exercise repository-relative module paths.
- `regression/browser-results.json`: all 18 lessons at 375/768/1280px, HTML/CSS negative cases and saved-progress regression.
- Nine `js01`–`js03` PNGs plus regression PNGs: responsive screenshots. Reviewed 1280px js03 and 375px js02 for readable code/results and no clipped layout.

## Native termination observations and acceptance contract

The initial 400ms post-cancellation zero-Worker assertion failed: two busy Worker targets were still present. That was a real observation, but subsequent independent controls disproved the initial persistent-leak interpretation. Chromium 151's native `terminate()` can take approximately three seconds to finish a busy Worker. A termination acknowledgement means the trusted frame requested termination, not that CPU has already stopped.

Independent reviewer controls (`native-probes/controls.mjs`, `long-controls.mjs`) used a task-owned browser/server, one page and one Worker; the raw CDP control did not attach a Playwright page/Worker. The reviewer measured 0.486–0.500 renderer CPU seconds per 500ms after termination request, followed by target disappearance around three seconds and four consecutive idle seconds (0–0.000271 CPU seconds per second). Idle and 1.8-second finite-loop controls were also checked. These observations are an independent report; their original terminal output was not retained. Final application tests retain their own raw JSON/log observations. Chromium 148 reproduced the short-delay observation, but its long shutdown timing was not independently measured.

The public calculation-result deadline remains two seconds. Cancel/timeout responses are separately measured at short test deadlines; completion is not delayed until the native shutdown grace ends. The application reserves one host slot during execution and for five seconds after frame cleanup, rejects additional starts without a queue, and disables execution controls with a visible stopping message. Rapid cancellation/timeout checks reject 32 attempted extra starts in each of four cycles, then require actual Worker target disappearance. CPU is checked separately after grace. This bounds application creation rate and cleanup backlog in the tested environment; five seconds is an observed-environment margin, not a universal browser termination guarantee.

Final application measurements: cancellation response 53.1–53.8ms, 150ms test timeout response 152.6–152.9ms. Each infinite Worker remained visible at 400ms and disappeared 2035–2046ms after response; post-grace renderer CPU was 0 seconds over the 500ms observation. Thus the original short-delay observation is retained, not hidden. The source review at the pinned SHA found no blocking source finding. Full release/main approval is outside this task.

## Limits

No browser-independent hard per-Worker memory quota exists here. An allocation attack may affect the browser; this is not an OS resource sandbox. The code-size/case/output bounds and network/storage denial do not constitute such a guarantee. Page reload can recreate the module execution slot. Tests cover installed Chromium, not Safari, manual assistive technology or real published GitHub Pages. Network denial was probed with fetch, WebSocket and importScripts; same-origin DOM/localStorage are unavailable, IndexedDB/CacheStorage are denied. Worker construction is suppressed as a supplementary measure; opaque origin and CSP are the actual authority boundary. No credentials or expected grading values are passed to the learner Worker.
