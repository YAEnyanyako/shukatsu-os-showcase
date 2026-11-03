(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SyncLab = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  // Independently authored, in-memory examples. No production data or AI connection.
  function create() {
    return { revision: 1, minute: 0, completed: false, receipt: null, result: '', packet: 'absent', submitted: false, testCompleted: false };
  }
  function act(before, action) {
    if (action === 'reset') return create();
    const s = { ...before };
    if (action === 'read') {
      s.receipt = { revision: s.revision, minute: s.minute, completed: s.completed };
      s.result = '';
    }
    if (action === 'complete' && !s.completed) { s.completed = true; s.revision++; s.result = ''; }
    if (action === 'advance') { s.minute += 16; s.result = ''; }
    if (action === 'check') {
      s.result = !s.receipt ? 'unread' : s.receipt.revision !== s.revision ? 'changed' :
        s.minute - s.receipt.minute > 15 ? 'expired' : 'current';
    }
    if (action === 'receive' && s.packet === 'absent') s.packet = 'received';
    if (action === 'review' && s.packet === 'received') s.packet = 'reviewed';
    if (action === 'submit-evidence') s.submitted = true;
    return s;
  }
  function render() {
    return `<div class="page-title"><div><div class="eyebrow">改善ノート / 2026年11月</div><h1>会話が変わっても、同じ根拠で答える</h1><p>2026年11月更新 · 約1分で読む · レビュー版（未公開）</p></div></div>
<section class="panel work-panel improvement-note" aria-label="改善ノート">
<div class="note-opening"><div><div class="eyebrow">01 / 起きたこと</div><h2>終えたはずの検査を、また求められた。</h2><p>就活管理の仕組みを使う中で、すでに完了した適性検査が、別のAI会話では未完了として扱われ、もう一度対応を求められることがありました。</p></div><div><div class="eyebrow">02 / 原因の見立て</div><h2>会話ごとに、参照する情報が違っていた。</h2><p>それぞれの会話が自分の記憶だけで答えており、共通の記録を確認していませんでした。</p></div></div>
<div class="table-scroll note-comparison"><table class="scope-table"><caption>改善前 → 改善後</caption><thead><tr><th scope="col">確認すること</th><th scope="col">改善前</th><th scope="col">改善後</th></tr></thead><tbody><tr><th scope="row">状態の根拠</th><td>会話ごとの記憶</td><td>共通の台帳</td></tr><tr><th scope="row">回答前の確認</th><td>なし</td><td>台帳を読み、読んだ時刻を残す</td></tr><tr><th scope="row">引き継ぎ</th><td>結果だけを伝える</td><td>未確認の点も一緒に渡す</td></tr></tbody></table></div>
<div class="eyebrow">03 / 決めたこと（私の判断）</div><h2>回答の前に、共通の記録を確かめる。</h2><ol class="note-decisions"><li><strong>状態の正本を、1つの台帳にする。</strong>完了・未完了は、その根拠と一緒に記録する。</li><li><strong>回答前に台帳を読み、読み取り時刻を残す。</strong>記録が更新されたときや時間が経ったときは、読み直す。</li><li><strong>2つのAIの役割を分ける。</strong>書類作成と台帳・メール確認を分担し、引き継ぎには「まだ確認できていない点」を明記する。</li></ol>
<p class="note-caption">引き継ぎのルール：資料の受信・確認と、企業への提出は別々に記録する。</p>
<p class="note-caption">このノートは私用環境での改善を説明する静的な記録です。このページは実際のAI会話・台帳には接続しません。</p></section>`;
  }
  function renderUpdates() {
    return `<div class="page-title"><div><div class="eyebrow">UPDATE NOTES / 2026.11.04</div><h1>今回の更新内容</h1><p>2026年11月4日 · レビュー版（未公開）</p></div></div>
<section class="panel work-panel improvement-note"><h2>操作の流れを整理し、改善の背景を読めるようにしました。</h2><p>通知を整理し、根拠を確認して、次の行動を決める。今回の作品集更新では、この流れを短時間で体験できるように画面と説明を見直しました。</p>
<ol class="note-decisions">
<li><strong>主なメニューを5つに整理。</strong>「概要」「受信トレイ」「会社・プロジェクト」「準備」「Calendar」を主な入口にしました。実行記録や操作ガイドなどは「その他」にまとめています。</li>
<li><strong>「準備」ページを追加。</strong>プロジェクトを選び、ES・企業研究・面接準備へ一か所から進めるようにしました。</li>
<li><strong>初回から、整理済みのサンプルを表示。</strong>12件の通知を仕分けた状態で始まり、会社別の情報や確定予定をすぐに確認できます。「最初からやり直す」で、空の状態からも試せます。</li>
<li><strong>操作ガイドを3ステップに短縮。</strong>「根拠を見る → 準備する → 日程変更を確かめる」を、約2〜3分で体験できる構成にしました。</li>
<li><strong>説明と用語を整理。</strong>デモの範囲は概要に集約。「蒸留」は「要点整理」、「日誌」は「活動メモ」など、画面で使う言葉を見直しました。</li>
<li><strong>「改善ノート」を独立した読み物に変更。</strong>会話間で進捗が食い違った経験、私が決めた確認ルール、AIとの役割分担、未測定の効果をまとめました。共同記録の操作演習を外し、「資料の受信と提出を分ける」ルールも文章で説明しています。</li>
</ol>
<p class="note-caption">この一覧は作品集の画面・説明の変更です。私用環境での運用改善の経緯は、別の「改善ノート」に記載しています。</p>
<div class="work-toolbar"><a class="button secondary" href="#guide">3ステップの操作ガイド →</a><a class="button secondary" href="#sync">改善ノートを読む →</a></div>
</section>`;
  }
  return { create, act, render, renderUpdates };
});
