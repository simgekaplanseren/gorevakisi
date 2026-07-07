@echo off
chcp 65001 >nul
title TaskFlow Baslatiliyor...
color 0A

echo.
echo  ========================================
echo       TASKFLOW - GOREV YONETIM SISTEMI
echo  ========================================
echo.
echo  Site tarayicida acilacak: http://localhost:5173
echo  Kapatmak icin acilan siyah pencereleri kapatin.
echo.

cd /d "%~dp0"

:: Ilk kurulum: frontend paketleri
if not exist "frontend\node_modules\" (
    echo  [1/3] Frontend paketleri yukleniyor (ilk sefer, biraz surer)...
    cd frontend
    call npm install
    cd ..
) else (
    echo  [1/3] Frontend paketleri hazir.
)

:: Ilk kurulum: veritabani
echo  [2/3] Veritabani kontrol ediliyor...
cd backend
dotnet ef database update --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.API >nul 2>&1
cd ..

:: Backend baslat
echo  [3/3] Sistem baslatiliyor...
start "TaskFlow - Backend (BUNU KAPATMA)" cmd /k "cd /d "%~dp0backend" && echo Backend calisiyor... && dotnet run --project src/TaskFlow.API"

:: Backend'in acilmasini bekle
timeout /t 6 /nobreak >nul

:: Frontend baslat
start "TaskFlow - Frontend (BUNU KAPATMA)" cmd /k "cd /d "%~dp0frontend" && echo Frontend calisiyor... && npm run dev"

:: Frontend'in acilmasini bekle
timeout /t 8 /nobreak >nul

:: Siteyi tarayicida ac
start http://localhost:5173

echo.
echo  ========================================
echo   TAMAM! Tarayici acildi.
echo.
echo   Giris bilgileri:
echo   Admin  - admin@taskflow.com  / Admin123!
echo   Kullanici - user@taskflow.com / User123!
echo  ========================================
echo.
pause
