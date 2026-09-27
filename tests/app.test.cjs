const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const W = require('../src/workflow.js');
const D = require('../src/fixtures.js');
const C = require('../src/catalog.js'), P = require('../src/preparation.js');

// No browser or network: exercise the real UI controller against a minimal DOM sink.
// These tests check controller behavior, not CSS layout or browser compatibility.
function app(saved = null, failStorage = false) {
  const elements = new Map(), listeners = {}, windowEvents = {};
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      innerHTML: '', textContent: '', value: '', open: false,
      classList: { add() {}, remove() {} },
      addEventListener(name, fn) { this[name] = fn; },
      showModal() { this.open = true; }, close() { this.open = false; }, focus() {}, setSelectionRange() {}
    });
    return elements.get(selector);
  }
  let stored = saved ? JSON.stringify(saved) : null;
  const document = { querySelector: element, querySelectorAll: () => [], addEventListener: (type, fn) => { listeners[type] = fn; } };
  const window = { Workflow: W, DemoData: D, Catalog:C, Preparation:P, addEventListener: (name, fn) => { windowEvents[name] = fn; }, scrollTo() {} };
  const location = { hash: '#overview' };
  const localStorage = { getItem() { if (failStorage) throw new Error('storage unavailable'); return stored; }, setItem(key, value) { if (failStorage) throw new Error('storage unavailable'); stored = value; } };
  const context = vm.createContext({ document, window, location, localStorage, Intl, setTimeout: () => 1, clearTimeout() {} });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/workbench.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8'), context);
  return {
    input(dataset,value){listeners.input({target:{dataset,value}});},
    change(id,value){listeners.change({target:{id,value,dataset:{}}});},
    element, get saved() { return JSON.parse(stored); },
    click(action, id) { listeners.click({ target: { closest: () => ({ dataset: { action, id } }) } }); },
    decision(companyId, value) { listeners.change({ target: { dataset: { decision: companyId }, value } }); },
    navigate(view) { location.hash = '#' + view; windowEvents.hashchange(); }
  };
}

test('controller renders an empty demo, processes fixtures and opens a source dialog', () => {
  const a = app(); assert.match(a.element('#content').innerHTML, /12 件のサンプルを仕分ける/);
  a.click('process'); assert.equal(Object.keys(a.saved.processed).length, 12);
  a.click('source', 'sample-004');
  assert.equal(a.element('#source-dialog').open, true);
  assert.match(a.element('#dialog-content').innerHTML, /キャンセル期限/);
  assert.match(a.element('#dialog-content').innerHTML, /手作業で作成/);
});
test('completed actions restore on reload without false storage errors', () => {
  const a = app(); a.click('process');
  a.click('complete', 'prepare:aster:aster-pm:aster-chat@sample-002');
  const b = app(a.saved);
  assert.equal(b.element('#storage-status').textContent, 'このブラウザ内だけに保存');
  assert.match(b.element('#content').innerHTML, /class="task-row done"/);
});
test('decision changes attention without creating a booking and restores on reload', () => {
  const a = app(); a.click('process'); a.decision('kumo-workshop', 'save');
  assert.equal(W.project(a.saved).calendar.length, 2);
  assert.doesNotMatch(a.element('#content').innerHTML, /data-id="rsvp:kumo:kumo-workshop:kumo-workshop@sample-003"/);
  const b = app(a.saved); b.navigate('pipeline');
  assert.match(b.element('#content').innerHTML, /保存中/);
});
test('rescheduling then replay is reflected in the real UI controller', () => {
  const a = app(); a.click('process'); a.click('update'); a.click('process');
  const p = W.project(a.saved);
  assert.equal(p.calendar.length, 2); assert.equal(p.conflicts.length, 0);
  a.navigate('evidence'); assert.match(a.element('#content').innerHTML, /スキップ 13 件/);
  a.navigate('inbox'); assert.match(a.element('#content').innerHTML, /会社未確認/);
});
test('reset removes processed records, decisions and completion state', () => {
  const a = app(); a.click('process'); a.decision('kumo-workshop', 'save'); a.click('reset-confirm');
  assert.deepEqual(a.saved, {...W.createState(),preparation:P.createState()});
});
test('storage denial leaves an operable temporary demo and reports its limit', () => {
  const a = app(null, true); a.click('process');
  assert.match(a.element('#storage-status').textContent, /一時モード/);
  assert.match(a.element('#content').innerHTML, /Sora Studio/);
});

