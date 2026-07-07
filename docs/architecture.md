# TaskFlow — Mimari Dokümantasyon

## Genel Bakış

TaskFlow, **Clean Architecture** prensiplerine uygun katmanlı bir monolit backend ve ayrı bir React SPA frontend'den oluşur.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  Pages → Components → Context → API (Axios)             │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / JSON
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  TaskFlow.API                            │
│  Controllers → Middleware (JWT) → Swagger               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              TaskFlow.Application                        │
│  Services → DTOs → Validators → Interfaces              │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  TaskFlow.Domain     │   │  TaskFlow.Infrastructure      │
│  Entities, Enums     │   │  EF Core, Repositories, JWT   │
└──────────────────────┘   └──────────────┬───────────────┘
                                          │
                                          ▼
                               ┌──────────────────┐
                               │   SQL Server     │
                               └──────────────────┘
```

## SOLID Uygulaması

| Prensip | Uygulama |
|---------|----------|
| **S** — Single Responsibility | Her controller yalnızca HTTP; iş mantığı Application servislerinde |
| **O** — Open/Closed | Yeni özellikler servis/interface genişletmesiyle eklenir |
| **L** — Liskov Substitution | Generic repository arayüzü somut implementasyonlarla değiştirilebilir |
| **I** — Interface Segregation | Her domain için ayrı repository arayüzü |
| **D** — Dependency Inversion | API katmanı somut sınıflara değil interface'lere bağımlı |

## Authentication Akışı

```
Client                    API                     Infrastructure
  │                        │                            │
  │── POST /auth/login ───►│                            │
  │                        │── Validate credentials ───►│
  │                        │◄── User entity ────────────│
  │                        │── Generate JWT ───────────►│
  │◄── { token, user } ────│                            │
  │                        │                            │
  │── GET /api/tasks ─────►│                            │
  │   Authorization: Bearer│── Validate JWT ───────────►│
  │◄── 200 OK ─────────────│                            │
```

## Veri Akışı (Kanban Durum Güncelleme)

1. Kullanıcı görev kartını sürükler → frontend `PATCH /api/tasks/{id}/status` çağırır
2. API controller isteği `TaskService.UpdateStatusAsync()` metoduna iletir
3. Servis yetki kontrolü yapar (Admin veya atanan kullanıcı)
4. Repository üzerinden entity güncellenir
5. Güncel DTO client'a döner

## Güvenlik

- Şifreler BCrypt ile hash'lenir
- JWT Bearer token; `Authorization` header ile iletilir
- Role-based authorization: `[Authorize(Roles = "Admin")]`
- CORS yalnızca frontend origin'ine izin verir
- Profil fotoğrafları `wwwroot/uploads/` altında saklanır
