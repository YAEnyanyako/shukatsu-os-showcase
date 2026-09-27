> Historical v1 implementation record. For the current release, see [v2 plan](v2-plan.md) and [evaluation](evaluation.md).

# Public showcase implementation plan

**Goal:** A privacy-safe interactive project demonstration that can be uploaded to a GitHub repository and served as a static website.

**Architecture:** Standalone static app; fictional structured extraction fixtures; pure state projection; browser-local UI state. No changes to any operational system.

**Stack:** HTML, CSS, JavaScript, Node built-in test runner, Python standard library for release packaging.

**Spec:** [design.md](design.md)

## Constraints and review focus
- Public files contain only fictional records and generic project documentation.
- Every simulated capability is labelled; no live AI, email, booking or calendar claims.
- Duplicate and older notifications cannot duplicate actions or reverse confirmed state.
- Deadline, event time and cancellation deadline remain distinct.
- Browser storage failures, keyboard use and small screens remain usable.

## Tasks
1. Write behavioral tests for the workflow interface, observe failures, then implement `createState()`, `processBatch(state, messages)`, `project(state)`, `overlap(a, b)` and `setDecision(state, companyId, decision)` in `src/workflow.js`.
2. Author fictional source messages in `src/fixtures.js`, then build overview, company inbox, pipeline and audit views in `index.html`, `src/app.js` and `assets/style.css`.
3. Add English, Japanese and Chinese documentation, case-study narrative, demo walkthrough, privacy boundary, contribution disclosure and license.
4. Run logic tests, check the real page at desktop/mobile widths, exercise processing/rescheduling/repeat/reset, run privacy checks and build a release archive from an allowlist.

## Implementation record
- Selected a fresh directory and authored synthetic data instead of exporting the private application. The public artifact contains no production snapshot or git history.
- This request authorizes building the previously discussed demo. Routine design and implementation decisions are made inline; no publication is performed by the packaging step.

## Verification record
- Workflow and UI-controller tests: 19 passed.
- Independent code review: two concrete issues fixed with regression tests (completion restoration and impossible dates).
- Public-file check: 25 allowlisted text/SVG files; no flagged patterns or broken local documentation links.
- Real-browser visual/keyboard checks remain unverified because the preview URL policy blocked the local page. The restriction was not bypassed.
- Ready for a public source archive; no repository has been created or published by this task.
