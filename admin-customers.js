/* ADMIN: customers (leads) */
V.customers=el=>{let all=[];const draw=()=>{const q=($('#cq').value||'').toLowerCase();
  $('#cl').innerHTML=all.filter(u=>(u.name+u.phone).toLowerCase().includes(q)).map(u=>`<div class="card acard"><div class="row2"><div><h4>${esc(u.name)}</h4><p>${esc(u.phone)} · Joined ${fmt(u.createdAt)}</p>${u.addr?`<p>${esc(u.addr)}</p>`:''}</div></div><div class="acts"><a href="tel:${esc(u.phone)}">Call</a><a href="https://wa.me/${CFG.cc}${esc(u.phone)}" target="_blank" rel="noopener">WhatsApp</a><button onclick="openChat('${esc(u.phone)}')">Chat</button></div></div>`).join('')||'<p class="empty">No customers found.</p>'};
  el.innerHTML='<input id="cq" placeholder="Search by name or mobile" oninput="window.CD()"><div id="cl"></div>';window.CD=draw;
  AUN.push(BE.db.collection('users').onSnapshot(s=>{all=s.docs.map(d=>d.data()).sort((a,b)=>(b.createdAt?.seconds||9e9)-(a.createdAt?.seconds||9e9));draw()}))};
