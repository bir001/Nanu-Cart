/* PWA: register the service worker + "Install app" button in the side panel */
let IP=null;
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
addEventListener('beforeinstallprompt',e=>{e.preventDefault();IP=e;typeof buildDrawer==='function'&&buildDrawer()});
addEventListener('appinstalled',()=>{IP=null;typeof buildDrawer==='function'&&buildDrawer()});
async function installApp(){if(!IP)return;IP.prompt();try{await IP.userChoice}catch(e){}IP=null;buildDrawer()}
