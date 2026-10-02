# Shukatsu OS: choosing the next step from evidence and document versions

[Interactive demo](https://yaenyanyako.github.io/shukatsu-os-showcase/#guide) · [Walkthrough](demo-guide.md) · [Changes](../CHANGELOG.md)

Four companies, seven projects and twelve notices are independently authored fiction. No real applicant profile, ongoing selection company, private document, message, schedule, result or private operating count is included.

## Role and problem

I owned requirements, information design, acceptance review and prioritization; implementation used AI coding assistance. I chose company → project → event organization, evidence-based transitions and confirmed-version selection.

Saving documents alone does not answer which opening they belong to, which version to use, whether an interview is actually next, or what remains unfinished. A seminar note, an application answer and a receipt serve different purposes. A newer draft can still be less authoritative than a previously confirmed answer.

## Product decisions

- Separate sibling openings: mail, deadlines, ES and interview answers are project scoped; company research can be shared.
- Organize materials by purpose: seminar notes and experience reports belong to research; applicant answers and CVs to ES; preparation and receipts have separate categories. Internal JSON stays out of the human material list.
- Keep one group per saved question/document identity. A confirmed version takes precedence over a later unconfirmed draft. Show version, date and confirmation state; fold other versions. Restore legacy versions without inventing missing timestamps or confirmation.
- Separate content confirmation from submission evidence. Confirming an ES version does not submit it.
- Open interview practice after an explicit interview invitation or document-screening pass. Seminar bookings and assessment notices do not imply interview progression. An AI interview can remain part of document screening.
- Apply a receipt only to its matching step. A fictional ES receipt completes the internship ES while the aptitude test remains pending; replay does not duplicate evidence.
- Reconcile all unfinished actions, including saved invitations, older items, undated questions and future preparation. No reply changes nothing. Activity notes require explicit nonempty input rather than being inferred from email.
- Preserve source IDs, event identities and date semantics. Reprocessing skips duplicates; a confirmed reschedule updates one existing event and recalculates conflicts.

The existing seven-dimension research and comparison flow remains. Authored provider/year/project/round context stays attached to distilled lessons. The ES editor stores versions per question; interview packs use the same confirmed-version rule.

## Executable behavior and demonstration boundaries

Editing, version save/confirmation, history display, purpose filters, state transitions, answer saving, pending reconciliation, journal saving, PDF generation and ICS generation run locally. Browser input stays in local storage and is not part of a static release.

Notifications, extracted facts, research, experience reports and questions are authored fixtures. “Collect” saves known fictional source IDs; it does not search websites. Review guidance uses simple rules and prewritten text. Calendar connection demonstrates local synchronization without service authentication. Email, recruitment portals, AI APIs, external calendars, applications, messages and unattended nightly runs are disconnected.

The wider private environment combines a local ledger and companion tools, but its data and current selection companies are not shipped. Public examples were written afresh, not exported and renamed.

## Verification and limits

Version 2.1 has 45 automated tests covering workflows, project isolation, versions/migration, preparation timing, exact receipts/replay, all-pending reconciliation, explicit activity replies and PDF/ICS structure. The 38-file public allowlist also receives static checks; see [evaluation](evaluation.md).

These checks do not establish browser layout, accessibility, AI accuracy, time savings or hiring outcomes. A future evaluation would freeze scenarios and measure evidence review time, version-selection mistakes and incorrect state changes before claiming improvements.

[Feature map](features.en.md) · [日本語](case-study.ja.md)
