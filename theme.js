/* THEMES: 4 blue themes. Default = Royal Blue. Change DEFAULT_THEME to set the main theme. */
const DEFAULT_THEME='royal';
const THEMES=[['royal','Royal Blue','#1F5BFF','#EEF3FF'],['midnight','Midnight','#4C8DFF','#050C20'],['ocean','Ocean','#0A93C9','#E9F8FC'],['indigo','Indigo','#3D4EF2','#EDEFFC']];
const curTheme=()=>ls.get('theme',DEFAULT_THEME);
function setTheme(t){document.documentElement.dataset.theme=t;ls.set('theme',t);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=(THEMES.find(x=>x[0]===t)||THEMES[0])[3];typeof buildDrawer==='function'&&buildDrawer();const a=$('#thm');if(a)a.innerHTML=themePicker()}
const themePicker=()=>`<div class="themes">${THEMES.map(([k,n,c,bg])=>`<button class="sw ${k===curTheme()?'on':''}" onclick="setTheme('${k}')" style="--c:${c};--bgc:${bg}"><i></i>${n}</button>`).join('')}</div>`;
document.documentElement.dataset.theme=curTheme();
