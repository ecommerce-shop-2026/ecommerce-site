@echo off
chcp 65001 >nul
echo ================================================
echo 🚀 支付页面上传工具
echo ================================================
echo.
echo 📋 当前状态:
echo   文件: ecommerce-site\payment.html (存在)
echo   线上: 404 Not Found (未部署)
echo   问题: GitHub已停止密码认证，需要Token
echo.
echo ================================================
echo 🔧 方案A: 手动上传 (推荐，最简单)
echo ================================================
echo 1. 按 Win+R，输入以下路径并按回车：
echo    ecommerce-site
echo.
echo 2. 找到 payment.html 文件
echo.
echo 3. 访问: https://github.com/ecommerce-shop-2026/ecommerce-site
echo.
echo 4. 点击 "Add file" → "Upload files"
echo.
echo 5. 将 payment.html 拖拽到页面中
echo.
echo 6. 输入 "添加支付页面" → 点击 "Commit changes"
echo.
echo 7. 等待1分钟后访问验证:
echo    https://ecommerce-shop-2026.github.io/ecommerce-site/payment.html
echo.
echo ================================================
echo 🔧 方案B: 自动上传 (需要GitHub Token)
echo ================================================
echo 如果您有GitHub Personal Access Token，请输入:
echo.
set /p token="输入GitHub Token: "

if "%token%"=="" (
    echo 未输入Token，请使用方案A
    pause
    exit /b
)

echo 正在上传支付页面...
cd ecommerce-site
for /f "delims=" %%i in ('certutil -encode payment.html /tmp/payment_b64.txt ^>nul') do set b64=%%i

curl -X PUT ^
  -H "Authorization: token %token%" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"添加支付页面\",\"content\":\"%b64%\"}" ^
  https://api.github.com/repos/ecommerce-shop-2026/ecommerce-site/contents/payment.html

cd ..
echo.
echo 上传完成！等待1分钟后验证...
echo https://ecommerce-shop-2026.github.io/ecommerce-site/payment.html
pause