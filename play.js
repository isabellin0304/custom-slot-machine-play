import {$,esc,api,auth,back,toast,busy,copy,download,shareURL} from './ui.js';
import {uniform,sentence,stopTimes} from './core.js';
export function play(root,m){
 const url=shareURL(m);
 root.innerHTML=back+'<div class="title-row"><h1>'+esc(m.name)+'</h1><div class="actions"><button id="share">分享連結</button>'+(auth.username?'<a class="button" href="#/edit/'+m.id+'">編輯機台</a><button id="dup">複製機台</button><button id="trash">移到垃圾桶</button>':'')+'</div></div><section class="cabinet" style="--theme:'+m.theme+';--cols:'+m.reels.length+'"><div class="cabinet-top" aria-hidden="true"><i></i><span>✧　✿　✧</span><i></i></div><div class="reels">'+m.reels.map(r=>'<div class="reel"><strong>'+esc(r.name)+'</strong><div class="window"><span class="value">✧</span></div></div>').join('')+'</div><div class="cabinet-controls"><span role="status" id="phase">準備就緒</span><button class="spin" id="spin">✧　開始抽選</button><button id="skip" hidden>跳過動畫</button></div></section><section class="history"><div class="title-row"><h2>抽選紀錄</h2><div class="actions"><button id="copyall">複製全部</button><button id="export">下載 TXT</button><button id="clear">清空紀錄</button></div></div><p class="muted">紀錄保留在本頁，重新整理後會清空。</p><ol id="records"></ol></section>';
 const spin=$('#spin',root),skip=$('#skip',root),phase=$('#phase',root),values=[...root.querySelectorAll('.value')],list=$('#records',root);
 const history=[];let pending=null,timer=0;
 const buttons=['#copyall','#export','#clear'].map(s=>$(s,root));
 function display(){buttons.forEach(b=>b.disabled=!history.length);if(!history.length)list.innerHTML='<li class="empty">轉動機台後，第一筆結果會出現在這裡。</li>'}
 function finish(){if(!pending)return;clearInterval(timer);const parts=pending;pending=null;
  values.forEach((v,i)=>{v.textContent=parts[i];v.className='value settled'});
  const result=sentence(parts);if(!history.length)list.replaceChildren();history.unshift(result);
  const li=document.createElement('li'),span=document.createElement('span'),b=document.createElement('button');span.textContent=result;b.textContent='複製';b.onclick=busy(b,()=>copy(result));li.append(span,b);list.prepend(li);display();
  spin.disabled=false;skip.hidden=true;phase.textContent='抽選完成';
 }
 spin.onclick=()=>{if(pending)return;pending=m.reels.map(r=>r.options[uniform(r.options.length)]);
  const offsets=m.reels.map(r=>uniform(r.options.length)),times=stopTimes(values.length),start=performance.now();let tick=0;
  spin.disabled=true;skip.hidden=false;phase.textContent='抽選中…';
  function frame(){const elapsed=performance.now()-start;if(elapsed>=3000){finish();return}
   values.forEach((v,i)=>{const rolling=elapsed<times[i];v.className=rolling?'value rolling':'value settled';v.textContent=rolling?m.reels[i].options[(offsets[i]+tick)%m.reels[i].options.length]:pending[i]});tick++}
  frame();timer=setInterval(frame,65);
 };
 skip.onclick=finish;buttons[0].onclick=busy(buttons[0],()=>copy(history.join('\n')));
 buttons[1].onclick=()=>{const name=m.name.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').slice(0,80);download(new Blob([[...history].reverse().join('\n')],{type:'text/plain;charset=utf-8'}),name+'-'+new Date().toISOString().slice(0,10)+'.txt')};
 buttons[2].onclick=()=>{if(confirm('清空本頁所有抽選紀錄？')){history.length=0;display();toast('已清空紀錄')}};
 $('#share',root).onclick=busy($('#share',root),()=>copy(url));display();
 if(auth.username){const dup=$('#dup',root),del=$('#trash',root),copyId=crypto.randomUUID();dup.onclick=busy(dup,async()=>{const r=await api('machines/'+m.id+'/copy','POST',{id:copyId});toast('已建立私人副本');location.hash='/play/'+r.id});
 del.onclick=busy(del,async()=>{if(confirm('將這台機台移到垃圾桶？可在 30 天內還原。')){await api('machines/'+m.id+'/trash','POST',{});toast('已移到垃圾桶');location.hash='/'}})}
 return ()=>{clearInterval(timer);pending=null};
}
