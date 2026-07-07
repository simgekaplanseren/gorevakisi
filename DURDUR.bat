@echo off
chcp 65001 >nul
echo TaskFlow kapatiliyor...

taskkill /FI "WINDOWTITLE eq TaskFlow - Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq TaskFlow - Frontend*" /T /F >nul 2>&1

echo Tamam, kapandi.
timeout /t 2 >nul
