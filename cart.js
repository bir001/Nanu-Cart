/* CART + WISHLIST + ORDERS storage (browser me save hota hai) */
const getCart=()=>ls.get('cart',{}), getWish=()=>ls.get('wish',[]), getOrders=()=>ls.get('orders',[]);
const findP=id=>CFG.products.find(p=>p.id===id), findS=id=>CFG.services.find(s=>s.id===id);
function addCart(id){const c=getCart();c[id]=(c[id]||0)+1;ls.set('cart',c);badges();toast('Cart me add ho gaya')}
function setQty(id,d){const c=getCart();c[id]=(c[id]||0)+d;if(c[id]<=0)delete c[id];ls.set('cart',c);refresh()}
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];ls.set('wish',w);refresh()}
function saveOrder(o){ls.set('orders',[o,...getOrders()])}
function cartTotal(){return Object.entries(getCart()).reduce((s,[id,q])=>s+(findP(id)?.price||0)*q,0)}
