const STORE_KEY = "pawsfirst_app_state_v1";

const seed = {
  role: "client",
  view: "login",
  tab: "home",
  user: {
    name: "Sarah Collins",
    email: "sarah@example.com",
    area: "Rochester, Medway"
  },
  dogs: [
    { id: 1, name: "Buddy", breed: "Cockapoo", age: "4", temperament: "Friendly, loves group walks", notes: "Keep on lead near roads. Loves chicken treats.", emoji: "🐶" },
    { id: 2, name: "Molly", breed: "Cocker Spaniel", age: "7", temperament: "Gentle, prefers calmer dogs", notes: "Slightly nervous in heavy rain.", emoji: "🐕" }
  ],
  bookings: [
    { id: 101, dog: "Buddy", type: "Group walk", date: "Mon 10 Aug", time: "12:30", status: "Confirmed", location: "Rochester" },
    { id: 102, dog: "Molly", type: "Solo walk", date: "Wed 12 Aug", time: "10:00", status: "Confirmed", location: "Chatham" },
    { id: 103, dog: "Buddy", type: "Group walk", date: "Fri 14 Aug", time: "12:30", status: "Pending", location: "Rochester" }
  ],
  invoices: [
    { id: "PF-1041", month: "August", amount: 88, status: "Due", due: "15 Aug", items: "4 group walks" },
    { id: "PF-1028", month: "July", amount: 124, status: "Paid", due: "Paid 29 Jul", items: "6 walks + 1 pop-in" }
  ],
  messages: [
    { from: "PawsFirst", text: "Buddy had a brilliant walk today at Capstone. He was calm around other dogs and loved the shaded route.", time: "Today, 13:42" },
    { from: "PawsFirst", text: "Molly's solo walk is confirmed for Wednesday at 10:00.", time: "Yesterday, 18:10" }
  ],
  media: [
    { id: 1, dog: "Buddy", label: "Capstone walk", kind: "photo", emoji: "🌳" },
    { id: 2, dog: "Molly", label: "Sunny stroll", kind: "photo", emoji: "☀️" },
    { id: 3, dog: "Buddy", label: "Treat break", kind: "video", emoji: "🎥" },
    { id: 4, dog: "Molly", label: "Happy tail", kind: "photo", emoji: "🐾" }
  ],
  admin: {
    todayWalks: 7,
    pendingRequests: 3,
    unpaidInvoices: 2,
    monthlyRevenue: 1840,
    clients: ["Sarah Collins", "Mark Evans", "Priya Patel", "Helen Moore", "Daniel Brown"],
    route: ["Rochester", "Chatham", "Gillingham"]
  }
};

let state = loadState();
const app = document.getElementById("app");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    return saved ? { ...seed, ...saved } : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}
function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function setState(patch) { state = { ...state, ...patch }; saveState(); render(); }
function go(tab) { state.tab = tab; state.view = "app"; saveState(); render(); window.scrollTo(0, 0); }
function toast(message) {
  const node = document.querySelector(".toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2400);
}
function money(value) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value); }

