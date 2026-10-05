const CAL="https://calendly.com/fshmentorship";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const safe=u=>/^https?:\/\//i.test(u||"")?u:CAL;
/* Data: published list from opportunities.js; an admin's unpublished draft (this browser only) overrides it for preview. */
let OPPS=null;try{OPPS=JSON.parse(localStorage.getItem("fshm-draft"))}catch(e){}
if(!Array.isArray(OPPS))OPPS=window.FSHM_OPPS||[];

const state={country:"",deg:"",area:"",fund:"",q:""};
const track=$("#track"),dots=$("#dots");
let idx=0,timer=null,paused=false,list=[];

const cardHTML=o=>`<div class="slide"><article class="card">
<h3>${esc(o.prog)}</h3><p class="meta">${esc(o.uni)} &middot; ${esc(o.country)}</p>
<p><b>${esc(o.deg)}</b> &middot; ${esc(o.fund)} &middot; Deadline ${esc(o.deadline)}</p>
<p>Research area: ${esc(o.area)}. Focus: ${esc(o.topic)}.</p>
<div class="row"><a class="btn gold sm" href="${esc(safe(o.url))}" target="_blank" rel="noopener">View Opportunity</a>
<a class="btn ghost sm" href="${CAL}" target="_blank" rel="noopener">Check Eligibility</a></div></article></div>`;

const filtered=()=>OPPS.filter(o=>(!state.country||o.country===state.country)&&(!state.deg||o.deg===state.deg)&&
  (!state.area||o.area===state.area)&&(!state.fund||o.fund===state.fund)&&
  (!state.q||[o.uni,o.prog,o.area,o.topic,o.country].join(" ").toLowerCase().includes(state.q)));

function render(){
  list=filtered();
  track.innerHTML=list.length?list.map(cardHTML).join(""):`<div class="slide"><article class="card"><h3>No matches yet</h3><p>Remove a filter, or <a style="color:#ffe3a1" href="${CAL}" target="_blank" rel="noopener">book a consultation</a> and we will search for you.</p></article></div>`;
  dots.innerHTML=list.map((_,i)=>`<button aria-label="Show opportunity ${i+1}" data-i="${i}"></button>`).join("");
  go(0);
  $("#count").textContent=`${list.length} ${list.length===1?"opportunity":"opportunities"} found`;
  $("#results").innerHTML=list.map(o=>`<div class="res"><h4>${esc(o.prog)}</h4><p>${esc(o.uni)}, ${esc(o.country)}</p><p>${esc(o.deg)} &middot; ${esc(o.fund)}</p><p>Deadline ${esc(o.deadline)}</p></div>`).join("");
  $("#countrySel").value=state.country;$("#fCountry").value=state.country;
}
function go(i){
  if(!list.length){track.style.transform="";return}
  idx=(i+list.length)%list.length;
  track.style.transform=`translateX(-${idx*100}%)`;
  [...dots.children].forEach((d,n)=>n===idx?d.setAttribute("aria-current","true"):d.removeAttribute("aria-current"));
}
const start=()=>{clearInterval(timer);timer=setInterval(()=>{if(!paused&&!matchMedia("(prefers-reduced-motion:reduce)").matches)go(idx+1)},5000)};

/* filter controls are built from the data, so new countries and areas appear automatically */
const uniq=k=>[...new Set(OPPS.map(o=>o[k]).filter(Boolean))].sort();
const opts=(a,all)=>`<option value="">${all}</option>`+a.map(c=>`<option>${esc(c)}</option>`).join("");
$("#countrySel").innerHTML=opts(uniq("country"),"All countries");
$("#fCountry").innerHTML=opts(uniq("country"),"All countries");
$("#fArea").innerHTML=opts(uniq("area"),"All");

$("#countrySel").addEventListener("change",e=>{state.country=e.target.value;render()});
dots.addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(+b.dataset.i)});
$("#prev").onclick=()=>go(idx-1);$("#next").onclick=()=>go(idx+1);
const car=$("#carousel");
["mouseenter","focusin"].forEach(ev=>car.addEventListener(ev,()=>paused=true));
["mouseleave","focusout"].forEach(ev=>car.addEventListener(ev,()=>paused=false));
car.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")go(idx-1);if(e.key==="ArrowRight")go(idx+1)});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();
  Object.assign(state,{q:$("#q").value.trim().toLowerCase(),deg:$("#fDegree").value,area:$("#fArea").value,country:$("#fCountry").value,fund:$("#fFund").value});render()});
["fDegree","fArea","fCountry","fFund"].forEach(id=>$("#"+id).addEventListener("change",()=>$("#searchForm").requestSubmit()));
render();start();

/* background switcher */
function setBg(v){document.body.dataset.bg=v;document.querySelectorAll(".bg-switch button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.bg===v)));try{localStorage.setItem("fshm-bg",v)}catch(e){}}
$(".bg-switch").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setBg(b.dataset.bg)});
try{const s=localStorage.getItem("fshm-bg");if(s)setBg(s)}catch(e){}

/* mobile menu */
const burger=$("#burger"),menu=$("#menu");
burger.onclick=()=>{const o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",String(o))};
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");burger.setAttribute("aria-expanded","false")}});

/* 3D logo tilt */
const logo=$("#logo").firstElementChild;
document.addEventListener("pointermove",e=>{logo.style.transform=`rotateY(${(e.clientX/innerWidth-.5)*40}deg) rotateX(${(e.clientY/innerHeight-.5)*-40}deg)`},{passive:true});

/* newsletter (frontend only; connect an email platform at the marked line) */
$("#newsForm").addEventListener("submit",e=>{
  e.preventDefault();
  const n=$("#nName").value.trim(),m=$("#nEmail").value.trim(),msg=$("#nMsg");
  if(n.length<2){msg.className="msg err";msg.textContent="Enter your full name.";$("#nName").focus();return}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){msg.className="msg err";msg.textContent="Enter a valid email address, like name@example.com.";$("#nEmail").focus();return}
  /* TODO: POST {n,m,interest:$("#nInt").value} to Mailchimp, Brevo or ConvertKit here */
  msg.className="msg ok";msg.textContent=`Thanks ${n.split(" ")[0]}, you are on the FSHM Opportunities List.`;e.target.reset();
});
