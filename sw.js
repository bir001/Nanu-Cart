/* NANU CART: the old PWA service worker is retired. This file only cleans up phones that still have it,
   then removes itself. The app now runs as a native Android app (APK). */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('nanucart')).map(x=>caches.delete(x)))).then(()=>self.registration.unregister()).then(()=>self.clients.matchAll()).then(cs=>cs.forEach(c=>c.navigate(c.url))).catch(()=>{}))});
