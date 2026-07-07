# TaskFlow — Frontend

React + Vite + Material UI tabanlı SPA.

## Gereksinimler

- Node.js 20+
- Backend API çalışır durumda olmalı

## Kurulum

```bash
cd frontend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Uygulama: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Sayfalar

| Sayfa | Route | Erişim |
|-------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Forgot Password | `/forgot-password` | Public |
| Dashboard | `/dashboard` | Admin |
| Projects | `/projects` | Authenticated |
| Tasks | `/projects/:id/tasks` | Authenticated |
| Kanban | `/projects/:id/kanban` | Authenticated |
| Profile | `/profile` | Authenticated |

## Özellikler

- JWT Authentication (Context API)
- Dark / Light mode
- Proje kart görünümü + arama
- Görev listesi + filtreleme (durum, öncelik, tarih)
- Sürükle-bırak Kanban board (@dnd-kit)
- Bildirimler (yaklaşan / geciken görevler)
- Profil fotoğrafı, isim ve şifre güncelleme

## Durum

✅ **Adım 3 tamamlandı** — Frontend hazır.
