/* FOOTER: shown only on pages where people read about the shop (Home, Services, Info pages).
   Hidden on shopping and task pages (products, cart, wishlist, checkout, orders, account, chat, login...) so they stay clean. */
const FOOT_PAGES=['home','services','info'];
function buildFooter(k){
  const on=FOOT_PAGES.includes(k),f=$('#foot');f.style.display=on?'':'none';document.body.classList.toggle('nofoot',!on);if(!on){f.innerHTML='';return}
  const col=(t,l)=>`<div><h5>${t}</h5>${l.map(([n,h])=>`<a href="${h}">${n}</a>`).join('')}</div>`;
  const num=`+${CFG.cc} ${CFG.wa.slice(CFG.cc.length)}`;
  f.innerHTML=`<div class="fb"><a class="ft" href="#home"><img src="${esc(CFG.img.logoFull)}" alt="Nanu Cart"></a><p>Order products and book services in one place. Track every order live and chat with our team anytime.</p>
  <div class="soc"><a href="${esc(CFG.insta)}" target="_blank" rel="noopener" aria-label="Instagram">${I('instagram',20)}</a><a href="${esc(CFG.fb)}" target="_blank" rel="noopener" aria-label="Facebook">${I('facebook',20)}</a><a href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${I('chat',20)}</a></div>${canGetApp()?`<button class="btn y sm" onclick="getApp()" style="margin:-8px 0 24px">${I('download',16)} Download Android app</button>`:''}</div>
  <div class="fcols">${col('Shop',[['Products','#products'],['Services','#services'],['Wishlist','#wishlist'],['Cart','#cart']])}
  ${col('Support',[['Track Order','#track'],['My Orders','#orders'],['Warranty Claim','#warranty'],['Chat with us','#chat']])}
  ${col('Company',[['About Us','#info/about'],['Contact Us','#info/contact'],['Privacy Policy','#info/privacy'],['Terms & Conditions','#info/terms'],['Returns & Refunds','#info/returns']])}
  <div class="wide fcon"><h5>Contact</h5><span>WhatsApp</span><a href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener"><b>${num}</b></a></div></div>
  <div class="fbot">© ${new Date().getFullYear()} Nanu Cart. All rights reserved.</div>`}
