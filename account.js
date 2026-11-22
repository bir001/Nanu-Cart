/* ACCOUNT, MY ORDERS, TRACK ORDER */
const STEPS=['Placed','Confirmed','Packed','Shipped','Delivered'];
const stepper=s=>{if(s==='Cancelled')return '<span class="st bad">Cancelled</span>';const n=STEPS.indexOf(s);return `<div class="sp">${STEPS.map((t,i)=>`<div class="${i<=n?'on':''}"><i>${i<=n?I('check',10):''}</i><span>${t}</span></div>`).join('')}</div>`};
const ORD={};
/* Full order details (used inside the expandable order card, on Track Order and on the order-placed page) */
const invBtn=o=>o.status==='Delivered'?`<button class="btn b w sm" onclick="invoiceDl('${o.id}')">${I('download',16)} Download invoice (PDF)</button>`:`<button class="btn o w sm" disabled>${I('lock',16)} Download invoice</button><p class="invnote">${o.status==='Cancelled'?'Invoice is not available for a cancelled order.':'Your invoice unlocks here once the order is delivered.'}</p>`;
const orderBody=o=>`${stepper(o.status)}
<div class="items">${(o.items||[]).map(i=>`<div class="it"><div class="th">${pic(i.img,i.name)}</div><div class="fl"><h4>${esc(i.name)}</h4><small>Qty ${i.qty}${i.price?' · '+rs(i.price):''}</small></div>${o.status==='Delivered'&&i.pid?`<button class="btn o sm" onclick="reviewSheet('${i.pid}')">Rate</button>`:(i.price?`<b>${rs(i.price*i.qty)}</b>`:'')}</div>`).join('')}</div>
${o.type==='Product'&&o.total!=null?priceRows({mrp:o.mrpTotal||o.total,save:o.savings||0,del:o.delivery||0,total:o.total}):''}
${o.payMethod?`<div class="ln"><span>Payment</span><b>${payLabel(o)}</b></div>`:''}${o.payMethod==='UPI'&&o.payStatus!=='Paid'&&o.status!=='Cancelled'?`<button class="btn b w sm" onclick="payNow('${o.id}')">Pay now</button>`:''}${o.address&&o.address!=='-'?`<div class="addr"><h5 class="eb">Delivering to</h5><b>${esc((o.addr&&o.addr.name)||o.name)}</b><p>${esc(o.address)}</p><p>${esc(o.contact||o.phone)}</p></div>`:''}
<div class="invbox">${invBtn(o)}</div>`;
const stc=s=>s==='Cancelled'?'bad':s==='Delivered'?'ok':'';
const orderSummary=o=>(ORD[o.id]=o,`<div class="card od"><div class="oh"><div><small>${esc(o.type)} · ${fmt(o.createdAt)}</small><h4>${esc(o.id)}</h4></div><span class="st ${stc(o.status)}">${esc(o.status)}</span></div>${orderBody(o)}</div>`);
/* MY ORDERS: compact cards that expand on tap, with search, status + date filters and sorting */
const ODATE=o=>o.createdAt&&o.createdAt.toDate?o.createdAt.toDate():new Date();
const oshort=d=>d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const omonth=d=>d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
const OF0={q:'',st:'all',tm:'all',so:'new'};
let OL=[],OF={...OF0},OPEN=new Set();
const STF={all:'All',act:'Active',done:'Delivered',can:'Cancelled'},TMF={all:'All time',w:'Last 7 days',m:'Last month',q:'3 months',y:'This year'},SORTO={new:'Newest first',old:'Oldest first',hi:'Amount: high to low',lo:'Amount: low to high'};
function ofilter(){const now=Date.now(),D=864e5,lim={w:7*D,m:30*D,q:90*D},q=OF.q.trim().toLowerCase(),yr=new Date().getFullYear();
  const l=OL.filter(o=>{const s=o.status,d=ODATE(o).getTime();
    if(OF.st==='act'&&(s==='Delivered'||s==='Cancelled'))return false;if(OF.st==='done'&&s!=='Delivered')return false;if(OF.st==='can'&&s!=='Cancelled')return false;
    if(lim[OF.tm]&&now-d>lim[OF.tm])return false;if(OF.tm==='y'&&new Date(d).getFullYear()!==yr)return false;
    if(q){const hay=(o.id+' '+o.type+' '+s+' '+(o.items||[]).map(i=>i.name).join(' ')).toLowerCase();return q.split(/\s+/).every(t=>hay.includes(t))}return true});
  const dv=o=>ODATE(o).getTime();
  return l.sort(OF.so==='old'?(a,b)=>dv(a)-dv(b):OF.so==='hi'?(a,b)=>(b.total||0)-(a.total||0):OF.so==='lo'?(a,b)=>(a.total||0)-(b.total||0):(a,b)=>dv(b)-dv(a))}
const orderRow=o=>{ORD[o.id]=o;const it=o.items||[],n=it.reduce((a,i)=>a+(+i.qty||1),0),f=it[0]||{},open=OPEN.has(o.id);
  return `<div class="card oc ${open?'open':''}" id="oc-${esc(o.id)}"><button class="och" onclick="toggleOrder('${o.id}')" aria-expanded="${open}"><div class="th">${pic(f.img,f.name||o.type)}</div><div class="fl"><div class="ocr"><b>${esc(o.id)}</b><span class="st ${stc(o.status)}">${esc(o.status)}</span></div><p>${esc(f.name||o.type)}${it.length>1?` <em>+${it.length-1} more</em>`:''}</p><small>${oshort(ODATE(o))} · ${n} item${n>1?'s':''}${o.total!=null?` · <b>${rs(o.total)}</b>`:''}${o.status==='Delivered'?`<span class="invp">${I('file',12)} Invoice ready</span>`:''}</small></div><i class="chev">${I('chev',18)}</i></button><div class="ocb"><div class="ocin">${open?orderBody(o):''}</div></div></div>`};
