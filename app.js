/* TaskFlow - Basit görev yönetimi (localStorage) */

const KEYS = {
  users: 'tf_users',
  session: 'tf_session',
  projects: 'tf_projects',
  tasks: 'tf_tasks',
};

const STATUSES = [
  { id: 'ToDo', label: 'To Do' },
  { id: 'InProgress', label: 'Devam Ediyor' },
  { id: 'Review', label: 'İnceleme' },
  { id: 'Completed', label: 'Tamamlandı' },
];

const PRIORITIES = [
  { id: 'Low', label: 'Düşük' },
  { id: 'Medium', label: 'Orta' },
  { id: 'High', label: 'Yüksek' },
  { id: 'Critical', label: 'Kritik' },
];

const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const load = (key, fallback = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function seed() {
  if (localStorage.getItem('tf_ready')) return;

  const adminId = id();
  const userId = id();
  const projectId = id();

  save(KEYS.users, [
    { id: adminId, name: 'Admin', surname: 'User', email: 'admin@taskflow.com', password: 'Admin123!', role: 'Admin' },
    { id: userId, name: 'Demo', surname: 'Kullanıcı', email: 'user@taskflow.com', password: 'User123!', role: 'User' },
  ]);

  save(KEYS.projects, [{
    id: projectId,
    name: 'TaskFlow Demo',
    description: 'Örnek proje — görevlerini buradan yönet.',
    ownerId: adminId,
    members: [userId],
    updatedAt: new Date().toISOString(),
  }]);

  save(KEYS.tasks, [
    { id: id(), projectId, title: 'Tasarımı tamamla', priority: 'Medium', status: 'Completed', assigneeId: adminId, dueDate: '2026-07-01', createdAt: new Date().toISOString() },
    { id: id(), projectId, title: 'Görev listesi sayfası', priority: 'High', status: 'InProgress', assigneeId: userId, dueDate: '2026-07-15', createdAt: new Date().toISOString() },
    { id: id(), projectId, title: 'Kanban panosu', priority: 'High', status: 'ToDo', assigneeId: userId, dueDate: '2026-07-20', createdAt: new Date().toISOString() },
  ]);

  localStorage.setItem('tf_ready', '1');
}

function me() {
  seed();
  const raw = localStorage.getItem(KEYS.session);
  return raw ? JSON.parse(raw) : null;
}

function login(email, password) {
  const user = load(KEYS.users).find((u) => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) throw new Error('E-posta veya şifre hatalı.');
  localStorage.setItem(KEYS.session, JSON.stringify(user));
  return user;
}

function register(name, surname, email, password) {
  const users = load(KEYS.users);
  const mail = email.trim().toLowerCase();
  if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta zaten kayıtlı.');
  const user = { id: id(), name, surname, email: mail, password, role: 'User' };
  users.push(user);
  save(KEYS.users, users);
  localStorage.setItem(KEYS.session, JSON.stringify(user));
  return user;
}

function logout() {
  localStorage.removeItem(KEYS.session);
  location.href = 'index.html';
}

function guard(adminOnly) {
  const user = me();
  if (!user) {
    location.href = 'index.html';
    return null;
  }
  if (adminOnly && user.role !== 'Admin') {
    location.href = 'projects.html';
    return null;
  }
  return user;
}

function userName(userId) {
  const u = load(KEYS.users).find((x) => x.id === userId);
  return u ? `${u.name} ${u.surname}` : '—';
}

function projectsFor(user) {
  return load(KEYS.projects).filter(
    (p) => user.role === 'Admin' || p.ownerId === user.id || (p.members || []).includes(user.id)
  );
}

function tasksFor(user, projectId) {
  let tasks = load(KEYS.tasks);
  if (projectId) tasks = tasks.filter((t) => t.projectId === projectId);
  if (user.role !== 'Admin') tasks = tasks.filter((t) => t.assigneeId === user.id);
  return tasks;
}

function projectStats(projectId) {
  const tasks = load(KEYS.tasks).filter((t) => t.projectId === projectId);
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Completed').length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

function fmtDate(value) {
  return value ? new Date(value).toLocaleDateString('tr-TR') : '—';
}

function statusLabel(value) {
  return STATUSES.find((s) => s.id === value)?.label || value;
}

function priorityLabel(value) {
  return PRIORITIES.find((p) => p.id === value)?.label || value;
}

function badge(status) {
  return { ToDo: 'b-todo', InProgress: 'b-progress', Review: 'b-review', Completed: 'b-done' }[status] || 'b-todo';
}

function pbadge(priority) {
  return { Low: 'b-low', Medium: 'b-med', High: 'b-high', Critical: 'b-crit' }[priority] || 'b-med';
}

function shell(active, body) {
  const user = me();
  const adminLink = user.role === 'Admin'
    ? `<a href="dashboard.html" class="${active === 'dashboard' ? 'on' : ''}">Dashboard</a>`
    : '';

  return `
  <div class="wrap">
    <aside class="side">
      <div class="brand">TaskFlow</div>
      <nav>
        ${adminLink}
        <a href="projects.html" class="${active === 'projects' ? 'on' : ''}">Projeler</a>
        <a href="profile.html" class="${active === 'profile' ? 'on' : ''}">Profil</a>
        <a href="#" onclick="logout();return false">Çıkış</a>
      </nav>
    </aside>
    <main class="main">
      <header class="top">${user.name} ${user.surname} <span>${user.role}</span></header>
      <section class="page">${body}</section>
    </main>
  </div>`;
}

function toast(msg, ok) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.className = ok ? 'toast ok' : 'toast err';
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 3000);
}

seed();
