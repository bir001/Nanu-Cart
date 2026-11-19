/* ADMIN: view, add, edit, delete products and images */
let PL=[];
const pv=a=>a.map(u=>`<img src="${esc(u)}" alt="">`).join('');
const pf=p=>`<h3>${p.id?'Edit product':'Add new product'}</h3><input id="f-n" placeholder="Product name" value="${esc(p.name)}"><input id="f-c" placeholder="Category (e.g. Gadgets)" value="${esc(p.cat)}"><div class="two"><input id="f-p" type="number" inputmode="decimal" placeholder="Selling price" value="${p.price??''}"><input id="f-m" type="number" inputmode="decimal" placeholder="MRP (original price)" value="${p.mrp??''}"></div><textarea id="f-d" rows="3" placeholder="Description">${esc(p.desc)}</textarea><textarea id="f-i" rows="4" placeholder="Image links, one per line. The first link is the main image." oninput="pvImgs()">${esc((p.imgs||[]).join('\n'))}</textarea><div id="f-pv" class="pvs">${pv(p.imgs||[])}</div><label class="sw2"><input type="checkbox" id="f-s" ${p.stock===false?'':'checked'}> In stock</label><label class="sw2"><input type="checkbox" id="f-a" ${p.active===false?'':'checked'}> Visible on website</label><button class="btn b w" onclick="saveProd('${p.id||''}')">${p.id?'Save changes':'Add product'}</button>`;
const pvImgs=()=>{$('#f-pv').innerHTML=pv($('#f-i').value.split('\n').map(x=>x.trim()).filter(Boolean))};
V.addp=el=>{el.innerHTML=`<div class="card form">${pf({})}</div>`};
V.products=el=>{el.innerHTML='<div id="pl"></div>';
  AUN.push(BE.db.collection('products').onSnapshot(s=>{PL=s.docs.map(d=>({id:d.id,...d.data()}));
    $('#pl').innerHTML=PL.map(p=>`<div class="card prow"><div class="th">${pic((p.imgs||[])[0],p.name)}</div><div class="fl"><h4>${esc(p.name)}</h4><p>${rs(p.price)} · ${esc(p.cat)}</p><span class="pill ${p.stock===false?'no':''}">${p.stock===false?'Out of stock':'In stock'}</span> <span class="pill ${p.active===false?'no':''}">${p.active===false?'Hidden':'Visible'}</span></div><div class="acts"><button onclick="editProd('${p.id}')" aria-label="Edit">${I('edit',16)}</button><button class="dng" onclick="delProd('${p.id}')" aria-label="Delete">${I('trash',16)}</button></div></div>`).join('')||'<p class="empty">No products yet. Use Add Product to create your first one.</p>'}))};
const editProd=id=>sheet(pf(PL.find(p=>p.id===id)||{}));
const delProd=id=>{if(confirm('Delete this product permanently?'))BE.db.doc('products/'+id).delete().then(()=>toast('Deleted'))};
async function saveProd(id){const g=s=>$(s).value.trim(),pr=+g('#f-p');
  const d={name:g('#f-n'),cat:g('#f-c')||'General',price:pr,mrp:+g('#f-m')||pr,desc:g('#f-d'),imgs:g('#f-i').split('\n').map(x=>x.trim()).filter(Boolean),stock:$('#f-s').checked,active:$('#f-a').checked,updatedAt:ts()};
  if(!d.name||!(pr>0))return toast('Enter a name and a valid price');
  try{if(id)await BE.db.doc('products/'+id).update(d);else await BE.db.collection('products').add({...d,createdAt:ts()});toast('Saved');closeAll();openView('products')}catch(e){toast('Save failed: '+e.code)}}
