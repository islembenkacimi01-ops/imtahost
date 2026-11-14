const pages = ["overview","console","resources","files","sftp","acl","settings"];
const titles = {overview:"نظرة عامة",console:"Console",resources:"Resources",files:"File Manager",sftp:"SFTP",acl:"ACL / الصلاحيات",settings:"الإعدادات"};
const descriptions = {overview:"تحكم في سيرفر MTA:SA وراقب حالته من مكان واحد.",console:"تابع سجل الأحداث وأوامر الإدارة.",resources:"إدارة موارد ومودات MTA:SA.",files:"تصفح ملفات السيرفر.",sftp:"بيانات الاتصال الآمن بالملفات.",acl:"إدارة مجموعات وصلاحيات السيرفر.",settings:"إعداد المعلومات الأساسية للسيرفر."};
let serverRunning = false;
const nav = document.getElementById("navigation");
function showPage(page){
  pages.forEach(p=>document.getElementById(p+"-page").classList.toggle("hidden",p!==page));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("page-title").textContent=titles[page];
  document.getElementById("page-subtitle").textContent=descriptions[page];
}
nav.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)showPage(b.dataset.page)});
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
function logLine(text){
  ["console-output","full-console"].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    const p=document.createElement("p");p.textContent=text;el.appendChild(p);el.scrollTop=el.scrollHeight;
  });
}
function setStatus(running){
  serverRunning=running;
  document.getElementById("status-text").textContent=running?"قيد التشغيل (محاكاة)":"متوقف";
  document.getElementById("status-note").textContent=running?"حالة تجريبية — لا يوجد اتصال فعلي":"السيرفر غير مشغّل حالياً";
  document.getElementById("mini-status").textContent=running?"تجريبي":"متوقف";
  document.getElementById("status-indicator").style.background=running?"#27c78a":"#78859b";
  document.getElementById("start-btn").textContent=running?"■ إيقاف السيرفر":"▶ تشغيل السيرفر";
}
document.getElementById("start-btn").addEventListener("click",()=>{
  setStatus(!serverRunning);
  logLine(serverRunning?"[DEMO] Start requested — يلزم Backend لتشغيل MTA الحقيقي.":"[DEMO] Stop requested — هذه محاكاة للواجهة فقط.");
});
document.getElementById("refresh-btn").addEventListener("click",()=>logLine("[UI] تم تحديث العرض التجريبي."));
document.getElementById("clear-console").addEventListener("click",()=>{document.getElementById("full-console").innerHTML="";});
document.getElementById("command-form").addEventListener("submit",e=>{
  e.preventDefault();const input=document.getElementById("command-input");const value=input.value.trim();if(!value)return;
  logLine("[LOCAL DEMO] > "+value);input.value="";
});
document.getElementById("add-resource").addEventListener("click",()=>{
  const name=prompt("أدخل اسم Resource للتجربة:");
  if(!name||!name.trim())return;
  const tbody=document.getElementById("resource-list");
  if(tbody.querySelector(".empty-row"))tbody.innerHTML="";
  const tr=document.createElement("tr");
  [name.trim(),"غير مشغّل","MTA Resource"].forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.appendChild(td)});
  const action=document.createElement("td");const btn=document.createElement("button");btn.className="text-btn";btn.textContent="تشغيل تجريبي";btn.addEventListener("click",()=>{btn.textContent=btn.textContent==="تشغيل تجريبي"?"إيقاف تجريبي":"تشغيل تجريبي"});action.appendChild(btn);tr.appendChild(action);tbody.appendChild(tr);
  logLine("[DEMO] Resource added: "+name.trim());
});
