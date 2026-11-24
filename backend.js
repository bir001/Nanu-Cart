/* BACKEND: Firebase connection, session, live products */
const BE={ready:false,why:''};
let PRODUCTS=CFG.products.map(p=>({...p})),ME=null,NEXT='#account',NEEDPHONE=null;
const mail=p=>p+'@nanucart.user';
const f=CFG.firebase;
if(typeof firebase==='undefined')BE.why='The Firebase files could not load. Check your internet connection or turn off your ad blocker.';
else if(!f.apiKey||f.apiKey.startsWith('PASTE'))BE.why='config.js on GitHub still has the placeholder. Upload the updated config.js file and refresh.';
else try{firebase.initializeApp(f);BE.auth=firebase.auth();BE.db=firebase.firestore();BE.ready=true}catch(e){BE.why=e.message;console.error(e)}
const ts=()=>firebase.firestore.FieldValue.serverTimestamp();
if(BE.ready){
  BE.db.collection('products').onSnapshot(s=>{const l=s.docs.map(d=>({id:d.id,...d.data()})).filter(p=>p.active!==false);if(l.length)PRODUCTS=l;typeof softRefresh==='function'&&softRefresh()},e=>console.error(e));
  BE.auth.onAuthStateChanged(async u=>{if(SIGNUP)return;ME=null;NEEDPHONE=null;
    if(u){let p=null;
      if(u.email&&u.email.endsWith('@nanucart.user'))p=u.email.split('@')[0];
      else{try{const l=await BE.db.doc('links/'+u.uid).get();if(l.exists)p=l.data().phone}catch(e){}}
      if(p){let n=u.displayName||'',a=null;try{const s=await BE.db.doc('users/'+p).get(),d=s.data()||{};n=d.name||n;a=d.addr&&typeof d.addr==='object'?d.addr:null;if(!s.exists&&n)BE.db.doc('users/'+p).set({name:n,phone:p,createdAt:ts()},{merge:true}).catch(()=>{})}catch(e){}ME={phone:p,name:n,addr:a,uid:u.uid,email:u.email&&!u.email.endsWith('@nanucart.user')?u.email:''}}
      else NEEDPHONE={uid:u.uid,name:u.displayName||'',email:u.email||''}}
    typeof authChanged==='function'&&authChanged()});
}
