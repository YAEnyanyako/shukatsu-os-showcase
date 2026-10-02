# Shukatsu OS — from scattered notices to an evidence-backed next step

A workflow demo that organizes job-search notices by company and opening, lets you inspect their evidence, and shows what to do next. All data is authored fiction.

**▶ [Open the public demo](https://yaenyanyako.github.io/shukatsu-os-showcase/)** — no login or external service connection; the guided walkthrough takes about six minutes.

![The demo's opening screen, using only fictional data](assets/screenshot-overview.png)

- Case study: [日本語](docs/case-study.ja.md) · [English](docs/case-study.en.md)
- My role: requirements, information design, acceptance review and prioritization. Code was generated with AI coding tools.

[日本語](README.md) · [中文](README.zh-CN.md)

## What is real, simulated, or absent?

| Component | Status |
|---|---|
| Grouping, date validation, state projection, deduplication and overlap detection | Executable deterministic JavaScript |
| Documents, ES confirmation/history, answers, receipts and pending review | Executable local editing, deterministic rules and browser persistence; content is authored fiction |
| Company/project research, source collection and distillation | Fictional catalog, source-linked saving and replay-safe collection simulation; no live search |
| Calendar connection / PDF and ICS | Local sync simulation; executable fictional PDF/ICS generation and downloads |
| Source messages and extracted facts | Hand-authored fictional fixtures |
| AI inference and extraction | Not connected; structured fixtures stand in for this stage |
| Email, recruitment portals, calendar services and submissions | Not connected; no external actions |

## Try the main flow

Process the sample notices → inspect the source evidence → review the next action for each opening. Replay the notices to check that tasks and events do not multiply. [Open the guided walkthrough](https://yaenyanyako.github.io/shukatsu-os-showcase/#guide).

Also included: company research organization, ES version management, interview preparation and simulated Calendar integration. See the [feature map](docs/features.en.md) for details.

## Documentation and privacy

[Evaluation](docs/evaluation.md) · [Changes](CHANGELOG.md) · [Public data boundary](PUBLIC_DATA.md) · [Maintainer guide](docs/maintainer.md)

No real applicant profile, current selection-company name, private document, message, account or private operating volume is published. Examples were written afresh rather than exported and renamed. Browser-entered drafts stay in local storage and are not part of a static release. No AI accuracy, time savings or hiring outcomes are claimed.

MIT License.
