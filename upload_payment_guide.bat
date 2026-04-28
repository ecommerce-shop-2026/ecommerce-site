@echo off
echo ================================================
echo 独立站支付页面上传指南
echo ================================================
echo.
echo 问题：payment.html 文件没有部署到GitHub Pages
echo 原因：本地Git仓库指向错误的远程仓库
echo 解决方案：手动上传 payment.html 到正确仓库
echo.
echo 请按照以下步骤操作：
echo.
echo 步骤1: 打开浏览器，访问以下链接：
echo     https://github.com/ecommerce-shop-2026/ecommerce-site
echo.
echo 步骤2: 点击页面上的 "Add file" 按钮
echo     然后选择 "Upload files"
echo.
echo 步骤3: 将本地的 payment.html 文件拖拽到上传区域
echo     或者点击 "choose your files" 选择文件
echo.
echo 步骤4: 在提交信息中输入：
echo     "Add payment page for checkout functionality"
echo.
echo 步骤5: 确保选择 "Commit directly to the main branch"
echo.
echo 步骤6: 点击 "Commit changes" 按钮
echo.
echo 步骤7: 等待几秒钟，然后访问以下链接验证：
echo     https://shop2026easy.com/payment.html
echo.
echo 如果页面显示正常（不是404错误），则上传成功！
echo.
echo ================================================
echo 备用方案：如果无法上传文件
echo ================================================
echo.
echo 如果无法上传，可以尝试以下方法：
echo.
echo 1. 复制 payment.html 文件内容
echo 2. 在GitHub仓库点击 "Add file" -> "Create new file"
echo 3. 输入文件名：payment.html
echo 4. 粘贴文件内容
echo 5. 提交更改
echo.
echo 按任意键查看 payment.html 文件的前50行内容...
pause > nul
echo.
echo ================================================
echo payment.html 文件内容（前50行）：
echo ================================================
type payment.html | head -50
echo.
echo ================================================
echo 按任意键退出...
pause > nul