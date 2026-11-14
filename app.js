const $ = (id) => document.getElementById(id);
let servers = [];
let activeServer = null;
let running = false;

function showApp(username) {
  $("auth-view").hidden = true;
  $("app-view").hidden = false;
  $("user-label").textContent = username;
  renderServers();
}
$("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = $("username").value.trim();
  if (username.length < 3) return;
  showApp(username);
});
$("logout").addEventListener("click", () => {
  $("app-view").hidden = true;
  $("auth-view").hidden = false;
  $("password").value = "";
  $("console-panel").hidden = true;
});
$("create-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const server = {
    id: Date.now(),
    name: $("server-name").value.trim(),
    type: $("server-type").value,
    version: $("server-version").value.trim() || "غير محدد",
    image: $("server-image").value.trim()
  };
  servers.push(server);
  $("create-form").reset();
  renderServers();
  openConsole(server.id);
});
function renderServers() {
  $("server-count").textContent = servers.length;
  const list = $("server-list");
  list.innerHTML = "";
  if (!servers.length) {
    list.innerHTML = '<div class="empty">مازال ما عندك حتى سيرفر. أنشئ أول سيرفر من الفوق.</div>';
    return;
  }
  servers.forEach((s) => {
    const card = document.createElement("article");
    card.className = "server-card";
    const image = document.createElement("div");
    image.className = "server-image";
    if (s.image) {
      const img = document.createElement("img");
      img.src = s.image;
      img.alt = "صورة " + s.name;
      img.onerror = () => { image.textContent = "⛏"; };
      image.appendChild(img);
    } else image.textContent = "⛏";
    const info = document.createElement("div");
    info.className = "server-info";
    const title = document.createElement("h3");
    title.textContent = s.name;
    const meta = document.createElement("div");
    meta.className = "server-meta";
    meta.textContent = `${s.type} · Minecraft ${s.version}`;
    const btn = document.createElement("button");
    btn.className = "ghost small";
    btn.textContent = "فتح الكونسول";
    btn.addEventListener("click", () => openConsole(s.id));
    info.append(title, meta, btn);
    card.append(image, info);
    list.appendChild(card);
  });
}
function openConsole(id) {
  activeServer = servers.find(s => s.id === id);
  if (!activeServer) return;
  $("console-panel").hidden = false;
  $("console-title").textContent = activeServer.name;
  $("console-output").textContent = `[FreeHost] تم فتح لوحة السيرفر: ${activeServer.name}\n[Demo] هذه واجهة محاكاة وليست سيرفر Minecraft حقيقي.\n`;
  $("console-panel").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function log(message) {
  $("console-output").textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
  $("console-output").scrollTop = $("console-output").scrollHeight;
}
$("start-server").addEventListener("click", () => {
  if (!activeServer) return;
  running = true;
  log("طلب تشغيل تجريبي — لم يتم تشغيل سيرفر حقيقي.");
});
$("stop-server").addEventListener("click", () => {
  if (!activeServer) return;
  running = false;
  log("طلب إيقاف تجريبي — لم يتم الاتصال بمضيف خارجي.");
});
$("clear-console").addEventListener("click", () => $("console-output").textContent = "");