function Header() {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand" onclick="go('home')" role="button" tabindex="0">
          <div class="logo">🐾</div>
          <div>PawsFirst<small>Medway dog walking app</small></div>
        </div>
        <div class="role-pill" aria-label="Role switcher">
          <button class="${state.role === "client" ? "active" : ""}" onclick="switchRole('client')">Client</button>
          <button class="${state.role === "admin" ? "active" : ""}" onclick="switchRole('admin')">Owner</button>
        </div>
      </div>
    </header>`;
}
function switchRole(role) {
  state.role = role;
  state.tab = "home";
  saveState();
  render();
  toast(role === "client" ? "Client app loaded" : "Owner dashboard loaded");
}
function Login() {
  return `
    <div class="app-shell">
      ${Header()}
      <main class="login-wrap">
        <section class="login-card">
          <div class="hero-card">
            <span class="kicker">Trusted Medway dog walking</span>
            <h1>Care first. Paws always.</h1>
            <p>PawsFirst gives new and existing clients a simple way to request walks, manage dog details, view schedules, check invoices, and receive private photo updates after every adventure.</p>
            <div class="hero-actions">
              <button class="btn primary" onclick="enterApp('client')">Open client demo</button>
              <button class="btn secondary" onclick="enterApp('admin')">Open owner demo</button>
            </div>
            <div class="stats">
              <div class="stat"><b>10+</b><span>years experience</span></div>
              <div class="stat"><b>Medway</b><span>local coverage</span></div>
              <div class="stat"><b>Private</b><span>dog updates</span></div>
            </div>
          </div>
          <div class="auth-card">
            <span class="kicker">App prototype</span>
            <h2>Login experience</h2>
            <p>This demo shows how PawsFirst could feel as a real app for dog owners and your mum as the business owner.</p>
            <div class="field">
              <label>Email</label>
              <input value="sarah@example.com" aria-label="Email" />
            </div>
            <div class="field">
              <label>Password</label>
              <input type="password" value="pawsfirst" aria-label="Password" />
            </div>
            <button class="btn primary full" onclick="enterApp(state.role)">Continue</button>
            <div class="demo-note">No real login yet. This is a UX/UI prototype with saved demo data in your browser.</div>
          </div>
        </section>
      </main>
      <div class="toast"></div>
    </div>`;
}
function enterApp(role) { state.role = role; state.view = "app"; state.tab = "home"; saveState(); render(); }
function Shell(content) {
  return `
    <div class="app-shell">
      ${Header()}
      <main class="page">${content}</main>
      ${state.role === "client" ? ClientTabs() : AdminTabs()}
      <button class="fab" onclick="openQuickAction()" title="Quick action">＋</button>
      ${Drawer()}
      <div class="toast"></div>
    </div>`;
}
function ClientTabs() {
  const tabs = [
    ["home", "🏠", "Home"], ["book", "📅", "Book"], ["dogs", "🐶", "Dogs"], ["media", "📸", "Media"], ["account", "💳", "Account"]
  ];
  return `<nav class="tabs">${tabs.map(([id, icon, label]) => `<button class="tab-btn ${state.tab===id?'active':''}" onclick="go('${id}')"><span>${icon}</span>${label}</button>`).join("")}</nav>`;
}
function AdminTabs() {
  const tabs = [
    ["home", "📊", "Today"], ["book", "✅", "Requests"], ["dogs", "👥", "Clients"], ["media", "📸", "Media"], ["account", "💷", "Money"]
  ];
  return `<nav class="tabs">${tabs.map(([id, icon, label]) => `<button class="tab-btn ${state.tab===id?'active':''}" onclick="go('${id}')"><span>${icon}</span>${label}</button>`).join("")}</nav>`;
}
function Drawer() {
  return `
    <div class="drawer" id="drawer">
      <div class="sheet">
        <div class="sheet-inner">
          <button class="close" onclick="closeDrawer()">✕</button>
          <div id="drawerContent"></div>
        </div>
      </div>
    </div>`;
}
function openDrawer(html) {
  document.getElementById("drawerContent").innerHTML = html;
  document.getElementById("drawer").classList.add("open");
}
function closeDrawer() { document.getElementById("drawer").classList.remove("open"); }
function openQuickAction() {
  if (state.role === "client") return openBookingSheet();
  return openAdminUpdateSheet();
}

function ClientHome() {
  const due = state.invoices.find(i => i.status === "Due");
  const next = state.bookings[0];
  return `
    <div class="dashboard-grid">
      <section class="welcome">
        <span class="kicker" style="color:#dff4ea">Good afternoon, ${state.user.name.split(' ')[0]}</span>
        <h2>${next.dog}'s next walk is ${next.date}</h2>
        <p>${next.type} at ${next.time} in ${next.location}. You’ll get a private update and photos after the walk.</p>
        <div class="quick-grid">
          <div class="quick-card"><b>${state.bookings.length}</b><span>Upcoming walks</span></div>
          <div class="quick-card"><b>${due ? money(due.amount) : "£0"}</b><span>Payment due</span></div>
          <div class="quick-card"><b>${state.media.length}</b><span>Dog memories</span></div>
          <div class="quick-card"><b>10+</b><span>Years care</span></div>
        </div>
      </section>
      <section class="card">
        <div class="section-head"><div><span class="kicker">Today’s update</span><h3>Latest message</h3></div><span class="badge">Private</span></div>
        <p>${state.messages[0].text}</p>
        <br><small class="badge grey">${state.messages[0].time}</small>
      </section>
    </div>
    <br>
    <div class="grid-3">
      <article class="item highlight"><h3>Book in seconds</h3><p>Request regular weekly walks, one-off cover, puppy visits or a meet & greet.</p><br><button class="btn primary" onclick="go('book')">Request booking</button></article>
      <article class="item"><h3>Private dog gallery</h3><p>See photos and videos uploaded specifically for your dog after walks.</p><br><button class="btn secondary" onclick="go('media')">View media</button></article>
      <article class="item due"><h3>Invoices</h3><p>${due ? `${due.id} is due by ${due.due}.` : "No invoices due right now."}</p><br><button class="btn warn" onclick="go('account')">View payments</button></article>
    </div>
    <br>
    ${ScheduleCard()}`;
}
function ScheduleCard() {
  return `<section class="card"><div class="section-head"><div><span class="kicker">Schedule</span><h2>Upcoming walks</h2></div><button class="btn secondary" onclick="openBookingSheet()">Add request</button></div><div class="list">${state.bookings.map(b => ScheduleRow(b)).join("")}</div></section>`;
}
function ScheduleRow(b) {
  const [day, date, month] = b.date.split(" ");
  return `<div class="schedule-row"><div class="datebox"><span>${month || "Aug"}</span>${date || "10"}</div><div class="row-main"><b>${b.dog} — ${b.type}</b><small>${day} at ${b.time} · ${b.location}</small></div><span class="badge ${b.status === 'Pending' ? 'orange' : ''}">${b.status}</span></div>`;
}
function ClientBook() {
  return `
    <section class="card">
      <span class="kicker">Booking</span><h2>Request a walk or visit</h2><p>Designed so clients can request a booking while your mum still approves availability and dog suitability before anything is confirmed.</p><br>
      ${BookingForm()}
    </section>
    <br>
    <div class="grid-3">
      <div class="item"><h3>Meet & greet</h3><p>Best for new clients. Discuss routine, behaviour, keys, location and dog needs.</p></div>
      <div class="item"><h3>Regular slot</h3><p>Weekly walking schedule for busy owners who want consistency.</p></div>
      <div class="item"><h3>Ad-hoc cover</h3><p>One-off help for holidays, office days, appointments or emergencies.</p></div>
    </div>`;
}
function BookingForm() {
  return `<form onsubmit="submitBooking(event)">
    <div class="grid-2"><div class="field"><label>Dog</label><select name="dog">${state.dogs.map(d => `<option>${d.name}</option>`).join("")}<option>New dog</option></select></div><div class="field"><label>Service</label><select name="type"><option>Group walk</option><option>Solo walk</option><option>Puppy visit</option><option>Pet pop-in</option><option>Meet & greet</option></select></div></div>
    <div class="grid-2"><div class="field"><label>Preferred date</label><input name="date" type="date" /></div><div class="field"><label>Preferred time</label><select name="time"><option>Morning</option><option>Midday</option><option>Afternoon</option></select></div></div>
    <div class="field"><label>Notes</label><textarea name="notes" placeholder="Tell PawsFirst about routine, behaviour, access, lead preference, or anything your dog needs."></textarea></div>
    <button class="btn primary full">Send request</button>
  </form>`;
}
function submitBooking(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const dog = form.get("dog");
  const type = form.get("type");
  state.bookings.unshift({ id: Date.now(), dog, type, date: "Pending", time: form.get("time"), status: "Pending", location: state.user.area.split(',')[0] });
  saveState();
  event.target.reset();
  render();
  setTimeout(() => toast("Booking request sent for approval"), 80);
}
function openBookingSheet() {
  openDrawer(`<span class="kicker">Quick booking</span><h2>Request a new visit</h2><p>Send a request to PawsFirst. The owner approves availability before confirming.</p><br>${BookingForm()}`);
}
function ClientDogs() {
  return `<section class="card"><div class="section-head"><div><span class="kicker">Dog profiles</span><h2>Your dogs</h2></div><button class="btn primary" onclick="openDogSheet()">Add dog</button></div><div class="grid-2">${state.dogs.map(DogCard).join("")}</div></section>`;
}
function DogCard(d) {
  return `<article class="item"><div class="dog-card"><div class="avatar">${d.emoji}</div><div><h3>${d.name}</h3><p>${d.breed} · ${d.age} years old</p></div></div><br><p><b>Temperament:</b> ${d.temperament}</p><p><b>Care notes:</b> ${d.notes}</p><br><button class="btn secondary" onclick="toast('Edit profile would open here')">Edit profile</button></article>`;
}
function openDogSheet() {
  openDrawer(`<span class="kicker">Dog profile</span><h2>Add a dog</h2><form onsubmit="addDog(event)"><div class="field"><label>Name</label><input name="name" required></div><div class="grid-2"><div class="field"><label>Breed</label><input name="breed"></div><div class="field"><label>Age</label><input name="age"></div></div><div class="field"><label>Temperament</label><textarea name="temperament"></textarea></div><div class="field"><label>Care notes</label><textarea name="notes"></textarea></div><button class="btn primary full">Save dog</button></form>`);
}
function addDog(event) {
  event.preventDefault();
  const f = new FormData(event.target);
  state.dogs.push({ id: Date.now(), name: f.get("name"), breed: f.get("breed") || "Dog", age: f.get("age") || "", temperament: f.get("temperament") || "To be added", notes: f.get("notes") || "No notes yet", emoji: "🐕" });
  saveState(); closeDrawer(); render(); setTimeout(() => toast("Dog profile added"), 80);
}
function ClientMedia() {
  return `<section class="card"><div class="section-head"><div><span class="kicker">Private media</span><h2>Walk memories</h2><p>Each client would only see their own dog's photos and videos here.</p></div><button class="btn secondary" onclick="toast('Filter by dog would open here')">Filter</button></div><div class="media-grid">${state.media.map(MediaTile).join("")}</div></section><br><section class="card"><span class="kicker">Public gallery idea</span><h2>Marketing media feed</h2><p>The public website can show approved walk photos and short videos, while this app keeps private client-specific media separate.</p></section>`;
}
function MediaTile(m) {
  return `<div class="media-tile">${m.src ? `<img src="${m.src}" alt="${m.label}">` : `<span>${m.emoji || '📸'}</span>`}<small>${m.dog} · ${m.label}</small></div>`;
}
function ClientAccount() {
  return `<div class="dashboard-grid"><section class="card"><span class="kicker">Invoices</span><h2>Payments</h2><div class="list">${state.invoices.map(InvoiceRow).join("")}</div></section><section class="card"><span class="kicker">Messages</span><h2>Updates from PawsFirst</h2><div class="list">${state.messages.map(m => `<div class="item"><b>${m.from}</b><p>${m.text}</p><br><span class="badge grey">${m.time}</span></div>`).join("")}</div></section></div>`;
}
function InvoiceRow(i) {
  return `<div class="schedule-row"><div class="datebox"><span>${i.month.slice(0,3)}</span>${money(i.amount).replace('£','£')}</div><div class="row-main"><b>${i.id} — ${i.items}</b><small>${i.due}</small></div><span class="badge ${i.status==='Due'?'orange':''}">${i.status}</span></div>`;
}

