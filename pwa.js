/* PWA: service worker + visible "Install app" options (banner, side panel, footer) */
let IP=null;
const isStandalone=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
addEventListener('beforeinstallprompt',e=>{e.preventDefault();IP=e});
addEventListener('appinstalled',()=>{IP=null;typeof refresh==='function'&&refresh()});
async function installApp(){closeAll();
  if(IP){IP.prompt();try{await IP.userChoice}catch(e){}IP=null;return}
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  sheet(`<h3>Install Nanu Cart</h3><p class="mut">${ios?'Tap the Share button in Safari, then choose "Add to Home Screen".':'Open the browser menu (three dots) and tap "Install app" or "Add to Home screen".'}</p><p class="mut small">If you do not see the option, open this page in Chrome (not inside Instagram or Facebook) and try again.</p><button class="btn b w" onclick="closeAll()">Got it</button>`)}
const installCard=()=>isStandalone()||ls.get('pwa_off',0)?'':`<div class="card inst"><div class="av">${I('bag',22)}</div><div class="fl"><h4>Get the Nanu Cart app</h4><small>Faster ordering and live order updates</small></div><button class="btn b sm" onclick="installApp()">Install</button><button class="x" onclick="ls.set('pwa_off',1);refresh()" aria-label="Dismiss">${I('x',16)}</button></div>`;
