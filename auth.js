/* AUTH: login, signup, forgot password, change password, logout */
let amode='in';
const isPhone=v=>/^\d{10}$/.test(v);
const authErr=e=>({'auth/email-already-in-use':'This mobile number is already registered. Please login.','auth/invalid-credential':'Incorrect mobile number or password.','auth/wrong-password':'Incorrect mobile number or password.','auth/user-not-found':'Incorrect mobile number or password.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/network-request-failed':'Network error. Check your connection.'}[e.code]||e.message);
function requireLogin(next){if(ME)return true;NEXT=next;toast('Please login to continue');location.hash='#login';return false}
const login=()=>`<div class="card auth"><img src="${CFG.img.logo}" alt=""><h2>${amode==='in'?'Welcome back':'Create your account'}</h2><p class="mut">${amode==='in'?'Login with your mobile number.':'Sign up to order products and book services.'}</p>${amode==='up'?'<input id="au-n" placeholder="Full name" autocomplete="name">':''}<input id="au-p" inputmode="numeric" maxlength="10" placeholder="Mobile number (10 digits)" autocomplete="username"><input id="au-w" type="password" placeholder="Password (min. 6 characters)" autocomplete="${amode==='in'?'current-password':'new-password'}" onkeydown="if(event.key==='Enter')doAuth()"><button class="btn b w" onclick="doAuth()">${amode==='in'?'Login':'Sign up'}</button>${amode==='in'?'<a class="lnk" onclick="forgot()">Forgot password?</a>':''}<p class="sw">${amode==='in'?'New here?':'Already have an account?'} <a onclick="amode=amode==='in'?'up':'in';refresh()">${amode==='in'?'Create account':'Login'}</a></p></div>`;
async function doAuth(){
  if(!BE.ready)return toast('Store is not connected yet');
  const p=$('#au-p').value.trim(),w=$('#au-w').value,n=amode==='up'?$('#au-n').value.trim():'';
  if(amode==='up'&&!n)return toast('Please enter your name');
  if(!isPhone(p))return toast('Enter a valid 10-digit mobile number');
  if(w.length<6)return toast('Password must be at least 6 characters');
  try{
    if(amode==='up'){await BE.auth.createUserWithEmailAndPassword(mail(p),w);await BE.db.doc('users/'+p).set({name:n,phone:p,createdAt:ts()},{merge:true});ME={phone:p,name:n}}
    else await BE.auth.signInWithEmailAndPassword(mail(p),w);
    toast(amode==='up'?'Account created':'Logged in');location.hash=NEXT;NEXT='#account'
  }catch(e){toast(authErr(e))}
}
function forgot(){sheet(`<h3>Forgot password?</h3><p class="mut">Enter your mobile number. We will receive your request and help you reset it on WhatsApp.</p><input id="fp" inputmode="numeric" maxlength="10" placeholder="Mobile number"><button class="btn b w" onclick="sendReset()">Request on WhatsApp</button>`)}
function sendReset(){const p=$('#fp').value.trim();if(!isPhone(p))return toast('Enter a valid 10-digit mobile number');
  wa(`Hello Nanu Cart, I forgot my password. Please help me reset it. Mobile: ${p}`);
  BE.ready&&BE.db.collection('resets').add({phone:p,ts:ts(),done:false}).catch(()=>{});closeAll()}
function pwSheet(){sheet(`<h3>Change password</h3><input id="op" type="password" placeholder="Current password" autocomplete="current-password"><input id="np" type="password" placeholder="New password (min. 6 characters)" autocomplete="new-password"><button class="btn b w" onclick="changePw()">Update password</button>`)}
async function changePw(){const o=$('#op').value,n=$('#np').value;if(n.length<6)return toast('New password must be at least 6 characters');
  try{const u=BE.auth.currentUser;await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,o));await u.updatePassword(n);closeAll();toast('Password updated')}catch(e){toast(authErr(e))}}
const logout=()=>BE.auth.signOut().then(()=>{toast('Logged out');location.hash='#home'});
