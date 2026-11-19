/* CART + WISHLIST (saved in the browser) */
const getCart=()=>ls.get('cart',{}),getWish=()=>ls.get('wish',[]);
const findP=id=>PRODUCTS.find(p=>p.id===id),findS=id=>CFG.services.find(s=>s.id===id);
const go=h=>{location.hash='#'+h};
function addCart(id,n=1){const c=getCart();c[id]=(c[id]||0)+n;ls.set('cart',c);badges();toast('Added to cart')}
function buyNow(id){const c=getCart();c[id]=(c[id]||0)+(+$('#pq').textContent||1);ls.set('cart',c);go('cart')}
function setQty(id,d){const c=getCart();c[id]=(c[id]||0)+d;if(c[id]<=0)delete c[id];ls.set('cart',c);refresh()}
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];ls.set('wish',w);refresh()}
const cartTotal=()=>Object.entries(getCart()).reduce((s,[id,q])=>s+(findP(id)?.price||0)*q,0);
