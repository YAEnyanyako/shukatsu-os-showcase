# Changelog

## 2026-11-04 — 私用ツールの協作・共通記録の確認を文書化

- Claudeは材料作成と識別IDつきの引き継ぎ、GPT / Codexは独立した検証・メール照合・正式台帳への登録と読み戻しを担当する分担を明確化。
- 状態の正本を1つの台帳とし、事実・情報源・未確認事項を同じ入口から参照。
- 回答前に読み取り記録の版・時刻・対象範囲・会話を照合し、更新や期限切れがあれば再読込。読み取り失敗時は未検証と明示。
- 引き継ぎのIDと材料ハッシュを照合し、対象未確定・未確認事項を保留。受信・確認・提出・選考結果は別々に扱う。
- 本人確認は原文保存→根拠つき登録→独立した読み戻し。材料欠落や事実衝突、完了後の古い対応事項も点検。
- 本人が課題・分担・確認条件・修正判断を担当し、AIはコード生成を支援。再発件数・時間削減は未測定。
- この文書は私用環境の改善を説明する。公開デモへの実AI・台帳接続を追加したものではない。GitHubでは更新背景を説明し、デモは機能体験に集中させる。

## Portfolio entrance and case-study clarification

- Clarify that the demo stays fictional while authorized, dated aggregate usage counts appear separately on the profile; no real applicant records are published.

- Put a Japanese introduction, direct public-demo link, fictional screenshot, case-study links and role summary at the repository entrance; add a separate English README.
- Move local setup, Pages publication and release packaging to the maintainer guide.
- Explain one existing Aster scenario before five representative acceptance decisions; retain executable/simulated boundaries and the historical v2.1 verification counts.
- Use only authored fictional data in the screenshot; no actual applicant profile or job-search record is added to the demo.

## 2.1.0 — 2026-10-02

- Added purpose-based project material shelves: research, ES, preparation and receipts. Internal JSON is hidden from document lists; an authored fictional CV PDF can be generated and downloaded.
- Added ES version timestamps and explicit confirmation. Confirmed versions remain primary after newer drafts and reload; older/other versions are folded. Legacy states keep their original numbering and unknown dates.
- Gated interview practice on explicit interview evidence or a screening-pass sample. A screening AI interview remains document screening; seminars remain events. Interview packs prioritize confirmed ES.
- Added an exact-step fictional ES receipt with replay protection. It does not complete the sibling test or claim a screening pass.
- Added full pending reconciliation, including saved invitations, old/undated items and future preparation, plus activity notes based only on explicit nonempty replies.
- Added an in-app six-step guide and rewritten bilingual case studies. Clarified executable local operations, authored examples and disconnected services. Removed private operating volumes from standalone demo descriptions.
- Retained existing research/ES/interview/Calendar workflows, source deduplication, rescheduling and ICS behavior. Expanded the automated suite from 33 to 45 tests; public allowlist from 34 to 38 files.

No real applicant information, active selection-company names, private documents, mail, outcomes, account links or schedules were added. This is an incremental update; previous commits remain in repository history.

## 2.0 — 2026-09-27

Company/project separation, research and distillation, ES editing, interview practice, Calendar simulation and ICS export. Follow-up documentation clarified authorship and the public/private boundary. Earlier source remains available through commit history.
