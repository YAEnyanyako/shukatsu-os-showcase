# Evaluation scope — v2.1

## Implemented checks

The v2.1 release passed **45 automated tests** with the Node built-in test runner:

- **13 workflow tests:** company/event labels, source deduplication, confirmation precedence, cancellation cutoff semantics, unresolved companies, digests, marketing notices, overlap, rescheduling, invalid dates, input immutability and fixture counts.
- **3 project-isolation tests:** sibling tracks with identical event names retain separate deadlines, decisions and confirmed events.
- **8 document/receipt/review tests:** confirmed-version priority and migration, exact receipt/replay, preparation evidence, all-pending and no-reply semantics, explicit journals, project-scoped screening pass and PDF byte offsets.
- **4 preparation tests:** independent ES versions/answers, replay-safe collection and source-linked distillation, stable Calendar updates and UTC ICS serialization, UTF-8-aware line folding.
- **17 UI-controller tests:** processing/source detail, completion restore, decisions, rescheduling/replay, reset/storage denial, company/project routes, escaped drafts and versions, research-to-interview linkage, company/project mail filters, Calendar sync and sequence restoration, next unfinished project deadline and disabled update controls.

Four UI additions cover material groups/confirmation restore, preparation gating, exact receipt/review/journal behavior, and saved invitations remaining in daily reconciliation.

Run `npm test` to reproduce. UI-controller tests execute actual application code against a minimal DOM sink in a Node virtual machine. They verify controller behavior and generated content. They are **not** browser, accessibility or visual-layout tests, and do not exercise a browser's download UI.

## Review and corrections

The initial release's review found completion restoration using a helper before initialization and acceptance of impossible dates. These regression cases remain covered. During v2, reload lost calendar update sequences; a regression reproduced it and the fix preserves the sequence. Independent v2 review found completed tasks still appearing as the next project deadline and an inert Calendar update button. Both were reproduced in controller tests before being fixed.

## Fixture results

| Step | Stored notices | Company groups | Source-derived actions | Confirmed sample events | Sample overlaps |
|---|---:|---:|---:|---:|---:|
| Initial state | 0 | 0 | 0 | 0 | 0 |
| Process initial batch | 12 | 4 | 9 | 2 | 1 |
| Add rescheduling receipt | 13 | 4 | 9 | 2 | 0 |
| Replay all 13 notices | 13 | 4 | 9 | 2 | 0 |

The catalog contains four companies, seven projects and 40 authored research sources. Aster's first collection adds 11 sources; repeating it skips all 11. Each Aster project's shelf uses four experience sources from its own track, with company-level research intentionally shared.

Saved decisions and completed tasks affect the attention list and next-deadline cards. The table above counts the underlying evidence projection before those choices. Counts are deterministic scenario outcomes, not measures of AI accuracy, time savings or hiring results.

## Public-file checks

The v2.1 feature update passed static checks of **38 public files**. Entrance documentation and a fictional screenshot were added afterwards. `python3 scripts/check_public.py` checks the current explicit release allowlist, forbidden file types, symlinks, user paths, non-example email domains, account-mail links, common credential patterns, local documentation links and SVG syntax. Packaging repeats the check and excludes Git history. The final archive is checked against the allowlist and current file bytes.

The release contains freshly authored fictional material. No database export, actual applicant history or genuine third-party experience post is included. Browser-local ES and answers are not part of the archive. The screenshot was captured from the public demo in a fresh, logged-out browser context and visually reviewed. Its reviewed digest and PNG structure are checked; image metadata, trailing data and unreviewed replacements are rejected. The static scan is a safeguard, not exhaustive secret detection.

## Separate browser smoke check

For the portfolio entrance update, the public Pages demo was exercised in an isolated Chromium browser: notification grouping, source dialog, confirmed ES versions and folded history, reload, explicit screening invitation, scoped receipt update, fictional PDF/ICS downloads and the simulated Calendar connection. The mobile opening and guide were checked for visible controls and horizontal page overflow. These checks are separate from the 45 deterministic automated tests and are not an accessibility audit, a complete cross-browser suite or a user study.

## Not yet verified or implemented

- Full desktop/mobile visual coverage, keyboard focus, screen readers and cross-browser compatibility remain unverified. The separate smoke check above covers selected interactions and downloads only. File navigation inside embedded previews may be blocked; use HTTP or the public site. No browser security settings were changed.
- Live model extraction or diagnosis, email/portal access, service authentication, outbound messages, submissions or calendar writes.
- Selection-cycle migration across years, travel buffers, cancellation notices and partial-duration events.
- Server persistence, shared accounts, concurrent writers or continuous operation.

## Future evaluation

For real extraction, freeze a reviewed evaluation set before tuning prompts, separate development and held-out cases, and report error denominators. Test wrong-company attribution, missed actions, invented deadlines, false confirmations and duplicated side effects separately. For preparation, evaluate source relevance, fact/experience separation and usefulness to the applicant. Measure human review time and failure recovery alongside output quality. No model or user study is claimed here.

The current release is also compared locally against private company-name and applicant-information markers before upload. That comparison is not shipped, and publishes neither the names nor matching private data. Static scanning and independent code review do not establish that all future additions are safe.
