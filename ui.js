import {apiOrigin,publicSite} from './config.js';
export {apiOrigin,publicSite};
export let auth={username:null,csrf:null};export const setAuth=value=>auth=value;
export const $=(q,root=document)=>root.querySelector(q);
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const adminHost=location.origin===apiOrigin;
export const loginURL=adminHost?'#/login':apiOrigin+'/#/login';
export async function api(path,method='GET',data){
 let r;try{r=await fetch(apiOrigin+'/api/'+path,{method,credentials:adminHost?'same-origin':'omit',cache:'no-store',
 headers:method==='GET'?{}:{'Content-Type':'application/json','X-CSRF-Token':auth.csrf||''},body:data===undefined?undefined:JSON.stringify(data)})}catch{throw Error('連線中斷，請檢查網路後重試')}
 let body;try{body=await r.json()}catch{throw Error('服務回應異常，請重新整理後再試')}
 if(!r.ok)throw Error(body.error||'操作失敗');return body;
}
export function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3600)}
export function message(root,msg){root.textContent=msg;root.hidden=!msg}
export function busy(btn,fn){return async e=>{e?.preventDefault();if(btn.disabled)return;btn.disabled=true;try{await fn()}catch(e){toast(e.message);const err=$('[data-error]');if(err)message(err,e.message)}finally{btn.disabled=false}}}
export const back='<a class="back" href="#/">‹　機台總覽</a>';
export const errBox='<p data-error class="error" role="alert" hidden></p>';
export const time=v=>new Date(v).toLocaleString('zh-TW',{hour12:false});
export function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
export async function copy(text){try{await navigator.clipboard.writeText(text)}catch{const e=document.createElement('textarea');e.value=text;document.body.append(e);e.select();const ok=document.execCommand('copy');e.remove();if(!ok)throw Error('瀏覽器未允許複製，請手動選取文字')}toast('已複製')}
export function coverURL(m){return apiOrigin+'/api/machines/'+encodeURIComponent(m.id)+'/cover?v='+m.revision}
export const shareURL=m=>new URL('#/play/'+m.id,m.public?publicSite:apiOrigin+'/').href;
export function nav(){
 const link=(href,s)=>'<a href="'+href+'">'+s+'</a>';
 $('#nav').innerHTML=link('#/','機台總覽')+(auth.username?link('#/new','建立機台')+link('#/trash','垃圾桶')+link('#/backups','備份')+link('#/settings','帳號設定')+'<button id="logout">登出</button>':'<a class="login-link" href="'+esc(loginURL)+'">管理員登入</a>');
 const out=$('#logout');if(out)out.onclick=busy(out,async()=>{if(window.canLeave&&!window.canLeave())return;await api('logout','POST',{});location.replace(location.pathname+'#/');location.reload()})
}
