/* AUTH: login with mobile number, email or Google. Signup, forgot password, change password, logout.
   Every account is stored under a 10-digit mobile number (orders, address, chat). Google / email accounts add their mobile number once. */
let amode='in',SIGNUP=false;
const isPhone=v=>/^\d{10}$/.test(v),isEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const authErr=e=>({'auth/email-already-in-use':'This mobile number or email is already registered. Please login.','auth/invalid-credential':'Incorrect mobile number, email or password.','auth/wrong-password':'Incorrect mobile number, email or password.','auth/user-not-found':'Incorrect mobile number, email or password.','auth/invalid-email':'Please enter a valid email address.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/network-request-failed':'Network error. Check your connection.','auth/popup-closed-by-user':'Google sign-in was cancelled.','auth/cancelled-popup-request':'Google sign-in was cancelled.','auth/unauthorized-domain':'Google login is not allowed on this website yet. Add bir001.github.io in Firebase: Authentication > Settings > Authorized domains.','auth/operation-not-allowed':'This login method is not enabled in Firebase.','auth/account-exists-with-different-credential':'This email is already registered with another login method.','permission-denied':'This mobile number is already registered with another account. Try logging in with it.'}[e.code]||e.message);
function requireLogin(next){if(ME)return true;NEXT=next;if(NEEDPHONE){phoneSheet();return false}toast('Please login to continue');location.hash='#login';return false}
const GLOGO='<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';
/* password box with Show / Hide button */
const pwBox=(id,ph,ac,enter)=>`<div class="pw"><input id="${id}" type="password" placeholder="${ph}" autocomplete="${ac}" ${enter?'onkeydown="if(event.key===\'Enter\')doAuth()"':''}><button type="button" class="eye" onclick="togglePw('${id}',this)" aria-label="Show password">${I('eye',20)}</button></div>`;
function togglePw(id,b){const i=$('#'+id),s=i.type==='password';i.type=s?'text':'password';b.innerHTML=I(s?'eyeoff':'eye',20);b.setAttribute('aria-label',s?'Hide password':'Show password')}
const login=()=>{const li=amode==='in';return `<div class="card auth"><img src="${CFG.img.logo}" alt=""><h2>${li?'Welcome back':'Create your account'}</h2><p class="mut">${li?'Login with your mobile number, email or Google.':'Sign up to order products and book services.'}</p>
${li?'<input id="au-p" placeholder="Mobile number or email" autocomplete="username" autocapitalize="off" spellcheck="false">':'<input id="au-n" placeholder="Full name" autocomplete="name"><input id="au-p" inputmode="numeric" maxlength="10" placeholder="Mobile number (10 digits)" autocomplete="tel"><input id="au-e" type="email" placeholder="Email (optional, for email login)" autocomplete="email" autocapitalize="off">'}
${pwBox('au-w','Password (min. 6 characters)',li?'current-password':'new-password',true)}
<button class="btn b w" onclick="doAuth()">${li?'Login':'Sign up'}</button>${li?'<a class="lnk" onclick="forgot()">Forgot password?</a>':''}
<div class="or"><span>or</span></div><button class="btn o w gbtn" onclick="googleLogin()">${GLOGO}<span>Continue with Google</span></button>
<p class="sw1">${li?'New here?':'Already have an account?'} <a onclick="amode=amode==='in'?'up':'in';refresh()">${li?'Create account':'Login'}</a></p></div>`};
async function linkPhone(uid,p,n,e){await BE.db.doc('links/'+uid).set({phone:p,email:e||'',createdAt:ts()});await BE.db.doc('users/'+p).set({name:n,phone:p,email:e||'',createdAt:ts()},{merge:true})}
async function doAuth(){
  if(!BE.ready)return toast('Store is not connected yet');
  const up=amode==='up',id=$('#au-p').value.trim(),w=$('#au-w').value,n=up?$('#au-n').value.trim():'',e=up?$('#au-e').value.trim():'';
  if(up&&!n)return toast('Please enter your name');
  if(up){if(!isPhone(id))return toast('Enter a valid 10-digit mobile number');if(e&&!isEmail(e))return toast('Enter a valid email address')}
  else if(!isPhone(id)&&!isEmail(id))return toast('Enter your 10-digit mobile number or email');
  if(w.length<6)return toast('Password must be at least 6 characters');
  try{
    if(up&&e){SIGNUP=true;let cr;
      try{cr=await BE.auth.createUserWithEmailAndPassword(e,w);await cr.user.updateProfile({displayName:n}).catch(()=>{});await linkPhone(cr.user.uid,id,n,e)}
      catch(err){if(cr&&cr.user)await cr.user.delete().catch(()=>{});SIGNUP=false;throw err}
      SIGNUP=false;ME={phone:id,name:n,addr:null,uid:cr.user.uid,email:e}}
    else if(up){const cr=await BE.auth.createUserWithEmailAndPassword(mail(id),w);await cr.user.updateProfile({displayName:n}).catch(()=>{});ME={phone:id,name:n,addr:null};try{await BE.db.doc('users/'+id).set({name:n,phone:id,createdAt:ts()},{merge:true})}catch(e){toast('Account created, but saving your profile failed ('+(e.code||'error')+'). Please contact support.')}}
    else await BE.auth.signInWithEmailAndPassword(isEmail(id)?id:mail(id),w);
    toast(up?'Account created':'Logged in');location.hash=NEXT;NEXT='#account'
  }catch(e){toast(authErr(e))}
}
/* GOOGLE LOGIN. In a browser it opens the Google popup. Inside the Android app, Google does not allow sign-in in an embedded screen,
   so the app opens the browser (#gapp page), the user signs in there, and the browser hands the result back to the app. */
