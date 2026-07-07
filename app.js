/* TaskFlow - Basit görev yönetimi (localStorage) */

const KEYS = {
  users: 'tf_users',
  session: 'tf_session',
  projects: 'tf_projects',
  tasks: 'tf_tasks',
  comments: 'tf_comments',
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
  save(KEYS.users, []);
  save(KEYS.projects, []);
  save(KEYS.tasks, []);
  save(KEYS.comments, []);
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
    location.href = 'my-tasks.html';
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

function projectsLedBy(user) {
  return load(KEYS.projects).filter((p) => p.ownerId === user.id);
}

function isLeader(user) {
  return user.role === 'Admin' || projectsLedBy(user).length > 0;
}

function canManageProject(user, project) {
  return user.role === 'Admin' || project.ownerId === user.id;
}

function projectTeam(project) {
  const users = load(KEYS.users);
  const ids = [...new Set([project.ownerId, ...(project.members || [])])];
  return ids.map((uid) => users.find((u) => u.id === uid)).filter(Boolean);
}

function usersNotInProject(project) {
  const inTeam = new Set([project.ownerId, ...(project.members || [])]);
  return load(KEYS.users).filter((u) => !inTeam.has(u.id));
}

function projectsForUserId(userId) {
  return load(KEYS.projects).filter(
    (p) => p.ownerId === userId || (p.members || []).includes(userId)
  );
}

function roleLabel(userOrRole) {
  if (typeof userOrRole === 'object') {
    if (userOrRole.role === 'Admin') return 'Admin';
    if (projectsLedBy(userOrRole).length) return 'Lider';
    return 'Üye';
  }
  return userOrRole === 'Admin' ? 'Admin' : 'Üye';
}

function createTeamUser(name, surname, email, password) {
  const users = load(KEYS.users);
  const mail = email.trim().toLowerCase();
  if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta zaten kayıtlı.');
  if (password.length < 6) throw new Error('Şifre en az 6 karakter olmalı.');
  const user = { id: id(), name, surname, email: mail, password, role: 'User' };
  users.push(user);
  save(KEYS.users, users);
  return user;
}

function tasksFor(user, projectId) {
  let tasks = load(KEYS.tasks);
  if (projectId) {
    tasks = tasks.filter((t) => t.projectId === projectId);
    const project = load(KEYS.projects).find((p) => p.id === projectId);
    if (user.role === 'Admin' || (project && project.ownerId === user.id)) return tasks;
    return tasks.filter((t) => t.assigneeId === user.id);
  }
  if (user.role === 'Admin') return tasks;
  const ledIds = new Set(projectsLedBy(user).map((p) => p.id));
  return tasks.filter((t) => t.assigneeId === user.id || ledIds.has(t.projectId));
}

function projectStats(projectId) {
  const tasks = load(KEYS.tasks).filter((t) => t.projectId === projectId);
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Completed').length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isOverdue(task) {
  if (!task.dueDate || task.status === 'Completed') return false;
  return new Date(task.dueDate) < todayStart();
}

function isDueToday(task) {
  if (!task.dueDate || task.status === 'Completed') return false;
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === todayStart().getTime();
}

function notificationsFor(user) {
  const tasks = tasksFor(user);
  const list = [];
  tasks.forEach((t) => {
    if (t.status === 'Completed' || !t.dueDate) return;
    const project = load(KEYS.projects).find((p) => p.id === t.projectId);
    if (isOverdue(t)) {
      list.push({ type: 'err', text: `"${t.title}" gecikti`, project: project?.name });
    } else if (isDueToday(t)) {
      list.push({ type: 'warn', text: `"${t.title}" bugün teslim`, project: project?.name });
    }
  });
  return list;
}

function commentsFor(taskId) {
  return load(KEYS.comments).filter((c) => c.taskId === taskId);
}

function addComment(taskId, userId, text) {
  const comments = load(KEYS.comments);
  comments.push({
    id: id(),
    taskId,
    userId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });
  save(KEYS.comments, comments);
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

function dueClass(task) {
  if (isOverdue(task)) return 'due-overdue';
  if (isDueToday(task)) return 'due-today';
  return '';
}

function shell(active, body) {
  const user = me();
  const adminLinks = user.role === 'Admin'
    ? `<a href="dashboard.html" class="${active === 'dashboard' ? 'on' : ''}">Dashboard</a>
       <a href="users.html" class="${active === 'users' ? 'on' : ''}">Kullanıcılar</a>`
    : '';

  const leaderLink = `<a href="leader.html" class="${active === 'leader' ? 'on' : ''}">Lider Paneli</a>`;

  const notes = notificationsFor(user);
  const noteHtml = notes.length
    ? notes.slice(0, 5).map((n) => `<li class="note-${n.type}">${n.text} <small>(${n.project})</small></li>`).join('')
    : '<li class="note-ok">Yaklaşan uyarı yok</li>';

  return `
  <div class="wrap">
    <aside class="side">
      <div class="brand">Görev Akışı</div>
      <nav>
        ${adminLinks}
        ${leaderLink}
        <a href="my-tasks.html" class="${active === 'mytasks' ? 'on' : ''}">Görevlerim</a>
        <a href="projects.html" class="${active === 'projects' ? 'on' : ''}">Projeler</a>
        <a href="profile.html" class="${active === 'profile' ? 'on' : ''}">Profil</a>
        <a href="#" onclick="logout();return false">Çıkış</a>
      </nav>
    </aside>
    <main class="main">
      <header class="top">
        <span>Görev Yönetim Sistemi</span>
        <div class="top-right">
          <div class="notify-wrap">
            <button type="button" class="notify-btn" onclick="this.nextElementSibling.classList.toggle('open')">
              🔔 ${notes.length ? `<span class="notify-count">${notes.length}</span>` : ''}
            </button>
            <div class="notify-panel">
              <strong>Bildirimler</strong>
              <ul>${noteHtml}</ul>
            </div>
          </div>
          <span>${user.name} ${user.surname} <small>${roleLabel(user)}</small></span>
        </div>
      </header>
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
