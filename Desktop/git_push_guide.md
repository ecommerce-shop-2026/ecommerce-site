# ShopEasy - 推送代码操作指南

## 当前状态
购物车 bug 已修复（cart-system.js 复用 main.js 的 products 数组）
分支合并已完成（main 和 temp-payment-fix 已同步）
本地有 11 个 commit 待推送

## 步骤

### 方案一：直接 git push（推荐）
```bash
cd /c/Users/Administrator/ecommerce-site
git push origin main
```

### 方案二：如果 token 过期

1. 打开 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 权限勾选：repo（所有子项）
4. 复制生成的 token（以 ghp_ 开头）
5. 在本机运行：
```bash
# 清除旧凭证
git credential-store erase <<< $'url=https://github.com\nprotocol=https\nhost=github.com\nusername=ecommerce-shop-2026\npassword=gho_xxx'

# 存入新凭证
git credential-store store <<< $'url=https://github.com\nprotocol=https\nhost=github.com\nusername=ecommerce-shop-2026\npassword=ghp_xxx'

# 推送
git push origin main
```

### 方案三：如果网络不通（443 端口被封）
尝试使用代理：
```bash
git config --global http.proxy http://你的代理地址:端口
git push origin main
git config --global --unset http.proxy
```

或使用 SSH：
```bash
# 检查 SSH key
cat ~/.ssh/id_rsa.pub

# 如果 SSH key 存在但没添加到 GitHub：
# 去 https://github.com/settings/keys 添加

# 然后推送
git push ssh-origin main
```

## 验证
推送后访问 https://shop2026easy.com/
点击"Add to Cart"测试新产品（4K无人机、智能摄像头等）
购物车计数应正常增加
