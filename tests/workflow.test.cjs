const test = require('node:test');
const assert = require('node:assert/strict');
const W = require('../src/workflow.js');

function message(id, extra = {}) {
  return { id, receivedAt: '2030-05-13T09:00:00+09:00', subject: 'Fictional notice', body: 'Synthetic source',
    facts: { type: 'invitation', companyIds: ['aster'], eventId: 'meeting-1', title: 'Demo meeting',
      start: '2030-05-20T10:00:00+09:00', end: '2030-05-20T11:00:00+09:00',
      applicationDeadline: '2030-05-16T12:00:00+09:00', ...extra } };
}
function run(messages, state = W.createState()) { return W.processBatch(state, messages).state; }

test('company labels are retained alongside event labels', () => {
  const p = W.project(run([message('one')]));
  assert.deepEqual(p.messages[0].labels, ['就活', '会社/aster', 'イベント/案内']);
});
test('replaying source IDs creates no duplicate actions or calendar events', () => {
  const m = message('receipt', { type: 'confirmation' });
  const first = run([m]);
  const second = W.processBatch(first, [m]);
  assert.equal(second.added, 0); assert.equal(second.skipped, 1);
  assert.equal(W.project(second.state).calendar.length, 1);
  assert.equal(W.project(second.state).actions.length, 1);
});
test('confirmation replaces the RSVP task with preparation even out of order', () => {
  const invite = message('invite');
  const receipt = message('receipt', { type: 'confirmation' });
  receipt.receivedAt = '2030-05-13T10:00:00+09:00';
  const p = W.project(run([receipt, invite]));
  assert.equal(p.calendar.length, 1);
  assert.equal(p.actions.length, 1);
  assert.equal(p.actions[0].kind, 'prepare');
});
test('later invitation cannot overwrite a confirmed reservation', () => {
  const receipt = message('receipt', { type: 'confirmation' });
  const invite = message('invite'); invite.receivedAt = '2030-05-14T10:00:00+09:00';
  assert.equal(W.project(run([receipt, invite])).actions[0].kind, 'prepare');
});
test('cancellation cutoff is not treated as an application deadline', () => {
  const p = W.project(run([message('cancel-cutoff', { type: 'confirmation', applicationDeadline: null,
    cancellationDeadline: '2030-05-19T12:00:00+09:00' })]));
  assert.equal(p.calendar[0].cancellationDeadline, '2030-05-19T12:00:00+09:00');
  assert.equal(p.actions[0].deadline, null);
});
test('unknown company remains unresolved and roundup stays unassigned', () => {
  const p = W.project(run([message('unknown', { companyIds: [] }),
    message('digest', { type: 'digest', companyIds: ['aster', 'kumo'] })]));
  assert.equal(p.messages.find(m => m.id === 'unknown').companyId, null);
  assert.equal(p.messages.find(m => m.id === 'digest').companyId, null);
  assert.equal(p.calendar.length, 0);
  assert.equal(p.actions.length, 1);
  assert.equal(p.actions[0].kind, 'review');
});
test('marketing urgency creates no personal action', () => {
  assert.equal(W.project(run([message('promo', { type: 'promotion' })])).actions.length, 0);
});
test('overlap uses real instants and adjacent slots do not overlap', () => {
  const a = { start: '2030-05-20T10:00:00+09:00', end: '2030-05-20T11:00:00+09:00' };
  assert.equal(W.overlap(a, { start: '2030-05-20T01:30:00Z', end: '2030-05-20T02:30:00Z' }), true);
  assert.equal(W.overlap(a, { start: a.end, end: '2030-05-20T12:00:00+09:00' }), false);
});
test('invitation conflict disappears after confirmed event is rescheduled in place', () => {
  const a = message('a', { type: 'confirmation' });
  const b = message('b', { companyIds: ['kumo'], eventId: 'workshop', start: '2030-05-20T10:30:00+09:00', end: '2030-05-20T11:30:00+09:00' });
  const first = run([a, b]); assert.equal(W.project(first).conflicts.length, 1);
  const revised = message('a-updated', { type: 'confirmation', start: '2030-05-20T13:00:00+09:00', end: '2030-05-20T14:00:00+09:00' });
  revised.receivedAt = '2030-05-14T12:00:00+09:00';
  const p = W.project(run([revised], first));
  assert.equal(p.calendar.length, 1); assert.equal(p.conflicts.length, 0);
  assert.equal(p.calendar[0].sourceId, 'a-updated');
  assert.equal(p.actions.find(a => a.companyId === 'kumo').kind, 'rsvp');
});
test('invalid or timezone-free dates are rejected and no progress is recorded for them', () => {
  const r = W.processBatch(W.createState(), [message('bad', { start: 'tomorrow' }),
    message('ambiguous', { applicationDeadline: '2030-05-16T12:00:00' }),
    message('negative', { end: '2030-05-20T09:00:00+09:00' })]);
  assert.equal(r.added, 0); assert.equal(r.rejected.length, 3);
  assert.equal(Object.keys(r.state.processed).length, 0);
});
test('processing leaves inputs unchanged and decisions cannot fabricate bookings', () => {
  const initial = W.createState(); const m = message('one');
  const before = JSON.stringify({ initial, m });
  const state = run([m], initial);
  assert.equal(JSON.stringify({ initial, m }), before);
  const decided = W.setDecision(state, 'aster', 'pursue');
  assert.equal(decided.decisions.aster, 'pursue');
  assert.equal(W.project(decided).calendar.length, 0);
  assert.throws(() => W.setDecision(state, 'aster', 'booked'));
});
test('impossible calendar dates and invalid offsets are not silently normalized', () => {
  const invalid = ['2030-02-30T12:00:00+09:00', '2030-04-31T12:00:00+09:00', '2030-05-16T24:00:00+09:00', '2030-05-16T12:00:00+18:00'];
  const r = W.processBatch(W.createState(), invalid.map((date, i) => message('date-' + i, { applicationDeadline: date })));
  assert.equal(r.added, 0); assert.equal(r.rejected.length, invalid.length);
});
test('fixture scenario gives exact derived counts and resolves the conflict', () => {
  const D = require('../src/fixtures.js');
  const first = run(D.messages), p = W.project(first);
  assert.equal(p.messages.length, 12); assert.equal(p.companies.length, 4);
  assert.equal(p.actions.length, 9); assert.equal(p.calendar.length, 2); assert.equal(p.conflicts.length, 1);
  const next = run([D.update], first), q = W.project(next);
  assert.equal(q.messages.length, 13); assert.equal(q.calendar.length, 2); assert.equal(q.conflicts.length, 0);
  assert.equal(W.processBatch(next, D.messages.concat(D.update)).skipped, 13);
});
