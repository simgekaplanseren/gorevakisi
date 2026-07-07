# Görev Akışı

Ekip veya staj grubunun **projelerini ve görevlerini** takip ettiği web sitesi.

## Nasıl açılır?

`index.html` dosyasına **çift tıkla**. Terminal gerekmez.

## Lider Paneli ★

Kayıt olunca veya giriş yapınca **Lider Paneli**'ne gidersin. Burada:

1. **+ Yeni Proje** → Sen otomatik proje lideri olursun
2. **+ Ekip Hesabı** → Arkadaşın için kullanıcı oluştur
3. **Ekip Yönet** → Projeye üye ekle
4. **+ Görev** → Görev oluştur ve ekip üyesine ata

Sol menüde **★ Lider Paneli** her zaman görünür.

## Kim ne yapar?

| Rol | Kim? | Yetkiler |
|-----|------|----------|
| **Proje Lideri (Sen)** | Projeyi oluşturan kişi | Proje açar, ekip hesabı oluşturur, üye ekler, görev atar |
| **Sistem Yöneticisi** | Demo admin hesabı | Tüm projeleri ve kullanıcıları görür |
| **Ekip Üyesi** | Arkadaşların | Sadece kendine atanan görevleri görür |

## Başlangıç — Proje lideri (Admin) için 4 adım

1. **Giriş yap** → `admin@taskflow.com` / `Admin123!`
2. **Kullanıcılar** → Ekip arkadaşlarının hesabını oluştur (e-posta + şifre ver onlara)
3. **Projeler** → **+ Proje** ile proje aç → **Proje Detayı** → **+ Üye Ekle**
4. **Görevler** → Görev oluştur, ekip üyesine ata, teslim tarihi ver

Dashboard ve Projeler sayfasında adım adım rehber de var.

## Ekip üyesi için

1. Liderinden hesap bilgilerini al (veya **Kayıt ol** ile kendin oluştur)
2. Giriş yap → **Görevlerim** sayfası
3. Projeye eklenene kadar görev görmezsin — liderinden eklenmeni iste
4. Eklenince: görev durumunu güncelle, Kanban'da sürükle, yorum yaz

## Demo hesaplar

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Proje Lideri | admin@taskflow.com | Admin123! |
| Ekip Üyesi | user@taskflow.com | User123! |

## Sayfalar

| Dosya | Ne işe yarar |
|-------|----------------|
| `index.html` | Giriş |
| `leader.html` | **Lider Paneli** — proje oluştur, ekip yönet |
| `users.html` | Ekip hesapları oluştur (Admin) |
| `projects.html` | Proje listesi + proje oluştur |
| `project.html` | Proje detayı, ekip yönetimi, üye ekle/çıkar |
| `tasks.html` | Görev listesi, oluştur, ata |
| `kanban.html` | Sürükle-bırak pano |
| `my-tasks.html` | Kişisel görev paneli |
| `profile.html` | Profil ayarları |

## Özellikler

- Adım adım kurulum rehberi (Dashboard + Projeler)
- Proje detay sayfası ve ekip yönetimi
- Görev oluşturma, atama, yorum, geciken/bugün vurgusu
- Kanban panosu
- Bildirim zili
- Veriler tarayıcıda (`localStorage`) saklanır
