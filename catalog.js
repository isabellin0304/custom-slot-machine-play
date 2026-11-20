import {api,auth,$,esc,coverURL} from './ui.js';
import {machineArt} from './art.js';
export async function home(root){
 root.innerHTML='<section class="hero"><div class="awning"></div><div class="hero-copy"><h1>奶油抽選所</h1><p>選一台喜歡的機台，轉出今天的小驚喜。</p><a class="button rose" href="#collection" id="browse">瀏覽機台 <span aria-hidden="true">✧</span></a></div><div class="hero-art">'+machineArt('#F6D5DE','hero')+'</div></section><section id="collection"><div class="section-head"><div><span class="section-mark" aria-hidden="true">✿</span><h2>機台總覽</h2><span id="count" class="count"></span></div><label class="search"><span aria-hidden="true">⚲</span><input type="search" placeholder="搜尋機台名稱" aria-label="搜尋機台名稱"></label></div><div class="cards" id="cards">載入機台中…</div></section>';
 $('#browse',root).onclick=e=>{e.preventDefault();$('#collection',root).scrollIntoView({behavior:'smooth'})};
 const items=await api('machines');const cards=$('#cards',root),search=$('input',root);
 function render(){const filtered=items.filter(m=>m.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));
 $('#count',root).textContent=filtered.length+' 台';cards.innerHTML=filtered.length?filtered.map(m=>'<a class="machine-card" href="#/play/'+esc(m.id)+'"><div class="cover">'+(m.hasCover?'<img loading="lazy" src="'+esc(coverURL(m))+'" style="object-position:'+m.x+'% '+m.y+'%" alt="">':machineArt(m.theme,'card'))+'</div><div class="card-info"><p class="card-meta"><i style="background:'+esc(m.theme)+'"></i>'+m.reel_count+' 欄位　·　'+m.option_count+' 個選項</p><h3>'+esc(m.name)+'</h3>'+(auth.username?'<small>'+ (m.public?'公開':'私人')+'</small>':'')+'<span class="card-play" aria-hidden="true">▷</span></div></a>').join(''):'<div class="empty">'+(search.value?'找不到符合的機台，試試其他名稱。':'目前沒有可遊玩的機台。')+'</div>'}
 search.oninput=render;render();
}
