# TaskFlow — Görev Yönetim Sistemi

TaskFlow, yazılım mühendisliği staj portföyü için geliştirilmiş modern bir görev yönetim sistemidir. Kullanıcılar proje oluşturabilir, görev ekleyebilir, ekip üyeleri atayabilir ve görev ilerlemesini Kanban panosu üzerinden takip edebilir.

Trello ve Jira mantığından ilham alınmıştır; birebir kopya değildir.

---

## Özellikler

| Modül | Açıklama |
|-------|----------|
| **Authentication** | JWT tabanlı kayıt, giriş, profil ve çıkış |
| **Dashboard** | Proje/görev istatistikleri, geciken ve bugün teslim edilecek görevler |
| **Projeler** | Kart görünümü, arama, ilerleme yüzdesi |
| **Görevler** | CRUD, filtreleme, öncelik ve durum yönetimi |
| **Kanban** | Sürükle-bırak destekli pano (To Do → In Progress → Review → Completed) |
| **Yorumlar** | Görevlere yorum ekleme |
| **Bildirimler** | Yaklaşan ve geciken teslim tarihi uyarıları |
| **Profil** | Fotoğraf, isim ve şifre güncelleme |
| **Dark Mode** | Material UI ile açık/koyu tema desteği |

---

## Kullanılan Teknolojiler

### Backend
- ASP.NET Core 9 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Clean Architecture
- Repository Pattern
- Dependency Injection
- Swagger

### Frontend
- React
- Vite
- React Router
- Axios
- Context API
- Material UI
- React Hook Form

### Versiyon Kontrol
- Git
- GitHub

---

## Proje Yapısı

```
taskflow/
├── backend/          # ASP.NET Core 9 Web API (Clean Architecture)
├── frontend/         # React + Vite SPA
├── docs/             # Mimari, veritabanı ve API dokümantasyonu
└── README.md
```

Detaylı klasör planları için:
- [Backend yapısı](backend/README.md)
- [Frontend yapısı](frontend/README.md)
- [Mimari](docs/architecture.md)
- [Veritabanı şeması](docs/database-schema.md)

---

## Kurulum

> Backend ve frontend adımları tamamlandıkça bu bölüm güncellenecektir.

### Gereksinimler

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB veya Express)
- [Git](https://git-scm.com/)

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.API
dotnet run --project src/TaskFlow.API
```

API adresleri:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:7001/swagger`

**Demo hesaplar:** `admin@taskflow.com` / `Admin123!` · `user@taskflow.com` / `User123!`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama: `http://localhost:5173`

Vite dev server, API isteklerini otomatik olarak `http://localhost:5000` adresine proxy eder.

### Veritabanı bağlantısı

`backend/src/TaskFlow.API/appsettings.json` içindeki `ConnectionStrings:DefaultConnection` değerini kendi SQL Server ortamınıza göre düzenleyin.

---

## Ekran Görüntüleri

| Ekran | Önizleme |
|-------|----------|
| Login | _Yakında eklenecek_ |
| Dashboard | _Yakında eklenecek_ |
| Projeler | _Yakında eklenecek_ |
| Görevler | _Yakında eklenecek_ |
| Kanban Board | _Yakında eklenecek_ |
| Profil | _Yakında eklenecek_ |

---

## API Endpoint Listesi

> Backend tamamlandığında güncel endpoint listesi için [docs/api-endpoints.md](docs/api-endpoints.md) dosyasına bakın.

### Authentication
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş (JWT döner) |
| POST | `/api/auth/forgot-password` | Şifre sıfırlama (UI placeholder) |
| GET | `/api/auth/me` | Oturum açmış kullanıcı bilgisi |

### Users (Admin)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/users` | Tüm kullanıcılar |
| POST | `/api/users` | Kullanıcı oluştur |
| PUT | `/api/users/{id}` | Kullanıcı güncelle |
| DELETE | `/api/users/{id}` | Kullanıcı sil |

### Projects
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/projects` | Proje listesi (arama destekli) |
| GET | `/api/projects/{id}` | Proje detayı |
| POST | `/api/projects` | Proje oluştur (Admin) |
| PUT | `/api/projects/{id}` | Proje güncelle |
| DELETE | `/api/projects/{id}` | Proje sil (Admin) |
| POST | `/api/projects/{id}/members` | Ekip üyesi ekle |
| DELETE | `/api/projects/{id}/members/{userId}` | Ekip üyesi çıkar |

### Tasks
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/tasks` | Görev listesi (filtre/arama) |
| GET | `/api/tasks/{id}` | Görev detayı |
| POST | `/api/tasks` | Görev oluştur |
| PUT | `/api/tasks/{id}` | Görev güncelle |
| PATCH | `/api/tasks/{id}/status` | Durum güncelle (Kanban) |
| DELETE | `/api/tasks/{id}` | Görev sil |

### Comments
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/tasks/{taskId}/comments` | Görev yorumları |
| POST | `/api/tasks/{taskId}/comments` | Yorum ekle |

### Dashboard
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/dashboard/stats` | Dashboard istatistikleri |
| GET | `/api/dashboard/notifications` | Bildirimler |

### Profile
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/profile` | Profil bilgisi |
| PUT | `/api/profile` | Profil güncelle |
| PUT | `/api/profile/password` | Şifre değiştir |
| POST | `/api/profile/avatar` | Profil fotoğrafı yükle |

---

## Roller

| Rol | Yetkiler |
|-----|----------|
| **Admin** | Kullanıcı/proje/görev CRUD, ekip yönetimi, dashboard |
| **User** | Atanan görevleri görme, durum değiştirme, yorum, profil güncelleme |

---

## Lisans

Bu proje eğitim ve staj portföyü amaçlı geliştirilmektedir.
