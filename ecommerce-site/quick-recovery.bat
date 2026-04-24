@echo off
chcp 65001 >nul
echo ================================================
echo 🔄 电商独立站快速恢复工具
echo ================================================
echo.

echo 📅 上次工作时间: 2026年4月23日
echo 📍 项目位置: %cd%
echo.

:MAIN_MENU
echo 📋 请选择要执行的操作：
echo -------------------------------------------------
echo 1. 🔍 检查项目状态
echo 2. 🧪 运行快速测试
echo 3. 🛒 开始域名购买
echo 4. 📊 查看网站状态
echo 5. 📝 查看项目文档
echo 6. 🚪 退出
echo -------------------------------------------------
echo.

set /p CHOICE="请选择 (1-6): "

if "%CHOICE%"=="1" goto CHECK_STATUS
if "%CHOICE%"=="2" goto RUN_TEST
if "%CHOICE%"=="3" goto BUY_DOMAIN
if "%CHOICE%"=="4" goto CHECK_WEBSITE
if "%CHOICE%"=="5" goto VIEW_DOCS
if "%CHOICE%"=="6" goto EXIT

echo 无效选择，请重试
timeout /t 2 /nobreak >nul
goto MAIN_MENU

:CHECK_STATUS
echo.
echo 🔍 检查项目状态...
echo.
git status
echo.
echo 📁 备份目录：
dir /b backups\daily-* 2>nul
echo.
pause
goto MAIN_MENU

:RUN_TEST
echo.
echo 🧪 运行快速测试...
echo.
if exist daily-update.bat (
    call daily-update.bat
) else (
    echo ⚠️ 未找到测试脚本
)
echo.
pause
goto MAIN_MENU

:BUY_DOMAIN
echo.
echo 🛒 启动域名购买流程...
echo.
if exist ..\buy_domain.bat (
    start ..\buy_domain.bat
) else (
    echo ⚠️ 未找到购买工具
    echo 💡 请手动访问：https://www.namecheap.com
)
echo.
pause
goto MAIN_MENU

:CHECK_WEBSITE
echo.
echo 📊 检查网站状态...
echo.
echo 正在检查网站可访问性...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://ecommerce-shop-2026.github.io/ecommerce-site/' -Method Head -UseBasicParsing -TimeoutSec 10; Write-Host '✅ 主页在线 (HTTP' $response.StatusCode ')' -ForegroundColor Green } catch { Write-Host '❌ 主页访问失败' -ForegroundColor Red }"
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://ecommerce-shop-2026.github.io/ecommerce-site/payment.html' -Method Head -UseBasicParsing -TimeoutSec 10; Write-Host '✅ 支付页面在线 (HTTP' $response.StatusCode ')' -ForegroundColor Green } catch { Write-Host '❌ 支付页面访问失败' -ForegroundColor Red }"
echo.
echo 💡 快速访问：
echo 1. 主页: https://ecommerce-shop-2026.github.io/ecommerce-site/
echo 2. 支付页: https://ecommerce-shop-2026.github.io/ecommerce-site/payment.html
echo.
pause
goto MAIN_MENU

:VIEW_DOCS
echo.
echo 📝 项目文档列表：
echo -------------------------------------------------
if exist "项目进度总结与下一步计划.md" echo • 项目进度总结与下一步计划.md
if exist "关机前检查清单.md" echo • 关机前检查清单.md
if exist "..\域名购买详细指南.md" echo • 域名购买详细指南.md
if exist "独立站当前状态与行动计划.md" echo • 独立站当前状态与行动计划.md
echo -------------------------------------------------
echo.
set /p DOC_CHOICE="输入文档名称查看（或按回车返回）: "
if not "%DOC_CHOICE%"=="" (
    if exist "%DOC_CHOICE%" (
        start "%DOC_CHOICE%"
    ) else (
        echo ⚠️ 未找到文档: %DOC_CHOICE%
    )
)
goto MAIN_MENU

:EXIT
echo.
echo 📋 今日建议任务：
echo 1. 购买域名 shop2026easy.com
echo 2. 配置DNS和GitHub Pages
echo 3. 测试完整购物流程
echo.
echo 💰 预算: $10-15/年
echo ⏰ 预计时间: 30分钟
echo.
echo 🎉 祝你工作顺利！
pause
exit