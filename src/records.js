(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./catalog.js'):root.Catalog,typeof module==='object'&&module.exports?require('./preparation.js'):root.Preparation);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.Records=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(C,P){
 'use strict';
 // Independently authored fiction. No production export or selection-company data.
 const receipts=[{id:'es-received',token:'assessment:aster:aster-ai:es@sample-011',projectId:'aster-ai',title:'回答フォームの提出受付',at:'2030-05-14T18:00:00+09:00',body:'【架空の受領通知】AI ビジネス夏インターンの回答フォームを受け付けました。適性テストの受検状況は、この通知では確認していません。'}];
 const extras=[
  {id:'old-question',companyId:'sora',projectId:'sora-ops',title:'以前の案内への回答を確認する',deadline:'2030-05-10T18:00:00+09:00',status:'pending'},
  {id:'undated-question',companyId:'kumo',projectId:'kumo-product',title:'応募条件の不明点を確認する',deadline:null,status:'pending'},
  {id:'done-example',status:'done'}, {id:'cancelled-example',status:'cancelled'}, {id:'routine-example',status:'routine'}
 ];
 const token=a=>a.id+'@'+a.sourceId;
 function done(s,a){return receipts.some(r=>r.token===token(a)&&s.records.receipts.includes(r.id));}
 function receive(s,id,actions){const r=receipts.find(x=>x.id===id);if(!r||!actions.some(a=>token(a)===r.token)||s.records.receipts.includes(id))return false;s.records.receipts.push(id);return true;}
 function invite(s,id){if(id!=='aster-ai')throw Error('Unknown invitation');s.records.aiInvited=true;}
 function pass(s,id){if(id!=='kumo-product')throw Error('Unknown result');s.records.docPassed=true;}
 function readiness(p,s,id){
  const pr=C.projects.find(x=>x.id===id);if(!pr)return {ready:false,reason:'プロジェクト未確認',screeningPassed:false};
  if(pr.type==='イベント')return {ready:false,reason:'説明会・体験会。研究と社員への質問を準備します。選考面接ではありません。',screeningPassed:false};
  if(id==='kumo-product'&&s.records.docPassed)return {ready:true,reason:'書類通過の明示的な通知あり（架空）／根拠 screening-pass。次の面接日程はまだ予約されていません。',screeningPassed:true};
  if(id==='aster-ai'&&s.records.aiInvited)return {ready:true,reason:'書類選考中／AI 面接の明示的な案内あり（架空）。書類通過とは別です。',screeningPassed:false};
  const source=p.messages.find(m=>m.projectId===id&&['invitation','confirmation'].includes(m.facts.type)&&m.facts.eventCategory==='interview');
  return source?{ready:true,reason:'企業から明示的な面談案内あり／根拠 '+source.id,screeningPassed:false}:{ready:false,reason:'書類通過・明示的な面談案内は未確認。今は資料と提出事項を確認します。',screeningPassed:false};
 }
 function pending(actions,s,isDone){return actions.filter(a=>!isDone(a)).map(a=>({...a,reviewId:token(a),origin:'notice'})).concat(extras.filter(x=>x.status==='pending'&&!['done','cancelled'].includes(s.records.responses[x.id])).map(x=>({...x,reviewId:x.id,origin:'legacy-example'})));}
 function respond(s,id,status){if(status==='no-reply')return false;if(!extras.some(x=>x.id===id&&x.status==='pending')||!['done','pending','cancelled'].includes(status))throw Error('Invalid review response');s.records.responses[id]=status;return true;}
 function journal(s,text){if(typeof text!=='string'||!text.trim())return false;s.records.journal=text.trim().slice(0,20000);return true;}
 function examples(s,id){if(!C.projects.some(p=>p.id===id))throw Error('Unknown project');for(const q of C.esQuestions){if(P.es(s,id,q.id).versions.length||P.es(s,id,q.id).text!==q.seed)continue;P.draft(s,id,q.id,q.seed);P.version(s,id,q.id,'2030-05-11T12:00:00+09:00');P.draft(s,id,q.id,q.seed+' 私の担当と別案の比較を追加した架空の確認稿です。');P.version(s,id,q.id,'2030-05-12T12:00:00+09:00');P.confirm(s,id,q.id,2);P.draft(s,id,q.id,q.seed+' まだ本人確認していない、後日の架空草稿です。');P.version(s,id,q.id,'2030-05-13T12:00:00+09:00');}}
 function materials(s,id){const pr=C.projects.find(x=>x.id===id);if(!pr)return [];const shared=[
  {id:id+'/seminar',type:'企業研究',title:'説明会メモ',format:'text',date:'2030-05-10',body:'【架空】説明会で聞いた仕事の進め方。仮説を根拠とともに比較するという説明。社員の実務や配属の保証とは分けて確認する。'},
  {id:id+'/experience',type:'企業研究',title:'先輩の経験談と確認点',format:'text',date:'2029 / 架空',body:'【架空】別案の根拠を聞かれたという参加者の経験。年度とコースが異なるため、現在の選考方式とは断定しない。'},
  {id:id+'/cv',type:'ES',title:'履歴書サンプル',format:'pdf',date:'2030-05-12',body:'Fictional applicant / example coursework in service design / no real personal details. Version 1, unconfirmed sample.'},
  {id:id+'/standby',type:'面接準備',title:'予備の深掘りメモ',format:'text',date:'2030-05-12',body:'【架空】なぜ別案ではなく、この案を選んだか。面談案内がない時は予備資料として保存し、面接タスクを増やさない。'},
  {id:id+'/manifest',type:'応募記録',title:'内部メタデータ',format:'json',body:'{"fictional":true}'}
 ];
 const es=C.esQuestions.flatMap(q=>{const v=P.current(s,id,q.id);return v?[{id:id+'/'+q.id,type:'ES',title:q.label,format:'text',date:v.savedAt,body:v.text,version:v,versions:P.es(s,id,q.id).versions}]:[];});
 const rs=receipts.filter(r=>r.projectId===id&&s.records.receipts.includes(r.id)).map(r=>({id:r.id,type:'応募記録',title:r.title,format:'text',date:r.at,body:r.body}));
 return shared.concat(es,rs);
 }
 function pdf(){
  const text='BT /F1 16 Tf 50 770 Td (Fictional CV - Demo Applicant) Tj 0 -30 Td /F1 11 Tf (Example coursework: service design. No real personal data.) Tj ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Length '+text.length+' >>\nstream\n'+text+'\nendstream'];
  let out='%PDF-1.4\n',offsets=[0];objects.forEach((o,i)=>{offsets.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});const start=out.length;out+='xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(x=>String(x).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF\n';return out;
 }
 return {receipts,pass,token,done,receive,invite,readiness,pending,respond,journal,examples,materials,pdf};
});
