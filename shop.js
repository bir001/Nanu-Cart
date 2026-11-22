/* PRODUCT CARD, PRODUCTS (infinite), SEARCH PANEL, EMPTY STATES, WISHLIST, CART */
const disc=p=>p.mrp>p.price?Math.round(100-p.price/p.mrp*100):0;
const img0=p=>(p.imgs&&p.imgs[0])||p.img||'';
const card=p=>{const w=getWish().includes(p.id),d=disc(p),o=p.stock===false,r=rv(p.id);return `<article class="card pc" onclick="go('product/${p.id}')"><div class="pi">${pic(img0(p),p.name)}${d?`<span class="tag">${d}% OFF</span>`:''}<button class="hb ${w?'on':''}" onclick="event.stopPropagation();toggleWish('${p.id}')" aria-label="Wishlist">${I('heart',18)}</button>${r.count?`<span class="rchip"><i>★</i> ${r.avg.toFixed(1)} <em>(${r.count})</em></span>`:''}${o?'<div class="oos">Out of stock</div>':''}</div><div class="pb"><small>${esc(p.cat)}</small><h4>${esc(p.name)}</h4><div class="pr"><div class="pp"><b>${rs(p.price)}</b>${d?`<s>${rs(p.mrp)}</s>`:''}</div><button class="add" ${o?'disabled':''} onclick="event.stopPropagation();addCart('${p.id}')" aria-label="Add to cart">${I('plus',18)}</button></div></div></article>`};
let catSel='All',sortSel='new',shown=8;
const SORTS={new:'Newest',low:'Price: Low to High',high:'Price: High to Low',rated:'Top rated'};
const sorted=()=>PRODUCTS.filter(p=>catSel==='All'||p.cat===catSel).sort({new:(a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0),low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,rated:(a,b)=>rv(b.id).avg-rv(a.id).avg}[sortSel]);
const setCat=c=>{catSel=c;shown=8;refresh()};
const products=()=>{const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];return `<div class="sh"><h2>Products</h2></div><div class="chips">${cats.map(c=>`<button class="${c===catSel?'on':''}" onclick="setCat(this.dataset.c)" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="sorter"><select onchange="sortSel=this.value;shown=8;refresh()">${Object.entries(SORTS).map(([k,v])=>`<option value="${k}" ${k===sortSel?'selected':''}>${v}</option>`).join('')}</select></div><div class="grid" id="pg"></div><div id="more" class="more"></div>`};
function productsInit(){const m=$('#more');let io;const draw=()=>{const l=sorted();$('#pg').innerHTML=l.slice(0,shown).map(card).join('')||'<p class="empty">No products found.</p>';m.textContent=l.length>shown?'Loading more…':(l.length>8?"You've seen everything":'');if(io&&l.length>shown)setTimeout(()=>{io.unobserve(m);io.observe(m)},80)};
  io=new IntersectionObserver(e=>{if(e[0].isIntersecting&&sorted().length>shown){shown+=8;draw()}});draw();io.observe(m);listen(()=>io.disconnect())}
/* SEARCH: opens as a full-screen panel from the bottom menu (slides up, keyboard opens automatically) */
const search=()=>'';
let SDIRTY=false,SQT;
const searchOpen=()=>!!$('#sov');
const searchHome=()=>{const rc=ls.get('recent',[]),cats=[...new Set(PRODUCTS.map(p=>p.cat))].filter(Boolean),pop=[...PRODUCTS].sort((a,b)=>rv(b.id).count-rv(a.id).count).slice(0,6);
  return `${rc.length?`<div class="sechead"><h5 class="eb">Recent searches</h5><button class="lk" onclick="clearRecent()">Clear all</button></div><div class="rlist">${rc.map(r=>`<button data-q="${esc(r)}" onclick="qs(this.dataset.q)">${I('clock',16)}<span>${esc(r)}</span>${I('chev',16)}</button>`).join('')}</div>`:''}
  ${cats.length?`<h5 class="eb">Browse by category</h5><div class="chips w">${cats.map(c=>`<button data-c="${esc(c)}" onclick="catSel=this.dataset.c;shown=8;go('products')">${esc(c)}</button>`).join('')}</div>`:''}
  ${pop.length?`<h5 class="eb">Popular products</h5><div class="chips w">${pop.map(p=>`<button data-q="${esc(p.name)}" onclick="qs(this.dataset.q)">${esc(p.name)}</button>`).join('')}</div>`:''}
  ${CFG.services.length?`<h5 class="eb">Services</h5><div class="chips w">${CFG.services.slice(0,6).map(s=>`<button data-q="${esc(s.name)}" onclick="qs(this.dataset.q)">${esc(s.name)}</button>`).join('')}</div>`:''}`};
function openSearch(){if(searchOpen())return;closeAll();
  const el=document.createElement('div');el.id='sov';el.setAttribute('role','dialog');el.setAttribute('aria-label','Search');
  el.innerHTML=`<div class="sbar"><button class="ib" onclick="closeSearch()" aria-label="Close search">${I('back',20)}</button><div class="sin">${I('search',18)}<input id="q" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Search products &amp; services" oninput="doSearch(this.value)" onkeydown="if(event.key==='Enter'){saveRecent(this.value);this.blur()}"><button class="sclr" id="sclr" onclick="qs('')" aria-label="Clear">${I('x',16)}</button></div></div><div class="sbody"><div id="sx">${searchHome()}</div><div id="sr"></div></div>`;
  document.body.appendChild(el);document.body.classList.add('so');
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('on')));
  setTimeout(()=>{const q=$('#q');q&&q.focus()},300)}
