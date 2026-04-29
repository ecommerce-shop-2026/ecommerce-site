#!/bin/bash
# 多平台部署脚本
# 自动部署到 GitHub Pages, Vercel 和 Netlify

set -e  # 遇到错误时退出

echo "🚀 开始多平台部署流程"
echo "========================"

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 1. 部署到 GitHub Pages
echo "📦 1. 部署到 GitHub Pages..."
echo "   当前已通过 GitHub Actions 自动部署"
echo "   网站地址: https://shop2026easy.com"
echo "   ✅ GitHub Pages 部署已配置"

# 2. 部署到 Vercel
echo "🌐 2. 部署到 Vercel..."
if command -v vercel &> /dev/null; then
    echo "   检测到 Vercel CLI，开始部署..."
    if [ -f "vercel.json" ]; then
        echo "   📄 使用现有的 vercel.json 配置"
    else
        echo "   ⚠️  vercel.json 不存在，将使用默认配置"
    fi
    
    # 检查是否已登录
    if vercel whoami &> /dev/null; then
        echo "   ✅ 已登录 Vercel"
        echo "   部署命令: vercel --prod"
        echo "   注意：需要手动运行 vercel --prod 进行部署"
    else
        echo "   ⚠️  未登录 Vercel，请先运行: vercel login"
        echo "   然后运行: vercel --prod"
    fi
else
    echo "   ⚠️  Vercel CLI 未安装"
    echo "   安装命令: npm i -g vercel"
    echo "   登录命令: vercel login"
    echo "   部署命令: vercel --prod"
fi

# 3. 部署到 Netlify
echo "🕸️ 3. 部署到 Netlify..."
if command -v netlify &> /dev/null; then
    echo "   检测到 Netlify CLI，开始部署..."
    if [ -f "netlify.toml" ]; then
        echo "   📄 使用现有的 netlify.toml 配置"
    else
        echo "   ⚠️  netlify.toml 不存在，将使用默认配置"
    fi
    
    # 检查是否已登录
    if netlify status &> /dev/null; then
        echo "   ✅ 已登录 Netlify"
        echo "   部署命令: netlify deploy --prod"
        echo "   注意：需要手动运行 netlify deploy --prod 进行部署"
    else
        echo "   ⚠️  未登录 Netlify，请先运行: netlify login"
        echo "   然后运行: netlify deploy --prod"
    fi
else
    echo "   ⚠️  Netlify CLI 未安装"
    echo "   安装命令: npm i -g netlify-cli"
    echo "   登录命令: netlify login"
    echo "   部署命令: netlify deploy --prod"
fi

# 4. 创建一键部署脚本
echo "📝 4. 创建一键部署脚本..."
cat > deploy-all.sh << 'EOF'
#!/bin/bash
# 一键部署脚本
# 使用前请确保已安装并登录相应的CLI工具

set -e

echo "🚀 开始一键部署..."

# 检查必要的CLI工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 错误：$1 未安装"
        echo "   请运行: $2"
        exit 1
    fi
}

# 检查是否已登录
check_login() {
    if ! $1 $2 &> /dev/null; then
        echo "❌ 错误：未登录 $3"
        echo "   请运行: $4"
        exit 1
    fi
}

# 部署到 Vercel
deploy_vercel() {
    echo "🌐 部署到 Vercel..."
    if command -v vercel &> /dev/null; then
        check_login "vercel" "whoami" "Vercel" "vercel login"
        vercel --prod --yes
        echo "✅ Vercel 部署完成"
    else
        echo "⚠️  Vercel CLI 未安装，跳过"
    fi
}

# 部署到 Netlify
deploy_netlify() {
    echo "🕸️ 部署到 Netlify..."
    if command -v netlify &> /dev/null; then
        check_login "netlify" "status" "Netlify" "netlify login"
        netlify deploy --prod --message "自动部署 $(date '+%Y-%m-%d %H:%M:%S')"
        echo "✅ Netlify 部署完成"
    else
        echo "⚠️  Netlify CLI 未安装，跳过"
    fi
}

# 主函数
main() {
    echo "选择部署平台："
    echo "1) Vercel"
    echo "2) Netlify"
    echo "3) 全部"
    echo "4) 退出"
    
    read -p "请输入选择 (1-4): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_vercel
            deploy_netlify
            ;;
        4)
            echo "退出部署"
            exit 0
            ;;
        *)
            echo "❌ 无效选择"
            exit 1
            ;;
    esac
    
    echo "🎉 部署完成！"
}

main
EOF

chmod +x deploy-all.sh
echo "   ✅ 已创建一键部署脚本: deploy-all.sh"

