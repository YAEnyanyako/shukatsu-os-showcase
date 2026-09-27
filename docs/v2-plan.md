# v2: Company and project preparation workspace

## Scope
Keep the public demo completely synthetic. Add a company directory with drill-down into seven separately identified recruiting projects across four fictional companies. Each project owns its deadlines, mail, ES questions/versions, distilled experience and interview practice. Company-level research is shared intentionally; project-specific history is not.

## Features
- Company → projects → overview, deadline timeline, mail, ES, research/distillation, interview tabs.
- Two independent Aster Works tracks with different ES/test deadlines and round-specific material.
- Company-first inbox retained, with a second project filter and an explicit unassigned/company-wide bucket.
- Research collection simulation for recruiting pages, IR, OpenWork, BizCampus, 外資就活 and ONE CAREER. Pre-authored sources are clearly fictional. Repeated collection adds only unseen source IDs. Seven-dimension company research, industry comparison and saved source-linked distillation.
- Editable ES drafts scoped by project and question, Unicode character counts, immutable saved versions, and diagnostic feedback in three dimensions without automatic rewriting.
- Round-specific interview questions, follow-ups, locally saved answers and a rules-based weakness review.
- A clearly labelled Calendar connection simulation, confirmation-only sync with stable event IDs, update-in-place on rescheduling, and a real ICS export of fictional events. No OAuth or live account connection.

## Acceptance
1. Two projects of one company can have different deadlines, decisions, ES and practice answers without leakage.
2. Company mail includes all its projects; project mail includes only its own messages; ambiguous mail is not assigned arbitrarily.
3. Source collection and distillation are idempotent and retain source year, round, project and credibility context.
4. Drafts and versions survive local reload; rendered text is escaped; no personal content enters packaged files.
5. Calendar simulation syncs confirmed events only, updates rather than duplicates on a changed receipt, and exports valid escaped ICS records.
6. Original date/duplicate/confirmation tests remain covered; new workflow and UI-controller tests cover the new paths. Browser preview remains constrained by the earlier URL-policy rejection; no workaround is used.

## Execution order
Tests → project-aware workflow → synthetic catalog and preparation store → company/project/research/interview/calendar views → persistence and routing → docs and privacy scan → independent code review and regression fixes → versioned archive.

## Completion record

Implemented all scoped local demo flows. Final suite: 33 passing automated tests. Independent review findings were reproduced and corrected. Public release contains 31 allowlisted files, with all company, project, mail, research and applicant examples authored fiction. Browser visual verification remains blocked as documented; live service connections remain intentionally unimplemented.
