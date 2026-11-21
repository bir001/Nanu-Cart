/* BACKEND: Firebase connection, session, live products */
const BE={ready:false,why:''};
let PRODUCTS=CFG.products.map(p=>({...p})),ME=null,NEXT='#account';
const mail=p=>p+'@nanucart.user';
const f=CFG.firebase;
if(typeof firebase==='undefined')BE.why='The Firebase files could not load. Check your internet connection or turn off your ad blocker.';
else if(!f.apiKey||f.apiKey.startsWith('PASTE'))BE.why='config.js on GitHub still has the placeholder. Upload the updated config.js file and refresh.';
else try{firebase.initializeApp(f);BE.auth=firebase.auth();BE.db=firebase.firestore();BE.ready=true}catch(e){BE.why=e.message;console.error(e)}
const ts=()=>firebase.firestore.FieldValue.serverTimestamp();
if(BE.ready){
  BE.db.collection('products').onSnapshot(s=>{const l=s.docs.map(d=>({id:d.id,...d.data()})).filter(p=>p.active!==false);if(l.length)PRODUCTS=l;typeof softRefresh==='function'&&softRefresh()},e=>console.error(e));
  BE.auth.onAuthStateChanged(async u=>{ME=null;
    if(u&&u.email&&u.email.endsWith('@nanucart.user')){const p=u.email.split('@')[0];let n=u.displayName||'',a=null;try{const s=await BE.db.doc('users/'+p).get(),d=s.data()||{};n=d.name||n;a=d.addr&&typeof d.addr==='object'?d.addr:null;if(!s.exists&&n)BE.db.doc('users/'+p).set({name:n,phone:p,createdAt:ts()},{merge:true}).catch(()=>{})}catch(e){}ME={phone:p,name:n,addr:a}}
    typeof authChanged==='function'&&authChanged()});
}
