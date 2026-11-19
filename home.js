/* HOME page */
const quick=[['box','My Orders','#orders'],['pin','Track Order','#track'],['heart','Wishlist','#wishlist'],['chat','WhatsApp','wa']];
const home=()=>{const u=ls.get('user',{});return `
<section class="hero" ${CFG.img.hero?`style="background-image:linear-gradient(100deg,#1A47D0ee,#2A74F055),url('${CFG.img.hero}')"`:''}>
  <p>${u.name?'Namaste, '+u.name:'Nanu Cart me swagat hai'}</p>
  <h1>${CFG.tagline}</h1>
  <div class="row"><a class="btn y" href="#products">Shop karo</a><a class="btn g" href="#services">Service book karo</a></div>
</section>
<div class="qa">${quick.map(([i,t,h])=>`<a ${h==='wa'?`onclick="wa('Namaste Nanu Cart, mujhe madad chahiye')"`:`href="${h}"`}><span>${I(i,22)}</span>${t}</a>`).join('')}</div>
<div class="sh"><h2>Hamari services</h2><a href="#services">Sab dekho</a></div>
<div class="rail">${CFG.services.map(svcCard).join('')}</div>
<div class="sh"><h2>Popular products</h2><a href="#products">Sab dekho</a></div>
<div class="grid">${CFG.products.slice(0,4).map(card).join('')}</div>
<section class="why"><h3>Order karna bahut aasaan</h3><p>Cart ya service chuno, WhatsApp par bhejo. Hum wahin confirm karenge.</p></section>
<footer>${CFG.img.logoFull?`<img class="fl-logo" src="${CFG.img.logoFull}" alt="Nanu Cart">`:'<b>nanu<span>cart</span></b>'}<div><a href="${CFG.insta}" target="_blank" rel="noopener">Instagram</a><a href="${CFG.fb}" target="_blank" rel="noopener">Facebook</a><a onclick="wa('Namaste Nanu Cart')">WhatsApp</a></div></footer>`};
