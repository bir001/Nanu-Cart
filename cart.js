/* CART, WISHLIST, RECENTLY VIEWED, TOTALS (saved in the browser) */
const getCart=()=>ls.get('cart',{}),getWish=()=>ls.get('wish',[]),viewed=()=>ls.get('viewed',[]);
const findP=id=>PRODUCTS.find(p=>p.id===id),findS=id=>CFG.services.find(s=>s.id===id);
const go=h=>{location.hash='#'+h};
const markViewed=id=>ls.set('viewed',[id,...viewed().filter(x=>x!==id)].slice(0,12));
function addCart(id,n=1){const c=getCart();c[id]=(c[id]||0)+n;ls.set('cart',c);badges();toast('Added to cart')}
function buyNow(id){const c=getCart();c[id]=(c[id]||0)+(+$('#pq').textContent||1);ls.set('cart',c);go('cart')}
function setQty(id,d){const c=getCart();c[id]=(c[id]||0)+d;if(c[id]<=0)delete c[id];ls.set('cart',c);refresh()}
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];ls.set('wish',w);refresh()}
const cartLines=()=>Object.entries(getCart()).map(([id,q])=>({p:findP(id),q})).filter(x=>x.p);
function totals(){const l=cartLines(),sub=l.reduce((s,x)=>s+x.p.price*x.q,0),mrp=l.reduce((s,x)=>s+Math.max(x.p.mrp||0,x.p.price)*x.q,0),del=(!CFG.deliveryFee||(CFG.freeShipAbove&&sub>=CFG.freeShipAbove))?0:CFG.deliveryFee;return{sub,mrp,save:mrp-sub,del,total:sub+del,n:l.reduce((s,x)=>s+x.q,0)}}
const priceRows=t=>`<div class="ln"><span>Price</span><b>${rs(t.mrp)}</b></div>${t.save>0?`<div class="ln ok"><span>Discount</span><b>− ${rs(t.save)}</b></div>`:''}<div class="ln"><span>Delivery</span><b>${t.del?rs(t.del):'Free'}</b></div><div class="ln tt"><span>Total</span><b>${rs(t.total)}</b></div>`;
