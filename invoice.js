/* INVOICE (PDF). Drawn on a canvas (so the Rupee sign and every language print correctly), then packed into a PDF file.
   Works offline. Available only after an order is Delivered. */
const IK=2,IW=595,IH=842;
const inr=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function inWords(n){n=Math.round(+n||0);if(!n)return 'Zero rupees only';const a=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],t=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const two=x=>x<20?a[x]:t[Math.floor(x/10)]+(x%10?' '+a[x%10]:''),three=x=>(x>=100?a[Math.floor(x/100)]+' Hundred'+(x%100?' ':''):'')+(x%100?two(x%100):'');
  const p=[[1e7,'Crore'],[1e5,'Lakh'],[1e3,'Thousand']];let s=[];for(const[v,l]of p){if(n>=v){s.push(three(Math.floor(n/v))+' '+l);n%=v}}if(n)s.push(three(n));return s.join(' ')+' rupees only'}
function invPages(o){
  const FF='Sora,"Plus Jakarta Sans",system-ui,"Segoe UI","Noto Sans",sans-serif',BLUE='#1F5BFF',INK='#0B1B45',MUT='#5F6E96',LN='#DCE5FA',LIGHT='#EEF3FF',OK='#12A150';
  const inv='INV-'+o.id,d0=ODATE(o),store=(typeof CFG!=='undefined'&&CFG)||{},phone='+'+store.cc+' '+String(store.wa||'').slice((store.cc||'').length);
  const pages=[];let cv,c,y;
  const font=(w,s)=>c.font=`${w} ${s}px ${FF}`;
  const rr=(x,yy,w,h,r)=>{c.beginPath();c.moveTo(x+r,yy);c.arcTo(x+w,yy,x+w,yy+h,r);c.arcTo(x+w,yy+h,x,yy+h,r);c.arcTo(x,yy+h,x,yy,r);c.arcTo(x,yy,x+w,yy,r);c.closePath()};
  const T=(s,x,yy,al)=>{c.textAlign=al||'left';c.fillText(String(s),x,yy)};
  const wrap=(s,w)=>{const out=[];String(s||'').split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(wd=>{const t=line?line+' '+wd:wd;if(c.measureText(t).width>w&&line){out.push(line);line=wd}else line=t});out.push(line)});return out};
  const nextPage=first=>{cv=document.createElement('canvas');cv.width=IW*IK;cv.height=IH*IK;c=cv.getContext('2d');c.scale(IK,IK);c.fillStyle='#fff';c.fillRect(0,0,IW,IH);c.textBaseline='alphabetic';pages.push(cv);
    if(first){const g=c.createLinearGradient(0,0,IW,112);g.addColorStop(0,'#061552');g.addColorStop(.6,'#0B3BD6');g.addColorStop(1,'#2C6BFF');c.fillStyle=g;c.fillRect(0,0,IW,112);
      c.fillStyle='#fff';rr(40,30,46,46,12);c.fill();c.fillStyle=BLUE;font(800,28);T('N',63,63,'center');
      c.fillStyle='#fff';font(800,26);T('Nanu Cart',98,56);c.globalAlpha=.8;font(500,10.5);T(store.tagline||'Products & Services',98,74);c.globalAlpha=1;
      font(800,26);T(o.type==='Service'?'RECEIPT':'INVOICE',IW-40,56,'right');c.fillStyle='#FFC21A';font(700,11);T('#'+inv,IW-40,76,'right');y=140}
    else{c.fillStyle=BLUE;c.fillRect(0,0,IW,6);c.fillStyle=INK;font(700,12);T('Nanu Cart · '+inv+' (continued)',40,36);y=56}};
  const tableHead=()=>{c.fillStyle=LIGHT;rr(40,y,IW-80,26,8);c.fill();c.fillStyle=MUT;font(700,8.5);T('ITEM',52,y+17);T('QTY',350,y+17,'right');T('RATE',445,y+17,'right');T('AMOUNT',IW-52,y+17,'right');y+=34};
  nextPage(true);
  // bill to + details
  const a=o.addr||{},nm=a.name||o.name||'Customer',ph=o.contact||o.phone||'';
  c.fillStyle=INK;font(500,10.5);
  const addr=o.address&&o.address!=='-'?wrap(o.address,215):[],bh=Math.max(138,70+addr.length*14+14);
  c.fillStyle='#F4F7FF';rr(40,y,250,bh,14);c.fill();rr(305,y,250,bh,14);c.fill();
  c.fillStyle=MUT;font(700,8.5);T('BILLED TO',54,y+20);T('INVOICE DETAILS',319,y+20);
  c.fillStyle=INK;font(700,13);T(nm,54,y+40);font(500,10.5);c.fillStyle=MUT;T('+'+(store.cc||'91')+' '+ph,54,y+55);addr.forEach((l,i)=>T(l,54,y+70+i*14));
  const kv=[['Order ID',o.id],['Order date',oshort(d0)],['Invoice date',oshort(new Date())],['Type',o.type==='Service'?'Service booking':'Product order'],['Payment',o.payMethod?payLabel(o):'-'],['Status',o.status]];
  kv.forEach(([k,v],i)=>{const yy=y+42+i*17;c.fillStyle=MUT;font(500,10);T(k,319,yy);c.fillStyle=k==='Status'?OK:INK;font(700,10.5);T(v,541,yy,'right')});
  y+=bh+22;
  if(o.type==='Service'&&(o.date||o.note)){c.fillStyle=MUT;font(500,10.5);if(o.date)T('Service date: '+o.date,40,y);if(o.note){wrap('Notes: '+o.note,IW-80).forEach((l,i)=>T(l,40,y+(o.date?15:0)+i*14))}y+=(o.date?20:4)+(o.note?wrap('Notes: '+o.note,IW-80).length*14+6:0)}
  tableHead();
  const items=o.items||[];
  items.forEach((it,i)=>{font(600,11);const ls_=wrap(it.name,270),h=Math.max(30,ls_.length*14+16);
    if(y+h>IH-110){nextPage(false);tableHead()}
    c.fillStyle=INK;font(600,11);ls_.forEach((l,k)=>T(l,52,y+14+k*14));font(500,11);c.fillStyle=MUT;T(it.qty,350,y+14,'right');T(it.price!=null?inr(it.price):'-',445,y+14,'right');c.fillStyle=INK;font(700,11);T(it.price!=null?inr(it.price*it.qty):'-',IW-52,y+14,'right');
    c.strokeStyle=LN;c.lineWidth=.8;c.beginPath();c.moveTo(40,y+h);c.lineTo(IW-40,y+h);c.stroke();y+=h});
  y+=16;if(y>IH-210){nextPage(false)}
  // totals
  const hasP=o.type==='Product'&&o.total!=null,mrp=o.mrpTotal||o.total,save=o.savings||0,del=o.delivery||0,total=o.total!=null?o.total:items.reduce((s,i)=>s+(i.price||0)*i.qty,0);
  const rows=[];if(hasP){rows.push(['Price (MRP)',inr(mrp)]);if(save>0)rows.push(['Discount','− '+inr(save)]);rows.push(['Delivery',del?inr(del):'Free'])}
  let ty=y;c.font=`500 11px ${FF}`;
  rows.forEach(([k,v])=>{c.fillStyle=MUT;font(500,11);T(k,350,ty+12);c.fillStyle=k==='Discount'?OK:INK;font(700,11);T(v,IW-52,ty+12,'right');ty+=22});
  c.fillStyle=BLUE;rr(330,ty+4,225,40,12);c.fill();c.fillStyle='#fff';font(600,11);T('Total',346,ty+29);font(800,17);T(inr(total),541,ty+30,'right');
  c.fillStyle=MUT;font(700,8.5);T('AMOUNT IN WORDS',40,y+12);c.fillStyle=INK;font(500,10.5);wrap(inWords(total),250).forEach((l,i)=>T(l,40,y+30+i*14));
  if(save>0){c.fillStyle=OK;font(700,10.5);T('You saved '+inr(save)+' on this order',40,y+30+wrap(inWords(total),250).length*14+10)}
  // footer on every page
  pages.forEach((p,i)=>{c=p.getContext('2d');c.strokeStyle=LN;c.lineWidth=.8;c.beginPath();c.moveTo(40,IH-62);c.lineTo(IW-40,IH-62);c.stroke();
    c.fillStyle=INK;font(700,11);T('Thank you for shopping with Nanu Cart!',IW/2,IH-44,'center');c.fillStyle=MUT;font(500,8.5);T('This is a computer-generated invoice and does not need a signature.  ·  WhatsApp '+phone,IW/2,IH-30,'center');T('Page '+(i+1)+' of '+pages.length,IW-40,IH-30,'right')});
  return pages}
