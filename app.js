const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0');
const brl=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
let S={e:[],p:''},per='w',SM=new Date().getMonth()+1,SY=new Date().getFullYear(),EX=new Set();
try{const r=localStorage.getItem('sdc-marmitas');if(r)S=JSON.parse(r)}catch(e){}
const save=()=>{try{localStorage.setItem('sdc-marmitas',JSON.stringify(S))}catch(e){}};
function wk(){const t=new Date(),k=(t.getDay()+6)%7,s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-k);return[iso(s),iso(new Date(s.getFullYear(),s.getMonth(),s.getDate()+6))]}
const tot=a=>({q:a.reduce((x,e)=>x+e.q,0),v:a.reduce((x,e)=>x+e.q*(e.v||0),0)});
function render(){
  const td=iso(new Date()),[ws,we]=wk();
  const h=tot(S.e.filter(e=>e.d===td));$('#hq').textContent=h.q;$('#hv').textContent=brl0(tot(S.e.filter(e=>e.d>=ws&&e.d<=we)).v);
  const hr=new Date().getHours(),META=50;$('#hi').textContent=hr<12?'Bom dia!':hr<18?'Boa tarde!':'Boa noite!';
  $('#gi').style.width=Math.min(100,h.q/META*100)+'%';$('#gt').textContent=h.q>=META?'Meta do dia batida! 🎉':'Faltam '+(META-h.q)+' para a meta de '+META;
  const wl=S.e.filter(e=>e.d>=ws&&e.d<=we).sort((a,b)=>b.d.localeCompare(a.d)||b.id-a.id);
  $('#list').innerHTML=wl.length?wl.map(e=>`<div class="row"><div><b>${e.q} marmitas · ${esc(e.c||'Sem cliente')}</b><br><span>${e.d.split('-').reverse().slice(0,2).join('/')} · ${brl(e.v||0)} cada${e.o?' · '+esc(e.o):''}</span></div><div style="text-align:right"><b>${brl(e.q*(e.v||0))}</b><br>${e.p?`<span style="color:#2E9E5B;font-weight:700;font-size:13px">Recebido${e.pd?' '+e.pd.split('-').reverse().slice(0,2).join('/'):''} ✓</span> <button class="pay" data-id="${e.id}">Desfazer</button>`:`<span style="color:${late(e)?'#C62828':'var(--chili)'};font-weight:700;font-size:13px">${late(e)?'Atrasado':'A receber'}${e.pv?' · '+dm(e.pv):''}</span> <button class="pay" data-id="${e.id}" style="background:#2E9E5B;border-color:#2E9E5B;color:#fff">Recebi</button>`}<button class="del" data-id="${e.id}" aria-label="Apagar lançamento">Apagar</button></div></div>`).join(''):'<p class="empty">Nada lançado esta semana. Preencha acima e toque em Lançar marmitas.</p>';
  const ym=SY+'-'+pad(SM);
  let set,keys,labels;
  if(per==='w'){set=wl;const s=parse(ws);keys=[...Array(7)].map((_,i)=>iso(new Date(s.getFullYear(),s.getMonth(),s.getDate()+i)));labels=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']}
  else if(per==='m'){set=S.e.filter(e=>e.d.startsWith(ym));const n=new Date(SY,SM,0).getDate();keys=[...Array(n)].map((_,i)=>ym+'-'+pad(i+1));labels=keys.map((_,i)=>(i+1)%5===1||i+1===n?i+1:'')}
  else{set=S.e;keys=[...new Set(S.e.map(e=>e.d.slice(0,7)))].sort();labels=keys.map(k=>k.slice(5)+'/'+k.slice(2,4))}
  const g=k=>set.filter(e=>(per==='a'?e.d.slice(0,7):e.d)===k).reduce((x,e)=>x+e.q,0);
  const vals=keys.map(g),mx=Math.max(...vals,1),T=tot(set);
  $('#kq').textContent=T.q;$('#kv').textContent=brl0(T.v);$('#kr').textContent=brl0(set.filter(e=>!e.p).reduce((x,e)=>x+e.q*(e.v||0),0));$('#mp').hidden=per!=='m';
  $('#sm').innerHTML=MN.map((m,i)=>`<option value="${i+1}"${i+1===SM?' selected':''}>${m}</option>`).join('');
  const ys=[...new Set([...S.e.map(e=>+e.d.slice(0,4)),SY,new Date().getFullYear()])].sort((a,b)=>b-a);
  $('#sy').innerHTML=ys.map(y=>`<option${y===SY?' selected':''}>${y}</option>`).join('');
  const nd=new Set(set.map(e=>e.d)).size;$('#ka').textContent=nd?Math.round(T.q/nd):0;
  const bc={};set.forEach(e=>{const k=e.c||'Sem cliente';bc[k]=bc[k]||{q:0,v:0,r:0};bc[k].q+=e.q;bc[k].v+=e.q*(e.v||0);if(e.p)bc[k].r+=e.q*(e.v||0)});
  const rk=Object.entries(bc).sort((a,b)=>b[1].q-a[1].q);window._rk=rk;window._set=set;$('#cp').textContent='Copiar resumo ('+rk.filter(([k])=>!EX.has(k)).length+' de '+rk.length+' clientes)';
  $('#byc').innerHTML=rk.length?rk.map(([k,x])=>`<div class="row"><div style="display:flex;gap:12px;align-items:center"><input type="checkbox" class="ck" data-k="${esc(k)}" aria-label="Incluir ${esc(k)} no resumo" ${EX.has(k)?'':'checked'}><div><b>${esc(k)}</b><br><span>${x.q} marmitas</span><br><span style="color:#2E9E5B;font-weight:500">recebido ${brl(x.r)}</span></div></div><b style="white-space:nowrap">${brl(x.v)}</b></div>`).join(''):'<p class="empty">Sem lançamentos neste período.</p>';
  const cm=new Map(S.e.filter(e=>e.c).sort((a,b)=>a.id-b.id).map(e=>[e.c,e.v]));window._cs=Object.fromEntries(cm);const cs=[...cm.entries()];
  $('#cl').innerHTML=cs.map(([c])=>`<option value="${esc(c)}">`).join('');
  $('#chips').innerHTML=cs.slice(-6).reverse().map(([c,v])=>`<button type="button" data-c="${esc(c)}" data-v="${v||''}">${esc(c)}</button>`).join('');
  $('#ct').textContent=per==='w'?'Marmitas por dia da semana':per==='m'?'Marmitas por dia em '+MN[SM-1]:'Marmitas por mês';
  $('#chart').innerHTML=vals.length?vals.map((v,i)=>`<div class="col">${per==='w'||per==='a'?`<em>${v||''}</em>`:''}<div class="bar" style="height:${v/mx*100*.78}%"></div><span>${labels[i]}</span></div>`).join(''):'<p class="empty">Sem dados ainda.</p>';
}
let cur=1;function tab(n){const dir=n>=cur?26:-26;cur=n;[1,2,3].forEach(i=>{$('#p'+i).hidden=i!==n;if(i<3)$('#t'+i).setAttribute('aria-selected',i===n)});$('#ctl').hidden=n<2;$('#dp').hidden=true;$('#mb').setAttribute('aria-expanded','false');
  document.querySelectorAll('#dp button').forEach(b=>b.setAttribute('aria-current',+b.dataset.n===n));window.scrollTo(0,0);
  const pe=$('#p'+n);pe.style.setProperty('--dx',dir+'px');pe.classList.remove('pg');void pe.offsetWidth;pe.classList.add('pg');
  $('.tabs').dataset.i=n;const lg=$('.logo3');lg.classList.remove('hop');void lg.offsetWidth;lg.classList.add('hop');render()}
$('#mb').onclick=()=>{const h=$('#dp').hidden;$('#dp').hidden=!h;$('#mb').setAttribute('aria-expanded',h)};
$('#dp').onclick=e=>{const b=e.target.closest('button');if(b)tab(+b.dataset.n)};
document.addEventListener('click',e=>{if(!e.target.closest('#dp,#mb'))$('#dp').hidden=true});
$('#t1').onclick=()=>tab(1);$('#t2').onclick=()=>tab(2);
$('#seg').onclick=e=>{const b=e.target.closest('button');if(!b)return;per=b.dataset.p;document.querySelectorAll('#seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));render()};
$('#f').onsubmit=e=>{e.preventDefault();const q=parseInt($('#q').value),v=parseFloat($('#v').value),c=$('#c').value.trim(),d=$('#d').value;
  if(!(q>0)||!(v>0)||!c||!d)return;S.e.push({id:Date.now(),d,q,c,v,p:false,o:$('#o').value.trim(),pv:$('#pv').value});save();$('#q').value='';$('#o').value='';$('#pv').value='';$('#qk').value='';render();const t=$('#toast');t.textContent='+'+q+' marmitas lançadas ✓';t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
$('#list').onclick=e=>{const pb=e.target.closest('.pay');if(pb){const x=S.e.find(z=>z.id==pb.dataset.id);if(x){x.p=!x.p;x.pd=x.p?iso(new Date()):'';save();render()}return}const b=e.target.closest('.del');if(!b)return;S.e=S.e.filter(x=>x.id!=b.dataset.id);save();render()};
const MN=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
$('#sm').onchange=e=>{SM=+e.target.value;render()};$('#sy').onchange=e=>{SY=+e.target.value;render()};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dm=s=>s.split('-').reverse().slice(0,2).join('/'),late=e=>!e.p&&e.pv&&e.pv<iso(new Date());
const brl0=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
$('#chips').onclick=e=>{const b=e.target.closest('button');if(!b)return;$('#c').value=b.dataset.c;$('#v').value=b.dataset.v;autoPv();$('#q').focus()};
$('#c').onchange=()=>{const v=(window._cs||{})[$('#c').value.trim()];if(v)$('#v').value=v;autoPv()};
$('#byc').onchange=e=>{const c=e.target.closest('.ck');if(!c)return;c.checked?EX.delete(c.dataset.k):EX.add(c.dataset.k);render()};
$('#sa').onclick=()=>{EX.clear();render()};$('#sn').onclick=()=>{EX=new Set((window._rk||[]).map(([k])=>k));render()};
$('#cp').onclick=async()=>{const L=(window._set||[]).filter(e=>!EX.has(e.c||'Sem cliente')).sort((a,b)=>a.d.localeCompare(b.d)||a.id-b.id);
  if(!L.length){toast('Selecione ao menos um cliente');return}
  const n=per==='w'?'da semana':per==='m'?'de '+MN[SM-1]+'/'+SY:'geral';let t='*Marmitas da Tiane - resumo '+n+'*\n';
  const by={};L.forEach(e=>{const k=e.c||'Sem cliente';(by[k]=by[k]||[]).push(e)});let TQ=0,TV=0;
  Object.entries(by).forEach(([k,a])=>{t+='\n*'+k+'*\n';let q=0,v=0;a.forEach(e=>{t+=e.d.split('-').reverse().join('/')+' - '+e.q+' marmitas x '+brl(e.v||0)+' = '+brl(e.q*(e.v||0))+'\n';q+=e.q;v+=e.q*(e.v||0)});if(a.length>1)t+='Subtotal: '+q+' marmitas - '+brl(v)+'\n';TQ+=q;TV+=v});
  t+='\nTotal: '+TQ+' marmitas - '+brl(TV);
  try{await navigator.clipboard.writeText(t);toast('Resumo copiado ✓')}catch(e){toast('Não consegui copiar aqui')}};
const csvDl=()=>{const L=(window._set||[]).slice().sort((a,b)=>a.d.localeCompare(b.d)||a.id-b.id);
  if(!L.length){toast('Nada para baixar neste período');return}
  const f=n=>String(n).replace('.',','),q=x=>'"'+String(x).replace(/"/g,'""')+'"';
  let c='Data;Cliente;Quantidade;Valor de cada;Total;Situação\r\n';
  L.forEach(e=>{const v=e.v||0;c+=[e.d.split('-').reverse().join('/'),q(e.c||'Sem cliente'),e.q,f(v.toFixed(2)),f((e.q*v).toFixed(2)),e.p?'Recebido':'A receber'].join(';')+'\r\n'});
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+c],{type:'text/csv;charset=utf-8'}));
  a.download='marmitas-'+(per==='m'?SY+'-'+pad(SM):per==='w'?'semana':'tudo')+'.csv';document.body.appendChild(a);a.click();a.remove();toast('Planilha baixada ✓')};
$('#csv').onclick=async()=>{
  const L=(window._set||[]).slice().sort((a,b)=>a.d.localeCompare(b.d)||a.id-b.id);
  if(!L.length){toast('Nada para baixar neste período');return}
  if(!window.ExcelJS){csvDl();return}
  try{
    const money='"R$" #,##0.00',ln={style:'thin',color:{argb:'FFD5DCE8'}},bd={top:ln,bottom:ln,left:ln,right:ln};
    const hd=r=>{r.height=26;r.eachCell(c=>{c.font={bold:true,color:{argb:'FFFFFFFF'},size:12};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF0B2545'}};c.alignment={vertical:'middle',horizontal:'center',wrapText:true}})};
    const DS=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
    const U=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))};
    const ps={orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0};
    const wb=new ExcelJS.Workbook(),ws=wb.addWorksheet('Lançamentos',{views:[{state:'frozen',ySplit:1,zoomScale:70}],pageSetup:ps});
    ws.columns=[{header:'Data',width:13},{header:'Dia da semana',width:16},{header:'Mês',width:17},{header:'Cliente',width:26},{header:'Quantidade',width:14},{header:'Valor de cada',width:16},{header:'Total',width:16},{header:'Situação',width:14},{header:'Previsão de recebimento',width:20},{header:'Dias de atraso',width:13},{header:'Data do recebimento',width:20},{header:'Observação',width:32}];
    let TQ=0,TV=0;const n=L.length,hoje=U(iso(new Date()));
    L.forEach((e,i)=>{const r=i+2,v=e.v||0,dt=U(e.d),pv=e.pv?U(e.pv):'',at=(!e.p&&pv&&hoje>pv)?Math.round((hoje-pv)/864e5):'';TQ+=e.q;TV+=e.q*v;
      ws.addRow([dt,DS[dt.getUTCDay()],MN[dt.getUTCMonth()]+'/'+dt.getUTCFullYear(),e.c||'Sem cliente',e.q,v,{formula:'E'+r+'*F'+r,result:e.q*v},e.p?'Recebido':'A receber',pv,{formula:'IF(AND(H'+r+'="A receber",I'+r+'<>""),MAX(0,TODAY()-I'+r+'),"")',result:at},e.p&&e.pd?U(e.pd):'',e.o||'']);});
    hd(ws.getRow(1));
    ws.eachRow((r,i)=>{if(i<2)return;r.height=22;r.eachCell({includeEmpty:true},(c,col)=>{c.border=bd;c.alignment={vertical:'middle',horizontal:col===4||col===12?'left':col===6||col===7?'right':'center'};
      if(col===1||col===9||col===11)c.numFmt='dd/mm/yyyy';if(col===6||col===7)c.numFmt=money;if(col===10)c.numFmt='0';
      if(col===8){const pg=c.value==='Recebido';c.font={bold:true,color:{argb:pg?'FF1B6E3F':'FFB4440A'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:pg?'FFD9F2E3':'FFFFE6D6'}}}})});
    ws.addConditionalFormatting({ref:'J2:J'+(n+1),rules:[{type:'expression',formulae:['AND(ISNUMBER(J2),J2>0)'],style:{font:{bold:true,color:{argb:'FFC00000'}},fill:{type:'pattern',pattern:'solid',bgColor:{argb:'FFFFD9D9'}}}}]});
    const tr=ws.addRow(['Total','','','(respeita o filtro)',{formula:'SUBTOTAL(109,E2:E'+(n+1)+')',result:TQ},'',{formula:'SUBTOTAL(109,G2:G'+(n+1)+')',result:TV},'','','','','']);tr.height=24;
    tr.eachCell({includeEmpty:true},(c,col)=>{c.font={bold:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE8EEF8'}};c.border={top:{style:'medium',color:{argb:'FF0B2545'}}};c.alignment={vertical:'middle',horizontal:col===4?'left':col===7?'right':'center'};if(col===7)c.numFmt=money});
    ws.autoFilter={from:'A1',to:'L'+(n+1)};
    const w2=wb.addWorksheet('Por cliente',{views:[{zoomScale:70}],pageSetup:ps});
    w2.columns=[{header:'Cliente',width:28},{header:'Marmitas',width:14},{header:'Total',width:17},{header:'Recebido',width:17},{header:'A receber',width:17}];
    const bc={};L.forEach(e=>{const k=e.c||'Sem cliente',t=e.q*(e.v||0);bc[k]=bc[k]||{q:0,t:0,r:0};bc[k].q+=e.q;bc[k].t+=t;if(e.p)bc[k].r+=t});
    Object.entries(bc).sort((a,b)=>b[1].t-a[1].t).forEach(([k,x])=>w2.addRow([k,x.q,x.t,x.r,x.t-x.r]));
    hd(w2.getRow(1));
    w2.eachRow((r,i)=>{if(i<2)return;r.height=22;r.eachCell((c,col)=>{c.border=bd;c.alignment={vertical:'middle',horizontal:col===1?'left':col===2?'center':'right'};if(col>2)c.numFmt=money})});
    const buf=await wb.xlsx.writeBuffer();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
    a.download='marmitas-'+(per==='m'?SY+'-'+pad(SM):per==='w'?'semana':'tudo')+'.xlsx';document.body.appendChild(a);a.click();a.remove();toast('Planilha baixada ✓');
  }catch(err){csvDl()}
};
// campos novos: lançamento rápido e previsão de recebimento
$('#o').closest('label').insertAdjacentHTML('beforebegin','<label class="full">Previsão de recebimento (opcional)<input id="pv" type="date"></label>');
$('#c').closest('.full').insertAdjacentHTML('beforebegin','<label class="full">Lançamento rápido<input id="qk" placeholder="Ex.: esq-12-14-receber 04/10" autocomplete="off"></label>');
const addD=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)},diffD=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const autoPv=()=>{if($('#pv').value)return;const c=$('#c').value.trim().toLowerCase(),d=$('#d').value;if(!c||!d)return;
  const l=S.e.filter(e=>e.pv&&(e.c||'').toLowerCase()===c).sort((a,b)=>b.id-a.id)[0];if(l)$('#pv').value=addD(d,diffD(l.d,l.pv))};
$('#qk').oninput=()=>{const m=$('#qk').value.trim().match(/^(.+?)\s*[-–]\s*(\d+)\s*[-–]\s*(?:R\$\s*)?(\d+(?:[.,]\d{1,2})?)(?:\s*[-–]?\s*(?:a\s+)?(?:receber|pagar|pago|paga)?\s*(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?)?\s*$/i);
  if(!m)return;let nm=m[1].trim();const ex=Object.keys(window._cs||{}).find(k=>k.toLowerCase()===nm.toLowerCase());
  nm=ex||nm.replace(/(^|\s)(\S)/g,(a,b,c)=>b+c.toUpperCase());
  $('#c').value=nm;$('#q').value=m[2];$('#v').value=m[3].replace(',','.');
  if(m[4]){const base=$('#d').value||iso(new Date()),y=m[6]?(m[6].length===2?2000+ +m[6]:+m[6]):parse(base).getFullYear();let f=iso(new Date(y,+m[5]-1,+m[4]));if(!m[6]&&f<base)f=iso(new Date(y+1,+m[5]-1,+m[4]));$('#pv').value=f}
  else{$('#pv').value='';autoPv()}};
$('#d').value=iso(new Date());
render();
