/* HOME: offer slider + engagement rows */
const row=(t,l,link)=>l.length?`<div class="sh"><div><h2>${t[0]}</h2>${t[1]?`<p class="sub">${t[1]}</p>`:''}</div>${link?`<a href="${link}">See all</a>`:''}</div><div class="rail">${l.map(card).join('')}</div>`:'';
const home=()=>{
  const sl=CFG.offers||[],cats=[...new Set(PRODUCTS.map(p=>p.cat))],
  deals=PRODUCTS.filter(p=>disc(p)>0).sort((a,b)=>disc(b)-disc(a)).slice(0,8),
  top=PRODUCTS.filter(p=>rv(p.id).count).sort((a,b)=>rv(b.id).avg-rv(a.id).avg).slice(0,8),
  fresh=[...PRODUCTS].sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,8),
  saved=getWish().map(findP).filter(Boolean),seen=viewed().map(findP).filter(Boolean).slice(0,8);
  return `${ME?`<p class="hi">Welcome back, <b>${esc((ME.name||'').split(' ')[0]||'there')}</b></p>`:''}
  <div class="hslider" id="hs" onscroll="hsDot(this)">${sl.map(o=>`<div class="hs" ${o.img?`style="background-image:linear-gradient(100deg,#061552e6,#0B3BD680),url('${esc(o.img)}')"`:''}><small>${esc(o.k)}</small><h2>${esc(o.t)}</h2><p>${esc(o.s)}</p><div><a class="btn y" href="${esc(o.h)}">${esc(o.c)}</a></div></div>`).join('')}</div>
  <div class="dots" id="hd">${sl.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
  <div id="ao"></div>${appCard()}
  <div class="trust3"><div>${I('pin',22)}Live order tracking</div><div>${I('chat',22)}Chat support</div><div>${I('shield',22)}Secure account</div></div>
  ${cats.length?`<div class="sh"><h2>Shop by category</h2></div><div class="chips">${cats.map(c=>`<button data-c="${esc(c)}" onclick="catSel=this.dataset.c;shown=8;go('products')">${esc(c)}</button>`).join('')}</div>`:''}
  ${deals.length?`<section class="deal"><small>${I('bolt',14)} Best deals</small><h3>Biggest savings right now</h3><div class="rail">${deals.map(card).join('')}</div></section>`:''}
  ${row(['Top rated','Loved by our customers'],top,'#products')}${row(['New arrivals','Fresh in the store'],fresh,'#products')}${row(['Saved for you','From your wishlist'],saved,'#wishlist')}${row(['Recently viewed','Pick up where you left off'],seen)}
  <div class="sh"><div><h2>Our services</h2><p class="sub">Book in a few taps</p></div><a href="#services">See all</a></div><div class="rail">${CFG.services.map(svcCard).join('')}</div>
  <div class="sh"><h2>Explore products</h2><a href="#products">See all</a></div><div class="grid">${PRODUCTS.slice(0,6).map(card).join('')}</div>`};
function hsDot(g){const i=Math.round(g.scrollLeft/g.clientWidth);document.querySelectorAll('#hd i').forEach((d,n)=>d.classList.toggle('on',n===i))}
function homeInit(){const s=$('#hs'),n=(CFG.offers||[]).length;
  if(s&&n>1){let i=0;const t=setInterval(()=>{if(document.hidden)return;i=(Math.round(s.scrollLeft/s.clientWidth)+1)%n;s.scrollTo({left:i*s.clientWidth,behavior:'smooth'})},4500);listen(()=>clearInterval(t))}
  if(ME&&BE.ready)listen(BE.db.collection('orders').where('phone','==',ME.phone).onSnapshot(x=>{const o=x.docs.map(d=>d.data()).filter(o=>o.status!=='Delivered'&&o.status!=='Cancelled').sort((a,b)=>(b.createdAt?.seconds||9e9)-(a.createdAt?.seconds||9e9))[0],e=$('#ao');if(!e)return;
    e.innerHTML=o?`<a class="card" href="#track/${o.id}"><div class="av" style="background:rgba(255,255,255,.2)">${I('truck',22)}</div><div class="fl"><small>Your active ${esc(o.type.toLowerCase())}</small><h4>${esc(o.id)} · ${esc(o.status)}</h4></div>${I('arrow',20)}</a>`:''},()=>{}))}