function AdminHome() {
  return `<div class="dashboard-grid"><section class="welcome"><span class="kicker" style="color:#dff4ea">Owner dashboard</span><h2>Today’s PawsFirst plan</h2><p>Manage walks, new requests, routes, invoices, and dog media from one simple dashboard.</p><div class="quick-grid"><div class="quick-card"><b>${state.admin.todayWalks}</b><span>Walks today</span></div><div class="quick-card"><b>${state.admin.pendingRequests}</b><span>Pending requests</span></div><div class="quick-card"><b>${state.admin.unpaidInvoices}</b><span>Invoices due</span></div><div class="quick-card"><b>${money(state.admin.monthlyRevenue)}</b><span>Month so far</span></div></div></section><section class="card"><span class="kicker">Route view</span><h2>Medway route</h2><div class="route-map"><div class="route-line"></div><div class="pin a"><span>1</span></div><div class="pin b"><span>2</span></div><div class="pin c"><span>3</span></div></div><br><p>Prototype route planning for Rochester, Chatham and Gillingham walks.</p></section></div><br><section class="card"><span class="kicker">Today’s walks</span><h2>Schedule</h2><div class="list">${state.bookings.map(ScheduleRow).join("")}</div></section>`;
}
function AdminRequests() {
  return `<section class="card"><div class="section-head"><div><span class="kicker">Booking requests</span><h2>Approve or message clients</h2></div><button class="btn primary" onclick="toast('New manual booking would open here')">Add booking</button></div><div class="list">${state.bookings.map(b => `<div class="schedule-row"><div class="datebox"><span>${b.status}</span>🐾</div><div class="row-main"><b>${b.dog} — ${b.type}</b><small>${b.date} · ${b.time} · ${b.location}</small></div><button class="btn secondary" onclick="approveBooking(${b.id})">Approve</button></div>`).join("")}</div></section>`;
}
function approveBooking(id) {
  state.bookings = state.bookings.map(b => b.id === id ? { ...b, status: "Confirmed", date: b.date === "Pending" ? "Tue 18 Aug" : b.date } : b);
  saveState(); render(); setTimeout(() => toast("Booking approved"), 80);
}
function AdminClients() {
  return `<section class="card"><span class="kicker">Clients</span><h2>Client and dog CRM</h2><div class="grid-2">${state.admin.clients.map((c, idx) => `<div class="item"><div class="dog-card"><div class="avatar">${idx % 2 ? '🐕' : '🐶'}</div><div><h3>${c}</h3><p>${idx + 1} dog${idx ? 's' : ''} · Medway client</p></div></div><br><div class="progress" title="profile completion"><i style="--w:${70 + idx * 5}%"></i></div><br><button class="btn secondary" onclick="toast('Client record would open here')">Open record</button></div>`).join("")}</div></section>`;
}
function AdminMedia() {
  return `<section class="card"><div class="section-head"><div><span class="kicker">Media manager</span><h2>Upload walk photos</h2><p>Upload once, tag a dog, then publish privately to that client or approve for public gallery.</p></div><button class="btn primary" onclick="openAdminUpdateSheet()">Upload</button></div><div class="media-grid">${state.media.map(MediaTile).join("")}</div></section>`;
}
function openAdminUpdateSheet() {
  openDrawer(`<span class="kicker">Walk update</span><h2>Upload dog media</h2><form onsubmit="addMedia(event)"><div class="grid-2"><div class="field"><label>Dog</label><select name="dog">${state.dogs.map(d => `<option>${d.name}</option>`).join("")}</select></div><div class="field"><label>Update type</label><select name="kind"><option>photo</option><option>video</option><option>note</option></select></div></div><div class="field"><label>Label</label><input name="label" placeholder="e.g. Riverside walk" required></div><div class="field"><label>Photo preview</label><input type="file" name="file" accept="image/*"></div><div class="field"><label>Walk note</label><textarea name="note" placeholder="How did the walk go?"></textarea></div><button class="btn primary full">Publish private update</button></form>`);
}
function addMedia(event) {
  event.preventDefault();
  const f = new FormData(event.target);
  const file = event.target.file.files[0];
  const finish = (src) => {
    state.media.unshift({ id: Date.now(), dog: f.get("dog"), label: f.get("label"), kind: f.get("kind"), emoji: f.get("kind") === "video" ? "🎥" : "📸", src });
    state.messages.unshift({ from: "PawsFirst", text: `${f.get("dog")} has a new private ${f.get("kind")} update: ${f.get("label")}.`, time: "Just now" });
    saveState(); closeDrawer(); render(); setTimeout(() => toast("Private media update published"), 80);
  };
  if (file) { const reader = new FileReader(); reader.onload = () => finish(reader.result); reader.readAsDataURL(file); }
  else finish(null);
}
function AdminMoney() {
  const dueTotal = state.invoices.filter(i => i.status === "Due").reduce((sum, i) => sum + i.amount, 0);
  return `<div class="grid-3"><div class="item admin-metric"><div><span class="kicker">Due</span><h3>Outstanding</h3></div><strong>${money(dueTotal)}</strong></div><div class="item admin-metric"><div><span class="kicker">Revenue</span><h3>This month</h3></div><strong>${money(state.admin.monthlyRevenue)}</strong></div><div class="item admin-metric"><div><span class="kicker">Clients</span><h3>Active</h3></div><strong>${state.admin.clients.length}</strong></div></div><br><section class="card"><span class="kicker">Invoices</span><h2>Invoice list</h2><div class="list">${state.invoices.map(InvoiceRow).join("")}</div><br><button class="btn primary" onclick="toast('Invoice creation would open here')">Create invoice</button></section>`;
}
function renderContent() {
  if (state.role === "admin") {
    if (state.tab === "book") return AdminRequests();
    if (state.tab === "dogs") return AdminClients();
    if (state.tab === "media") return AdminMedia();
    if (state.tab === "account") return AdminMoney();
    return AdminHome();
  }
  if (state.tab === "book") return ClientBook();
  if (state.tab === "dogs") return ClientDogs();
  if (state.tab === "media") return ClientMedia();
  if (state.tab === "account") return ClientAccount();
  return ClientHome();
}
function render() { app.innerHTML = state.view === "login" ? Login() : Shell(renderContent()); }
window.switchRole = switchRole;
window.enterApp = enterApp;
window.go = go;
window.openQuickAction = openQuickAction;
window.openBookingSheet = openBookingSheet;
window.openAdminUpdateSheet = openAdminUpdateSheet;
window.closeDrawer = closeDrawer;
window.submitBooking = submitBooking;
window.addDog = addDog;
window.openDogSheet = openDogSheet;
window.addMedia = addMedia;
window.approveBooking = approveBooking;
window.toast = toast;
render();