test('company and project navigation separates ES, deadlines and messages',()=>{
 const a=app();a.click('process');a.navigate('company/aster');assert.match(a.element('#content').innerHTML,/AI ビジネス｜夏インターン/);
 a.navigate('project/aster-pm/mail');assert.match(a.element('#content').innerHTML,/sample-010/);assert.doesNotMatch(a.element('#content').innerHTML,/sample-011/);
 a.navigate('project/aster-ai');assert.match(a.element('#content').innerHTML,/5\/22/);assert.match(a.element('#content').innerHTML,/5\/24/);
 a.navigate('project/aster-pm/es');a.input({draft:'aster-pm',question:'motivation'},'<script>fictional</script>');a.click('version','aster-pm/motivation');
 assert.match(a.element('#content').innerHTML,/&lt;script&gt;/);assert.doesNotMatch(a.element('#content').innerHTML,/<script>fictional/);
 const b=app(a.saved);b.navigate('project/aster-pm/es');assert.match(b.element('#content').innerHTML,/Version 1/);
 b.navigate('project/aster-ai/es');assert.doesNotMatch(b.element('#content').innerHTML,/fictional/);
});
test('research collection, project notes and interview answers are linked and survive reload',()=>{
 const a=app();a.navigate('project/aster-ai/research');a.click('collect','aster');a.click('distill','aster-ai');
 assert.equal(a.saved.preparation.notes['aster-ai'].length,4);
 a.navigate('project/aster-ai/interview');a.input({answer:'aster-ai',round:'グループ面接',q:'0'},'架空の回答');a.click('feedback','aster-ai');
 assert.match(a.element('#content').innerHTML,/回答が短く/);
 const b=app(a.saved);b.navigate('project/aster-ai/interview');assert.match(b.element('#content').innerHTML,/架空の回答/);
 b.change('interview-round','発表・質疑');assert.doesNotMatch(b.element('#content').innerHTML,/架空の回答/);
});
test('company and project inbox filters retain company-wide and unresolved buckets',()=>{
 const a=app();a.click('process');a.navigate('inbox');a.change('company-filter','aster');a.change('project-filter','aster-ai');
 assert.match(a.element('#content').innerHTML,/data-id="sample-011"/);assert.doesNotMatch(a.element('#content').innerHTML,/data-id="sample-010"/);
 a.change('company-filter','sora');a.change('project-filter','unassigned');assert.match(a.element('#content').innerHTML,/data-id="sample-008"/);assert.doesNotMatch(a.element('#content').innerHTML,/data-id="sample-005"/);
});
test('calendar connection and reschedule synchronize only confirmed events',()=>{
 const a=app();a.click('process');a.navigate('calendar');a.click('connect-calendar','');assert.equal(Object.keys(a.saved.preparation.calendar.events).length,2);
 a.click('update');assert.equal(a.saved.preparation.calendar.runs.at(-1).updated,1);
 assert.equal(Object.values(a.saved.preparation.calendar.events).find(e=>e.companyId==='aster').sequence,1);
 a.click('sync-calendar','');assert.equal(a.saved.preparation.calendar.runs.at(-1).skipped,2);
});
test('calendar update sequence survives reload without becoming a new import',()=>{
 const a=app();a.click('process');a.click('connect-calendar','');a.click('update');
 const b=app(a.saved);b.click('sync-calendar','');
 assert.equal(Object.values(b.saved.preparation.calendar.events).find(e=>e.companyId==='aster').sequence,1);
});
test('project cards advance to the next unfinished deadline after completion',()=>{
 const a=app();a.click('process');a.click('complete','assessment:aster:aster-ai:es@sample-011');a.navigate('pipeline');
 const card=a.element('#content').innerHTML.split('<article').find(x=>x.includes('AI ビジネス｜夏インターン'));
 assert.match(card,/1 アクション/);assert.match(card,/5\/24/);assert.doesNotMatch(card,/5\/22/);
});
test('calendar rescheduling control states explain when no update can run',()=>{
 const a=app();a.navigate('calendar');assert.match(a.element('#content').innerHTML,/data-action="update"[^>]*disabled/);
 a.click('process');a.click('update');a.navigate('calendar');assert.match(a.element('#content').innerHTML,/data-action="update"[^>]*disabled/);assert.match(a.element('#content').innerHTML,/日程変更は反映済/);
});
