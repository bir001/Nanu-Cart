/* ADMIN: orders management */
const OST=['Placed','Confirmed','Packed','Shipped','Delivered','Cancelled'];
V.orders=el=>{let f='All',all=[];
  const draw=()=>{const l=all.filter(o=>f==='All'||o.status===f);
    $('#ol').innerHTML=l.map(o=>`<div class="card acard"><div class="row2"><div><h4>${esc(o.id)} · ${esc(o.type)}</h4><p>${fmt(o.createdAt)}</p></div><b>${o.total?rs(o.total):''}</b></div>
    <p><b>${esc(o.name)}</b> · ${esc(o.phone)}</p><p>${(o.items||[]).map(i=>esc(i.name)+' × '+i.qty).join(', ')}</p><p>${esc(o.address)}</p>${o.date?`<p>Preferred date: ${esc(o.date)}</p>`:''}${o.note?`<p>Note: ${esc(o.note)}</p>`:''}
    <div class="acts"><select onchange="setStatus('${o.id}',this.value)">${OST.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select><a href="tel:${esc(o.phone)}">Call</a><a href="https://wa.me/${CFG.cc}${esc(o.phone)}" target="_blank" rel="noopener">WhatsApp</a></div></div>`).join('')||'<p class="empty">No orders.</p>'};
  el.innerHTML=`<div class="chips">${['All',...OST].map(s=>`<button class="${s==='All'?'on':''}" onclick="document.querySelectorAll('.chips button').forEach(b=>b.classList.remove('on'));this.classList.add('on');window.OF('${s}')">${s}</button>`).join('')}</div><div id="ol"></div>`;
  window.OF=s=>{f=s;draw()};
  AUN.push(BE.db.collection('orders').orderBy('createdAt','desc').onSnapshot(s=>{all=s.docs.map(d=>d.data());draw()},e=>{$('#ol').innerHTML='<p class="empty">Could not load orders. Check Firestore rules.</p>'}))};
const setStatus=(id,v)=>BE.db.doc('orders/'+id).update({status:v,updatedAt:ts()}).then(()=>toast('Status updated')).catch(()=>toast('Update failed'));
