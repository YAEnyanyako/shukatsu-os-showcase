(function (root) {
  'use strict';
  // All entities and source messages are authored fiction, not anonymized exports.
  const companies = [
    { id: 'aster', name: 'Aster Works', initials: 'AW', color: 'blue', role: 'プロダクト企画', description: '架空の業務ソフトウェア企業' },
    { id: 'kumo', name: 'Kumo Labs', initials: 'KL', color: 'purple', role: 'AI ビジネス体験', description: '架空の AI サービス企業' },
    { id: 'mori', name: 'Mori Systems', initials: 'MS', color: 'green', role: 'サービス企画', description: '架空のデジタルサービス企業' },
    { id: 'sora', name: 'Sora Studio', initials: 'SS', color: 'orange', role: 'プロダクトオペレーション', description: '架空のプロダクトスタジオ' }
  ];
  const messages = [
    { id: 'sample-001', receivedAt: '2030-05-13T09:00:00+09:00', sender: 'Aster Works 採用チーム', address: 'recruiting@aster.example.com',
      subject: 'プロダクト企画カジュアル面談のご案内',
      body: '【架空のサンプル】\nプロダクト企画のカジュアル面談をご案内します。\n候補日時：2030年5月20日 10:00〜11:00（JST）\n参加希望の場合は5月16日12:00（JST）までにご回答ください。\nこの案内だけでは予約は完了していません。',
      facts: { type: 'invitation', companyIds: ['aster'], projectId: 'aster-pm', eventId: 'aster-chat', eventCategory: 'interview', title: 'カジュアル面談', start: '2030-05-20T10:00:00+09:00', end: '2030-05-20T11:00:00+09:00', applicationDeadline: '2030-05-16T12:00:00+09:00', evidence: '5月16日12:00（JST）までにご回答ください。' } },
    { id: 'sample-002', receivedAt: '2030-05-13T09:15:00+09:00', sender: 'Aster Works 採用チーム', address: 'recruiting@aster.example.com',
      subject: '【予約確定】5月20日 カジュアル面談',
      body: '【架空のサンプル】\nご回答ありがとうございます。下記の日時でご予約を確定しました。\n2030年5月20日 10:00〜11:00（JST）／オンライン\n参加用リンクは開催前日にお知らせします。再度の参加申込は不要です。',
      facts: { type: 'confirmation', companyIds: ['aster'], projectId: 'aster-pm', eventId: 'aster-chat', eventCategory: 'interview', title: 'カジュアル面談', start: '2030-05-20T10:00:00+09:00', end: '2030-05-20T11:00:00+09:00', evidence: '下記の日時でご予約を確定しました。' } },
    { id: 'sample-003', receivedAt: '2030-05-13T09:30:00+09:00', sender: 'Campus Post｜Kumo Labs 個別案内', address: 'notice@campus.example.com',
      subject: 'Kumo Labs｜AI ビジネス体験会のご招待',
      body: '【架空のサンプル】\nKumo Labs の AI ビジネス体験会をご案内します。\n日時：2030年5月20日 10:30〜11:30（JST）\n参加希望の回答締切：5月18日18:00（JST）\n参加者には担当社員への質問時間があります。選考免除はありません。\n個別案内ですが、参加予約はまだ完了していません。',
      facts: { type: 'invitation', companyIds: ['kumo'], projectId: 'kumo-workshop', eventId: 'kumo-workshop', title: 'AI ビジネス体験会', start: '2030-05-20T10:30:00+09:00', end: '2030-05-20T11:30:00+09:00', applicationDeadline: '2030-05-18T18:00:00+09:00', evidence: 'Kumo Labs の AI ビジネス体験会をご案内します。' } },
    { id: 'sample-004', receivedAt: '2030-05-13T10:00:00+09:00', sender: 'Mori Systems イベント窓口', address: 'events@mori.example.com',
      subject: '【予約済】サービス企画セッション／キャンセル期限のご案内',
      body: '【架空のサンプル】\nサービス企画セッションへのご予約を受け付けました。\n日時：2030年5月21日 14:00〜15:00（JST）\nキャンセル期限：5月19日12:00（JST）\n上記はキャンセルの期限であり、申込期限ではありません。',
      facts: { type: 'confirmation', companyIds: ['mori'], projectId: 'mori-service', eventId: 'mori-session', title: 'サービス企画セッション', start: '2030-05-21T14:00:00+09:00', end: '2030-05-21T15:00:00+09:00', cancellationDeadline: '2030-05-19T12:00:00+09:00', evidence: 'キャンセル期限：5月19日12:00（JST）' } },
    { id: 'sample-005', receivedAt: '2030-05-13T10:30:00+09:00', sender: 'Sora Studio 採用チーム', address: 'talent@sora.example.com',
      subject: 'プロダクト改善ケース課題のご案内',
      body: '【架空のサンプル】\nプロダクトオペレーションの選考課題をご案内します。\n課題：架空サービスの利用体験を整理してください。\n提出期限：2030年5月16日18:00（JST）\n提出はご本人が行ってください。本デモからは提出できません。',
      facts: { type: 'assessment', companyIds: ['sora'], projectId: 'sora-ops', eventId: 'sora-case', title: 'プロダクト改善ケースを準備する', applicationDeadline: '2030-05-16T18:00:00+09:00', evidence: '提出期限：2030年5月16日18:00（JST）' } },
    { id: 'sample-006', receivedAt: '2030-05-13T11:00:00+09:00', sender: 'Campus Post 編集部', address: 'digest@campus.example.com',
      subject: '今週のイベント特集｜Aster Works・Kumo Labs ほか',
      body: '【架空のサンプル】\n今週の企業イベントをまとめてご紹介します。\n掲載：Aster Works、Kumo Labs、その他の架空企業。\nこのメールは複数社のまとめ記事です。個別の予約確認や本人向けの提出期限ではありません。',
      facts: { type: 'digest', companyIds: ['aster', 'kumo'], title: '今週のイベント特集', evidence: '掲載：Aster Works、Kumo Labs、その他の架空企業。' } },
    { id: 'sample-007', receivedAt: '2030-05-13T11:30:00+09:00', sender: 'Campus Post スカウト通知', address: 'scout@campus.example.com',
      subject: '新しい個別スカウトが届きました',
      body: '【架空のサンプル】\n個別スカウトが届きました。\n企業名・職種・回答期限はこの通知には記載されていません。\nサイト内の詳細を確認してください。本デモではサイトへの接続は行いません。',
      facts: { type: 'invitation', companyIds: [], title: '企業名のないスカウト', evidence: '企業名・職種・回答期限はこの通知には記載されていません。' } },
    { id: 'sample-008', receivedAt: '2030-05-13T12:00:00+09:00', sender: 'Sora Studio お知らせ', address: 'news@sora.example.com',
      subject: '締切間近！プロダクトづくり特集',
      body: '【架空のサンプル】\nプロダクトづくりに関する記事を公開しました。\nこのメールは一般向けのお知らせです。個別の選考課題、予約確認、本人への返信依頼は含まれていません。',
      facts: { type: 'promotion', companyIds: ['sora'], title: 'プロダクトづくり特集', evidence: 'このメールは一般向けのお知らせです。' } }
  ];
  const update = { id: 'sample-009', receivedAt: '2030-05-14T09:00:00+09:00', sender: 'Aster Works 採用チーム', address: 'recruiting@aster.example.com',
    subject: '【日程変更確定】カジュアル面談 13:00開始',
    body: '【架空のサンプル】\n調整の結果、面談日時を以下に変更して確定しました。\n新日時：2030年5月20日 13:00〜14:00（JST）\n以前の10:00〜11:00の予約は、この新しい日時に置き換わります。',
    facts: { type: 'confirmation', companyIds: ['aster'], projectId: 'aster-pm', eventId: 'aster-chat', eventCategory: 'interview', title: 'カジュアル面談', start: '2030-05-20T13:00:00+09:00', end: '2030-05-20T14:00:00+09:00', evidence: '以前の10:00〜11:00の予約は、この新しい日時に置き換わります。' } };
  [
    ['010', 'aster', 'aster-pm', 'es', 'プロダクト企画 本選考 ES', '2030-05-16T18:00:00+09:00'],
    ['011', 'aster', 'aster-ai', 'es', 'AI ビジネス インターン ES', '2030-05-22T12:00:00+09:00'],
    ['012', 'aster', 'aster-ai', 'test', 'AI ビジネス 適性テスト', '2030-05-24T18:00:00+09:00'],
    ['013', 'kumo', 'kumo-product', 'es', 'プロダクト職 本選考 ES', '2030-05-19T23:59:00+09:00']
  ].forEach(([n, companyId, projectId, eventId, title, deadline]) => {
    const name = companies.find(c => c.id === companyId).name;
    messages.push({ id: 'sample-' + n, receivedAt: '2030-05-13T13:00:00+09:00', sender: name + ' 採用チーム', address: 'recruiting@' + companyId + '.example.com',
      subject: title + ' 提出のご案内', body: '【架空のサンプル】\n対象プロジェクト：' + title + '\n提出期限：' + deadline + '（JST）\n対象コース以外には適用されません。',
      facts: { type: 'assessment', companyIds: [companyId], projectId, eventId, title, applicationDeadline: deadline, evidence: '提出期限：' + deadline + '（JST）' } });
  });
  const data = { companies, messages, update, sampleDate: '2030-05-13' };
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.DemoData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this);
