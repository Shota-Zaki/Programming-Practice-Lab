# ChatGPT / Codex Verification Contract

## Standard entrypoint

`npm run verify:agent`

The command aliases the repository's existing `verify` gate (`build`, Pages checks, and generated-docs drift check). Task-specific browser/accessibility checks remain additional requirements when listed in `task-list.md`.

## Execution rules

1. Read `AGENTS.md`, `task-list.md`, and `NEXT_WORK.md`.
2. Fix and record the verification SHA.
3. Run `npm run verify:agent`.
4. Run every extra task-specific audit required by the current Acceptance Criteria.
5. Treat skipped/unavailable/failed checks as not PASS.
6. Re-run affected checks after any SHA change.
7. GitHub Actions are not verification evidence.

## Evidence

Record verified SHA, command/exit result, generated-docs state, task-specific audits, blockers/unrun checks, and review result in `task-list.md`. Persist raw evidence only when required for readback.
