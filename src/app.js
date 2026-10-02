(function () {
  'use strict';
  const D = window.DemoData, W = window.Workflow, C = window.Catalog, P = window.Preparation, R = window.Records;
  const KEY = 'shukatsu-os-public-demo-v2';
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paths = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    inbox: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    pipeline: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
    evidence: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8m-8 4h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    warning: '<path d="m12 3 10 18H2zM12 9v5m0 3v.1"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9zm-9 11 9 5 9-5m-18 5 9 5 9-5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>'
  };
  paths.companies = paths.layers;
  paths.research = paths.search;
  paths.interview = '<path d="M4 4h16v12H9l-5 4zM8 8h8m-8 4h5"/>';
  const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.evidence}</svg>`;
  const typeName = { invitation: '案内', confirmation: '予約確認', assessment: '選考課題', digest: 'まとめ情報', promotion: '募集情報' };
  const kindName = { prepare: '予定の準備', rsvp: '参加を検討', assessment: '本人が対応', conflict: '日程が重複', review: '会社名を確認' };
  const viewNames = { guide: '操作ガイド', review: '未完了の確認', overview: '概要', inbox: '会社別の受信箱', pipeline: '機会と進捗', evidence: '証拠と実行記録', companies: '会社・プロジェクト', research: '企業・業界研究', interview: '面接準備', calendar: 'Calendar' };
  const allFixtures = D.messages.concat(D.update);
  let state = W.createState(), storageOK = true, companyFilter = 'all', searchTerm = '', projectFilter = 'all', toastTimer;
  const ui = {round: '', question: 0, feedback: false};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === 1 && saved.processed && typeof saved.processed === 'object') {
      // Rehydrate only authored fixtures; never render arbitrary persisted source text.
      const allowed = allFixtures.filter(m => Object.hasOwn(saved.processed, m.id));
      state = W.processBatch(W.createState(), allowed).state;
      state.runs = Array.isArray(saved.runs) ? saved.runs.filter(r => [r.sequence, r.added, r.skipped, r.rejected].every(Number.isInteger) && r.sequence > 0 && Math.min(r.added, r.skipped, r.rejected) >= 0).slice(-100) : [];
      for (const c of C.projects) {
        if (saved.decisions && ['pursue', 'save', 'decline', 'undecided'].includes(saved.decisions[c.id])) state.decisions[c.id] = saved.decisions[c.id];
      }
      state.preparation = P.restore(saved.preparation, W.project(state).calendar);
      const validTokens = W.project(state).actions.map(completionKey);
      state.completed = Array.isArray(saved.completed) ? saved.completed.filter(id => validTokens.includes(id)) : [];
    }
  } catch (_) { storageOK = false; }

  if (!state.preparation) state.preparation = P.createState();
  if (state.preparation.calendar.connected) P.sync(state.preparation, W.project(state).calendar);

  function company(id) { return D.companies.find(c => c.id === id) || { name: id === 'digest' ? 'Campus Post' : '会社未確認', initials: id === 'digest' ? 'CP' : '?', color: 'gray', role: '確認が必要です' }; }
  function fmt(value, time = true) {
    if (!value) return '記載なし';
    return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}) }).format(new Date(value));
  }
  const hour = value => new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
  const tag = (text, color = 'gray') => `<span class="tag ${esc(color)}">${esc(text)}</span>`;
  const avatar = c => `<span class="company-avatar ${esc(c.color)}">${esc(c.initials)}</span>`;
  const processed = () => Object.keys(state.processed).length;
  function completionKey(a) { return `${a.id}@${a.sourceId}`; }
  const isDone = a => state.completed.includes(completionKey(a)) || R.done(state.preparation,a);
  function visibleActions(p) {
    return p.actions.filter(a => !['rsvp', 'conflict'].includes(a.kind) || !['save', 'decline'].includes(state.decisions[a.projectId || a.companyId]));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; }
    catch (_) { storageOK = false; }
    $('#storage-status').textContent = storageOK ? 'このブラウザ内だけに保存' : '一時モード：再読込すると操作は失われます';
  }
  function toast(text) {
    clearTimeout(toastTimer); $('#toast').textContent = text; $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4500);
  }
  function process(updateOnly = false) {
    const batch = updateOnly ? [D.update] : D.messages.concat(state.processed[D.update.id] ? [D.update] : []);
    const result = W.processBatch(state, batch); state = result.state;
    if (state.preparation.calendar.connected) P.sync(state.preparation, W.project(state).calendar);
    save(); render();
    toast(updateOnly ? '日程変更を反映しました。予約は 2 件のまま、重複は解消しました。' : result.added ? `${result.added} 件を整理しました。会社・日付の根拠を確認できます。` : `${result.skipped} 件を既処理としてスキップ。タスク・予定の重複はありません。`);
  }
  function nav(view) {
    const counts = { inbox: D.messages.length + (state.processed[D.update.id] ? 1 : 0), pipeline: processed() ? W.project(state).companies.length : 0 };
    $('#navigation').innerHTML = Object.entries(viewNames).map(([id, name]) => `<a href="#${id}" class="nav-item ${view === id ? 'active' : ''}" ${view === id ? 'aria-current="page"' : ''} aria-label="${name}" title="${name}">${icon(id)}<span class="nav-text">${id === 'inbox' ? '受信トレイ' : id === 'pipeline' ? '機会と進捗' : id === 'evidence' ? '実行記録' : name}</span>${counts[id] ? `<span class="nav-number">${counts[id]}</span>` : ''}</a>`).join('');
    $('#page-label').textContent = viewNames[view];
  }
  const runButton = () => `<button class="button primary" data-action="process">${icon(processed() ? 'check' : 'layers', 16)}${processed() ? '同じ通知でもう一度実行' : D.messages.length + ' 件のサンプルを仕分ける'}${icon('arrow', 15)}</button>`;
  const resultBanner = () => state.runs.length ? `<div class="result-banner"><strong>${iconInline()}前回の処理：追加 ${state.runs.at(-1).added} 件 ・ 既処理 ${state.runs.at(-1).skipped} 件</strong><span>架空の通知を使用したルール実行 / ${processed()} 件の根拠を保持</span></div>` : '';
  function iconInline() { return '<span aria-hidden="true">✓　</span>'; }
  function taskRow(a) {
    return `<div class="task-row ${isDone(a) ? 'done' : ''}"><button class="check" ${R.done(state.preparation,a)?'disabled':''} data-action="complete" data-id="${esc(completionKey(a))}" aria-label="${esc(a.title)}を${isDone(a) ? '未完了に戻す' : '完了にする'}" aria-pressed="${isDone(a)}">${isDone(a) ? icon('check', 13) : ''}</button><div class="task-main"><div class="task-company">${esc(company(a.companyId).name)}${a.projectId ? ` · <a href="#project/${esc(a.projectId)}">${esc(C.projects.find(p=>p.id===a.projectId)?.name || a.projectId)}</a>` : ''}</div><div class="task-title">${esc(a.title)}</div><div class="task-meta">${R.done(state.preparation,a)?tag('受領通知で確認済み','green'):''}${tag(kindName[a.kind], a.kind === 'conflict' || a.kind === 'review' ? 'amber' : a.kind === 'assessment' ? 'purple' : 'green')}<span>${a.deadline ? `回答・提出期限 ${fmt(a.deadline)} JST` : a.scheduledAt ? `開催 ${fmt(a.scheduledAt)} JST` : '期限は未確認'}</span></div></div><button class="task-source" data-action="source" data-id="${esc(a.sourceId)}" aria-label="${esc(a.title)}の根拠を見る" title="根拠を見る">${icon('evidence', 15)}</button></div>`;
  }
  function schedule(p) {
    return `<section class="panel"><div class="panel-heading"><div><h2>確認済みの予定</h2><p>予約確認があるものだけ</p></div>${icon('calendar', 17)}</div>${p.calendar.length ? p.calendar.map(e => `<div class="schedule-row"><div class="date-box"><span>MAY</span><strong>${new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tokyo', day: 'numeric' }).format(new Date(e.start))}</strong></div><div class="schedule-main"><h3>${esc(company(e.companyId).name)}</h3><p>${hour(e.start)}–${hour(e.end)} JST · ${esc(e.title)}</p></div><button data-action="source" data-id="${esc(e.sourceId)}" aria-label="${esc(e.title)}の予約確認を見る">${icon('arrow', 15)}</button></div>`).join('') : `<div class="empty"><p>仕分け後、確認メールに基づく<br>架空の予定がここに表示されます。</p></div>`}<div class="panel-footer">カレンダーへの書き込みはシミュレーション</div></section>`;
  }
  function tour() {
    return `<div class="tour" aria-label="デモの操作手順"><button class="tour-step" data-action="process"><span class="step-no">01</span><span><strong>通知を仕分け</strong><small>会社とイベントを整理</small></span></button><button class="tour-step" data-action="source" data-id="sample-004"><span class="step-no">02</span><span><strong>根拠をひらく</strong><small>締切の意味を確認</small></span></button><button class="tour-step" data-action="update" ${!processed() || state.processed[D.update.id] ? 'disabled' : ''}><span class="step-no">03</span><span><strong>${state.processed[D.update.id] ? '日程変更を反映済' : '日程変更を追加'}</strong><small>重複をもう一度判定</small></span></button><button class="tour-step" data-action="process" ><span class="step-no">04</span><span><strong>再実行して確認</strong><small>二重処理を防ぐ</small></span></button></div>`;
  }
  function overview(p) {
    const actions = visibleActions(p), remaining = actions.filter(a => !isDone(a));
    return `<section class="hero"><div><div class="eyebrow">JOB SEARCH, WITH CONTEXT</div><h1>散らばる情報を、<br>確かな次の一手へ。</h1><p>会社ごとに整理し、根拠を確認し、次の行動につなげる。<br>人と AI の協働を考える、就活ワークフローの公開デモ。</p><div class="hero-actions">${runButton()}<span class="hero-small">ログイン不要 · 外部通信なし</span></div></div><div class="flow-card"><div class="flow-top"><span class="mini-label">FROM SIGNAL TO ACTION</span><span class="flow-live"><span class="status-dot"></span> DEMO WORKFLOW</span></div><div class="flow-nodes"><div class="flow-node">${icon('inbox', 23)}<span>分散した通知</span></div><span class="flow-arrow">→</span><div class="flow-node emphasis">${icon('shield', 23)}<span>根拠を確認</span></div><span class="flow-arrow">→</span><div class="flow-node">${icon('check', 23)}<span>次のアクション</span></div></div><div class="flow-caption"><span>招待 ≠ 予約完了</span><strong>判断の理由を残す</strong></div></div></section>
      <section class="stats" aria-label="デモの集計"><div class="stat"><div class="stat-label">整理した通知 ${icon('inbox', 15)}</div><div class="stat-value">${processed()}<span>/ ${D.messages.length + (state.processed[D.update.id] ? 1 : 0)}</span></div><div class="stat-foot">架空のメールサンプル</div></div><div class="stat"><div class="stat-label">確認できた会社 ${icon('layers', 15)}</div><div class="stat-value">${p.companies.length}<span>社</span></div><div class="stat-foot">複数社情報・会社不明は別枠</div></div><div class="stat"><div class="stat-label">次のアクション ${icon('check', 15)}</div><div class="stat-value">${remaining.length}<span>件</span></div><div class="stat-foot">完了・保留の判断を反映</div></div><div class="stat alert"><div class="stat-label">日程の重複 ${icon('clock', 15)}</div><div class="stat-value">${p.conflicts.length}<span>件</span></div><div class="stat-foot">確認済みの予定と照合</div></div></section>
      ${resultBanner()}<section class="panel work-panel"><div class="eyebrow">PREPARATION WORKSPACE</div><h2>会社 → プロジェクト → 自分の準備</h2><p>4 社・7 プロジェクト。コース別の締切、メール、ES、経験談の素材棚、面接練習を一か所に。</p><a class="button primary" href="#guide">順に体験する →</a><a class="button secondary" href="#companies">会社・プロジェクトを開く →</a><a class="button secondary" href="#research">企業・業界研究 →</a><a class="button secondary" href="#calendar">Calendar 接続デモ →</a></section><div class="two-column"><section class="panel"><div class="panel-heading"><div><h2>次に進めること</h2><p>予定とタスク、期限の意味を分けて表示</p></div><span class="count-pill">${remaining.length} 件</span></div>${actions.length ? actions.map(taskRow).join('') : `<div class="empty"><div class="empty-icon">${icon('inbox', 23)}</div><h3>まずは、${D.messages.length} 件の通知から。</h3><p>予約確認、課題の案内、企業名のないスカウト。<br>異なる情報がどう整理されるか試してみてください。</p><button class="button secondary" data-action="process">サンプルを整理する ${icon('arrow', 15)}</button></div>`}<div class="panel-footer"><span>各項目の右端から元の通知を確認</span><a class="button text" href="#inbox">受信トレイへ ${icon('arrow', 12)}</a></div></section><div class="stack"><section class="spotlight"><div class="spotlight-top">${icon('search', 15)} A CLOSER LOOK</div><h3>その日付、本当に申込期限？</h3><p>Mori Systems の通知には「キャンセル期限」があります。日付の意味を分けることで、不要な申込タスクを作りません。</p><button class="button text" data-action="source" data-id="sample-004">通知の根拠を見る ${icon('arrow', 13)}</button></section>${schedule(p)}</div></div>
      ${tour()}<section><div class="section-title"><h2>このデモで伝えたいこと</h2><span>PRODUCT THINKING</span></div><div class="principles"><article class="principle"><span class="principle-number">01 / ORGANIZE</span><h3>会社を軸に、文脈をつなぐ</h3><p>プラットフォーム経由でも会社が明記されていれば同じ場所へ。複数社のまとめは混ぜずに残します。</p></article><article class="principle"><span class="principle-number">02 / VERIFY</span><h3>不明な情報は、不明のまま</h3><p>企業名・期限を推測で補わず、確認待ちに。開催時刻、申込期限、取消期限を別々に扱います。</p></article><article class="principle"><span class="principle-number">03 / FOLLOW THROUGH</span><h3>新しい証拠で、次の一手を更新</h3><p>予約確認が来たら準備へ。日程が変われば重複を再判定。同じ通知は繰り返し処理しません。</p></article></div></section>`;
  }
  function messageRow(m, isProcessed) {
    const f = m.facts;
    const statusColor = f.type === 'confirmation' ? 'green' : f.type === 'assessment' ? 'purple' : 'gray';
    return `<button class="message-row" data-action="source" data-id="${esc(m.id)}">${icon('inbox', 17)}<span class="message-main"><h3>${esc(m.subject)}</h3><p>${esc(m.sender)}</p><span class="message-tags">${tag(isProcessed ? typeName[f.type] : '未処理のサンプル', statusColor)}${isProcessed && !m.companyId && f.type !== 'digest' ? tag('会社名を確認', 'amber') : ''}${m.companyId ? tag('会社 / ' + company(m.companyId).name, 'blue') : ''}${m.projectId ? tag(C.projects.find(p=>p.id===m.projectId)?.name || m.projectId,'purple') : m.companyId ? tag('会社共通・コース未指定') : ''}</span></span><span class="message-time">${fmt(m.receivedAt)}</span>${icon('arrow', 13)}</button>`;
  }
  function inbox(p) {
    const inputs = processed() ? p.messages : W.project(W.processBatch(W.createState(), D.messages).state).messages;
    const q = searchTerm.toLowerCase();
    const filtered = inputs.filter(m => (projectFilter === 'all' || (m.projectId || 'unassigned') === projectFilter) && (!q || `${m.subject} ${m.sender} ${m.body}`.toLowerCase().includes(q)) && (companyFilter === 'all' || (m.companyId || (m.facts.type === 'digest' ? 'digest' : 'unknown')) === companyFilter));
    const groups = new Map();
    filtered.forEach(m => { const key = m.companyId || (m.facts.type === 'digest' ? 'digest' : 'unknown'); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(m); });
    return `<div class="page-title"><div><div class="eyebrow">COMPANY-FIRST INBOX</div><h1>会社ごとに、つながる通知。</h1><p>同じ会社の案内と確認をひとまとめに。通知を開くと、判断に使った根拠が見えます。</p></div>${runButton()}</div><div class="notice">すべて架空のサンプルです。抽出済みの構造化データにルールを適用します。実際のメール取得や AI 推論は行いません。</div><div class="filters"><label class="field search">通知を検索<input id="message-search" type="search" placeholder="会社名・件名・キーワード" value="${esc(searchTerm)}"></label><label class="field">会社で絞り込む<select id="company-filter" ><option value="all">すべての会社・通知</option>${D.companies.concat([{ id: 'digest', name: 'プラットフォーム情報' }, { id: 'unknown', name: '会社未確認' }]).map(c => `<option value="${c.id}" ${companyFilter === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label><label class="field">プロジェクト<select id="project-filter"><option value="all">すべてのプロジェクト</option>${C.projects.filter(p=>companyFilter==='all'||p.companyId===companyFilter).map(p=>`<option value="${p.id}" ${projectFilter===p.id?'selected':''}>${esc(company(p.companyId).name)} / ${esc(p.name)}</option>`).join('')}<option value="unassigned" ${projectFilter==='unassigned'?'selected':''}>会社共通・未確認</option></select></label></div><div id="message-groups">${groups.size ? [...groups].map(([id, ms]) => { const c = company(id); return `<section class="company-group"><div class="group-title">${avatar(c)}<div><h2>${id === 'unprocessed' ? '新着のサンプル通知' : id === 'digest' ? 'プラットフォーム情報' : esc(c.name)}</h2><small>${id === 'unprocessed' ? '仕分けを実行すると会社ごとに整理されます' : id === 'digest' ? '複数社を含むまとめ情報' : id === 'unknown' ? '企業名が通知にないため、推測せず確認待ち' : esc(c.role)}</small></div>${D.companies.some(c=>c.id===id)?`<a class="button text" href="#company/${id}">会社ページ →</a>`:''}<span class="count-pill">${ms.length} 件</span></div><div class="panel">${ms.map(m => messageRow(m, Boolean(processed()))).join('')}</div></section>`; }).join('') : '<div class="empty"><h3>一致する通知はありません</h3><p>検索語や会社の指定を変更してください。</p></div>'}</div>`;
  }
  function evidence(p) {
    return `<div class="page-title"><div><div class="eyebrow">TRACEABLE BY DESIGN</div><h1>何を処理したか、あとから辿れる。</h1><p>処理件数とスキップ件数を分けて記録。同じサンプルを再実行して、変化を確認できます。</p></div>${runButton()}</div><div class="two-column"><section class="panel"><div class="panel-heading"><div><h2>実行履歴</h2><p>このブラウザで行ったデモ操作</p></div><span class="count-pill">${state.runs.length} 回</span></div>${state.runs.length ? `<ol class="timeline">${state.runs.slice().reverse().map(r => `<li class="run-row"><span class="run-no">${r.sequence}</span><div><h3>${r.added ? '新しい根拠を取り込み' : '既処理の通知を確認'}</h3><p>追加 ${r.added} 件 / スキップ ${r.skipped} 件 / 拒否 ${r.rejected} 件</p></div>${tag(r.added ? '更新あり' : '重複なし', r.added ? 'green' : 'gray')}</li>`).join('')}</ol>` : '<div class="empty"><p>サンプルの仕分けを実行すると<br>ここに処理記録が残ります。</p></div>'}<div class="panel-footer">保持中：${processed()} 通知・${p.calendar.length} 予定・${p.actions.length} 元タスク</div></section><section class="panel"><div class="panel-heading"><h2>このデモの実装範囲</h2>${icon('shield', 18)}</div><div class="audit-info"><h3>実際に動くもの</h3><p>会社・プロジェクト別表示、日付検証、重複排除、ES の編集と版保存、出典の模擬収集、面接回答の保存、日程同期のデモ、ICS 出力。</p><h3>サンプルとして置き換えたもの</h3><p>メール本文、抽出結果、企業情報、経験談、蒸留文、質問バンク。すべて手作業で作った架空データです。ES と面接の診断は簡易ルールです。</p><h3>接続していないもの</h3><p>メール、採用サイト、AI API、外部カレンダー。予約・応募・メッセージの送信も行いません。</p></div></section></div><section class="panel"><div class="panel-heading"><div><h2>入力から、行動まで</h2><p>デモのデータフロー</p></div></div><div class="audit-info"><div class="architecture"><span>架空の通知</span><b>→</b><span>抽出済みサンプル</span><b>→</b><span>検証・状態ルール</span><b>→</b><span>タスク・予定</span><b>→</b><span>根拠と履歴</span></div><p>自動処理の範囲と、人が確認する箇所を明確にします。不明な情報を埋めるより、確認待ちとして扱う設計です。</p></div></section><section class="panel audit-table"><div class="panel-heading"><h2>検証すること</h2><a class="button text" href="docs/evaluation.md">評価の詳細 ↗</a></div><table class="scope-table"><thead><tr><th scope="col">ケース</th><th scope="col">期待する動き</th></tr></thead><tbody><tr><td>同じ通知の再実行</td><td>元の通知 ID を使い、タスクや予定を増やさない</td></tr><tr><td>企業名のないスカウト</td><td>会社を推測せず確認待ちへ</td></tr><tr><td>予約確認・日程変更</td><td>旧タスクを準備に切り替え、同じ予定を更新</td></tr><tr><td>複数種類の日付</td><td>申込、開催、キャンセルを別々に扱う</td></tr></tbody></table></section><p class="boundary">実行件数はこのデモの操作結果です。実利用での精度、時間削減率、利用者数を表すものではありません。</p>`;
  }
  function render() {
    const route = location.hash.slice(1) || 'overview';
    const head = route.split('/')[0];
    const view = ['company','project'].includes(head) ? 'companies' : Object.hasOwn(viewNames,head) ? head : 'overview';
    const p = W.project(state, C.projects); nav(view);
    $('#content').innerHTML = ['overview','inbox','evidence'].includes(view) ? ({ overview, inbox, evidence })[view](p) :
      window.Workbench.render(route,p,state.preparation,{esc,tag,fmt,company,messageRow,taskRow,isDone,visibleActions},ui);
    $('#storage-status').textContent = storageOK ? 'このブラウザ内だけに保存' : '一時モード：再読込すると操作は失われます';
    document.title = `${viewNames[view]} · Shukatsu OS Demo`;
  }
  function openSource(id) {
    const m = allFixtures.find(v => v.id === id); if (!m) return;
    const f = m.facts, p = W.project(state), current = p.messages.find(v => v.id === id);
    const latest = p.calendar.find(e => e.companyId === f.companyIds[0] && e.projectId === (f.projectId || null) && e.id.endsWith(':' + f.eventId));
    const isSuperseded = latest && latest.sourceId !== id;
    const type = f.type === 'digest' ? '複数社のまとめ → プラットフォーム情報' : f.companyIds.length === 1 ? `会社 / ${company(f.companyIds[0]).name}` : '会社未確認 → 確認待ち';
    let outcome = !current ? 'このサンプルはまだ処理されていません。仕分けを実行すると、この根拠に基づく結果が表示されます。' :
      isSuperseded ? 'この通知は履歴として保持しています。現在の予定は、同じイベントの新しい予約確認に基づいています。' :
      f.type === 'confirmation' ? '予約確認として、架空の予定と準備タスクを作成。キャンセル期限は申込期限と別に保持します。' :
      f.type === 'promotion' || f.type === 'digest' ? '参考情報として保管。個別の本人タスクや予約は作成しません。' :
      f.companyIds.length !== 1 ? '企業名を推測せず、確認タスクだけを作成。期限も補いません。' :
      f.type === 'assessment' ? '本文にある提出期限を使って、本人が対応する課題を作成。代理提出は行いません。' :
      '参加検討のタスクを作成。確認済みの日程と照合します。この案内だけでは予約済みになりません。';
    $('#dialog-content').innerHTML = `<div class="dialog-top"><span class="eyebrow">SOURCE & EVIDENCE</span><button class="icon-button" data-action="close" aria-label="閉じる">${icon('close', 16)}</button></div><div class="dialog-body"><div class="message-tags">${tag('架空のサンプル', 'green')}${tag(typeName[f.type])}${tag(current ? '処理済み' : '未処理', current ? 'blue' : 'gray')}</div><h2 id="dialog-title">${esc(m.subject)}</h2><div class="dialog-meta">${esc(m.sender)} · ${esc(m.address)}<br>サンプル受信日時 ${fmt(m.receivedAt)} JST · ${esc(m.id)}</div><div class="source-body">${esc(m.body)}</div><div class="evidence-quote"><small>判断の根拠となる一文</small>${esc(f.evidence)}</div><div class="date-grid"><div class="date-cell"><small>回答・提出期限</small><strong>${f.applicationDeadline ? fmt(f.applicationDeadline) + ' JST' : '記載なし'}</strong></div><div class="date-cell"><small>開催日時</small><strong>${f.start ? fmt(f.start) + (f.end ? '–' + hour(f.end) : '') + ' JST' : '記載なし'}</strong></div><div class="date-cell"><small>キャンセル期限</small><strong>${f.cancellationDeadline ? fmt(f.cancellationDeadline) + ' JST' : '記載なし'}</strong></div></div><div class="trace"><strong>${esc(type)}</strong>${esc(outcome)}</div><details><summary>構造化サンプルを見る（手作業で作成）</summary><pre>${esc(JSON.stringify(f, null, 2))}</pre></details></div>`;
    $('#source-dialog').showModal();
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]'); if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === 'sample-versions') {R.examples(state.preparation,id);save();render();toast('未編集の質問に架空3版を追加。既存の保存版は変更しません。');}
    if (action === 'confirm-version') {const [pr,q,n]=id.split('/');P.confirm(state.preparation,pr,q,Number(n));save();render();toast('この版を本人確認版にしました。企業への提出はしていません。');}
    if (action === 'screening-pass') {R.pass(state.preparation,id);save();render();toast('架空の書類通過結果を反映。面接予約はしていません。');}
    if (action === 'stage-source') {const text=id==='screening-pass'?'【架空】Kumo Labsプロダクト職の書類選考通過をお知らせします。面接日時は別途調整してください。予約はまだ完了していません。':'【架空】Aster Works AIインターンの一次AI面接をご案内します。この面接と回答フォームをもとに書類選考を行います。書類選考の結果通知ではありません。';$('#dialog-content').innerHTML='<div class="dialog-body"><h2 id="dialog-title">架空の選考通知</h2><p>'+esc(text)+'</p><small>根拠ID: '+esc(id)+'</small></div>';$('#source-dialog').showModal();}
    if (action === 'invite-ai') {R.invite(state.preparation,id);save();render();toast('架空のAI面接案内を反映。書類選考中のままです。');}
    if (action === 'receipt') {const changed=R.receive(state.preparation,id,W.project(state).actions);save();render();toast(changed?'回答フォームのみ受領確認。適性テストは未完了です。':state.preparation.records.receipts.includes(id)?'既に同じ受領通知を反映済みです。':'先に通知を仕分けてください。');}
    if (action === 'record-source') {const r=R.receipts.find(r=>r.id===id);if(r){$('#dialog-content').innerHTML='<div class="dialog-body"><h2 id="dialog-title">'+esc(r.title)+'（架空）</h2><p>'+esc(r.at)+'</p><p class="preserve">'+esc(r.body)+'</p><small>架空の根拠ID: '+esc(r.id)+'</small></div>';$('#source-dialog').showModal();}}
    if (action === 'review-done' || action === 'review-cancel') {R.respond(state.preparation,id,action==='review-done'?'done':'cancelled');save();render();}
    if (action === 'save-journal') {const changed=R.journal(state.preparation,ui.journalDraft||'');save();render();toast(changed?'本人返答をこのブラウザの日誌に保存しました。':'返答が空欄のため保存しません。');}
    if (action === 'download-cv') {const url=URL.createObjectURL(new Blob([R.pdf()],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download='fictional-cv.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('架空の履歴書PDFをダウンロードしました。');}
    if (action === 'collect') {const r=P.collect(state.preparation,id);save();render();toast(`模擬資料：追加 ${r.added} 件 / 既存 ${r.skipped} 件`);}
    if (action === 'distill') {const n=P.distill(state.preparation,id);save();render();toast(n ? `${n} 件を出典付きで素材棚へ保存しました。` : '新しい素材はありません。先にサンプルを収集してください。');}
    if (action === 'version') {const [projectId,q]=id.split('/');P.version(state.preparation,projectId,q);save();render();toast('この稿を保存しました。提出はしていません。');}
    if (action === 'review-es') {render();toast('文字数と3観点を更新しました。');}
    if (action === 'prev-question' || action === 'next-question') {ui.question=Math.max(0,Math.min(2,ui.question+(action==='next-question'?1:-1)));ui.feedback=false;render();}
    if (action === 'feedback') {ui.feedback=true;render();}
    if (action === 'connect-calendar' || action === 'sync-calendar') {state.preparation.calendar.connected=true;const r=P.sync(state.preparation,W.project(state).calendar);save();render();toast(`デモ同期：追加 ${r.added} 件 / 更新 ${r.updated} 件 / 既存 ${r.skipped} 件`);}
    if (action === 'disconnect-calendar') {state.preparation.calendar.connected=false;save();render();toast('デモ接続を解除しました。');}
    if (action === 'download-ics') {
      const p=W.project(state),synced=state.preparation.calendar.events;
      const events=p.calendar.map(e=>({...e,sequence:synced[e.id]?.sequence || (e.sourceId===D.update.id?1:0)}));
      const url=URL.createObjectURL(new Blob([P.ics(events)],{type:'text/calendar;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download='shukatsu-fictional-events.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('架空の確定予定を ICS に出力しました。');
    }
    if (action === 'process') process();
    if (action === 'update' && processed() && !state.processed[D.update.id]) process(true);
    if (action === 'source') openSource(el.dataset.id);
    if (action === 'close') $('#source-dialog').close();
    if (action === 'complete') {
      const id = el.dataset.id; state.completed = state.completed.includes(id) ? state.completed.filter(v => v !== id) : state.completed.concat(id);
      save(); render();
      const control = [...document.querySelectorAll('[data-action="complete"]')].find(button => button.dataset.id === id); if (control) control.focus();
    }
    if (action === 'reset-confirm') {
      state = W.createState(); state.preparation=P.createState(); searchTerm = ''; companyFilter = 'all'; projectFilter='all'; ui.round='';ui.question=0;ui.feedback=false;ui.materialType='all';ui.journalDraft=undefined; save(); $('#source-dialog').close(); render(); toast('デモを初期状態に戻しました。');
    }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'material-type') {ui.materialType=e.target.value;render();}
    if (e.target.id === 'project-filter') {projectFilter=e.target.value;render();$('#project-filter').focus();}
    if (e.target.id === 'interview-round') {ui.round=e.target.value;ui.question=0;ui.feedback=false;render();}
    if (e.target.id === 'company-filter') { companyFilter = e.target.value; projectFilter='all'; render(); $('#company-filter').focus(); }
    if (e.target.dataset.decision) {
      const id = e.target.dataset.decision; state = W.setDecision(state, id, e.target.value); save(); render();
      document.querySelector(`[data-decision="${id}"]`).focus(); toast('判断を保存しました。予約状態は変更していません。');
    }
  });
  document.addEventListener('input', e => {
    if (e.target.dataset.journal) {ui.journalDraft=e.target.value;return;}
    if (e.target.dataset.draft) {const q=e.target.dataset.question;P.draft(state.preparation,e.target.dataset.draft,q,e.target.value);save();$('#count-'+q).textContent=P.count(e.target.value)+' / '+C.esQuestions.find(v=>v.id===q).limit+' 字';return;}
    if (e.target.dataset.answer) {P.answer(state.preparation,e.target.dataset.answer,e.target.dataset.round,Number(e.target.dataset.q),e.target.value);save();return;}

    if (e.target.id !== 'message-search') return;
    searchTerm = e.target.value; const start = e.target.selectionStart; render(); $('#message-search').focus();
    try { $('#message-search').setSelectionRange(start, start); } catch (_) { /* Search input selection differs by browser. */ }
  });
  $('#reset').addEventListener('click', () => {
    $('#dialog-content').innerHTML = `<div class="reset-body"><h2 id="dialog-title">デモをリセットしますか？</h2><p>このブラウザの架空データの操作履歴と判断を初期状態に戻します。</p><div class="reset-actions"><button class="button secondary" data-action="close">戻る</button><button class="button primary" data-action="reset-confirm">リセットする</button></div></div>`;
    $('#source-dialog').showModal();
  });
  $('#source-dialog').addEventListener('click', e => { if (e.target === $('#source-dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
  window.addEventListener('hashchange', () => { ui.round='';ui.question=0;ui.feedback=false; render(); window.scrollTo(0, 0); });
  render();
})();
