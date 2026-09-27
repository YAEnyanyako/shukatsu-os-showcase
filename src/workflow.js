(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Workflow = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const TYPE = { invitation: '案内', confirmation: '予約確認', assessment: '選考課題', digest: 'まとめ情報', promotion: '募集情報' };
  const createState = () => ({ version: 1, processed: {}, decisions: {}, completed: [], runs: [] });
  function timestamp(value) {
    if (typeof value !== 'string') return false;
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
    if (!m) return false;
    const [, year, month, day, hour, minute, second] = m.map((s, i) => i > 0 && i < 7 ? Number(s) : s);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1] || hour > 23 || minute > 59 || second > 59) return false;
    if (m[7] !== 'Z' && (Number(m[8]) > 14 || Number(m[9]) > 59 || Number(m[8]) === 14 && Number(m[9]) !== 0)) return false;
    return Number.isFinite(Date.parse(value));
  }

  function validate(m) {
    if (!m || !/^[a-z0-9-]+$/.test(m.id || '')) return 'Invalid source ID';
    if (!timestamp(m.receivedAt)) return 'A source timestamp with timezone is required';
    const f = m.facts;
    if (!f || !Object.hasOwn(TYPE, f.type)) return 'Unknown event type';
    if (!Array.isArray(f.companyIds) || f.companyIds.some(id => !/^[a-z0-9-]+$/.test(id))) return 'Invalid company identifiers';
    if (f.projectId != null && !/^[a-z0-9-]+$/.test(f.projectId)) return 'Invalid project identifier';
    for (const key of ['start', 'end', 'applicationDeadline', 'cancellationDeadline']) {
      if (f[key] != null && !timestamp(f[key])) return `Invalid ${key}`;
    }
    if (f.start && f.end && Date.parse(f.end) <= Date.parse(f.start)) return 'End must be later than start';
    if (f.type === 'confirmation' && (!f.start || !f.end)) return 'A confirmation needs a complete time slot';
    return null;
  }

  function processBatch(state, messages) {
    const next = copy(state);
    let added = 0, skipped = 0;
    const rejected = [];
    for (const m of messages) {
      if (m && Object.hasOwn(next.processed, m.id)) { skipped++; continue; }
      const reason = validate(m);
      if (reason) { rejected.push({ id: m && m.id || 'unknown', reason }); continue; }
      next.processed[m.id] = copy(m);
      added++;
    }
    next.runs.push({ sequence: next.runs.length + 1, added, skipped, rejected: rejected.length });
    return { state: next, added, skipped, rejected };
  }

  function overlap(a, b) {
    return Boolean(a.start && a.end && b.start && b.end &&
      Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end));
  }

  function project(state, catalog = []) {
    const messages = Object.values(state.processed).sort((a, b) =>
      Date.parse(a.receivedAt) - Date.parse(b.receivedAt) || a.id.localeCompare(b.id)).map(m => {
      const f = m.facts;
      const companyId = f.type !== 'digest' && f.companyIds.length === 1 ? f.companyIds[0] : null;
      const projectId = companyId ? (f.projectId || null) : null;
      return { ...copy(m), companyId, projectId,
        labels: ['就活', ...(companyId ? [`会社/${companyId}`] : f.type === 'digest' ? ['プラットフォーム情報'] : ['会社未確認']), `イベント/${TYPE[f.type]}`] };
    });
    const groups = new Map(), actions = [], calendar = [], conflicts = [];
    for (const m of messages) {
      const f = m.facts;
      if (f.type === 'digest' || f.type === 'promotion') continue;
      if (!m.companyId) {
        actions.push({ id: `review:${m.id}`, companyId: null, kind: 'review', title: '案内元の会社名を確認する', deadline: null, sourceId: m.id });
        continue;
      }
      const key = `${m.companyId}:${m.projectId ? m.projectId + ":" : ""}${f.eventId || m.id}`;
      const prior = groups.get(key);
      if (prior && prior.facts.type === 'confirmation' && f.type !== 'confirmation') continue;
      groups.set(key, m);
    }
    for (const [key, m] of groups) {
      const f = m.facts;
      if (f.type === 'confirmation') {
        calendar.push({ id: key, companyId: m.companyId, projectId: m.projectId, title: f.title, start: f.start, end: f.end,
          cancellationDeadline: f.cancellationDeadline || null, sourceId: m.id });
        actions.push({ id: `prepare:${key}`, companyId: m.companyId, projectId: m.projectId, kind: 'prepare', title: `${f.title}の準備`,
          deadline: null, scheduledAt: f.start, sourceId: m.id });
      } else if (f.type === 'assessment') {
        actions.push({ id: `assessment:${key}`, companyId: m.companyId, projectId: m.projectId, kind: 'assessment', title: f.title,
          deadline: f.applicationDeadline || null, sourceId: m.id });
      } else {
        actions.push({ id: `rsvp:${key}`, companyId: m.companyId, projectId: m.projectId, kind: 'rsvp', title: `${f.title}を検討する`,
          deadline: f.applicationDeadline || null, sourceId: m.id, slot: { start: f.start, end: f.end } });
      }
    }
    // Recompute derived conflicts from current evidence after every projection.
    for (const a of actions) {
      if (a.kind !== 'rsvp') continue;
      const collisions = calendar.filter(event => overlap(a.slot, event));
      if (collisions.length) {
        a.kind = 'conflict';
        a.title = '重複する日程を確認して判断する';
        collisions.forEach(event => conflicts.push({ actionId: a.id, sourceId: a.sourceId, withEventId: event.id, withSourceId: event.sourceId }));
      }
    }
    for (let i = 0; i < calendar.length; i++) {
      for (let j = i + 1; j < calendar.length; j++) {
        if (overlap(calendar[i], calendar[j])) conflicts.push({ sourceId: calendar[i].sourceId, withSourceId: calendar[j].sourceId, withEventId: calendar[j].id });
      }
    }
    const companies = [...new Set(messages.map(m => m.companyId).filter(Boolean))].map(id => ({ id,
      decision: state.decisions[id] || 'undecided',
      stage: calendar.some(e => e.companyId === id) || actions.some(a => a.companyId === id && a.kind === 'assessment') ? 'active' :
        state.decisions[id] === 'pursue' ? 'preparing' : state.decisions[id] === 'save' ? 'watching' : state.decisions[id] === 'decline' ? 'closed' : 'incoming' }));
    const projectMap = new Map(catalog.map(p => [p.id, { ...p }]));
    messages.filter(m => m.projectId).forEach(m => {
      if (!projectMap.has(m.projectId)) projectMap.set(m.projectId, { id: m.projectId, companyId: m.companyId });
    });
    const projects = [...projectMap.values()].map(p => ({ ...p, decision: state.decisions[p.id] || 'undecided',
      stage: calendar.some(e => e.projectId === p.id) || actions.some(a => a.projectId === p.id && a.kind === 'assessment') ? 'active' :
        state.decisions[p.id] === 'pursue' ? 'preparing' : state.decisions[p.id] === 'save' ? 'watching' : state.decisions[p.id] === 'decline' ? 'closed' : 'incoming' }));
    actions.sort((a, b) => (a.deadline ? Date.parse(a.deadline) : Infinity) - (b.deadline ? Date.parse(b.deadline) : Infinity) || a.id.localeCompare(b.id));
    return { messages, actions, calendar: calendar.sort((a, b) => Date.parse(a.start) - Date.parse(b.start)), conflicts, companies, projects };
  }

  function setDecision(state, companyId, decision) {
    if (!['pursue', 'save', 'decline', 'undecided'].includes(decision)) throw new Error('Unsupported decision');
    const next = copy(state);
    next.decisions[companyId] = decision;
    return next;
  }
  return { createState, processBatch, project, overlap, setDecision };
});
