/* ADMIN: Payment Settings (UPI ID + QR code) and UPI Payments list */
const qrPv=()=>{const u=$('#s-qr').value.trim();$('#s-pv').innerHTML=u?`<img src="${esc(u)}" alt="">`:''};
V.paysettings=el=>{el.innerHTML='<div class="card form" id="ps"><p class="mut">Loading…</p></div>';
  BE.db.doc('settings/payment').get().then(d=>{const s=d.exists?d.data():{};$('#ps').innerHTML=`<h3>Payment settings</h3>
  <label class="sw2"><input type="checkbox" id="s-cod" ${s.codEnabled===false?'':'checked'}> Cash on Delivery</label>
  <label class="sw2"><input type="checkbox" id="s-upi" ${s.upiEnabled?'checked':''}> UPI payments</label>
  <input id="s-id" placeholder="Your UPI ID (e.g. name@bank)" value="${esc(s.upiId)}"><input id="s-nm" placeholder="Payee / business name" value="${esc(s.payeeName)}">
  <input id="s-qr" placeholder="QR code image link" value="${esc(s.qrUrl)}" oninput="qrPv()"><div id="s-pv" class="pvs">${s.qrUrl?`<img src="${esc(s.qrUrl)}" alt="">`:''}</div>
  <textarea id="s-nt" rows="2" placeholder="Note shown to customers (optional)">${esc(s.note)}</textarea><button class="btn b w" onclick="saveSettings()">Save settings</button>`}).catch(banner)};
function saveSettings(){const g=s=>$(s).value.trim(),d={codEnabled:$('#s-cod').checked,upiEnabled:$('#s-upi').checked,upiId:g('#s-id'),payeeName:g('#s-nm'),qrUrl:g('#s-qr'),note:g('#s-nt'),updatedAt:ts()};
  if(d.upiEnabled&&!/^[\w.\-]{2,}@[\w]{2,}$/.test(d.upiId))return toast('Enter a valid UPI ID (like name@bank) to enable UPI');
  if(!d.codEnabled&&!d.upiEnabled)return toast('Keep at least one payment method on');
  BE.db.doc('settings/payment').set(d,{merge:true}).then(()=>toast('Payment settings saved')).catch(e=>toast('Save failed: '+(e.code||'')))}
const upiSt=o=>o.payStatus==='Paid'?'Paid':o.payStatus==='Failed'?'Failed':o.payClaim?'Verifying':'Pending';let UALL=[];
V.upi=el=>{let f='All';
  const draw=()=>{const l=UALL.filter(o=>f==='All'||upiSt(o)===f);
    $('#uc').innerHTML=['All','Pending','Verifying','Paid','Failed'].map(s=>`<button class="${s===f?'on':''}" onclick="UF('${s}')">${s} <em>${s==='All'?UALL.length:UALL.filter(o=>upiSt(o)===s).length}</em></button>`).join('');
    $('#ul').innerHTML=l.map(o=>`<div class="card acard"><div class="row2"><div><h4>${esc(o.id)}</h4><p>${esc(o.name)} · ${esc(o.contact||o.phone)} · ${fmt(o.createdAt)}</p></div><b>${rs(o.total)}</b></div>
    <p>Payment: <span class="pill ${upiSt(o)==='Paid'?'':'no'}">${upiSt(o)}</span>${o.utr?` · UTR: <b>${esc(o.utr)}</b>`:''}</p>
    <div class="acts"><button onclick="markPay('${o.id}','Paid')">Mark paid</button><button class="dng" onclick="markPay('${o.id}','Failed')">Mark failed</button><a href="tel:${esc(o.contact||o.phone)}">Call</a><a href="https://wa.me/${CFG.cc}${esc(o.contact||o.phone)}" target="_blank" rel="noopener">WhatsApp</a></div></div>`).join('')||'<p class="empty">No UPI payments yet.</p>'};
  el.innerHTML='<div class="chips" id="uc"></div><div id="ul"></div>';window.UF=s=>{f=s;draw()};
  AUN.push(BE.db.collection('orders').where('payMethod','==','UPI').onSnapshot(s=>{UALL=s.docs.map(d=>d.data()).sort((a,b)=>(b.createdAt?.seconds||9e9)-(a.createdAt?.seconds||9e9));draw()}))};
function markPay(id,v){const o=UALL.find(x=>x.id===id),u={payStatus:v,updatedAt:ts()};if(v==='Paid'){u.paidAt=ts();if(o&&o.status==='Placed')u.status='Confirmed'}
  BE.db.doc('orders/'+id).update(u).then(()=>toast('Marked '+v.toLowerCase())).catch(()=>toast('Update failed'))}
