const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../src/sync_lab.js');

test('a response requires a read, rejects changed state, and succeeds after rereading', () => {
  let s = S.create();
  s = S.act(s, 'check'); assert.equal(s.result, 'unread');
  s = S.act(s, 'read'); s = S.act(s, 'check'); assert.equal(s.result, 'current');
  s = S.act(s, 'complete'); s = S.act(s, 'check'); assert.equal(s.result, 'changed');
  assert.equal(s.receipt.completed, false);
  s = S.act(s, 'read'); s = S.act(s, 'check'); assert.equal(s.result, 'current');
  assert.equal(s.receipt.completed, true);
});
test('simulated time expiry requires a fresh read even without a revision change', () => {
  let s = S.act(S.create(), 'read');
  s = S.act(s, 'advance'); s = S.act(s, 'check'); assert.equal(s.result, 'expired');
  s = S.act(s, 'read'); s = S.act(s, 'check'); assert.equal(s.result, 'current');
});
test('material receipt and review never prove submission; explicit evidence completes only ES', () => {
  let s = S.act(S.create(), 'review'); assert.equal(s.packet, 'absent');
  s = S.act(s, 'receive'); assert.equal(s.packet, 'received'); assert.equal(s.submitted, false);
  s = S.act(s, 'review'); assert.equal(s.packet, 'reviewed'); assert.equal(s.submitted, false);
  s = S.act(s, 'submit-evidence'); assert.equal(s.submitted, true); assert.equal(s.testCompleted, false);
});
test('replay does not add revisions or regress review; reset isolates the lesson', () => {
  let s = S.act(S.create(), 'complete'); const revision = s.revision;
  s = S.act(s, 'complete'); assert.equal(s.revision, revision);
  s = S.act(S.act(s, 'receive'), 'review'); s = S.act(s, 'receive'); assert.equal(s.packet, 'reviewed');
  s = S.act(s, 'submit-evidence'); assert.deepEqual(S.act(s, 'submit-evidence'), s);
  assert.deepEqual(S.act(s, 'reset'), S.create());
});
test('actions preserve input state, and the note is static and states its limits', () => {
  const before = S.create(); S.act(before, 'complete'); assert.deepEqual(before, S.create());
  const html = S.render(S.create());
  assert.match(html, /2026年11月更新/); assert.match(html, /未公開/);
  assert.match(html, /実際のAI会話・台帳には接続しません/);
  assert.match(html, /決めたこと/); assert.doesNotMatch(html, /04 \/|05 \/|note-closing/); assert.doesNotMatch(html, /<button|data-action=|<details/);
});