const gprov=()=>{const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p};
async function googleLogin(){
  if(!BE.ready)return toast('Store is not connected yet');
  if(isNative()){try{NanuNative.googleLogin()}catch(e){toast('Please update the app to use Google login')}return}
  try{await BE.auth.signInWithPopup(gprov());toast('Signed in with Google');location.hash=NEXT;NEXT='#account'}
  catch(e){if(e.code==='auth/popup-blocked'){BE.auth.signInWithRedirect(gprov());return}toast(authErr(e))}
}
async function nativeGoogle(tok){for(let i=0;i<40&&!BE.ready;i++)await new Promise(r=>setTimeout(r,250));if(!BE.ready)return;
  try{await BE.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(tok));toast('Signed in with Google');location.hash=NEXT;NEXT='#account'}catch(e){toast(authErr(e))}}
const gapp=()=>`<div class="card auth"><img src="${CFG.img.logo}" alt=""><h2>Continue with Google</h2><p class="mut">Sign in with Google here. You will then be taken back to the Nanu Cart app.</p><button class="btn b w gbtn" onclick="gappGo()">${GLOGO}<span>Continue with Google</span></button><div id="gapp-r"></div></div>`;
async function gappGo(){if(!BE.ready)return toast('Store is not connected yet');
  try{const r=await BE.auth.signInWithPopup(gprov()),id=r.credential&&r.credential.idToken;if(!id)throw{message:'Google did not return a sign-in token. Please try again.'};
    const url='nanucart://auth?id='+encodeURIComponent(id);$('#gapp-r').innerHTML=`<p class="mut" style="margin:14px 0 8px">Signed in. Tap below to return to the app.</p><a class="btn b w" href="${url}">Open Nanu Cart app</a>`;location.href=url}
  catch(e){toast(authErr(e))}}
/* Google / email accounts add their mobile number once */
function phoneSheet(){if(!NEEDPHONE)return;sheet(`<h3>One last step</h3><p class="mut">Add your mobile number so we can deliver your orders and contact you.</p><input id="np-n" placeholder="Full name" value="${esc(NEEDPHONE.name)}" autocomplete="name"><input id="np-p" inputmode="numeric" maxlength="10" placeholder="Mobile number (10 digits)" autocomplete="tel"><button class="btn b w" onclick="savePhone()">Continue</button><button class="btn o w" onclick="logout();closeAll()">Use another account</button>`)}
async function savePhone(){if(!NEEDPHONE)return;const p=$('#np-p').value.trim(),n=($('#np-n').value.trim()||NEEDPHONE.name);
  if(!n)return toast('Please enter your name');if(!isPhone(p))return toast('Enter a valid 10-digit mobile number');
  try{await linkPhone(NEEDPHONE.uid,p,n,NEEDPHONE.email);ME={phone:p,name:n,addr:null,uid:NEEDPHONE.uid,email:NEEDPHONE.email};NEEDPHONE=null;closeAll();toast('Welcome, '+n);refresh();if(location.hash==='#login'||location.hash==='#gapp'){location.hash=NEXT;NEXT='#account'}}
  catch(e){toast(authErr(e))}}
function forgot(){sheet(`<h3>Forgot password?</h3><p class="mut">Enter your email and we will send a reset link. Or enter your mobile number and we will help you reset it on WhatsApp.</p><input id="fp" placeholder="Mobile number or email" autocapitalize="off"><button class="btn b w" onclick="sendReset()">Continue</button>`)}
function sendReset(){const v=$('#fp').value.trim();
  if(isEmail(v)){if(!BE.ready)return toast('Store is not connected yet');BE.auth.sendPasswordResetEmail(v).then(()=>{closeAll();toast('Reset link sent. Check your email.')}).catch(e=>toast(authErr(e)));return}
  if(!isPhone(v))return toast('Enter a valid mobile number or email');
  wa(`Hello Nanu Cart, I forgot my password. Please help me reset it. Mobile: ${v}`);
  BE.ready&&BE.db.collection('resets').add({phone:v,ts:ts(),done:false}).catch(()=>{});closeAll()}
function pwSheet(){const u=BE.auth.currentUser;if(u&&!u.providerData.some(p=>p.providerId==='password'))return toast('You signed in with Google, so there is no password to change.');
  sheet(`<h3>Change password</h3>${pwBox('op','Current password','current-password')}${pwBox('np','New password (min. 6 characters)','new-password')}<button class="btn b w" onclick="changePw()">Update password</button>`)}
async function changePw(){const o=$('#op').value,n=$('#np').value;if(n.length<6)return toast('New password must be at least 6 characters');
  try{const u=BE.auth.currentUser;await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,o));await u.updatePassword(n);closeAll();toast('Password updated')}catch(e){toast(authErr(e))}}
const logout=()=>BE.auth.signOut().then(()=>{toast('Logged out');location.hash='#home'});