function toggleOrder(id){const c=document.getElementById('oc-'+id);if(!c)return;const open=c.classList.toggle('open'),i=c.querySelector('.ocin');open?OPEN.add(id):OPEN.delete(id);if(open&&!i.innerHTML.trim())i.innerHTML=orderBody(ORD[id]);c.querySelector('.och').setAttribute('aria-expanded',open)}
function drawOrders(){const el=$('#olist');if(!el)return;const l=ofilter(),c=$('#ocount');
  if(c)c.textContent=OL.length?(l.length===OL.length?`${OL.length} order${OL.length>1?'s':''}`:`${l.length} of ${OL.length} orders`):'';
  if(!OL.length){el.innerHTML=emptyState('cart','No orders yet','When you place an order it will show up here, so you can track it and download its invoice.','<a class="btn b" href="#products">Start shopping</a>');return}
  if(!l.length){el.innerHTML=emptyState('search','No orders match','Try a different word or clear the filters.','<button class="btn o sm" onclick="resetOF()">Clear filters</button>');return}
  let last='';el.innerHTML=l.map(o=>{const g=omonth(ODATE(o)),h=(OF.so==='new'||OF.so==='old')&&g!==last?(last=g,`<h5 class="eb mh">${g}</h5>`):'';return h+orderRow(o)}).join('')}
function setOF(k,v){OF[k]=v;if(k!=='q'||v===''){document.querySelectorAll(`#ofil [data-g="${k}"] button`).forEach(b=>b.classList.toggle('on',b.dataset.k===v))}const x=$('#oqx');x&&x.classList.toggle('on',!!OF.q);drawOrders()}
function resetOF(){OF={...OF0};const q=$('#oq');if(q)q.value='';['st','tm'].forEach(g=>document.querySelectorAll(`#ofil [data-g="${g}"] button`).forEach(b=>b.classList.toggle('on',b.dataset.k==='all')));const s=$('#oso');if(s)s.value='new';const x=$('#oqx');x&&x.classList.remove('on');drawOrders()}
const orders=()=>{OF={...OF0};const chips=(g,m)=>`<div class="chips" data-g="${g}">${Object.entries(m).map(([k,v])=>`<button data-k="${k}" class="${OF[g]===k?'on':''}" onclick="setOF('${g}','${k}')">${v}</button>`).join('')}</div>`;
  return `<div class="sh"><h2>My Orders</h2><span class="sub" id="ocount"></span></div><div class="ofil" id="ofil"><div class="sbox">${I('search',18)}<input id="oq" type="search" enterkeyhint="search" autocomplete="off" placeholder="Search by order ID or product" oninput="setOF('q',this.value)"><button class="sclr" id="oqx" onclick="$('#oq').value='';setOF('q','')" aria-label="Clear">${I('x',16)}</button></div>${chips('tm',TMF)}${chips('st',STF)}<div class="osort"><span>Sort by</span><select id="oso" onchange="setOF('so',this.value)">${Object.entries(SORTO).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div></div><div id="olist"><p class="empty">Loading…</p></div>`};
function ordersInit(){listen(BE.db.collection('orders').where('phone','==',ME.phone).onSnapshot(s=>{OL=s.docs.map(d=>d.data());drawOrders()},()=>{$('#olist').innerHTML='<p class="empty">Could not load orders.</p>'}))}
const track=id=>`<div class="sh"><h2>Track Order</h2></div><div class="card form"><input id="tid" placeholder="Enter Order ID (e.g. NC1A2B3)" value="${esc(id||'')}"><button class="btn b w" onclick="trackIt()">Track</button></div><div id="tr"></div>`;
const trackInit=id=>{if(id)trackIt()};
async function trackIt(){const id=$('#tid').value.trim().toUpperCase();if(!id)return toast('Enter your Order ID');
  try{const d=await BE.db.doc('orders/'+id).get();$('#tr').innerHTML=d.exists?orderSummary(d.data()):'<p class="empty">Order not found.</p>'}catch(e){$('#tr').innerHTML='<p class="empty">Order not found.</p>'}}
const account=()=>`<div class="sh"><h2>My Account</h2></div><div class="card prof"><div class="av">${esc((ME.name||'U')[0].toUpperCase())}</div><div><h3>${esc(ME.name||'Customer')}</h3><p class="mut" style="margin:0">+${CFG.cc} ${esc(ME.phone)}</p></div></div>
<div class="menu">${[['box','My Orders','#orders'],['pin','Track Order','#track'],['heart','Wishlist','#wishlist'],['chat','Messages','#chat'],['shield','Warranty Claim','#warranty']].map(([i,t,h])=>`<a href="${h}">${I(i,20)}${t}</a>`).join('')}<a onclick="pwSheet()">${I('lock',20)}Change password</a><a onclick="logout()">${I('logout',20)}Logout</a></div>
<h5 class="eb" style="margin-top:22px">Appearance</h5><div id="thm">${themePicker()}</div>`;
