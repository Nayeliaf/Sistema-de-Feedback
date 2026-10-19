const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "aeropostal_feedback_demo_v1";
const areas = ["Puntualidad","Atención a bordo","Equipaje","Atención en mostradores","Proceso de reserva","Comunicación y notificaciones","Atención al cliente","Plataforma digital","Otro"];
const ratingNames = ["Facilidad de reserva","Atención en mostradores","Puntualidad","Atención a bordo","Equipaje"];
let currentStep = 1, currentDetailId = null, toastTimer;
const today = new Date();
const dateOffset = n => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString(); };
function seedData(){
  const samples = [
    ["Agencia de viaje","Viajes del Sur","Puntualidad","Alta","El vuelo con destino a Madrid presentó un retraso y la comunicación pudo ser más clara.","Sería ideal recibir notificaciones inmediatas sobre cambios de itinerario.",-2],
    ["Viajero frecuente","María González","Atención a bordo","Media","Excelente servicio del personal durante el vuelo.","Mantener la calidad de la atención y ampliar las opciones de entretenimiento.",-4],
    ["Agencia de viaje","Rutas y Destinos","Equipaje","Alta","Pérdida de equipaje durante una conexión.","Mejorar el seguimiento y la información de equipaje en ruta.",-8],
    ["Viajero frecuente","Carlos Pérez","Proceso de reserva","Baja","La compra fue sencilla, aunque no encontré fácilmente las condiciones de equipaje.","Hacer más visibles las condiciones antes de confirmar la compra.",-12],
    ["Agencia de viaje","Mundo Travel","Atención en mostradores","Media","La fila en el mostrador avanzó lentamente en hora pico.","Evaluar refuerzo de personal durante las horas de mayor demanda.",-18],
    ["Viajero frecuente","Andrea Rojas","Puntualidad","Alta","Hubo poca información durante la espera en puerta.","Informar el estado del vuelo y los tiempos estimados con más frecuencia.",-25],
    ["Viajero frecuente","Luis Romero","Atención a bordo","Baja","La tripulación fue amable y atenta.","Conservar el trato cercano del equipo de cabina.",-38],
    ["Agencia de viaje","Conexión Turística","Plataforma digital","Media","La consulta de disponibilidad presentó lentitud en algunos momentos.","Optimizar el tiempo de respuesta del portal de reservas.",-48]
  ];
  return samples.map((s,i)=>({id:"AP-DEMO-"+String(i+1).padStart(4,"0"),participant:s[0],name:s[1],identifier:s[0]==="Agencia de viaje"?"J-12345678-9":"Cliente frecuente",role:s[0]==="Agencia de viaje"?"Asesor de viajes":"Viajero frecuente",email:"demo"+(i+1)+"@ejemplo.com",phone:"+58 412 1234567",city:"Caracas",service:"Vuelo nacional",ratings:{"Facilidad de reserva":4,"Atención en mostradores":4,"Puntualidad":i%3===0?2:4,"Atención a bordo":4,"Equipaje":i%4===0?3:4},positive:"Agradecemos la atención recibida.",experience:s[4],area:s[2],proposal:s[5],priority:s[3],followup:i%2===0,consent:true,status:i%3===0?"En revisión":"Recibido",createdAt:dateOffset(s[6]),demoSeed:true}));
}
function loadRecords(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(v)?v:seedData()}catch(e){return seedData()}}
let records = loadRecords();
if(!localStorage.getItem(STORAGE_KEY)){saveRecords();}
function saveRecords(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(records))}catch(e){showToast("No se pudo guardar en el navegador. Exporta tus datos para conservarlos.")}}
function showToast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3200)}
function setView(name){$$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));$$(".nav-link[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));const titles={welcome:"Tu opinión nos lleva más lejos",feedback:"Nuevo feedback",submissions:"Mis envíos",dashboard:"Panel de análisis"};$("#pageTitle").textContent=titles[name]||"Sistema de feedback";if(name==="dashboard")renderDashboard();if(name==="submissions")renderSubmissions();window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-view]").forEach(el=>el.addEventListener("click",()=>setView(el.dataset.view)));
$$("[data-participant]").forEach(el=>el.addEventListener("click",()=>{resetForm();setProfile(el.dataset.participant);setView("feedback")}));
function setProfile(profile){$("#participantType").value=profile;$$(".profile-option").forEach(b=>b.classList.toggle("selected",b.dataset.profile===profile));const agency=profile==="Agencia de viaje";$("#organizationLabel").firstChild.textContent=agency?"Nombre de la agencia *":"Nombre completo *";$("#organization").placeholder=agency?"Ej. Viajes del Sur":"Ej. María González";$("#rifLabel").firstChild.textContent=agency?"RIF / ID de la agencia *":"Número de viajero (opcional)";$("#identifier").required=agency;$("#identifier").placeholder=agency?"Ej. J-12345678-9":"Ej. Código de viajero";$("#role").placeholder=agency?"Ej. Gerente de ventas":"Ej. Viajero frecuente"}
$$(".profile-option").forEach(b=>b.addEventListener("click",()=>setProfile(b.dataset.profile)));
function buildRatings(){const root=$("#ratingList");root.innerHTML="";ratingNames.forEach(name=>{const row=document.createElement("div");row.className="rating-row";row.innerHTML=`<span>${name}</span><div class="stars" role="group" aria-label="${name}">`+[1,2,3,4,5].map(n=>`<button type="button" class="star ${n<=4?"active":""}" data-rating="${n}" aria-label="${n} de 5" aria-pressed="${n<=4}">★</button>`).join("")+"</div>";root.appendChild(row);row.dataset.ratingName=name;row.dataset.value="4";$$(".star",row).forEach(btn=>btn.addEventListener("click",()=>{row.dataset.value=btn.dataset.rating;$$(".star",row).forEach(s=>{const on=Number(s.dataset.rating)<=Number(btn.dataset.rating);s.classList.toggle("active",on);s.setAttribute("aria-pressed",String(on))})}))})}
buildRatings();
function goStep(n){if(n>currentStep&&!validateStep(currentStep))return;currentStep=n;$$(".form-step").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===n));$$("[data-step-indicator]").forEach(s=>{const num=Number(s.dataset.stepIndicator);s.classList.toggle("active",num===n);s.classList.toggle("done",num<n);s.querySelector("span").textContent=num<n?"✓":num});}
function validateStep(n){const step=$(`.form-step[data-step="${n}"]`);const fields=$$("input[required],textarea[required],select[required]",step).filter(el=>el.type!=="checkbox"||el.checked);for(const field of fields){if(!field.checkValidity()){field.reportValidity();field.focus();return false}}if(n===3&&!$("#consent").checked){$("#consent").reportValidity();return false}return true}
$$("[data-next]").forEach(b=>b.addEventListener("click",()=>goStep(Number(b.dataset.next))));$$("[data-prev]").forEach(b=>b.addEventListener("click",()=>goStep(Number(b.dataset.prev))));
function resetForm(){ $("#feedbackForm").reset();setProfile($("#participantType").value||"Agencia de viaje");buildRatings();currentStep=1;goStep(1)}
function getFormRecord(){const participant=$("#participantType").value;const name=$("#organization").value.trim();const ratings={};$$(".rating-row").forEach(row=>ratings[row.dataset.ratingName]=Number(row.dataset.value));return{id:"AP-"+Date.now().toString(36).toUpperCase(),participant,name,identifier:$("#identifier").value.trim(),role:$("#role").value.trim(),email:$("#email").value.trim(),phone:$("#phone").value.trim(),city:$("#city").value.trim(),service:$("#serviceType").value,ratings,positive:$("#positive").value.trim(),experience:$("#experience").value.trim(),area:$("#area").value||"Sin clasificar",proposal:$("#proposal").value.trim(),priority:$('input[name="priority"]:checked').value,followup:$("#followup").checked,consent:$("#consent").checked,status:"Recibido",createdAt:new Date().toISOString(),demoSeed:false}}
$("#feedbackForm").addEventListener("submit",e=>{e.preventDefault();if(!validateStep(3))return;const record=getFormRecord();records.unshift(record);saveRecords();resetForm();setView("submissions");showToast("¡Feedback registrado! Código: "+record.id)});
const fmtDate=value=>new Intl.DateTimeFormat("es-VE",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(value));
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function priorityBadge(p){return `<span class="priority-badge ${p.toLowerCase()}">${esc(p)}</span>`}
function openDetail(id){const r=records.find(x=>x.id===id);if(!r)return;currentDetailId=id;$("#detailContent").innerHTML=`<div class="detail-heading"><div><span class="kicker">DETALLE DEL FEEDBACK</span><h2 id="detailTitle">${esc(r.name)}</h2><div class="detail-sub">${esc(r.participant)} · ${esc(r.id)} · ${fmtDate(r.createdAt)}</div></div>${priorityBadge(r.priority)}</div><div class="detail-grid"><div class="detail-block"><div class="detail-label">Información de contacto</div><h4>${esc(r.role)}</h4><p>${esc(r.email)}<br>${esc(r.phone)}${r.city?"<br>"+esc(r.city):""}</p></div><div class="detail-block"><div class="detail-label">Servicio evaluado</div><h4>${esc(r.service)}</h4><p>Estado: ${esc(r.status)}<br>Seguimiento solicitado: ${r.followup?"Sí":"No"}</p></div><div class="detail-block detail-wide"><div class="detail-label">Calificaciones</div><p>${ratingNames.map(n=>`${esc(n)}: ${r.ratings?.[n]??"—"}/5`).join("  ·  ")}</p></div><div class="detail-block detail-wide"><div class="detail-label">Descripción de la experiencia</div><p>${esc(r.experience||"Sin descripción")}</p></div><div class="detail-block detail-wide"><div class="detail-label">Área de mejora</div><h4>${esc(r.area)}</h4><div class="detail-label" style="margin-top:12px">Propuesta de mejora</div><p>${esc(r.proposal||"Sin propuesta")}</p></div><div class="detail-block detail-wide"><div class="detail-label">Lo que más le gustó</div><p>${esc(r.positive||"No especificado")}</p></div></div>`;
$("#detailModal").classList.remove("hidden");$("#deleteRecord").textContent="Eliminar registro"}
function closeDetail(){$("#detailModal").classList.add("hidden");currentDetailId=null}
$("#closeDetail").addEventListener("click",closeDetail);$("#closeDetailX").addEventListener("click",closeDetail);$("#closeDetailBottom").addEventListener("click",closeDetail);$("#detailModal").addEventListener("click",e=>{if(e.target===$("#detailModal"))closeDetail()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDetail()});
$("#deleteRecord").addEventListener("click",()=>{if(!currentDetailId)return;if(!confirm("¿Eliminar este registro de la demo? Esta acción no se puede deshacer."))return;records=records.filter(r=>r.id!==currentDetailId);saveRecords();closeDetail();renderDashboard();renderSubmissions();showToast("Registro eliminado de la demo.")});
function tableRow(r,showType=true){const summary=(r.proposal||r.experience||"").replace(/\s+/g," ");return `<tr><td>${fmtDate(r.createdAt)}</td>${showType?`<td>${esc(r.participant)}</td>`:""}<td>${esc(r.area)}</td><td>${priorityBadge(r.priority)}</td>${showType?`<td><span class="status-badge">${esc(r.status||"Recibido")}</span></td>`:`<td title="${esc(summary)}">${esc(summary.slice(0,64))}${summary.length>64?"…":""}</td>`}<td><button class="table-action" data-detail="${esc(r.id)}">Ver detalle ↗</button></td></tr>`}
function bindDetails(root){$$("[data-detail]",root).forEach(b=>b.addEventListener("click",()=>openDetail(b.dataset.detail)))}
function renderSubmissions(){const q=$("#submissionSearch").value.toLowerCase();const filtered=records.filter(r=>[r.name,r.area,r.participant,r.id].join(" ").toLowerCase().includes(q));$("#submissionCount").textContent=`${filtered.length} ${filtered.length===1?"registro":"registros"}`;$("#submissionRows").innerHTML=filtered.map(r=>tableRow(r,true)).join("");$("#submissionEmpty").classList.toggle("hidden",filtered.length>0);bindDetails($("#submissionRows"))}
$("#submissionSearch").addEventListener("input",renderSubmissions);
function filteredRecords(){const period=$("#periodFilter").value;let list=records;if(period!=="all"){const cutoff=Date.now()-Number(period)*86400000;list=list.filter(r=>new Date(r.createdAt).getTime()>=cutoff)}return list}
function renderDashboard(){const list=filteredRecords();const total=list.length,agency=list.filter(r=>r.participant==="Agencia de viaje").length,traveler=total-agency,high=list.filter(r=>r.priority==="Alta").length;$("#statTotal").textContent=total;$("#statAgencies").textContent=agency;$("#statTravelers").textContent=traveler;$("#statHigh").textContent=high;$("#agencyShare").textContent=`${total?Math.round(agency/total*100):0}% del total`;$("#travelerShare").textContent=`${total?Math.round(traveler/total*100):0}% del total`;$("#highShare").textContent=`${total?Math.round(high/total*100):0}% del total`;$("#legendAgency").textContent=`${total?Math.round(agency/total*100):0}%`;$("#legendTraveler").textContent=`${total?Math.round(traveler/total*100):0}%`;$("#donutTotal").textContent=total;const pct=total?agency/total*100:0;$("#profileDonut").style.background=`conic-gradient(#237acb 0 ${pct}%,#0d2b4a ${pct}% 100%)`;
const counts={};list.forEach(r=>counts[r.area]=(counts[r.area]||0)+1);const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,7);$("#areaBars").innerHTML=sorted.length?sorted.map(([name,count])=>`<div class="bar-row"><span title="${esc(name)}">${esc(name.length>19?name.slice(0,18)+"…":name)}</span><div class="bar-track"><div class="bar-fill" style="width:${count/Math.max(...sorted.map(x=>x[1]))*100}%"></div></div><span class="bar-percent">${total?Math.round(count/total*100):0}%</span></div>`).join(""):'<div class="empty-state">Sin datos para mostrar.</div>';
renderTrend(list);const q=$("#dashboardSearch").value.toLowerCase(),priority=$("#priorityFilter").value;const rows=list.filter(r=>(!priority||r.priority===priority)&&[r.name,r.area,r.participant,r.proposal,r.experience].join(" ").toLowerCase().includes(q)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));$("#dashboardRows").innerHTML=rows.map(r=>tableRow(r,false)).join("");$("#dashboardEmpty").classList.toggle("hidden",rows.length>0);bindDetails($("#dashboardRows"))}
function renderTrend(list){const months=[];const now=new Date();for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({label:d.toLocaleDateString("es-VE",{month:"short"}),year:d.getFullYear(),month:d.getMonth(),value:0})}list.forEach(r=>{const d=new Date(r.createdAt),m=months.find(x=>x.month===d.getMonth()&&x.year===d.getFullYear());if(m)m.value++});const max=Math.max(1,...months.map(m=>m.value));const W=340,H=170,left=28,right=8,top=12,bottom=26,plotH=H-top-bottom,plotW=W-left-right;const pts=months.map((m,i)=>({x:left+i*plotW/(months.length-1),y:top+plotH-(m.value/max)*plotH,...m}));const path=pts.map((p,i)=>(i?"L":"M")+p.x.toFixed(1)+" "+p.y.toFixed(1)).join(" ");const area=path+` L ${pts[pts.length-1].x} ${H-bottom} L ${pts[0].x} ${H-bottom} Z`;const grid=[0,.33,.66,1].map(t=>{const y=top+plotH*(1-t);return `<line x1="${left}" y1="${y}" x2="${W-right}" y2="${y}" stroke="#e8edf2" stroke-dasharray="3 3"/><text x="${left-7}" y="${y+3}" text-anchor="end" font-size="8" fill="#8a98a7">${Math.round(max*t)}</text>`}).join("");$("#trendChart").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tendencia mensual de opiniones">${grid}<path d="${area}" fill="#d8eafa" opacity=".8"/><path d="${path}" fill="none" stroke="#2179c5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="3" fill="#2179c5"><title>${p.label}: ${p.value} opiniones</title></circle><text x="${p.x}" y="${H-7}" text-anchor="middle" font-size="8" fill="#78899a">${esc(p.label)}</text>`).join("")}</svg>`}
$("#periodFilter").addEventListener("change",renderDashboard);$("#dashboardSearch").addEventListener("input",renderDashboard);$("#priorityFilter").addEventListener("change",renderDashboard);
function exportCSV(){const list=filteredRecords();if(!list.length){showToast("No hay registros para exportar.");return}const headers=["Código","Fecha","Participante","Nombre","Identificación","Cargo","Correo","Teléfono","Ciudad","Servicio","Área de mejora","Prioridad","Estado","Experiencia","Propuesta","Lo que más gustó","Facilidad de reserva","Atención en mostradores","Puntualidad","Atención a bordo","Equipaje","Solicita seguimiento"];const keys=["id","createdAt","participant","name","identifier","role","email","phone","city","service","area","priority","status","experience","proposal","positive"];const rows=list.map(r=>[...keys.map(k=>k==="createdAt"?fmtDate(r[k]):r[k]??""),...ratingNames.map(n=>r.ratings?.[n]??""),r.followup?"Sí":"No"]);const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="aeropostal-feedback-"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast("Exportación CSV preparada.")}
$("#exportCsv").addEventListener("click",exportCSV);
$("#resetDemo").addEventListener("click",()=>{if(confirm("¿Restablecer los datos de prueba? Se eliminarán los comentarios creados durante esta sesión.")){records=seedData();saveRecords();renderDashboard();renderSubmissions();showToast("Datos de demostración restablecidos.")}});
renderDashboard();renderSubmissions();

