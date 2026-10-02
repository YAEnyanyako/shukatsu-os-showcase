# Shukatsu OS: full workflow and feature map

**An AI-assisted job-search workspace spanning opportunity discovery, company research, ES revision, interview preparation, and follow-through.** Company → project is the organizing structure: an internship and a full-time track at the same company keep separate deadlines, messages, drafts, and preparation.

## The workflow

Find an opportunity → identify the company and project → research the business and selection process → distill source material → connect confirmed personal experience → revise an ES → prepare for interviews → track deadlines and next actions.

## Features and outputs

| Area | What the workflow does | What the public demo shows |
|---|---|---|
| Messages and opportunities | Organize notifications by both company and event type; distinguish individual invitations, confirmed bookings, selection tasks, and platform digests | Executable classification of fictional structured notices, source evidence, and next actions |
| Company and project workspace | Keep multiple recruitment tracks within one company separate; associate deadlines, messages, ES versions, and preparation | Four fictional companies, seven projects, independent material and deadlines |
| Company and industry research | AI-assisted retrieval of recruitment pages, company sites, IR and accessible experience reports; compare competitors and prepare motivation angles and reverse questions | Seven-dimension sample research and an industry comparison view |
| Past ES and selection experience | Import accessible or user-provided past ES examples, interview accounts, questions, follow-ups, case/GD/workshop formats; retain source, year, role and stage | Fictional material attributed to source categories such as OpenWork, BizReach Campus, Gaishishukatsu and ONE CAREER |
| Knowledge distillation | Extract recurring evaluation criteria, question patterns and preparation lessons; keep links to supporting accounts and mark gaps | Replay-safe sample collection and a source-linked material shelf |
| Personal experience materials | Use a separate record of confirmed experiences and facts when preparing answers; distinguish another applicant's experience from the author's own | Fictional applicant examples kept separate from reference accounts |
| ES coaching and revision | Combine the question, draft, company research and relevant experience; diagnose specificity, follow-up risk and expression; review revisions and check length and logic. Rewriting can be requested explicitly | Editable drafts, character counts, saved versions, and authored diagnostic guidance tied to each project |
| Interview preparation | Combine company/role/round, submitted ES, research and distilled material into expected questions, answer outlines, reverse questions and weak points; separate mock-interview workflow supports follow-ups | Round-specific sample questions, answers, follow-ups and a preparation pack using saved ES/material |
| Deadlines and Calendar | Separate submission, reply, event and cancellation dates; identify confirmed events, detect conflicts and update changed schedules | Connection/sync simulation plus a downloadable ICS file of fictional events |
| Daily actions and continuity | Record reported daily activity and the next step; keep processing timestamps and source IDs so later runs focus on new items | Persistent local task state, execution evidence and duplicate-safe replay; an authored activity-note example can be saved only from explicit nonempty input |
| Platform events and scouts | Review accessible individual notices, assess role relevance and identify the next step; missing company names remain unresolved | Unknown-scout handling and company/project organization; autonomous portal application or booking is not part of this release |

## Seven dimensions of research

1. Company fundamentals: scale, performance, business mix and position.
2. Strategy: medium-term direction, investment and challenges.
3. Role and department: actual work, required capabilities and career paths.
4. Business and revenue: products, customers and how value is monetized.
5. Competition: compare two or three peers on consistent criteria.
6. Culture and people: official hiring criteria alongside attributed employee accounts.
7. Recent developments: dated news that can inform motivation and reverse questions.

The useful output is a company-specific reason to apply, a clear view of the role, and questions that connect research to actual work.

## From a source to a better ES

An accessible past interview account is stored with its year, role, round and source. The relevant evaluation pattern becomes a preparation question. That question is compared with the applicant's confirmed experience and current draft. Feedback identifies a missing action, weak causal link, or follow-up the answer would invite. The applicant revises; the next review checks whether the problem was resolved and whether the answer fits the length limit.

This connection between research, evidence and revision is the core product decision. Collecting more reference material is useful only if it improves the next preparation step.

## Runtime and release scope

The wider working environment combines a private ledger, local tools and companion agent skills for research, ingestion/distillation, ES review and interview preparation. Skill definitions and local company/interview reports substantiate that workflow design; they do not establish unattended execution across every platform. Those companion skills and private materials are not bundled into this standalone repository.

When invoked with available browsing tools, the agent can search and organize accessible material. Login-restricted sources such as OpenWork are read through permitted access or supplied text/screenshots; this is not a site-wide unattended crawler. Missing pages remain gaps. Historical accounts are examples with dates, not current official selection rules.

The public website demonstrates the information structure with fictional data. It executes local editing, rules, persistence and ICS generation; live web collection, LLM ES feedback, external mail and calendar connections require the companion environment and are not connected here.

[Product case study](case-study.en.md) · [日本語](features.ja.md)

## Added in v2.1

Project material shelves distinguish research, ES, preparation and receipts; show confirmed versions before later drafts with timestamps and folded histories; generate a fictional CV PDF. Preparation opens on explicit invitation or a screening-pass example, keeping screening AI interviews separate from passed screening. Full reconciliation includes saved, old and undated items, exact-step receipt completion and explicit activity replies. The [walkthrough](demo-guide.md) exercises these local rules. Live email and unattended nightly runs remain disconnected.
