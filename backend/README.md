# TaskFlow — Backend

ASP.NET Core 9 Web API. **Clean Architecture** + **Repository Pattern** + **JWT Authentication**.

## Klasör Yapısı

```
backend/
├── TaskFlow.sln
└── src/
    ├── TaskFlow.Domain/           # Entity, Enum, domain kuralları
    ├── TaskFlow.Application/      # DTO, servisler, repository arayüzleri
    ├── TaskFlow.Infrastructure/   # EF Core, repository, JWT, seed
    └── TaskFlow.API/              # Controllers, middleware, Swagger
```

## Gereksinimler

- .NET 9 SDK
- SQL Server (LocalDB, Express veya tam sürüm)

## Kurulum

```bash
cd backend

# Bağımlılıkları yükle
dotnet restore

# Veritabanı migration (SQL Server çalışır durumda olmalı)
dotnet ef database update --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.API

# API'yi çalıştır
dotnet run --project src/TaskFlow.API
```

**Swagger UI:** https://localhost:7001/swagger  
**HTTP:** http://localhost:5000

## Bağlantı Dizesi

`src/TaskFlow.API/appsettings.json` içinde:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskFlowDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

SQL Server Express için örnek:

```
Server=localhost\\SQLEXPRESS;Database=TaskFlowDb;Trusted_Connection=True;TrustServerCertificate=True
```

## Demo Hesaplar (Seed)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@taskflow.com | Admin123! |
| User | user@taskflow.com | User123! |

## API Endpoint'leri

| Controller | Route | Yetki |
|------------|-------|-------|
| Auth | `/api/auth` | Public / Authenticated |
| Users | `/api/users` | Admin |
| Projects | `/api/projects` | Authenticated |
| Tasks | `/api/tasks` | Authenticated |
| Comments | `/api/tasks/{id}/comments` | Authenticated |
| Dashboard | `/api/dashboard` | Admin (stats), Authenticated (notifications) |
| Profile | `/api/profile` | Authenticated |

## Durum

✅ **Adım 2 tamamlandı** — Backend hazır. Frontend için Adım 3 bekleniyor.
