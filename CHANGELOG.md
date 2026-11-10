# Changelog

更新は新しい記録を追加し、以前の説明も履歴として残します。後から変更した方針は注記し、当時の記録を置き換えません。

## 2026-11-04 — README整理と機能デモの公開更新

- READMEを「概要・3つの重点・3ステップ・役割・短い改善紹介」の順に整理。詳細な協作説明は `docs/improvement-note.ja.md` へ移動し、操作と架空例の境界表を折りたたみ表示に変更。
- デモは機能体験に集中。5つの主入口、統合した準備ページ、整理済みサンプル、3ステップのガイドを反映。更新内容・改善ノートの画面入口は設けない。
- 最初のボタンをサンプルの体験入口に変更し、英語READMEはGitHubの表示ページへリンク。
- 過去の更新説明をすべて保持。下のレビュー版の記録は当時の履歴であり、現在の公開仕様はこの項目を参照。

## 2026-11-04 — 私用ツールの協作・共通記録の確認を文書化

- Claudeは材料作成と識別IDつきの引き継ぎ、GPT / Codexは独立した検証・メール照合・正式台帳への登録と読み戻しを担当する分担を明確化。
- 状態の正本を1つの台帳とし、事実・情報源・未確認事項を同じ入口から参照。
- 回答前に読み取り記録の版・時刻・対象範囲・会話を照合し、更新や期限切れがあれば再読込。読み取り失敗時は未検証と明示。
- 引き継ぎのIDと材料ハッシュを照合し、対象未確定・未確認事項を保留。受信・確認・提出・選考結果は別々に扱う。
- 本人確認は原文保存→根拠つき登録→独立した読み戻し。材料欠落や事実衝突、完了後の古い対応事項も点検。
- 本人が課題・分担・確認条件・修正判断を担当し、AIはコード生成を支援。再発件数・時間削減は未測定。
- この文書は私用環境の改善を説明する。公開デモへの実AI・台帳接続を追加したものではない。GitHubでは更新背景を説明し、デモは機能体験に集中させる。

## 2026-11-04 — 画面構成の見直し（当時のローカルレビュー版・履歴）

> 以下は当時の更新記録として保持しています。同日その後、更新説明と改善の背景はGitHub文書へ移し、デモ内の「改善ノート」「更新内容」の入口は取り外しました。機能デモの公開版にこれらの画面変更が反映済みという意味ではありません。

- 主ナビゲーションを「概要・受信トレイ・会社／プロジェクト・準備・Calendar」の5項目に整理し、補助項目を「その他」へ移動。
- ES・企業研究・面接への入口をまとめた「準備」ページを追加。
- 初回は12件のサンプル通知を整理済みで表示。保存済みの操作は維持し、明示的にリセットした空の状態も再読込後に保持。
- 操作ガイドを「根拠・準備・日程変更」の3ステップ、約2〜3分の構成に短縮。
- デモの範囲説明を概要に集約し、「要点整理」「自分で確認」「対応漏れの候補」「活動メモ」などの用語に整理。
- 共同記録のA/B操作演習を静的な「改善ノート」に置き換え、主デモの導線から分離。改善前後、本人の判断とAIの役割、効果が未測定であることを記載。「受け取り≠提出」は文章に統合。
- 今回の画面・説明の変更を一覧で読める「更新内容」ページを追加。
- この更新はローカルのレビュー版のみ。公開サイトへの反映・デプロイは行っていない。

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

## 2026-11-10 — Case-scoped notice tracking design note

Added a [Japanese update note](docs/notice-tracking.ja.md) documenting the local system fix: durable notices, case-specific booking/calendar verification, audited corrections and replay-safe resolution history. This public update contains documentation only; the operational implementation and personal data remain private.
