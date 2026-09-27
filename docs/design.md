# Public showcase design — v2

## Purpose and boundary

Demonstrate company → project → evidence → preparation → next action. All source content is independently authored fiction. No private application records or account connection are used. Website names identify simulated source categories only. No network requests, model calls, analytics, external fonts or runtime packages.

## Modules

| Module | Responsibility |
|---|---|
| `fixtures.js` | 12 initial fictional messages and one rescheduling receipt |
| `workflow.js` | Timestamp validation, company/project attribution, action projection, confirmation precedence and overlap checks |
| `catalog.js` | Four companies, seven projects, 40 fictional research sources, seven-dimension profiles and question banks |
| `preparation.js` | Drafts/versions, source collection, source-linked material shelf, interview answers, Calendar simulation and ICS serialization |
| `workbench.js` | Company, project, research, interview and calendar views |
| `app.js` | Routing, local persistence, event handlers, inbox and evidence dialog |

## Identity and information boundaries

- Company context is shared intentionally. Mail can belong to a company without identifying a project.
- Project ID separates main selection, internship and event participation. ES is keyed by project/question; interview answers by project/round/question.
- Event identity combines company, project and source event ID. A sibling project using the same event name cannot overwrite another's deadline or reservation.
- The main inbox retains company grouping and adds a project filter. Digests and unknown scouts remain unassigned.
- Intentions never fabricate bookings. Saving an invitation removes it from the attention list; a confirmed event or assessment remains a fact.
- Company research sources may apply to every project. Experience sources carry one explicit project, year and round; distillation retains that provenance.

## Local state

Only authored mail fixtures are restored from saved source IDs. Known preparation keys are restored, and user-entered prose is escaped when rendered. Drafts autosave; versions are explicit snapshots. Storage denial falls back to a temporary session with a visible notice. The v2 storage key is separate from v1. Reset clears v2 data, including ES drafts and answers.

Collection is a simulation over an authored catalog, with source-ID deduplication, new/skipped counts and an actual local execution timestamp. It does not imply successful access to any named website. Distilled lessons and diagnosis text are authored templates/simple rules, not language-model outputs.

## Calendar

The connection toggle controls a local simulation. Confirmation-only projection feeds stable event IDs; a new receipt updates the same event and increments its sequence. Repeated sync skips unchanged entries. Reload preserves the current sequence. Disconnect stops automatic sync; reconnect compares with the retained snapshot.

ICS export is a real download of fictional confirmed events. It uses UTC timestamps, escaped text, CRLF endings and UTF-8-aware 75-octet line folding. It does not send invitations or authenticate to a calendar provider. Repeated manual imports are subject to the destination application's behavior.

## Verification and limitations

Workflow and UI-controller checks are automated with Node; the latter execute generated UI against a minimal DOM sink and do not replace browser testing. Browser preview was blocked by URL policy and was not bypassed. Desktop/mobile layout and keyboard behavior remain unverified in a real browser. See [evaluation](evaluation.md).

No server persistence, collaborative editing, automatic website retrieval, real model extraction, account connection, cancellation workflow, travel buffers or real application submission is implemented.
