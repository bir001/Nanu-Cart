/* ACCOUNT, MY ORDERS, TRACK ORDER */
const STEPS=['Placed','Confirmed','Packed','Shipped','Delivered'];
const stepper=s=>{if(s==='Cancelled')return '<span class="st bad">Cancelled</span>';const n=STEPS.indexOf(s);return `<div class="sp">${STEPS.map((t,i)=>`<div class="${i<=n?'on':''}"><i>${i<=n?I('check',10):''}</i><span>${t}</span></div>`).join('')}</div>`};
const orderSummary=o=>`<div class="card od"><div class="oh"><div><small>${esc(o.type)} · ${fmt(o.createdAt)}</small><h4>${esc(o.id)}</h4></div><span class="st ${o.status==='Cancelled'?'bad':''}">${esc(o.status)}</span></div>${stepper(o.status)}
<div class="items">${(o.items||[]).map(i=>`<div class="it"><div class="th">${pic(i.img,i.name)}</div><div class="fl"><h4>${esc(i.name)}</h4><small>Qty ${i.qty}${i.price?' · '+rs(i.price):''}</small></div>${o.status==='Delivered'&&i.pid?`<button class="btn o sm" onclick="reviewSheet('${i.pid}')">Rate</button>`:(i.price?`<b>${rs(i.price*i.qty)}</b>`:'')}</div>`).join('')}</div>
${o.type==='Product'&&o.total!=null?priceRows({mrp:o.mrpTotal||o.total,save:o.savings||0,del:o.delivery||0,total:o.total}):''}
${o.address&&o.address!=='-'?`<div class="addr"><h5 class="eb">Delivering to</h5><b>${esc((o.addr&&o.addr.name)||o.name)}</b><p>${esc(o.address)}</p><p>${esc(o.contact||o.phone)}</p></div>`:''}</div>`;
const orders=()=>`<div class="sh"><h2>My Orders</h2></div><div id="ol"><p class="empty">Loading…</p></div>`;
function ordersInit(){listen(BE.db.collection('orders').where('phone','==',ME.phone).onSnapshot(s=>{const l=s.docs.map(d=>d.data()).sort((a,b)=>(b.createdAt?.seconds||9e9)-(a.createdAt?.seconds||9e9));
  $('#ol').innerHTML=l.length?l.map(orderSummary).join(''):'<p class="empty">You have no orders yet.</p><a class="btn b" href="#products">Start shopping</a>'},()=>{$('#ol').innerHTML='<p class="empty">Could not load orders.</p>'}))}
const track=id=>`<div class="sh"><h2>Track Order</h2></div><div class="card form"><input id="tid" placeholder="Enter Order ID (e.g. NC1A2B3)" value="${esc(id||'')}"><button class="btn b w" onclick="trackIt()">Track</button></div><div id="tr"></div>`;
const trackInit=id=>{if(id)trackIt()};
async function trackIt(){const id=$('#tid').value.trim().toUpperCase();if(!id)return toast('Enter your Order ID');
  try{const d=await BE.db.doc('orders/'+id).get();$('#tr').innerHTML=d.exists?orderSummary(d.data()):'<p class="empty">Order not found.</p>'}catch(e){$('#tr').innerHTML='<p class="empty">Order not found.</p>'}}
const account=()=>`<div class="sh"><h2>My Account</h2></div><div class="card prof"><div class="av">${esc((ME.name||'U')[0].toUpperCase())}</div><div><h3>${esc(ME.name||'Customer')}</h3><p class="mut" style="margin:0">+${CFG.cc} ${esc(ME.phone)}</p></div></div>
<div class="menu">${[['box','My Orders','#orders'],['pin','Track Order','#track'],['heart','Wishlist','#wishlist'],['chat','Messages','#chat'],['shield','Warranty Claim','#warranty']].map(([i,t,h])=>`<a href="${h}">${I(i,20)}${t}</a>`).join('')}<a onclick="pwSheet()">${I('lock',20)}Change password</a><a onclick="logout()">${I('logout',20)}Logout</a></div>
<h5 class="eb" style="margin-top:22px">Appearance</h5><div id="thm">${themePicker()}</div>`;
