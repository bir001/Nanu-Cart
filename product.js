/* SINGLE PRODUCT page */
const product=id=>{const p=findP(id);if(!p)return '<p class="empty">Product not found.</p><a class="btn b" href="#products">Browse products</a>';
  const im=(p.imgs&&p.imgs.length)?p.imgs:(p.img?[p.img]:['']),d=disc(p),o=p.stock===false,w=getWish().includes(p.id),more=PRODUCTS.filter(x=>x.id!==p.id&&x.cat===p.cat).slice(0,4);
  return `<div class="pd"><div class="gal" onscroll="galDot(this)">${im.map(s=>`<div class="gs">${pic(s,p.name)}</div>`).join('')}</div>${im.length>1?`<div class="dots">${im.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}
  <div class="pinfo"><div class="meta"><small>${esc(p.cat)}</small><button class="hb2 ${w?'on':''}" onclick="toggleWish('${p.id}')" aria-label="Wishlist">${I('heart',20)}</button></div><h1>${esc(p.name)}</h1>
  <div class="price"><b>${rs(p.price)}</b>${d?`<s>${rs(p.mrp)}</s><span class="off">${d}% off</span>`:''}</div><p class="stk ${o?'no':'yes'}">${o?'Currently unavailable':'In stock'}</p>
  ${p.desc?`<h3>About this product</h3><p class="desc">${esc(p.desc)}</p>`:''}
  <div class="trust"><div>${I('pin',20)}Live order tracking</div><div>${I('chat',20)}In-app chat support</div><div>${I('lock',20)}Secure account</div></div></div>
  ${more.length?`<div class="sh"><h2>You may also like</h2></div><div class="grid">${more.map(card).join('')}</div>`:''}</div>
  <div class="buy"><a class="ib" onclick="history.back()" aria-label="Back">${I('back')}</a><div class="qty"><button onclick="pq(-1)">${I('minus',16)}</button><span id="pq">1</span><button onclick="pq(1)">${I('plus',16)}</button></div><button class="btn o" ${o?'disabled':''} onclick="addCart('${p.id}',+$('#pq').textContent)">Add to cart</button><button class="btn b" ${o?'disabled':''} onclick="buyNow('${p.id}')">Buy now</button></div>`};
const pq=d=>{const e=$('#pq');e.textContent=Math.max(1,+e.textContent+d)};
function galDot(g){const i=Math.round(g.scrollLeft/g.clientWidth);document.querySelectorAll('.dots i').forEach((d,n)=>d.classList.toggle('on',n===i))}
