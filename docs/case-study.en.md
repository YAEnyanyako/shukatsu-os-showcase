# Shukatsu OS — choosing a next step from notice evidence

[Public demo](https://yaenyanyako.github.io/shukatsu-os-showcase/) · [Interactive guide](https://yaenyanyako.github.io/shukatsu-os-showcase/#guide) · [Changes](../CHANGELOG.md)

A workflow demo for scattered notices → evidence review → the next action. Companies, messages, documents and dates are authored fiction. No personal profile, current selection-company name or private operating volume is published.

**My role:** requirements, information design, acceptance review and prioritization. I chose company → opening → event organization, evidence-based transitions and confirmed-version selection. Code was generated with AI coding tools.

## The problem

One company can have several openings, and receipt, invitation and booking confirmation mean different things. Saving messages and documents alone does not explain which opening they belong to, which version to use or what remains unfinished.

## A concrete fictional example

Aster Works has product-selection and AI-internship notices. Grouping by company alone can mix a product-selection meeting confirmation with an internship answer-form receipt. A receipt is also not evidence of screening success. The demo separates the openings and shows the product meeting only from its booking-confirmation notice. Applying the internship receipt completes that ES alone: the aptitude test stays pending, without adding a screening pass or interview booking.

![The fictional demo's opening screen](../assets/screenshot-overview.png)

## Representative product decisions

| Decision | Acceptance condition |
|---|---|
| Separate openings | Sibling tracks keep independent notices, deadlines, ES and answers |
| Prefer a confirmed version | Confirmed v2 stays first; other versions, including a later unconfirmed v3, are folded with dates and states visible |
| Separate content confirmation from submission | Confirming an ES version does not submit it or prove receipt |
| Separate invitation from booking | Explicit practice evidence does not create a reservation; a screening-stage AI interview does not imply screening success |
| Replay without multiplying work | Known notice IDs are skipped, a receipt updates only its matching step, and a reschedule updates the same event |

Other features are documented in the [feature map](features.en.md).

## Executable behavior and demonstration boundaries

Editing, version save/confirmation, history display, purpose filters, state transitions, answer saving, pending reconciliation, journal saving, PDF generation and ICS generation run locally. Browser input stays in local storage and is not part of a static release.

Notifications, extracted facts, research, experience reports and questions are authored fixtures. “Collect” saves known fictional source IDs; it does not search websites. Guidance uses simple rules and prewritten text. Calendar connection is a local simulation. Email, recruitment portals, AI APIs, external calendars, applications, messages and unattended nightly runs are disconnected.

Examples were written afresh, not exported and renamed from private records. Real applicant details and operating counts are excluded.

## Acceptance verification and limits

Acceptance conditions were translated into 45 automated tests covering workflows, project isolation, versions/migration, preparation timing, exact receipt updates and replay, all-pending reconciliation, explicit activity replies and PDF/ICS structure. The v2.1 feature update also passed a static check of 38 public files. The subsequently added entrance documentation and fictional screenshot are included in the current public-file checks. See [evaluation](evaluation.md).

Automated checks alone do not establish browser layout, accessibility, AI accuracy, time savings or hiring outcomes. Future evaluation should freeze scenarios and measure evidence review time, version-selection mistakes and incorrect state changes before claiming improvements. No unmeasured outcome is presented as a result.

[Feature map](features.en.md) · [日本語](case-study.ja.md)
