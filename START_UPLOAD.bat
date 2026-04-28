@echo off
echo ========================================
echo   电商独立站 - GitHub上传助手
echo ========================================
echo.
echo 你的GitHub信息:
echo   用户名: ecommerce-site
echo   邮箱: chengtianru315@outlook.com
echo   仓库: ecommerce-site
echo.
echo 网站网址:
echo   https://ecommerce-site.github.io/ecommerce-site
echo.
echo ========================================
echo 上传步骤:
echo 1. 登录 GitHub: https://github.com
echo 2. 创建仓库: ecommerce-site
echo 3. 上传本目录所有文件
echo 4. 开启 GitHub Pages
echo 5. 访问你的网站!
echo ========================================
echo.
echo 本目录包含所有需要上传的文件。
echo 请打开文件管理器，上传所有文件和文件夹。
echo.
echo 按任意键打开上传目录...
pause > nul

:: 打开文件管理器
explorer "C:\Users\Administrator\github_upload"

:: 打开上传指南
start "" "C:\Users\Administrator\github_upload\UPLOAD_GUIDE.html"

echo.
echo 已打开上传目录和指南。
echo 请按照指南操作。
echo.
pause