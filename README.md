<p align="center"><img src="assets/cover.svg" alt="Shukatsu OS: from scattered signals to evidence-backed next actions"></p>

# Shukatsu OS — public showcase

**An AI-assisted job-search workflow connecting company research, past selection experiences, ES revision, interview preparation, and next actions.**

[日本語](README.ja.md) · [中文使用说明](README.zh-CN.md) · [Case study: English](docs/case-study.en.md) · [日本語](docs/case-study.ja.md) · [Evaluation](docs/evaluation.md)

Company → project → deadlines, mail, ES, source-linked research, interview practice and Calendar. Four fictional companies, seven independent projects and a fully local preparation workspace.

This standalone project uses **entirely fictional data**. It contains no applicant profile, private mail, production database, credentials, account links or production history. It is an AI-assisted implementation and a product/workflow design showcase.

## From research to action

Search accessible official and experience sources → organize seven-dimension company/industry research → distill past ES and interview lessons → review and revise an ES against confirmed experience → prepare for interviews → manage project deadlines and actions.

The full working environment combines companion agent skills with a private ledger. This standalone public website demonstrates their information flow with fictional data.

[Full feature map: English](docs/features.en.md) · [全機能：日本語](docs/features.ja.md)

## Product ownership and real use

I owned requirements, information design, acceptance review, and prioritization. I chose company → opening → event organization and rules that distinguish invitations from confirmed bookings; code was generated with AI coding tools.

The private workflow recorded **215 messages across 166 companies and 243 opportunities** (Sep 27, 2026, 19:02 JST; single user). These are aggregate operating records; the public app uses fictional fixtures. The case study explains the decisions and measurement definitions.

## Try it in five minutes

Open `index.html` in a modern browser. No installation, account or API key is needed.

1. Click **12 件のサンプルを仕分ける**. Twelve notices produce four company groups, two confirmed events and nine actions.
2. Open **会社・プロジェクト → Aster Works**. Compare the main selection and internship tracks: different ES/test deadlines, separate mail and separate drafts.
3. In **ES**, edit a fictional answer, save a version and check the three review perspectives. In **研究・素材棚**, collect simulated sources and save source-linked lessons.
4. In **面接準備**, pick a round, answer questions and inspect follow-ups. Saved ES versions and distilled material appear in the preparation pack.
5. Open **Calendar**, connect the simulation, apply the rescheduling sample and download a fictional ICS file. The two confirmed events stay at two.
6. Re-run mail processing or research collection. Existing source IDs are skipped. Follow the [walkthrough](docs/demo-guide.md) for details.

The circular-arrow button resets this browser's demo state. Dates are fixed fictional timestamps in May 2030, displayed in Japan Standard Time. They are not current opportunities or reminders.

## What is real, simulated, or absent?

| Component | Status |
|---|---|
| Grouping, date validation, state projection, deduplication, overlap detection | Executable deterministic JavaScript |
| Project decisions, ES drafts/versions, interview answers | Executable local editing and persistence |
| Company/project research, source collection and distillation | Fictional catalog, source-linked saving and replay-safe collection simulation |
| Calendar connection / ICS | Local connection/sync simulation; real fictional ICS download |
| Source messages and extracted facts | Hand-authored fictional fixtures |
| AI inference and extraction | Not connected; structured fixtures stand in for this stage |
| Email, recruitment portals, calendar services, submissions | Not connected; no external actions |

Seven independently identified projects illustrate multiple opportunities per company. The case study separates verified operating volumes from the fictional demo dataset.

## Product decisions

- **Project isolation:** deadlines, ES and interview answers belong to a specific course; company-wide notices remain unassigned to a project.
- **Research provenance:** fictional provider, year, round and project remain attached to distilled lessons.
- **Company context:** a platform-sent message can belong to a known company; a multi-company digest cannot be assigned arbitrarily.
- **Evidence before state:** an invitation does not create a confirmed reservation. A confirmation supersedes an RSVP action.
- **Date semantics:** reply/submission deadline, event time and cancellation cutoff have separate fields.
- **Honest uncertainty:** company-less notices become review items. Missing dates remain missing.
- **Incremental processing:** source IDs are retained; reprocessing is idempotent. A new rescheduling notice updates the event and recomputes conflicts.

## Structure

```text
index.html             Application entry point
src/fixtures.js        Fictional source messages and structured facts
src/workflow.js        Pure validation, projection and transition rules
src/catalog.js         Fictional projects, research sources and question banks
src/preparation.js     ES, distillation, interview and Calendar state / ICS
src/workbench.js       Company and project preparation views
src/app.js             Browser UI, routing and local state
assets/                Local styling and original SVG illustrations
tests/                 Node behavioral and UI-controller tests
docs/                  Case study, architecture, evaluation and demo guide
scripts/               Public-file checks and release packaging
```

## Verify

Requires Node.js 18+ and Python 3.9+. No package installation is needed.

```bash
npm test
python3 scripts/check_public.py
```

The tests check deterministic workflow behavior. They do **not** measure an AI model. See [evaluation scope and limitations](docs/evaluation.md).

## Put it on GitHub Pages

Upload the **contents** of this directory to the root of a new repository. Keep the folder structure. Do not upload a private project alongside it.

In the repository, select **Settings → Pages → Deploy from a branch → your default branch → /(root) → Save**. This site has no build step. `.nojekyll` is included. GitHub's [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) describes this setup.

To make a clean release archive:

```bash
python3 scripts/package_release.py ../shukatsu-os-showcase.zip
```

Only files in `release-files.json` are packaged. Packaging fails on an unexpected file, a symlink or a privacy-check finding. No Git history is included.

## Privacy and authorship

Read [PUBLIC_DATA.md](PUBLIC_DATA.md). All examples were authored for this demo, rather than exported and renamed from personal records. OpenWork, BizCampus, 外資就活 and ONE CAREER names represent source categories; their actual posts are not reproduced. Browser-entered drafts are not packaged into the static files. Source and documentation were developed with AI assistance; the repository makes no claim that every line was independently hand-written. Proposed evaluations and future integrations are explicitly separated from implemented behavior.

MIT License. The cover image is an original conceptual illustration, not a screenshot or a production-performance chart.
