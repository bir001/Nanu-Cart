/* PAYMENTS (customer side): Cash on Delivery / UPI. Settings come from the admin panel. */
let PAY={codEnabled:true,upiEnabled:false},paySel='COD';
if(BE.ready)BE.db.doc('settings/payment').onSnapshot(d=>{PAY={codEnabled:true,upiEnabled:false,...(d.exists?d.data():{})};const b=$('#paybox');if(b)b.innerHTML=payBox()},()=>{});
const upiOn=()=>!!(PAY.upiEnabled&&PAY.upiId);
const payBtn=()=>(paySel==='UPI'?'Place order & pay · ':'Place order · ')+rs(totals().total);
const payBox=()=>{const o=[];if(PAY.codEnabled!==false)o.push(['COD','Cash on Delivery','Pay when your order arrives']);if(upiOn())o.push(['UPI','Pay with UPI','Scan the QR code or pay to our UPI ID']);if(!o.length)o.push(['COD','Cash on Delivery','Pay when your order arrives']);if(!o.find(x=>x[0]===paySel))paySel=o[0][0];
  return `<div class="card form"><h3>${I('bag',18)} Payment method</h3>${o.map(([k,t,s])=>`<label class="payopt ${k===paySel?'on':''}" onclick="setPay('${k}')"><i></i><div><b>${t}</b><small>${s}</small></div></label>`).join('')}</div>`};
const setPay=k=>{paySel=k;$('#paybox').innerHTML=payBox();const b=$('#k-btn');if(b)b.textContent=payBtn()};
const payLabel=o=>o.payMethod==='COD'?'Cash on Delivery':'UPI · '+(o.payStatus==='Paid'?'Paid':o.payStatus==='Failed'?'Failed':o.payClaim?'Verifying':'Pending');
const payPanel=o=>{const link=`upi://pay?pa=${encodeURIComponent(PAY.upiId||'')}&pn=${encodeURIComponent(PAY.payeeName||'Nanu Cart')}&am=${o.total}&cu=INR&tn=${encodeURIComponent(o.id)}`;
  return `<div class="card pay"><h3>${I('lock',18)} Complete your UPI payment</h3><p class="mut" style="margin:4px 0 0">Pay <b>${rs(o.total)}</b> for order ${esc(o.id)}</p>${PAY.qrUrl?`<div class="qr"><img src="${esc(PAY.qrUrl)}" alt="UPI QR code"></div>`:''}
  <div class="upid"><div><span>UPI ID</span><b>${esc(PAY.upiId)}</b></div><button class="btn o sm" onclick="copyUpi()">Copy</button></div>
  <a class="btn b w" href="${esc(link)}">Pay with UPI app</a>${PAY.note?`<p class="mut small" style="margin-top:12px">${esc(PAY.note)}</p>`:''}
  <h5 class="eb">After paying</h5><input id="utr" placeholder="UPI transaction / UTR number" value="${esc(o.utr)}"><button class="btn o w" onclick="sendUtr('${o.id}')">I have paid</button>${o.payClaim?'<p class="mut small" style="margin-top:12px">Payment details sent. We will verify it shortly.</p>':''}</div>`};
const payNow=id=>{const o=ORD[id];if(o)sheet(payPanel(o))};
function copyUpi(){const t=PAY.upiId||'';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('UPI ID copied')).catch(()=>toast('UPI ID: '+t))}
function sendUtr(id){const u=$('#utr').value.trim();if(u.length<6)return toast('Enter your UPI transaction number');
  BE.db.doc('orders/'+id).update({utr:u,payClaim:true}).then(()=>{closeAll();toast('Payment details sent. We will verify it shortly.')}).catch(e=>toast('Failed: '+(e.code||'error')))}