const b64bytes=b=>{const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
const bytes64=u=>{let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s)};
function pdfFrom(pages){const en=s=>new TextEncoder().encode(s),parts=[],offs=[];let len=0;const push=b=>{parts.push(b);len+=b.length};
  const obj=(n,...ch)=>{offs[n]=len;push(en(n+' 0 obj\n'));ch.forEach(x=>push(typeof x==='string'?en(x):x));push(en('\nendobj\n'))};
  push(en('%PDF-1.4\n'));obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,`<< /Type /Pages /Kids [${pages.map((_,i)=>(3+3*i)+' 0 R').join(' ')}] /Count ${pages.length} >>`);
  pages.forEach((cv,i)=>{const p=3+3*i,jpg=b64bytes(cv.toDataURL('image/jpeg',.92).split(',')[1]),cs=`q ${IW} 0 0 ${IH} 0 0 cm /Im0 Do Q`;
    obj(p,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${IW} ${IH}] /Resources << /XObject << /Im0 ${p+2} 0 R >> >> /Contents ${p+1} 0 R >>`);
    obj(p+1,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
    obj(p+2,`<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,'\nendstream')});
  const N=2+3*pages.length,xr=len;let t=`xref\n0 ${N+1}\n0000000000 65535 f \n`;for(let n=1;n<=N;n++)t+=String(offs[n]).padStart(10,'0')+' 00000 n \n';t+=`trailer\n<< /Size ${N+1} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`;push(en(t));
  const out=new Uint8Array(len);let p=0;parts.forEach(b=>{out.set(b,p);p+=b.length});return out}
async function invoiceDl(id){const o=ORD[id];if(!o)return;if(o.status!=='Delivered')return toast('Invoice is available after your order is delivered');toast('Preparing your invoice…');
  try{try{await document.fonts.ready}catch(e){}await new Promise(r=>setTimeout(r,60));
    const bytes=pdfFrom(invPages(o)),name=`NanuCart-Invoice-${o.id}.pdf`;
    if(window.NanuNative&&NanuNative.saveFile){NanuNative.saveFile(name,'application/pdf',bytes64(bytes))}
    else{const u=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);toast('Invoice downloaded')}
  }catch(e){toast('Could not create the invoice')}}
