/* SINGLE PRODUCT page */
const product=id=>{const p=findP(id);if(!p)return '<p class="empty">Product not found.</p><a class="btn b" href="#products">Browse products</a>';markViewed(id);
  const im=(p.imgs&&p.imgs.length)?p.imgs:(p.img?[p.img]:['']),d=disc(p),o=p.stock===false,w=getWish().includes(p.id),r=rv(id),more=PRODUCTS.filter(x=>x.id!==p.id&&x.cat===p.cat).slice(0,6);
  return `<div class="pd"><div class="gwrap"><div class="gal" onscroll="galDot(this)">${im.map(s=>`<div class="gs">${pic(s,p.name)}</div>`).join('')}</div><a class="gb l" onclick="history.length>1?history.back():go('products')" aria-label="Back">${I('back')}</a><button class="gb r2" onclick="shareP('${p.id}')" aria-label="Share">${I('share',20)}</button><button class="gb r ${w?'on':''}" onclick="toggleWish('${p.id}')" aria-label="Wishlist">${I('heart',20)}</button>${im.length>1?`<div class="dots">${im.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}</div>
  <div class="psheet"><small class="cat">${esc(p.cat)}</small><h1>${esc(p.name)}</h1>
  <div class="ratingrow">${r.count?`${stars(r.avg)}<b>${r.avg.toFixed(1)}</b><a onclick="$('#rv').scrollIntoView()">${r.count} review${r.count>1?'s':''}</a>`:'<span class="mut" style="margin:0">No reviews yet</span>'}</div>
  <div class="price"><b>${rs(p.price)}</b>${d?`<s>${rs(p.mrp)}</s><span class="off">${d}% off</span>`:''}</div><p class="stk ${o?'no':'yes'}">${o?'Currently unavailable':'In stock'}</p>
  <div class="card dinfo">${I('truck',24)}<div><b>Delivery: ${CFG.deliveryFee?rs(CFG.deliveryFee):'Free'}</b><p>We confirm every order on chat or WhatsApp.</p></div></div>
  ${p.desc?`<h3>About this product</h3><p class="desc">${esc(p.desc)}</p>`:''}
  <div class="trust"><div>${I('pin',20)}Live order tracking</div><div>${I('chat',20)}Chat support</div><div>${I('lock',20)}Secure account</div></div>
  ${reviewsHTML(id)}${more.length?`<div class="sh"><h2>You may also like</h2></div><div class="rail">${more.map(card).join('')}</div>`:''}</div></div>
  <div class="buy"><div class="qty"><button onclick="pq(-1)">${I('minus',16)}</button><span id="pq">1</span><button onclick="pq(1)">${I('plus',16)}</button></div><button class="btn o" ${o?'disabled':''} onclick="addCart('${p.id}',+$('#pq').textContent)">Add to cart</button><button class="btn b" ${o?'disabled':''} onclick="buyNow('${p.id}')">Buy now</button></div>`};
const pq=d=>{const e=$('#pq');e.textContent=Math.max(1,+e.textContent+d)};
function galDot(g){const i=Math.round(g.scrollLeft/g.clientWidth);document.querySelectorAll('.gwrap .dots i').forEach((d,n)=>d.classList.toggle('on',n===i))}
function shareP(id){const p=findP(id),u=location.href.split('#')[0]+'#product/'+id,t=`${p.name} - ${rs(p.price)} on Nanu Cart`;if(navigator.share)navigator.share({title:p.name,text:t,url:u}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(t+'\n'+u),'_blank')}
