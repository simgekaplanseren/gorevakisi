# TaskFlow — Veritabanı Şeması

## ER Diyagramı

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    Users    │       │ ProjectMembers  │       │  Projects   │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ Id (PK)     │──┐    │ ProjectId (PK,FK│───┐   │ Id (PK)     │
│ Name        │  └───►│ UserId (PK,FK)  │   └──►│ Name        │
│ Surname     │       └─────────────────┘       │ Description │
│ Email       │                                 │ Status      │
│ PasswordHash│◄────────────────────────────────│ CreatedDate │
│ Role        │         OwnerId (FK)            │ OwnerId (FK)│
│ AvatarUrl   │                                 └──────┬──────┘
│ CreatedDate │                                        │
└──────┬──────┘                                        │
       │                                               │
       │         ┌─────────────┐                       │
       │         │ TaskComments│                       │
       │         ├─────────────┤                       │
       │         │ Id (PK)     │                       │
       └────────►│ UserId (FK) │                       │
                 │ TaskId (FK) │◄──────────┐           │
                 │ Comment     │           │           │
                 │ CreatedDate │           │           │
                 └─────────────┘           │           │
                                           │           │
                                    ┌──────┴──────┐    │
                                    │    Tasks    │    │
                                    ├─────────────┤    │
                                    │ Id (PK)     │    │
                                    │ Title       │    │
                                    │ Description │    │
                                    │ Priority    │    │
                                    │ Status      │    │
                                    │ DueDate     │    │
                                    │ CreatedDate │    │
                                    │ ProjectId(FK)◄────┘
                                    │ AssignedUserId(FK)
                                    └─────────────┘
```

## Tablolar

### Users

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int (PK, Identity) | Birincil anahtar |
| Name | nvarchar(100) | Ad |
| Surname | nvarchar(100) | Soyad |
| Email | nvarchar(256) | E-posta (unique) |
| PasswordHash | nvarchar(500) | BCrypt hash |
| Role | int | 0 = User, 1 = Admin |
| AvatarUrl | nvarchar(500) | Profil fotoğrafı yolu (nullable) |
| CreatedDate | datetime2 | Oluşturulma tarihi |

### Projects

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int (PK, Identity) | Birincil anahtar |
| Name | nvarchar(200) | Proje adı |
| Description | nvarchar(2000) | Açıklama |
| Status | int | 0 = Active, 1 = Archived, 2 = Completed |
| CreatedDate | datetime2 | Oluşturulma tarihi |
| OwnerId | int (FK → Users) | Proje sahibi |

### Tasks

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int (PK, Identity) | Birincil anahtar |
| Title | nvarchar(300) | Görev başlığı |
| Description | nvarchar(4000) | Açıklama |
| Priority | int | 0 = Low, 1 = Medium, 2 = High, 3 = Critical |
| Status | int | 0 = ToDo, 1 = InProgress, 2 = Review, 3 = Completed |
| DueDate | datetime2 | Teslim tarihi (nullable) |
| CreatedDate | datetime2 | Oluşturulma tarihi |
| UpdatedDate | datetime2 | Son güncelleme |
| ProjectId | int (FK → Projects) | Bağlı proje |
| AssignedUserId | int (FK → Users, nullable) | Atanan kullanıcı |

### TaskComments

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int (PK, Identity) | Birincil anahtar |
| Comment | nvarchar(2000) | Yorum metni |
| CreatedDate | datetime2 | Oluşturulma tarihi |
| TaskId | int (FK → Tasks) | Bağlı görev |
| UserId | int (FK → Users) | Yorumu yazan |

### ProjectMembers

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| ProjectId | int (PK, FK → Projects) | Proje |
| UserId | int (PK, FK → Users) | Üye |
| JoinedDate | datetime2 | Katılım tarihi |

## Enum Değerleri

### TaskStatus
| Değer | Ad |
|-------|----|
| 0 | To Do |
| 1 | In Progress |
| 2 | Review |
| 3 | Completed |

### TaskPriority
| Değer | Ad |
|-------|----|
| 0 | Low |
| 1 | Medium |
| 2 | High |
| 3 | Critical |

### UserRole
| Değer | Ad |
|-------|----|
| 0 | User |
| 1 | Admin |

### ProjectStatus
| Değer | Ad |
|-------|----|
| 0 | Active |
| 1 | Archived |
| 2 | Completed |
