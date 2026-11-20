/* ADMIN: customer reviews (delete inappropriate ones) */
V.reviews=el=>{el.innerHTML='<div id="rl2"></div>';
  AUN.push(BE.db.collection('reviews').onSnapshot(s=>{const l=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||9e9)-(a.createdAt?.seconds||9e9));
    $('#rl2').innerHTML=l.map(r=>`<div class="card acard"><div class="row2"><div><h4>${esc(r.pname||r.pid)}</h4><p>${esc(r.name)} · ${esc(r.phone)} · ${fmt(r.createdAt)}</p></div><b>${'★'.repeat(r.rating)}</b></div>${r.text?`<p style="color:var(--ink)">${esc(r.text)}</p>`:''}<div class="acts"><button class="dng" onclick="if(confirm('Delete this review?'))BE.db.doc('reviews/${r.id}').delete()">Delete</button></div></div>`).join('')||'<p class="empty">No reviews yet.</p>'}))};
