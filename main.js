/* ROUTER, NAV, DRAWER, BADGES, CART BAR */
const pages={home,services,products,search,cart,wishlist,orders,track,account,chat,login,product,warranty,info,checkout,success};
const guarded=['orders','track','account','chat','checkout','success'],inits={home:homeInit,products:productsInit,orders:ordersInit,chat:chatInit,track:trackInit,success:successInit};
const nav=[['home','Home','home'],['products','Products','grid'],['search','','search'],['services','Services','tool'],['account','Account','user']];
let AUTH_READY=!BE.ready,UN=[],CURR='home';
const listen=u=>UN.push(u);
$('#mb').innerHTML=I('menu');$('#wb').innerHTML=I('heart');$('#cb').innerHTML=I('bag');
$('.logo img').src=CFG.img.logo;
$('#nav').innerHTML=nav.map(([h,t,i])=>`<a href="#${h}" data-h="${h}" class="${h==='search'?'fab':''}" aria-label="${t||'Search'}">${I(i,h==='search'?24:22)}<span>${t}</span></a>`).join('');
function buildDrawer(){const dl=[['Shop',[['home','Home','#home'],['grid','Products','#products'],['tool','Services','#services'],['heart','Wishlist','#wishlist'],['bag','Cart','#cart']]],['Orders',[['box','My Orders','#orders'],['pin','Track Order','#track'],['shield','Warranty Claim','#warranty']]],['Support',[['chat','Chat with us','#chat']]]];
  $('#drawer').innerHTML=`<div class="dh"><a class="logo" href="#home" onclick="closeAll()"><i class="wm">nanu<span>cart</span></i></a><button class="ib" onclick="closeAll()" aria-label="Close">${I('x')}</button></div>
  ${ME?`<a class="dme" href="#account" onclick="closeAll()"><div class="av">${esc((ME.name||'U')[0].toUpperCase())}</div><div><b>${esc(ME.name||'My account')}</b><small>+${CFG.cc} ${esc(ME.phone)}</small></div></a>`:`<a class="dme" href="#login" onclick="closeAll()">${I('user',20)}<b>Login / Sign up</b></a>`}
  ${dl.map(([g,l])=>`<h5>${g}</h5>${l.map(([i,t,h])=>`<a href="${h}" onclick="closeAll()">${I(i,20)}${t}</a>`).join('')}`).join('')}<h5>Account</h5>${ME?`<a href="#account" onclick="closeAll()">${I('user',20)}My Account</a><a onclick="closeAll();logout()">${I('logout',20)}Logout</a>`:''}<a onclick="closeAll();wa('Hello Nanu Cart, I need help')">${I('phone',20)}WhatsApp support</a><h5>Appearance</h5>${themePicker()}`}
function cartBar(k){const t=totals(),e=$('#cbar'),show=t.n&&!['cart','checkout','success','product','chat','login','warranty'].includes(k);e.innerHTML=show?`<a href="#cart"><span>${I('bag',18)} ${t.n} item${t.n>1?'s':''} · <b>${rs(t.total)}</b></span><em>View cart ${I('arrow',16)}</em></a>`:''}
function badges(){const c=Object.values(getCart()).reduce((a,b)=>a+b,0),w=getWish().length;[['#cb',c],['#wb',w]].forEach(([s,n])=>{const e=$(s);e.querySelector('.bd')?.remove();if(n)e.insertAdjacentHTML('beforeend',`<i class="bd">${n}</i>`)});cartBar(CURR)}
function render(){UN.forEach(f=>f());UN=[];const[k0,arg]=(location.hash||'#home').slice(1).split('/'),k=pages[k0]?k0:'home';buildFooter(k);
  if(guarded.includes(k)){if(!AUTH_READY){$('#app').innerHTML='<p class="empty">Loading…</p>';return k}if(!ME){NEXT='#'+k;location.hash='#login';return k}}
  if(k==='login'&&ME){location.hash='#account';return k}
  if(!BE.ready&&['login'].concat(guarded).includes(k)){$('#app').innerHTML=`<div class="card auth"><h3>Store is not connected yet</h3><p class="mut">${esc(BE.why)}</p></div>`;return k}
  CURR=k;$('#app').innerHTML=pages[k](arg);document.body.classList.toggle('pdp',k==='product');
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.h===k||(k==='product'&&a.dataset.h==='products')));
  inits[k]&&inits[k](arg);badges();buildDrawer();closeAll();return k}
function refresh(){const y=scrollY,k=render();if(k!=='search')scrollTo(0,y)}
const softRefresh=()=>{if(['home','products','wishlist','product'].includes(CURR))refresh()};
const authChanged=()=>{AUTH_READY=true;refresh()};
addEventListener('hashchange',()=>{render();scrollTo(0,0)});render();
