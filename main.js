/* ROUTER, NAV, DRAWER, BADGES */
const pages={home,services,products,search,cart,wishlist,orders,track,account};
const nav=[['home','Home','home'],['services','Services','tool'],['search','','search'],['products','Products','grid'],['account','Account','user']];
const dl=[['Shop',[['home','Home','#home'],['grid','Products','#products'],['tool','Services','#services'],['heart','Wishlist','#wishlist'],['bag','Cart','#cart']]],['Orders',[['box','My Orders','#orders'],['pin','Track Order','#track']]],['Account',[['user','My Account','#account']]]];
$('#mb').innerHTML=I('menu');$('#wb').innerHTML=I('heart');$('#cb').innerHTML=I('bag');
$('#nav').innerHTML=nav.map(([h,t,i])=>`<a href="#${h}" data-h="${h}" class="${h==='search'?'fab':''}" aria-label="${t||'Search'}">${I(i,h==='search'?24:22)}<span>${t}</span></a>`).join('');
$('#drawer').innerHTML=`<div class="dh"><a class="logo" href="#home">nanu<span>cart</span></a><button class="ib" onclick="closeAll()">${I('x')}</button></div>${dl.map(([g,l])=>`<h5>${g}</h5>${l.map(([i,t,h])=>`<a href="${h}" onclick="closeAll()">${I(i,20)}${t}</a>`).join('')}`).join('')}<h5>Madad</h5><a onclick="closeAll();wa('Namaste Nanu Cart, mujhe madad chahiye')">${I('chat',20)}WhatsApp par baat karo</a>`;
function badges(){const c=Object.values(getCart()).reduce((a,b)=>a+b,0),w=getWish().length;[['#cb',c],['#wb',w]].forEach(([s,n])=>{const e=$(s);e.querySelector('.bd')?.remove();if(n)e.insertAdjacentHTML('beforeend',`<i class="bd">${n}</i>`)})}
function render(){const h=(location.hash||'#home').slice(1),k=pages[h]?h:'home';$('#app').innerHTML=pages[k]();document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.h===k));badges();closeAll();return k}
function refresh(){const y=scrollY;const k=render();if(k==='search')return;scrollTo(0,y)}
addEventListener('hashchange',()=>{render();scrollTo(0,0)});render();
if(CFG.img.logo)document.querySelectorAll('.logo img').forEach(i=>i.src=CFG.img.logo);