# 5. 创建 GitHub Actions 工作流
echo "⚙️ 5. 创建 GitHub Actions 工作流..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Multiple Platforms

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:  # 允许手动触发

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          if [ -f package.json ]; then
            npm ci
          fi
          
      - name: Run tests
        run: |
          echo "运行测试..."
          # 这里可以添加具体的测试命令
          
  deploy-gh-pages:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          
  deploy-vercel:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
  deploy-netlify:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: '.'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
EOF

echo "   ✅ 已创建 GitHub Actions 工作流: .github/workflows/deploy.yml"

# 6. 创建环境变量配置示例
echo "🔧 6. 创建环境变量配置示例..."
cat > .env.example << 'EOF'
# 环境变量配置示例
# 复制此文件为 .env 并填写实际值

# Vercel 配置
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here

# Netlify 配置
NETLIFY_AUTH_TOKEN=your_netlify_auth_token_here
NETLIFY_SITE_ID=your_netlify_site_id_here

# 其他配置
NODE_ENV=production
EOF

echo "   ✅ 已创建环境变量示例: .env.example"

# 7. 创建部署文档
echo "📚 7. 创建部署文档..."
cat > DEPLOYMENT.md << 'EOF'
# 多平台部署指南

本指南介绍如何将网站部署到多个平台：GitHub Pages、Vercel 和 Netlify。

## 1. GitHub Pages

### 自动部署
网站已配置 GitHub Actions 自动部署到 GitHub Pages。

访问地址：https://shop2026easy.com

### 手动部署
如果需要手动部署，可以运行：
```bash
git push origin main
```

## 2. Vercel

### 准备工作
1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

### 部署
1. 使用一键部署脚本：
```bash
./deploy-all.sh
```

2. 或手动部署：
```bash
vercel --prod
```

## 3. Netlify

### 准备工作
1. 安装 Netlify CLI：
```bash
npm i -g netlify-cli
```

2. 登录 Netlify：
```bash
netlify login
```

### 部署
1. 使用一键部署脚本：
```bash
./deploy-all.sh
```

2. 或手动部署：
```bash
netlify deploy --prod
```

## 4. GitHub Actions 自动部署

### 配置 Secrets
在 GitHub 仓库设置中配置以下 Secrets：

1. **VERCEL_TOKEN**: Vercel 访问令牌
2. **VERCEL_ORG_ID**: Vercel 组织 ID
3. **VERCEL_PROJECT_ID**: Vercel 项目 ID
4. **NETLIFY_AUTH_TOKEN**: Netlify 访问令牌
5. **NETLIFY_SITE_ID**: Netlify 站点 ID

### 触发部署
- 推送到 main 分支时自动触发
- 也可以在 Actions 页面手动触发

## 5. 部署脚本

### deploy-all.sh
一键部署脚本，支持选择部署平台。

使用方法：
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

### setup-deployment.sh
部署配置脚本，用于初始化部署环境。

## 6. 配置文件

### vercel.json
Vercel 部署配置文件。

### netlify.toml
Netlify 部署配置文件。

### .github/workflows/deploy.yml
GitHub Actions 工作流配置。

## 7. 环境变量

复制 .env.example 为 .env 并填写实际值：
```bash
cp .env.example .env
```

## 8. 监控和日志

### Vercel
- 仪表板：https://vercel.com/dashboard
- 日志：在项目设置中查看

### Netlify
- 仪表板：https://app.netlify.com
- 日志：在站点设置中查看

### GitHub Actions
- 日志：https://github.com/ecommerce-shop-2026/ecommerce-site/actions

## 9. 故障排除

### 常见问题
1. **CLI 工具未安装**
   - 运行相应的安装命令

2. **未登录**
   - 运行相应的登录命令

3. **权限不足**
   - 检查访问令牌是否正确
   - 确保有项目部署权限

4. **部署失败**
   - 检查控制台输出
   - 查看平台日志
   - 验证配置文件格式

### 获取帮助
- Vercel 文档：https://vercel.com/docs
- Netlify 文档：https://docs.netlify.com
- GitHub Actions 文档：https://docs.github.com/en/actions
EOF

echo "   ✅ 已创建部署文档: DEPLOYMENT.md"

echo ""
echo "🎉 多平台部署配置完成！"
echo "========================"
echo ""
echo "📋 下一步："
echo "1. 安装必要的 CLI 工具："
echo "   npm i -g vercel netlify-cli"
echo ""
echo "2. 登录到各个平台："
echo "   vercel login"
echo "   netlify login"
echo ""
echo "3. 配置 GitHub Secrets（用于自动部署）"
echo ""
echo "4. 运行一键部署："
echo "   chmod +x deploy-all.sh"
echo "   ./deploy-all.sh"
echo ""
echo "📚 详细说明请查看 DEPLOYMENT.md"