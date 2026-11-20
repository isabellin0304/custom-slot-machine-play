export const themes = {
 '草莓奶霜':'#F6D5DE','蜜桃奶昔':'#F8DDCC','香草布丁':'#F6E8B9','開心果奶油':'#DDEBCF',
 '薄荷牛奶':'#D1EAE3','天空奶昔':'#D7E7F8','薰衣草奶霜':'#E6D9F5','芋泥牛奶':'#E8DCE9'
};
export const palette = Object.values(themes);
export const options = text => text.split(/\r\n|\n|\r/).filter(line => line.trim().length);
export function uniform(n, sample=()=>crypto.getRandomValues(new Uint32Array(1))[0]) {
 if (!Number.isSafeInteger(n) || n<1 || n>2**32) throw new Error('選項數量無效');
 const bound = 2**32 - 2**32 % n;
 let value; do { value=sample(); } while(value>=bound);
 return value % n;
}
export function sentence(parts) {
 const text=parts.join(''); return /[。！？!?．.…](?:[」』”’）)】"']*)\s*$/u.test(text) ? text : text+'。';
}
export const stopTimes = n => Array.from({length:n},(_,i)=>Math.round(1400+1600*i/(n-1)));
export function checkMachine(m) {
 if (!m || typeof m.name!=='string' || !m.name.trim()) return '請輸入機台名稱';
 if (!palette.includes(m.theme) || typeof m.public!=='boolean') return '請確認主題與公開設定';
 if (![m.x,m.y].every(n=>Number.isInteger(n)&&n>=0&&n<=100)) return '圖片裁切位置無效';
 if (!Array.isArray(m.reels)||m.reels.length<2||m.reels.length>5) return '機台需要 2～5 個欄位';
 for (const [i,r] of m.reels.entries()) {
  if (!r || typeof r.name!=='string'||!r.name.trim()) return '請輸入第 '+(i+1)+' 欄的名稱';
  if (!Array.isArray(r.options)||!r.options.length||r.options.some(o=>typeof o!=='string'||!o.trim()||/[\r\n]/.test(o))) return '第 '+(i+1)+' 欄至少需要一行有效選項，每個選項限一行';
 }
 if(new TextEncoder().encode(JSON.stringify([m.name,m.reels])).length>1800000) return '單台文字超過 1.8 MB，請分成多台儲存（D1 單列限制為 2 MB）';
 return '';
}
