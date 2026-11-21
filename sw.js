/* NANU CART service worker. Change V when you want every phone to refresh its cache. */
const V='nanucart-v1',SHELL=['./','index.html','style.css','manifest.webmanifest','icon-192.png','config.js','core.js','theme.js','backend.js','auth.js','cart.js','reviews.js','home.js','shop.js','checkout.js','product.js','service.js','account.js','chat.js','warranty.js','info.js','footer.js','sfx.js','pay.js','pwa.js','main.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(/googleapis\.com$/.test(u.hostname)&&u.hostname!=='fonts.googleapis.com')return;
  if(/(identitytoolkit|securetoken|firebaseio|firestore)/.test(u.hostname))return;
  if(u.origin===location.origin){e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined))));return}
  if(/fonts\.(googleapis|gstatic)\.com|ibb\.co$/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>{caches.open(V).then(h=>h.put(r,x.clone()));return x}).catch(()=>m);return m||n}))}});
