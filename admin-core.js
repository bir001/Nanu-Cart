/* ADMIN CORE: login, sidebar, view switching */
const V={};let AUN=[],CUR='orders';
const ANAV=[['orders','box','Orders'],['products','grid','Products'],['addp','plus','Add Product'],['customers','users','Customers (Leads)'],['chats','chat','Chats'],['reviews','heart','Reviews'],['resets','lock','Password Requests']];
const TTL=Object.fromEntries(ANAV.map(a=>[a[0],a[2]]));
function openView(k){AUN.forEach(f=>f());AUN=[];CUR=k;$('#ttl').textContent=TTL[k]||'';$('#view').innerHTML='';V[k]($('#view'));
  document.querySelectorAll('#drawer a[data-k]').forEach(a=>a.classList.toggle('on',a.dataset.k===k));closeAll()}
function shell(on){['#drawer','.top','#view'].forEach(s=>$(s).style.display=on?'':'none');$('#alogin').style.display=on?'none':'block'}
function aLogin(){BE.auth.signInWithEmailAndPassword($('#ae').value.trim(),$('#aw').value).catch(()=>toast('Login failed. Check email and password.'))}
$('#amb').innerHTML=I('menu');
$('#drawer').innerHTML=`<div class="dh"><div class="abrand"><img src="${CFG.img.logo}" alt="">Admin</div><button class="ib" onclick="closeAll()">${I('x')}</button></div>${ANAV.map(([k,i,t])=>`<a data-k="${k}" onclick="openView('${k}')">${I(i,20)}${t}</a>`).join('')}<a class="alogout" onclick="BE.auth.signOut()">${I('logout',20)}Logout</a><a href="index.html">${I('home',20)}View website</a>`;
V.resets=el=>{el.innerHTML=`<div class="note"><b>How to reset a customer's password</b><br>1. Open Firebase Console, then Authentication, then Users.<br>2. Find <b>mobilenumber@nanucart.user</b> and delete that user.<br>3. Ask the customer to sign up again with the same mobile number. Their orders and chats are kept.</div><div id="rl"></div>`;
  AUN.push(BE.db.collection('resets').orderBy('ts','desc').onSnapshot(s=>{$('#rl').innerHTML=s.docs.map(d=>{const r=d.data();return `<div class="card acard"><div class="row2"><div><h4>${esc(r.phone)}</h4><p>${fmt(r.ts)}</p></div><span class="pill ${r.done?'':'no'}">${r.done?'Done':'Pending'}</span></div><div class="acts"><a href="https://wa.me/${CFG.cc}${esc(r.phone)}" target="_blank" rel="noopener">WhatsApp</a><a href="tel:${esc(r.phone)}">Call</a><button onclick="BE.db.doc('resets/${d.id}').update({done:${!r.done}})">${r.done?'Reopen':'Mark done'}</button><button class="dng" onclick="BE.db.doc('resets/${d.id}').delete()">Delete</button></div></div>`}).join('')||'<p class="empty">No password requests.</p>'}))};
if(!BE.ready){shell(false);$('#alogin').innerHTML='<h3>Not connected</h3><p class="mut">Add your Firebase details in config.js first.</p>'}
else BE.auth.onAuthStateChanged(u=>{if(u&&u.email===CFG.adminEmail){shell(true);openView(CUR)}else{if(u)BE.auth.signOut();shell(false)}});
