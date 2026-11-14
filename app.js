const pages = {
  overview: ["نظرة عامة", "تحكم في سيرفر Minecraft Java وBedrock من مكان واحد."],
  console: ["Console", "مخرجات السيرفر وأوامر الإدارة."],
  players: ["اللاعبون", "قائمة اللاعبين المتصلين بالسيرفر."],
  files: ["File Manager", "ملفات ومجلدات Minecraft."],
  plugins: ["Plugins", "إضافات Java وBedrock."],
  settings: ["الإعدادات", "خيارات واجهة FreeHost."]
};

const nav = document.getElementById("navigation");
const title = document.getElementById("page-title");
const subtitle = document.getElementById("page-subtitle");

function showPage(name) {
  if (!pages[name]) return;
  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  document.getElementById(`${name}-page`).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === name);
  });
  title.textContent = pages[name][0];
  subtitle.textContent = pages[name][1];
}

nav.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) showPage(button.dataset.page);
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

const statusText = document.getElementById("status-text");
const statusNote = document.getElementById("status-note");
const miniStatus = document.getElementById("mini-status");
const indicator = document.getElementById("status-indicator");
const startButton = document.getElementById("start-btn");
let demoRunning = false;

function setDemoStatus(running) {
  demoRunning = running;
  statusText.textContent = running ? "يعمل (تجريبي)" : "متوقف";
  miniStatus.textContent = running ? "يعمل (تجريبي)" : "متوقف";
  statusNote.textContent = running
    ? "هذه محاكاة داخل الواجهة وليست عملية تشغيل فعلية"
    : "لا يوجد اتصال باستضافة حقيقية";
  indicator.classList.toggle("running", running);
  startButton.textContent = running ? "■ إيقاف تجريبي" : "▶ تشغيل تجريبي";
  addLog(running
    ? "[Demo] تم تغيير الحالة إلى يعمل داخل الواجهة فقط."
    : "[Demo] تم تغيير الحالة إلى متوقف داخل الواجهة فقط.");
}

startButton.addEventListener("click", () => setDemoStatus(!demoRunning));

function addLog(message) {
  ["console-output", "full-console"].forEach(id => {
    const box = document.getElementById(id);
    if (!box) return;
    const line = document.createElement("p");
    line.textContent = message;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  });
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  addLog("[FreeHost] تم تحديث العرض التجريبي. لا توجد بيانات خارجية.");
});

document.getElementById("clear-console").addEventListener("click", () => {
  document.getElementById("full-console").replaceChildren();
});

document.getElementById("command-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("command-input");
  const command = input.value.trim();
  if (!command) return;
  addLog(`> ${command}`);
  addLog(`[Demo] الأمر "${command}" لم يُرسل إلى أي سيرفر.`);
  input.value = "";
});

document.getElementById("server-name").addEventListener("change", event => {
  const name = event.target.value.trim() || "My Minecraft Server";
  document.querySelector(".server-name strong").textContent = name;
  addLog(`[Demo] اسم العرض أصبح: ${name}`);
});
