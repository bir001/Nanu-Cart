/* ADMIN: customer chats */
V.chats=el=>{el.innerHTML='<div id="cl"></div>';
  AUN.push(BE.db.collection('chats').orderBy('lastTs','desc').onSnapshot(s=>{$('#cl').innerHTML=s.docs.map(d=>{const c=d.data();return `<a class="crow" onclick="openChat('${esc(c.phone)}')"><div class="av">${esc((c.name||'?')[0])}</div><div class="fl"><h4>${esc(c.name)} <small>${esc(c.phone)}</small></h4><p>${esc(c.last)}</p></div>${c.unread?'<i class="dot"></i>':''}</a>`}).join('')||'<p class="empty">No chats yet.</p>'}))};
let CP='';
function openChat(ph){AUN.forEach(f=>f());AUN=[];CP=ph;$('#ttl').textContent='Chat';
  $('#view').innerHTML=`<div class="chead"><button onclick="openView('chats')" aria-label="Back">${I('back')}</button><b>${esc(ph)}</b></div><div class="chatbox"><div id="msgs" class="msgs"></div><div class="cin"><input id="cm" placeholder="Type a reply" onkeydown="if(event.key==='Enter')adminSend()"><button class="send" onclick="adminSend()" aria-label="Send">${I('send',20)}</button></div></div>`;
  BE.db.doc('chats/'+ph).set({unread:false},{merge:true});
  AUN.push(BE.db.collection('chats/'+ph+'/messages').orderBy('ts').onSnapshot(s=>{const m=$('#msgs');m.innerHTML=s.docs.map(d=>{const x=d.data();return `<div class="bub ${x.from==='admin'?'me':'ad'}">${esc(x.text)}<small>${fmt(x.ts)}</small></div>`}).join('')||'<p class="empty">No messages yet.</p>';m.scrollTop=m.scrollHeight}))}
async function adminSend(){const i=$('#cm'),t=i.value.trim();if(!t)return;i.value='';
  try{await BE.db.collection('chats/'+CP+'/messages').add({text:t,from:'admin',ts:ts()});await BE.db.doc('chats/'+CP).set({phone:CP,last:t,lastTs:ts(),unread:false},{merge:true})}catch(e){toast('Send failed')}}
