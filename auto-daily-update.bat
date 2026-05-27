@echo off
REM ============================================
REM ShopEasy 独立站 - 每日自动更新系统 (Windows)
REM 功能：备份站点 → Git提交 → 推送部署
REM ============================================

echo ============================================
echo   ShopEasy 每日自动更新系统
echo ============================================
echo 时间: %date% %time%
echo.

set SITE_DIR=C:\Users\Administrator\ecommerce-site
set BACKUP_DIR=%SITE_DIR%\backups
set LOG_DIR=%BACKUP_DIR%\logs
set LOG_FILE=%LOG_DIR%\daily-update.log

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo [1/4] 备份站点文件...

set BACKUP_NAME=daily-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_NAME=%BACKUP_NAME: =0%
set BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%

if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"

cd /d "%SITE_DIR%"

copy index.html "%BACKUP_PATH%\" >nul 2>&1
copy payment.html "%BACKUP_PATH%\" >nul 2>&1
copy about.html "%BACKUP_PATH%\" >nul 2>&1
copy contact.html "%BACKUP_PATH%\" >nul 2>&1
copy product-detail.html "%BACKUP_PATH%\" >nul 2>&1
copy order-history.html "%BACKUP_PATH%\" >nul 2>&1
copy wishlist.html "%BACKUP_PATH%\" >nul 2>&1
copy sitemap.xml "%BACKUP_PATH%\" >nul 2>&1
copy robots.txt "%BACKUP_PATH%\" >nul 2>&1
copy CNAME "%BACKUP_PATH%\" >nul 2>&1

if exist "js" xcopy /E /I /Y js "%BACKUP_PATH%\js\" >nul 2>&1
if exist "css" xcopy /E /I /Y css "%BACKUP_PATH%\css\" >nul 2>&1
if exist "images" xcopy /E /I /Y images "%BACKUP_PATH%\images\" >nul 2>&1
if exist "products" xcopy /E /I /Y products "%BACKUP_PATH%\products\" >nul 2>&1

echo %date% %time% - 备份完成: %BACKUP_NAME% >> "%LOG_DIR%\backup-history.log"

echo [OK] 备份完成: %BACKUP_NAME%
echo.

echo [2/4] 更新时间戳...
echo Last update: %date% %time% > "%SITE_DIR%\.last-update"
echo Version: %date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2% >> "%SITE_DIR%\.last-update"
echo [OK] 时间戳已更新
echo.

echo [3/4] Git提交并推送...
cd /d "%SITE_DIR%"

git add -A

git diff --cached --quiet >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 没有变更，跳过提交
) else (
    git commit -m "Daily auto update %date% %time%"
    git push origin main
    echo [OK] 推送完成
)
echo.

echo [4/4] 更新完成
echo.
echo ============================================
echo  更新报告
echo ============================================
echo 日期: %date% %time%
echo 备份: %BACKUP_NAME%
echo ============================================
echo.
echo %date% %time% - 自动更新完成 >> "%LOG_FILE%"

echo [OK] 每日更新流程完成！
echo.
pause
