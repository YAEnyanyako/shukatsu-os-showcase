const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../src/preparation.js'),W=require('../src/workflow.js'),D=require('../src/fixtures.js');
let R;try{R=require('../src/records.js');}catch{R={};}
test('confirmed ES remains selected after newer draft and reload',()=>{
 const s=P.createState();P.draft(s,'aster-pm','motivation','confirmed');P.version(s,'aster-pm','motivation','2030-05-13T12:00:00+09:00');
 assert.equal(typeof P.confirm,'function');P.confirm(s,'aster-pm','motivation',1);
 P.draft(s,'aster-pm','motivation','later draft');P.version(s,'aster-pm','motivation','2030-05-14T12:00:00+09:00');
 assert.equal(P.current(s,'aster-pm','motivation').text,'confirmed');
 const restored=P.restore(s);assert.equal(P.current(restored,'aster-pm','motivation').number,1);
 assert.equal(P.es(restored,'aster-pm','motivation').versions[1].savedAt,'2030-05-14T12:00:00+09:00');
 assert.equal(P.current(restored,'aster-ai','motivation'),null);
});
test('legacy versions migrate without inventing dates or confirmation',()=>{
 assert.equal(typeof P.current,'function');const s=P.restore({drafts:{'aster-pm/motivation':{text:'legacy',versions:[{number:5,text:'old'}]}}});
 assert.equal(P.current(s,'aster-pm','motivation').number,5);assert.equal(P.current(s,'aster-pm','motivation').savedAt,null);assert.equal(P.current(s,'aster-pm','motivation').confirmed,false);
});
test('exact ES receipt leaves sibling test pending and replay does not add evidence',()=>{
 assert.equal(typeof R.receive,'function');const s=P.createState();
 const projection=W.project(W.processBatch(W.createState(),D.messages).state);
 const a=projection.actions.find(x=>x.projectId==='aster-ai'&&x.id.endsWith(':es'));
 const t=projection.actions.find(x=>x.projectId==='aster-ai'&&x.id.endsWith(':test'));
 assert.equal(R.receive(s,'es-received',projection.actions),true);assert.equal(R.done(s,a),true);assert.equal(R.done(s,t),false);
 assert.equal(R.receive(s,'es-received',projection.actions),false);assert.equal(s.records.receipts.length,1);
 assert.equal(P.restore(s).records.receipts.length,1);
});
test('seminar and assessment never enable interview; explicit screening AI invitation does not imply pass',()=>{
 assert.equal(typeof R.readiness,'function');const s=P.createState(),p=W.project(W.processBatch(W.createState(),D.messages).state);
 assert.equal(R.readiness(p,s,'mori-service').ready,false);assert.equal(R.readiness(p,s,'aster-ai').ready,false);
 assert.equal(R.readiness(p,s,'aster-pm').ready,true);
 R.invite(s,'aster-ai');const stage=R.readiness(p,s,'aster-ai');assert.equal(stage.ready,true);assert.equal(stage.screeningPassed,false);
 assert.match(stage.reason,/書類選考中/);assert.equal(R.readiness(p,P.restore(s),'aster-ai').ready,true);
});
test('review keeps old and undated pending but excludes done cancelled and routine; no reply changes nothing',()=>{
 assert.equal(typeof R.pending,'function');const s=P.createState();const rows=R.pending([],s,()=>false);
 assert.ok(rows.some(x=>x.id==='old-question'));assert.ok(rows.some(x=>x.id==='undated-question'));assert.ok(rows.every(x=>!['done-example','cancelled-example','routine-example'].includes(x.id)));
 const before=JSON.stringify(s);R.respond(s,'old-question','no-reply');assert.equal(JSON.stringify(s),before);
 R.respond(s,'old-question','done');assert.ok(!R.pending([],P.restore(s),()=>false).some(x=>x.id==='old-question'));
});
test('journal records only an explicit nonempty reply and is not created by receipts',()=>{
 assert.equal(typeof R.journal,'function');const s=P.createState();assert.equal(R.journal(s,' '),false);assert.equal(s.records.journal,'');
 R.journal(s,'【架空】質問票を見直した。');assert.equal(P.restore(s).records.journal,'【架空】質問票を見直した。');
});
test('explicit screening pass enables only matching project and is distinct from ES receipt',()=>{
 assert.equal(typeof R.pass,'function');const s=P.createState(),p=W.project(W.processBatch(W.createState(),D.messages).state);
 R.receive(s,'es-received',p.actions);assert.equal(R.readiness(p,s,'kumo-product').screeningPassed,false);
 R.pass(s,'kumo-product');assert.equal(R.readiness(p,P.restore(s),'kumo-product').screeningPassed,true);assert.equal(R.readiness(p,s,'aster-ai').screeningPassed,false);
});
test('PDF export has valid byte offsets and contains only authored applicant content',()=>{
 const pdf=R.pdf();assert.ok(pdf.startsWith('%PDF-1.4'));assert.match(pdf,/Demo Applicant/);const x=Number(pdf.match(/startxref\n(\d+)/)[1]);assert.equal(pdf.slice(x,x+4),'xref');
 const offsets=[...pdf.matchAll(/(\d{10}) 00000 n /g)].map(x=>Number(x[1]));offsets.forEach((o,i)=>assert.ok(pdf.slice(o).startsWith((i+1)+' 0 obj')));
});
