# Shukatsu OS: connecting research, ES revision, interviews, and next actions

**Live demo:** https://yaenyanyako.github.io/shukatsu-os-showcase/ (rebuilt with 4 fictional companies, 7 openings and 12 notifications; email, sending and calendar are simulated)

![Shukatsu OS overview](https://raw.githubusercontent.com/YAEnyanyako/YAEnyanyako/main/assets/shukatsu-overview.png)
**My role:** I owned requirements, information design, acceptance review, and prioritization. I defined the company-to-opening structure and the distinction between invitations and confirmed bookings, reviewed outputs, and directed revisions. Code was generated with AI coding tools.

## Product scope

I designed the workflow to connect company and industry research, past ES and interview accounts, source-linked distillation, ES revision, interview preparation, and application follow-through. Company and project identity keep those materials connected to the right recruitment track.

A useful research finding should become an ES improvement or a better interview question. That is why the workspace links research, confirmed personal experience, draft versions and preparation, alongside messages and deadlines. The wider workflow uses companion agent skills; the standalone demo illustrates those connections with fictional material.

[Full feature map and runtime scope](features.en.md)

### Problem
During job hunting, notices arrive separately from companies, job sites, and applicant portals. Storing them was not enough: every time, I had to work out which opening an email belonged to, whether I needed to act, and whether a date was a deadline or an event time.

**The one question I wanted answered: "What stage is this opening in, what should I do next, and what is the evidence?"**

### Problems found in use → my decisions

| Problem found in daily use | My decision | Result |
|---|---|---|
| Sorting by email type made it hard to follow one company | **Make the company the main entry point** | Emails, deadlines, and materials grouped by company |
| Deadlines for a company's full-time and internship tracks got mixed | **Split into three levels: company → opening → event** | Essays, deadlines, and prep linked to each opening |
| An "invitation" was treated as "already booked" | **Record facts, my intention, and the next action separately** | Reply deadline, event time, and cancellation deadline shown separately |
| Unclear sources made information hard to trust | **Preserve the evidence and verification status behind decisions** | Official notices, emails, and self-confirmed facts are distinguished |
| Missing information could lead to wrong actions | **Never fill gaps by guessing; mark them "to be confirmed"** | Evidence and unconfirmed items are shown on screen |

![Company inbox](https://raw.githubusercontent.com/YAEnyanyako/YAEnyanyako/main/assets/shukatsu-inbox.png)

**Try it in the public demo:** Open a scheduling-conflict notification and inspect its evidence and next action. My acceptance criteria included keeping invitations separate from confirmed bookings and preventing duplicate records when processing the same notification again.

### Records accumulated through real use (Sep 27, 2026, 19:02 JST)
- In use since mid-September 2026
- **215 message records** organized across 7 source categories
- **166 companies / 243 openings** and **80 selection steps** tracked
- **136 action records**, including completed, review-needed, and cancelled items
- **834 evidence records**, each labeled by source type

*Counts come from one local database snapshot. Companies are those linked to opportunities; opportunities include recruitment tracks and events. These are single-user usage volumes, not submitted-application totals or measured time savings.*

## Next validation

Measure task completion time, missed deadlines, and correction effort under a defined comparison procedure. The current figures document use; the next study will test whether the workflow improves those outcomes.

[Verification scope](evaluation.md) · [日本語](case-study.ja.md)
