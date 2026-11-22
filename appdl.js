/* NATIVE APP DOWNLOAD (replaces the old PWA "Install" option).
   The Android app is built by GitHub (see the Android zip) and published as a release.
   EDIT APK_URL if your Android repo has a different name:  https://github.com/<user>/<repo>/releases/latest/download/NanuCart.apk */
const APK_URL=(typeof CFG!=='undefined'&&CFG.apkUrl)||'https://github.com/bir001/nanucart-android/releases/latest/download/NanuCart.apk';
const isNative=()=>{if(/NanuCartApp\//.test(navigator.userAgent))return true;try{return !!(window.NanuNative&&NanuNative.isNative())}catch(e){return false}};
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
/* Download options are shown on Android browsers only (never inside the app itself, never on iPhone) */
const canGetApp=()=>!isNative()&&!isIOS();
/* Clean up the old PWA (only this shop's own service worker and caches, nothing else on the same domain) */
try{const base=new URL('./',location.href).href;
  if('serviceWorker' in navigator)navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>{if(r.scope===base)r.unregister()})).catch(()=>{});
  if(window.caches)caches.keys().then(ks=>ks.filter(k=>k.startsWith('nanucart')).forEach(k=>caches.delete(k))).catch(()=>{})}catch(e){}
function getApp(){closeAll();
  sheet(`<div class="appdl"><div class="adi">${I('phone2',30)}</div><h3>Download the Nanu Cart app</h3><p class="mut">A real Android app: opens like any other app on your phone, with live order updates and invoices.</p>
  <ol class="adsteps"><li>Tap <b>Download app</b> below</li><li>Open the downloaded file and tap <b>Install</b></li><li>If Android asks, allow <b>Install unknown apps</b> for your browser</li></ol>
  <a class="btn b w" href="${esc(APK_URL)}" download onclick="setTimeout(closeAll,600)">${I('download',18)} Download app</a><button class="btn o w" onclick="closeAll()">Not now</button></div>`)}
const appCard=()=>!canGetApp()||ls.get('app_off',0)?'':`<div class="card inst"><div class="av">${I('phone2',22)}</div><div class="fl"><h4>Get the Nanu Cart app</h4><small>Faster ordering and live order updates</small></div><button class="btn b sm" onclick="getApp()">Download</button><button class="x" onclick="ls.set('app_off',1);refresh()" aria-label="Dismiss">${I('x',16)}</button></div>`;