function closeSearch(skipRefresh){const el=$('#sov');if(!el)return false;
  document.body.classList.remove('so');el.classList.remove('on');el.id='sov-x';
  const q=el.querySelector('input');q&&q.blur();setTimeout(()=>el.remove(),280);
  if(SDIRTY&&!skipRefresh){SDIRTY=false;refresh()}else SDIRTY=false;return true}
const qs=v=>{const q=$('#q');if(!q)return;q.value=v;doSearch(v);q.focus()};
const saveRecent=v=>{v=(v||'').trim();if(v)ls.set('recent',[v,...ls.get('recent',[]).filter(x=>x!==v)].slice(0,6))};
function clearRecent(){ls.set('recent',[]);const x=$('#sx');x&&(x.innerHTML=searchHome())}
function doSearch(v){v=v.trim();const r=$('#sr'),x=$('#sx'),c=$('#sclr');if(!r)return;c&&c.classList.toggle('on',!!v);x.style.display=v?'none':'';clearTimeout(SQT);
  if(!v){r.innerHTML='';x.innerHTML=searchHome();return}
  const t=v.toLowerCase().split(/\s+/),hit=s=>t.every(w=>s.includes(w)),
  a=PRODUCTS.filter(p=>hit((p.name+' '+p.cat+' '+(p.desc||'')).toLowerCase())),b=CFG.services.filter(s=>hit((s.name+' '+(s.desc||'')).toLowerCase())),n=a.length+b.length;
  r.innerHTML=n?`<p class="rcount"><b>${n}</b> result${n>1?'s':''} for “${esc(v)}”</p>${a.length?`<div class="grid">${a.map(card).join('')}</div>`:''}${b.length?`<h5 class="eb">Services</h5><div class="list">${b.map(s=>svcCard(s,1)).join('')}</div>`:''}`:emptyState('search','No results found',`We could not find “${esc(v)}”. Check the spelling or try a shorter word.`,`<button class="btn o sm" onclick="qs('')">Clear search</button>`);
  if(n&&v.length>1)SQT=setTimeout(()=>saveRecent(v),1200)}
