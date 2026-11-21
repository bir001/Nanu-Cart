/* ADMIN: orders, order summary and status control */
const OST=['Placed','Confirmed','Packed','Shipped','Delivered','Cancelled'];
V.orders=el=>{let f='All',all=[],q='';
  const draw=()=>{const l=all.filter(o=>(f==='All'||o.status===f)&&(!q||(o.id+o.name+o.phone+(o.contact||'')).toLowerCase().includes(q)));
    $('#oc').innerHTML=['All',...OST].map(s=>`<button class="${s===f?'on':''}" onclick="OF('${s}')">${s} <em>${s==='All'?all.length:all.filter(o=>o.status===s).length}</em></button>`).join('');
    $('#ol').innerHTML=l.map(o=>`<div class="card acard"><div class="row2"><div><h4>${esc(o.id)} <span class="pill">${esc(o.type)}</span></h4><p>${fmt(o.createdAt)}</p></div><span class="pill ${o.status==='Cancelled'?'no':''}">${esc(o.status)}</span></div>
    <div class="items">${(o.items||[]).map(i=>`<div class="it"><div class="th">${pic(i.img,i.name)}</div><div class="fl"><h4>${esc(i.name)}</h4><p>Qty ${i.qty}${i.price?' × '+rs(i.price):''}</p></div>${i.price?`<b>${rs(i.price*i.qty)}</b>`:''}</div>`).join('')}</div>
    ${o.type==='Product'&&o.total!=null?`<div class="ln"><span>Delivery</span><b>${o.delivery?rs(o.delivery):'Free'}</b></div><div class="ln tt"><span>Order total</span><b>${rs(o.total)}</b></div>`:''}
    ${o.payMethod?`<div class="ln"><span>Payment</span><b>${o.payMethod==='COD'?'Cash on Delivery':'UPI · '+(o.payStatus||'Pending')}</b></div>`:''}<div class="addr"><h5 class="eb">Customer</h5><b>${esc((o.addr&&o.addr.name)||o.name)}</b> · ${esc(o.contact||o.phone)}<p>${esc(o.address)}</p>${o.date?`<p>Preferred date: ${esc(o.date)}</p>`:''}${o.note?`<p>Note: ${esc(o.note)}</p>`:''}</div>
    <h5 class="eb">Update status</h5><div class="chips w st">${OST.map(s=>`<button class="${s===o.status?'on':''}" onclick="setStatus('${o.id}','${s}')">${s}</button>`).join('')}</div>
    <div class="acts"><a href="tel:${esc(o.contact||o.phone)}">Call</a><a href="https://wa.me/${CFG.cc}${esc(o.contact||o.phone)}" target="_blank" rel="noopener">WhatsApp</a><button onclick="openChat('${esc(o.phone)}')">Chat</button></div></div>`).join('')||'<p class="empty">No orders found.</p>'};
  el.innerHTML='<input id="oq" placeholder="Search by order ID, name or mobile" oninput="window.OQ(this.value)"><div class="chips" id="oc"></div><div id="ol"></div>';
  window.OF=s=>{f=s;draw()};window.OQ=v=>{q=v.trim().toLowerCase();draw()};
  AUN.push(BE.db.collection('orders').orderBy('createdAt','desc').onSnapshot(s=>{all=s.docs.map(d=>d.data());draw()},e=>{$('#ol').innerHTML='<p class="empty">Could not load orders. Check Firestore rules.</p>'}))};
const setStatus=(id,v)=>BE.db.doc('orders/'+id).update({status:v,updatedAt:ts()}).then(()=>toast('Status updated: '+v)).catch(()=>toast('Update failed'));
