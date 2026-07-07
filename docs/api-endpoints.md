# TaskFlow — API Endpoint Dokümantasyonu

> Bu dosya backend (Adım 2) tamamlandığında güncel endpoint detaylarıyla doldurulacaktır.

Swagger UI üzerinden canlı dokümantasyon: `https://localhost:7001/swagger`

## Endpoint Özeti

Endpoint listesinin tam hali için [README.md](../README.md#api-endpoint-listesi) dosyasına bakın.

## Request / Response Örnekleri

_Backend tamamlandıktan sonra eklenecek._

### POST /api/auth/login

```json
// Request
{
  "email": "user@example.com",
  "password": "Password123!"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ali",
    "surname": "Yılmaz",
    "email": "user@example.com",
    "role": "User"
  }
}
```

### GET /api/dashboard/stats

```json
// Response 200
{
  "totalProjects": 5,
  "totalTasks": 42,
  "completedTasks": 18,
  "inProgressTasks": 12,
  "overdueTasks": 3,
  "dueTodayTasks": 2,
  "recentTasks": []
}
```

## Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 400 | Geçersiz istek / validasyon hatası |
| 401 | Kimlik doğrulama gerekli |
| 403 | Yetkisiz erişim |
| 404 | Kaynak bulunamadı |
| 500 | Sunucu hatası |