/* ANIMATED EMPTY STATES (cart, wishlist, search, orders) */
const EMPTY={
cart:`<svg viewBox="0 0 220 180" fill="none" aria-hidden="true"><ellipse class="e-sh" cx="110" cy="160" rx="60" ry="8" fill="var(--b)" opacity=".14"/>
<g class="e-drop d1"><rect x="92" y="6" width="18" height="18" rx="4" fill="var(--gold)"/><path d="M92 14h18M101 6v18" stroke="#fff" stroke-width="2.4"/></g>
<g class="e-drop d2"><circle cx="128" cy="14" r="9" fill="#FF7A59"/><path d="M123 14l3.5 3.5L133 11" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>
<g class="e-drop d3"><rect x="70" y="8" width="16" height="16" rx="8" fill="var(--b)"/></g>
<g class="e-cart"><path d="M26 46h24l9 14" stroke="var(--b)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 60h122l-15 58H69z" fill="var(--sf)" stroke="var(--b)" stroke-width="7" stroke-linejoin="round"/><path d="M84 70l5 38M113 70v38M142 70l-5 38" stroke="var(--b)" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/>
<g class="e-wh"><circle cx="86" cy="138" r="11" fill="var(--sf)" stroke="var(--b)" stroke-width="6"/><path d="M86 131v14M79 138h14" stroke="var(--b)" stroke-width="2.6" stroke-linecap="round"/></g><g class="e-wh"><circle cx="146" cy="138" r="11" fill="var(--sf)" stroke="var(--b)" stroke-width="6"/><path d="M146 131v14M139 138h14" stroke="var(--b)" stroke-width="2.6" stroke-linecap="round"/></g></g></svg>`,
wish:`<svg viewBox="0 0 220 180" fill="none" aria-hidden="true"><defs><linearGradient id="hgw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8FA0"/><stop offset="1" stop-color="#E5484D"/></linearGradient></defs>
<ellipse class="e-sh" cx="110" cy="160" rx="44" ry="7" fill="var(--bad)" opacity=".16"/><circle class="e-ring" cx="110" cy="88" r="50" stroke="var(--bad)" stroke-width="2"/><circle class="e-ring r2" cx="110" cy="88" r="50" stroke="var(--bad)" stroke-width="2"/>
<g class="e-heart"><path d="M110 134C58 100 54 64 79 54C94 48 106 56 110 67C114 56 126 48 141 54C166 64 162 100 110 134Z" fill="url(#hgw)"/><path d="M82 66c4-6 11-8 16-4" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/></g>
<g transform="translate(46 54)"><path class="e-sp" d="M0-9L2.4-2.4L9 0L2.4 2.4L0 9L-2.4 2.4L-9 0L-2.4-2.4Z" fill="var(--gold)"/></g><g transform="translate(176 46)"><path class="e-sp s2" d="M0-7L2-2L7 0L2 2L0 7L-2 2L-7 0L-2-2Z" fill="var(--b)"/></g><g transform="translate(170 116)"><path class="e-sp s3" d="M0-8L2.2-2.2L8 0L2.2 2.2L0 8L-2.2 2.2L-8 0L-2.2-2.2Z" fill="var(--gold)"/></g>
<g transform="translate(70 130)"><path class="e-fh f1" d="M0 5C-7 0-7-6-3.5-6C-1.8-6 0-4.8 0-3C0-4.8 1.8-6 3.5-6C7-6 7 0 0 5Z" fill="var(--bad)"/></g><g transform="translate(152 128)"><path class="e-fh f2" d="M0 5C-7 0-7-6-3.5-6C-1.8-6 0-4.8 0-3C0-4.8 1.8-6 3.5-6C7-6 7 0 0 5Z" fill="#FF8FA0"/></g></svg>`,
search:`<svg viewBox="0 0 220 180" fill="none" aria-hidden="true"><ellipse class="e-sh" cx="110" cy="160" rx="46" ry="7" fill="var(--b)" opacity=".14"/><g class="e-mag"><circle cx="100" cy="82" r="38" fill="var(--sf)" stroke="var(--b)" stroke-width="8"/><path d="M128 110l30 30" stroke="var(--gold)" stroke-width="12" stroke-linecap="round"/><path d="M84 70c4-7 12-10 19-7" stroke="var(--b)" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/><path d="M90 92h20" stroke="var(--b)" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></g>
<g transform="translate(168 40)"><path class="e-sp" d="M0-8L2.2-2.2L8 0L2.2 2.2L0 8L-2.2 2.2L-8 0L-2.2-2.2Z" fill="var(--gold)"/></g><g transform="translate(46 44)"><path class="e-sp s2" d="M0-6L1.8-1.8L6 0L1.8 1.8L0 6L-1.8 1.8L-6 0L-1.8-1.8Z" fill="var(--b)"/></g></svg>`};
const emptyState=(k,t,s,btn)=>`<div class="es es-${k}"><div class="esart">${EMPTY[k]||EMPTY.cart}</div><h3>${t}</h3><p>${s}</p>${btn||''}</div>`;
const wishlist=()=>{const l=getWish().map(findP).filter(Boolean);return `<div class="sh"><h2>Wishlist</h2>${l.length?`<span class="sub">${l.length} saved item${l.length>1?'s':''}</span>`:''}</div>${l.length?`<div class="grid">${l.map(card).join('')}</div>`:emptyState('wish','Your wishlist is empty','Tap the heart on any product to save it here for later.','<a class="btn b" href="#products">Explore products</a>')}`};
const cart=()=>{const l=cartLines();if(!l.length)return `<div class="sh"><h2>Cart</h2></div>${emptyState('cart','Your cart is empty','Looks like you have not added anything yet. Let us find something you will love.','<a class="btn b" href="#products">Start shopping</a>')}`;const t=totals(),fs=CFG.freeShipAbove;
return `<div class="sh"><h2>Cart</h2></div>${t.save>0?`<div class="save">You are saving ${rs(t.save)} on this order</div>`:''}${fs&&CFG.deliveryFee&&t.sub<fs?`<div class="card shipbar">Add ${rs(fs-t.sub)} more for free delivery<i><u style="width:${Math.min(100,t.sub/fs*100)}%"></u></i></div>`:''}
${l.map(({p,q})=>`<div class="card li" onclick="go('product/${p.id}')"><div class="th">${pic(img0(p),p.name)}</div><div class="fl"><h4>${esc(p.name)}</h4><b>${rs(p.price)}</b></div><div class="qty" onclick="event.stopPropagation()"><button onclick="setQty('${p.id}',-1)">${I('minus',16)}</button><span>${q}</span><button onclick="setQty('${p.id}',1)">${I('plus',16)}</button></div></div>`).join('')}
<div class="card sum"><h3>Price details</h3>${priceRows(t)}</div><button class="btn b w" onclick="if(requireLogin('#checkout'))go('checkout')">Proceed to checkout</button>`};
