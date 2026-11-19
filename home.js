/* HOME page */
const quick=[['box','My Orders','#orders'],['pin','Track Order','#track'],['heart','Wishlist','#wishlist'],['chat','Chat','#chat']];
const home=()=>`
<section class="hero" ${CFG.img.hero?`style="background-image:linear-gradient(100deg,#1A47D0ee,#2A74F055),url('${esc(CFG.img.hero)}')"`:''}>
  <p>${ME&&ME.name?'Hello, '+esc(ME.name):'Welcome to Nanu Cart'}</p>
  <h1>${esc(CFG.tagline)}</h1>
  <div class="row"><a class="btn y" href="#products">Shop now</a><a class="btn g" href="#services">Book a service</a></div>
</section>
<div class="qa">${quick.map(([i,t,h])=>`<a href="${h}"><span>${I(i,22)}</span>${t}</a>`).join('')}</div>
<div class="sh"><h2>Popular products</h2><a href="#products">View all</a></div>
<div class="grid">${PRODUCTS.slice(0,4).map(card).join('')}</div>
<div class="sh"><h2>Our services</h2><a href="#services">View all</a></div>
<div class="rail">${CFG.services.map(svcCard).join('')}</div>
<section class="why"><h3>How it works</h3><ol><li>Choose a product or service</li><li>Place your order or booking</li><li>Track it live and chat with us anytime</li></ol></section>
<footer>${CFG.img.logoFull?`<img class="fl-logo" src="${esc(CFG.img.logoFull)}" alt="Nanu Cart">`:'<b>nanu<span>cart</span></b>'}<div><a href="${esc(CFG.insta)}" target="_blank" rel="noopener">Instagram</a><a href="${esc(CFG.fb)}" target="_blank" rel="noopener">Facebook</a><a onclick="wa('Hello Nanu Cart')">WhatsApp</a></div></footer>`;
