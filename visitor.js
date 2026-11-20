import {$,api,esc,back,loginURL,nav} from './ui.js';
import {home} from './catalog.js';
import {play} from './play.js';
let dispose=()=>{},generation=0;
async function route(){
 const current=++generation;dispose();dispose=()=>{};const root=document.createElement('div');$('#app').replaceChildren(root);window.scrollTo(0,0);
 root.innerHTML='<p class="loading">載入中…</p>';const [,path,id]=(location.hash||'#/').slice(1).split('/');
 try{if(!path)await home(root);else if(path==='play'){
  const machine=await api('machines/'+encodeURIComponent(id));if(current!==generation)return;dispose=play(root,machine);
 }else if(path==='login'){location.replace(loginURL);return}else throw Error('找不到這個頁面');
 if(current===generation)document.title=($('h1',root)?.textContent||'機台總覽')+' · 奶油抽選所';
 }catch(e){root.innerHTML=back+'<section class="empty"><h2>無法開啟頁面</h2><p>'+esc(e.message)+'</p><button>重試</button></section>';$('button',root).onclick=route}
}
nav();addEventListener('hashchange',route);addEventListener('pageshow',e=>{if(e.persisted)location.reload()});route();
