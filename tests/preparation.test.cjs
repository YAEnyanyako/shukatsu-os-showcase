const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../src/preparation.js'), C=require('../src/catalog.js');
test('ES versions and answers persist independently for sibling projects',()=>{
 const s=P.createState();P.draft(s,'aster-pm','motivation','本文😀');P.version(s,'aster-pm','motivation');P.draft(s,'aster-pm','motivation','次の稿');
 assert.equal(P.es(s,'aster-pm','motivation').versions[0].text,'本文😀');assert.equal(P.count('本文😀'),3);
 assert.notEqual(P.es(s,'aster-ai','motivation').text,'次の稿');
 P.answer(s,'aster-pm','一次面接',0,'自分の回答');assert.equal(P.answers(s,'aster-pm','最終面接')[0],undefined);
});
test('collection and distillation are replay safe, retain provenance and reject sibling sources',()=>{
 const s=P.createState();let r=P.collect(s,'aster');assert.equal(r.added,11);r=P.collect(s,'aster');assert.equal(r.added,0);assert.equal(r.skipped,11);
 P.distill(s,'aster-pm');assert.equal(s.notes['aster-pm'].length,4);P.distill(s,'aster-pm');assert.equal(s.notes['aster-pm'].length,4);
 assert.ok(s.notes['aster-pm'].every(id=>C.sources.find(x=>x.id===id).projectId==='aster-pm'));
});
test('calendar sync updates stable events, skips duplicates, exports UTC with safe escaping',()=>{
 const s=P.createState();const e={id:'aster:aster-pm:chat',title:'Demo, test;\nnext',start:'2030-05-20T10:00:00+09:00',end:'2030-05-20T11:00:00+09:00',sourceId:'one'};
 assert.throws(()=>P.sync(s,[e]),/Connect/);s.calendar.connected=true;assert.equal(P.sync(s,[e]).added,1);assert.equal(P.sync(s,[e]).skipped,1);
 assert.equal(P.sync(s,[{...e,start:'2030-05-20T13:00:00+09:00',end:'2030-05-20T14:00:00+09:00',sourceId:'two'}]).updated,1);
 const ics=P.ics(Object.values(s.calendar.events));assert.match(ics,/DTSTART:20300520T040000Z/);assert.match(ics,/SEQUENCE:1/);assert.match(ics,/UID:aster:aster-pm:chat@example.com/);assert.match(ics,/SUMMARY:Demo\\, test\\;\\nnext/);assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,1);
});
test('long unicode ICS lines fold to 75 bytes and unfold losslessly',()=>{
 const title='日本語の予定'.repeat(50), e={id:'x',title,start:'2030-05-20T10:00:00+09:00',end:'2030-05-20T11:00:00+09:00'};
 const ics=P.ics([e]);assert.ok(ics.split('\r\n').every(l=>Buffer.byteLength(l)<=75));assert.ok(ics.replace(/\r\n /g,'').includes('SUMMARY:'+title));
});
