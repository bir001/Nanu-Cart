/* PRODUCT CARD, PRODUCTS, SEARCH, WISHLIST, CART, CHECKOUT */
const disc=p=>p.mrp>p.price?Math.round(100-p.price/p.mrp*100):0;
const img0=p=>(p.imgs&&p.imgs[0])||p.img||'';
const card=p=>{const w=getWish().includes(p.id),d=disc(p),o=p.stock===false;return `<article class="card pc" onclick="go('product/${p.id}')"><div class="pi">${pic(img0(p),p.name)}${d?`<span class="tag">${d}% OFF</span>`:''}<button class="hb ${w?'on':''}" onclick="event.stopPropagation();toggleWish('${p.id}')" aria-label="Wishlist">${I('heart',18)}</button>${o?'<div class="oos">Out of stock</div>':''}</div><div class="pb"><small>${esc(p.cat)}</small><h4>${esc(p.name)}</h4><div class="pr"><div class="pp"><b>${rs(p.price)}</b>${d?`<s>${rs(p.mrp)}</s>`:''}</div><button class="add" ${o?'disabled':''} onclick="event.stopPropagation();addCart('${p.id}')" aria-label="Add to cart">${I('plus',18)}</button></div></div></article>`};
let catSel='All';
const setCat=c=>{catSel=c;refresh()};
const products=()=>{const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];return `<div class="sh"><h2>Products</h2></div><div class="chips">${cats.map(c=>`<button class="${c===catSel?'on':''}" onclick="setCat(this.dataset.c)" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="grid">${PRODUCTS.filter(p=>catSel==='All'||p.cat===catSel).map(card).join('')}</div>`};
const search=()=>`<div class="sh"><h2>Search</h2></div><input id="q" placeholder="Search products and services" oninput="doSearch(this.value)" autofocus><div id="sr" class="grid" style="margin-top:16px"></div>`;
function doSearch(v){v=v.trim().toLowerCase();const r=$('#sr');if(!v){r.innerHTML='';return}const a=PRODUCTS.filter(p=>(p.name+p.cat).toLowerCase().includes(v)).map(card).join(''),b=CFG.services.filter(s=>s.name.toLowerCase().includes(v)).map(svcCard).join('');r.innerHTML=a+b||'<p class="empty">No results found.</p>'}
const wishlist=()=>{const l=getWish().map(findP).filter(Boolean);return `<div class="sh"><h2>Wishlist</h2></div>${l.length?`<div class="grid">${l.map(card).join('')}</div>`:'<p class="empty">Your wishlist is empty.</p>'}`};
const cart=()=>{const items=Object.entries(getCart()).map(([id,q])=>({p:findP(id),q})).filter(x=>x.p);
if(!items.length)return `<div class="sh"><h2>Cart</h2></div><p class="empty">Your cart is empty.</p><a class="btn b" href="#products">Browse products</a>`;
return `<div class="sh"><h2>Cart</h2></div>${items.map(({p,q})=>`<div class="card li"><div class="th">${pic(img0(p),p.name)}</div><div class="fl"><h4>${esc(p.name)}</h4><b>${rs(p.price)}</b></div><div class="qty"><button onclick="setQty('${p.id}',-1)">${I('minus',16)}</button><span>${q}</span><button onclick="setQty('${p.id}',1)">${I('plus',16)}</button></div></div>`).join('')}
<div class="card form"><h3>Delivery address</h3><textarea id="ca" rows="3" placeholder="Full address with pincode"></textarea><div class="tot"><span>Total</span><b>${rs(cartTotal())}</b></div><button class="btn b w" onclick="placeOrder()">Place order</button></div>`};
async function placeOrder(){
  if(!requireLogin('#cart'))return;
  const a=$('#ca').value.trim();if(!a)return toast('Please enter your delivery address');
  const items=Object.entries(getCart()).map(([id,q])=>({name:findP(id).name,qty:q,price:findP(id).price})),id=newId('NC');
  try{await BE.db.collection('orders').doc(id).set({id,type:'Product',phone:ME.phone,name:ME.name,address:a,items,total:cartTotal(),status:'Placed',createdAt:ts()});
    BE.db.doc('users/'+ME.phone).set({addr:a},{merge:true});ls.set('cart',{});toast('Order placed successfully');go('orders')}catch(e){toast('Could not place order. Please try again.')}
}
