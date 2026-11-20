/* CHECKOUT (address + order summary), ORDER PLACED page */
let atype='Home';
const setType=t=>{atype=t;document.querySelectorAll('#k-t button').forEach(b=>b.classList.toggle('on',b.dataset.t===t))};
const checkout=()=>{const l=cartLines();if(!l.length)return '<div class="sh"><h2>Checkout</h2></div><p class="empty">Your cart is empty.</p><a class="btn b" href="#products">Browse products</a>';
  const t=totals(),a=ME.addr||{};atype=a.type||'Home';
  return `<div class="sh"><h2>Checkout</h2></div>
  <div class="card form"><h3>${I('pin',18)} Delivery address</h3>
  <input id="k-n" placeholder="Full name" value="${esc(a.name||ME.name)}" autocomplete="name"><input id="k-p" inputmode="numeric" maxlength="10" placeholder="Mobile number" value="${esc(a.phone||ME.phone)}">
  <div class="two"><input id="k-pin" inputmode="numeric" maxlength="6" placeholder="Pincode" value="${esc(a.pin)}"><input id="k-city" placeholder="City" value="${esc(a.city)}"></div>
  <input id="k-state" placeholder="State" value="${esc(a.state)}"><input id="k-l1" placeholder="House / Flat / Building no." value="${esc(a.l1)}"><input id="k-l2" placeholder="Street / Area / Locality" value="${esc(a.l2)}"><input id="k-lm" placeholder="Landmark (optional)" value="${esc(a.lm)}">
  <div class="chips w" id="k-t">${['Home','Work','Other'].map(x=>`<button data-t="${x}" class="${x===atype?'on':''}" onclick="setType('${x}')">${x}</button>`).join('')}</div></div>
  <div class="card sum"><h3>Order summary</h3><div class="items">${l.map(({p,q})=>`<div class="it"><div class="th">${pic(img0(p),p.name)}</div><div class="fl"><h4>${esc(p.name)}</h4><small>Qty ${q} · ${rs(p.price)}</small></div><b>${rs(p.price*q)}</b></div>`).join('')}</div>${priceRows(t)}</div>
  <p class="mut small">Our team will contact you to confirm your order and payment.</p>
  <button class="btn b w" id="k-btn" onclick="placeOrder()">Place order · ${rs(t.total)}</button>`};
async function placeOrder(){
  const g=s=>$(s).value.trim(),a={name:g('#k-n'),phone:g('#k-p'),pin:g('#k-pin'),city:g('#k-city'),state:g('#k-state'),l1:g('#k-l1'),l2:g('#k-l2'),lm:g('#k-lm'),type:atype};
  if(!a.name)return toast('Enter your full name');if(!isPhone(a.phone))return toast('Enter a valid 10-digit mobile number');
  if(!/^\d{6}$/.test(a.pin))return toast('Enter a valid 6-digit pincode');if(!a.city)return toast('Enter your city');if(!a.l1)return toast('Enter your house or flat number');
  const l=cartLines();if(!l.length)return;const t=totals(),id=newId('NC'),b=$('#k-btn');b.disabled=true;b.textContent='Placing order…';
  const text=[a.l1,a.l2,a.lm&&'Landmark: '+a.lm,a.city+(a.state?', '+a.state:'')+' - '+a.pin].filter(Boolean).join(', ');
  try{await BE.db.collection('orders').doc(id).set({id,type:'Product',phone:ME.phone,name:a.name,contact:a.phone,address:text,addr:a,items:l.map(({p,q})=>({pid:p.id,name:p.name,qty:q,price:p.price,mrp:p.mrp||p.price,img:img0(p)})),subtotal:t.sub,mrpTotal:t.mrp,savings:t.save,delivery:t.del,total:t.total,payment:'To be confirmed',status:'Placed',createdAt:ts()});
    BE.db.doc('users/'+ME.phone).set({addr:a},{merge:true}).catch(()=>{});ME.addr=a;ls.set('cart',{});go('success/'+id)}
  catch(e){b.disabled=false;b.textContent='Place order · '+rs(t.total);toast('Order failed: '+(e.code||e.message))}}
const success=id=>`<div class="okbox"><div class="tick">${I('check',34)}</div><h2>Order placed!</h2><p class="mut" style="margin:6px 0 0">Thank you. Your Order ID is <b>${esc(id)}</b></p></div><div id="so"></div><div class="row2b"><a class="btn b" href="#track/${esc(id)}">Track order</a><a class="btn o" href="#products">Keep shopping</a></div><a class="btn o w" href="#chat" style="margin-top:0">${I('chat',18)} Chat with us</a>`;
const successInit=id=>listen(BE.db.doc('orders/'+id).onSnapshot(d=>{if(d.exists)$('#so').innerHTML=orderSummary(d.data())},()=>{}));
