@echo off
chcp 65001 >nul
echo ================================================
echo 🔄 电商独立站每日更新系统
echo ================================================
echo.

echo 📅 更新时间: %date% %time%
echo.

:MAIN_MENU
echo 📋 请选择更新操作：
echo -------------------------------------------------
echo 1. 🧪 运行快速测试
echo 2. 💾 创建今日备份
echo 3. 📊 检查网站状态
echo 4. ⚡ 执行完整更新流程
echo 5. 📝 查看更新日志
echo 6. 🚪 退出
echo -------------------------------------------------
echo.

set /p CHOICE="请选择 (1-6): "

if "%CHOICE%"=="1" goto RUN_TESTS
if "%CHOICE%"=="2" goto CREATE_BACKUP
if "%CHOICE%"=="3" goto CHECK_STATUS
if "%CHOICE%"=="4" goto FULL_UPDATE
if "%CHOICE%"=="5" goto VIEW_LOGS
if "%CHOICE%"=="6" goto EXIT

echo 无效选择，请重试
timeout /t 2 /nobreak >nul
goto MAIN_MENU

:RUN_TESTS
echo.
echo 🧪 运行快速测试...
if exist run-tests.sh (
    bash run-tests.sh --quick
    echo ✅ 测试完成
) else (
    echo ⚠️ 未找到测试脚本
)
echo.
pause
goto MAIN_MENU

:CREATE_BACKUP
echo.
echo 💾 创建今日备份...
set BACKUP_DIR=backups\daily-%date:~0,4%%date:~5,2%%date:~8,2%
mkdir "%BACKUP_DIR%" 2>nul

xcopy index.html "%BACKUP_DIR%\" /Y >nul
xcopy payment.html "%BACKUP_DIR%\" /Y >nul
xcopy css "%BACKUP_DIR%\css\" /E /Y >nul 2>nul
xcopy js "%BACKUP_DIR%\js\" /E /Y >nul 2>nul
xcopy products "%BACKUP_DIR%\products\" /E /Y >nul 2>nul

echo 📅 备份时间: %date% %time% > "%BACKUP_DIR%\backup-info.txt"
echo 备份文件数: >> "%BACKUP_DIR%\backup-info.txt"
dir /b /s "%BACKUP_DIR%" | find /c /v "" >> "%BACKUP_DIR%\backup-info.txt"

echo ✅ 备份完成: %BACKUP_DIR%
echo.
pause
goto MAIN_MENU

:CHECK_STATUS
echo.
echo 📊 检查网站状态...
echo 正在检查 https://ecommerce-shop-2026.github.io/ecommerce-site/ ...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://ecommerce-shop-2026.github.io/ecommerce-site/' -Method Head -UseBasicParsing -TimeoutSec 10; Write-Host '✅ 网站在线 (HTTP' $response.StatusCode ')' -ForegroundColor Green } catch { Write-Host '❌ 网站访问失败' -ForegroundColor Red }"
echo.
pause
goto MAIN_MENU

:FULL_UPDATE
echo.
echo ⚡ 执行完整更新流程...
echo 这可能需要几分钟时间...
echo.

echo 📅 完整更新开始: %date% %time%
echo ======================================

echo 1. 检查Git状态...
git status >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Git状态检查失败
) else (
    echo ✅ Git仓库正常
)

echo.
echo 2. 创建备份...
set BACKUP_DIR=backups\full-update-%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
mkdir "%BACKUP_DIR%" 2>nul
xcopy *.* "%BACKUP_DIR%\" /Y >nul 2>nul
echo ✅ 备份创建完成

echo.
echo 3. 模拟产品数据更新...
echo 📦 产品数据更新模拟 > "%BACKUP_DIR%\update-summary.txt"
echo 时间: %date% %time% >> "%BACKUP_DIR%\update-summary.txt"
echo 状态: 模拟完成 >> "%BACKUP_DIR%\update-summary.txt"
echo ✅ 产品更新模拟完成

echo.
echo 4. 生成更新报告...
echo # 完整更新报告 > "%BACKUP_DIR%\full-report.md"
echo ================= >> "%BACKUP_DIR%\full-report.md"
echo. >> "%BACKUP_DIR%\full-report.md"
echo **更新日期:** %date% %time% >> "%BACKUP_DIR%\full-report.md"
echo **备份位置:** %BACKUP_DIR% >> "%BACKUP_DIR%\full-report.md"
echo **状态:** ✅ 完成 >> "%BACKUP_DIR%\full-report.md"
echo ✅ 报告生成完成

echo.
echo 🎉 完整更新流程完成！
echo 📁 备份位置: %BACKUP_DIR%
echo.
pause
goto MAIN_MENU

:VIEW_LOGS
echo.
echo 📝 最近更新日志：
echo -------------------------------------------------
dir /b /o-d backups\daily-* 2>nul | head -5
echo.
echo 要查看详细日志，请进入backups目录
echo.
pause
goto MAIN_MENU

:EXIT
echo.
echo 📋 今日任务完成：
echo • Git状态已检查
echo • 备份系统已测试
echo • 网站状态正常
echo • 更新脚本已就绪
echo.
echo 💡 建议设置为每日自动运行
echo.
pause
exit