// --- Demo de separación de accesos ---
// Esto solo protege la interfaz de la demo. No es autenticación de producción.
const DEMO_ADMIN_PASSWORD = "Aero2026!";
let adminAuthenticated = false;
let pendingAdminView = "dashboard";
const originalSetView = setView;
setView = function(name) {
  if ((name === "dashboard" || name === "submissions") && !adminAuthenticated) {
    pendingAdminView = name;
    openAdminLogin();
    return;
  }
  originalSetView(name);
  updateRoleUI();
};
function updateRoleUI() {
  $$(".admin-only").forEach(el => el.classList.toggle("hidden", !adminAuthenticated));
  $("#adminEntry").classList.toggle("hidden", adminAuthenticated);
  $("#adminLogout").classList.toggle("hidden", !adminAuthenticated);
  if (!adminAuthenticated && ($("#view-dashboard").classList.contains("active") || $("#view-submissions").classList.contains("active"))) {
    originalSetView("welcome");
  }
}
function openAdminLogin() {
  $("#adminLoginModal").classList.remove("hidden");
  $("#adminPassword").value = "";
  $("#loginError").classList.add("hidden");
  setTimeout(() => $("#adminPassword").focus(), 20);
}
function closeAdminLogin() {
  $("#adminLoginModal").classList.add("hidden");
}
$("#adminEntry").addEventListener("click", () => { pendingAdminView = "dashboard"; openAdminLogin(); });
$("#closeAdminLogin").addEventListener("click", closeAdminLogin);
$("#cancelAdminLogin").addEventListener("click", closeAdminLogin);
$("#adminLoginModal").addEventListener("click", e => { if (e.target === $("#adminLoginModal")) closeAdminLogin(); });
$("#adminLoginForm").addEventListener("submit", e => {
  e.preventDefault();
  if ($("#adminPassword").value === DEMO_ADMIN_PASSWORD) {
    adminAuthenticated = true;
    closeAdminLogin();
    updateRoleUI();
    originalSetView(pendingAdminView);
    updateRoleUI();
    showToast("Acceso de demostración concedido.");
  } else {
    $("#loginError").classList.remove("hidden");
    $("#adminPassword").focus();
  }
});
$("#adminLogout").addEventListener("click", () => {
  adminAuthenticated = false;
  originalSetView("welcome");
  updateRoleUI();
  showToast("Sesión de demostración cerrada.");
});
const originalNavListeners = true;
$$(".nav-link[data-view]").forEach(el => {
  // Rebind click handler to route through the role-aware navigation function.
  el.onclick = () => setView(el.dataset.view);
});
// Keep all participant-facing entry points public, and default to the welcome page.
updateRoleUI();
originalSetView("welcome");
