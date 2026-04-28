@echo off
chcp 65001 >nul
title ShopEasy - 推送代码到 GitHub

echo ================================================
echo     ShopEasy - 推送代码到 GitHub
echo ================================================
echo.

cd /d C:\Users\Administrator\ecommerce-site

echo [1/3] 检查当前分支和状态...
git status --short
echo.

echo [2/3] 推送到 GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [3/3] 推送成功!
    echo.
    git log --oneline -3
    echo.
    echo ================================================
    echo     完成！代码已推送到 GitHub
    echo ================================================
) else (
    echo.
    echo [3/3] 推送失败 - 可能是网络问题
    echo.
    echo 请检查：
    echo 1. 网络连接是否正常
    echo 2. GitHub token 是否有效
    echo    (凭证在 ~/.git-credentials 中)
    echo.
    echo 如果 token 过期，请在 GitHub 生成新 token:
    echo https://github.com/settings/tokens
    echo 权限需要：repo (全选)
    echo.
    echo 然后运行: git credential-store store
    echo.
)

pause
