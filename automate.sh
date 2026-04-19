#!/bin/bash
# 主自动化脚本
# 整合测试、备份、部署和监控功能

set -e  # 遇到错误时退出

echo "🤖 开始自动化运维流程"
echo "========================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 显示菜单
show_menu() {
    clear
    echo "🤖 电商网站自动化运维系统"
    echo "========================"
    echo ""
    echo "请选择要执行的操作："
    echo ""
    echo "1) 🧪 运行自动化测试"
    echo "2) 💾 运行自动化备份"
    echo "3) 📊 运行网站监控"
    echo "4) 🚀 运行多平台部署"
    echo "5) 🔄 运行完整流程（测试+备份+监控）"
    echo "6) 📋 查看系统状态"
    echo "7) ⚙️  系统配置"
    echo "8) 📚 查看文档"
    echo "9) 🚪 退出"
    echo ""
}

# 运行测试
run_tests() {
    log_info "开始运行自动化测试..."
    if [ -f "run-tests.sh" ]; then
        chmod +x run-tests.sh
        ./run-tests.sh
    else
        log_error "测试脚本不存在: run-tests.sh"
    fi
}

# 运行备份
run_backup() {
    log_info "开始运行自动化备份..."
    if [ -f "run-backup.sh" ]; then
        chmod +x run-backup.sh
        ./run-backup.sh
    else
        log_error "备份脚本不存在: run-backup.sh"
    fi
}

# 运行监控
run_monitoring() {
    log_info "开始运行网站监控..."
    if [ -f "monitor-site.sh" ]; then
        chmod +x monitor-site.sh
        ./monitor-site.sh
    else
        log_error "监控脚本不存在: monitor-site.sh"
    fi
}

# 运行部署
run_deployment() {
    log_info "开始运行多平台部署..."
    if [ -f "deploy-all.sh" ]; then
        chmod +x deploy-all.sh
        ./deploy-all.sh
    elif [ -f "setup-deployment.sh" ]; then
        log_info "运行部署配置..."
        chmod +x setup-deployment.sh
        ./setup-deployment.sh
    else
        log_error "部署脚本不存在"
    fi
}

# 运行完整流程
run_full_process() {
    log_info "开始完整自动化流程..."
    echo ""
    
    # 1. 测试
    log_info "步骤 1/3: 运行自动化测试"
    run_tests
    echo ""
    
    # 2. 备份
    log_info "步骤 2/3: 运行自动化备份"
    run_backup
    echo ""
    
    # 3. 监控
    log_info "步骤 3/3: 运行网站监控"
    run_monitoring
    echo ""
    
    log_success "完整自动化流程完成！"
}

# 查看系统状态
show_status() {
    log_info "系统状态检查..."
    echo ""
    
    # 检查脚本是否存在
    echo "📁 脚本状态:"
    echo "-----------"
    scripts=("run-tests.sh" "run-backup.sh" "monitor-site.sh" "deploy-all.sh" "setup-deployment.sh")
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                echo "✅ $script (可执行)"
            else
                echo "⚠️  $script (不可执行)"
            fi
        else
            echo "❌ $script (不存在)"
        fi
    done
    echo ""
    
    # 检查目录
    echo "📂 目录状态:"
    echo "-----------"
    directories=("test-results" "backups" "monitoring" ".github/workflows")
    for dir in "${directories[@]}"; do
        if [ -d "$dir" ]; then
            COUNT=$(find "$dir" -type f 2>/dev/null | wc -l)
            echo "✅ $dir ($COUNT 个文件)"
        else
            echo "❌ $dir (不存在)"
        fi
    done
    echo ""
    
    # 检查配置文件
    echo "⚙️  配置文件:"
    echo "-----------"
    configs=("vercel.json" "netlify.toml" ".env" "package.json")
    for config in "${configs[@]}"; do
        if [ -f "$config" ]; then
            SIZE=$(du -h "$config" | cut -f1)
            echo "✅ $config ($SIZE)"
        else
            echo "⚠️  $config (不存在)"
        fi
    done
    echo ""
    
    # 检查网站文件
    echo "🌐 网站文件:"
    echo "-----------"
    web_files=("index.html" "css/style.css" "js/main.js" "product-detail.html")
    for file in "${web_files[@]}"; do
        if [ -f "$file" ]; then
            SIZE=$(du -h "$file" | cut -f1)
            echo "✅ $file ($SIZE)"
        else
            echo "❌ $file (不存在)"
        fi
    done
    echo ""
    
    # 检查 Git 状态
    if [ -d ".git" ]; then
        echo "📦 Git 状态:"
        echo "-----------"
        git status --short
        echo ""
    fi
    
    # 磁盘使用
    echo "💾 磁盘使用:"
    echo "-----------"
    df -h . | tail -1
    echo ""
}

# 系统配置
system_config() {
    log_info "系统配置..."
    echo ""
    echo "请选择配置选项："
    echo "1) 安装依赖工具"
    echo "2) 配置环境变量"
    echo "3) 设置定时任务"
    echo "4) 配置报警通知"
    echo "5) 返回主菜单"
    echo ""
    
    read -p "请输入选择 (1-5): " config_choice
    
    case $config_choice in
        1)
            install_dependencies
            ;;
        2)
            setup_environment
            ;;
        3)
            setup_cron
            ;;
        4)
            setup_alerts
            ;;
        5)
            return
            ;;
        *)
            log_error "无效选择"
            ;;
    esac
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖工具..."
    echo ""
    
    # 检查包管理器
    if command -v apt-get &> /dev/null; then
        echo "检测到 apt，安装工具..."
        sudo apt-get update
        sudo apt-get install -y curl wget git nodejs npm python3 python3-pip
    elif command -v yum &> /dev/null; then
        echo "检测到 yum，安装工具..."
        sudo yum install -y curl wget git nodejs npm python3 python3-pip
    elif command -v brew &> /dev/null; then
        echo "检测到 brew，安装工具..."
        brew install curl wget git node npm python3
    else
        log_warning "未检测到包管理器，请手动安装工具"
    fi
    
    # 安装 Node.js 工具
    if command -v npm &> /dev/null; then
        echo "安装 Node.js 工具..."
        npm install -g vercel netlify-cli lighthouse
    fi
    
    # 安装 Python 工具
    if command -v pip3 &> /dev/null; then
        echo "安装 Python 工具..."
        pip3 install awscli
    fi
    
    log_success "依赖安装完成"
}

# 配置环境变量
setup_environment() {
    log_info "配置环境变量..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success "已创建 .env 文件，请编辑配置"
        else
            log_error ".env.example 不存在"
        fi
    else
        log_info ".env 文件已存在"
    fi
    
    echo ""
    echo "当前环境变量:"
    echo "--------------"
    if [ -f ".env" ]; then
        cat .env
    fi
    echo ""
    echo "编辑命令: nano .env"
}

# 设置定时任务
setup_cron() {
    log_info "设置定时任务..."
    echo ""
    
    cat > /tmp/cron-jobs.txt << 'EOF'
# 电商网站自动化任务
# 编辑: crontab -e

# 每天凌晨1点运行备份
0 1 * * * cd /path/to/your/project && ./run-backup.sh >> logs/cron-backup.log 2>&1

# 每30分钟运行监控
*/30 * * * * cd /path/to/your/project && ./monitor-site.sh >> logs/cron-monitor.log 2>&1

# 每天凌晨2点运行测试
0 2 * * * cd /path/to/your/project && ./run-tests.sh >> logs/cron-tests.log 2>&1

# 每周日凌晨3点运行完整流程
0 3 * * 0 cd /path/to/your/project && ./automate.sh --full >> logs/cron-full.log 2>&1

# 每月1号凌晨4点清理旧备份
0 4 1 * * cd /path/to/your/project && find backups -type d -name "ecommerce-backup-*" -mtime +30 -exec rm -rf {} \; 2>/dev/null
EOF
    
    echo "定时任务配置示例:"
    echo "----------------"
    cat /tmp/cron-jobs.txt
    echo ""
    echo "添加定时任务:"
    echo "1. 复制上面的配置"
    echo "2. 运行: crontab -e"
    echo "3. 粘贴配置"
    echo "4. 修改 /path/to/your/project 为实际路径"
    echo "5. 保存退出"
}

# 配置报警通知
setup_alerts() {
    log_info "配置报警通知..."
    echo ""
    
    cat > /tmp/alert-config.md << 'EOF'
# 报警通知配置

## 1. 邮件通知
编辑 monitor-site.sh，添加：
```bash
# 发送邮件
send_email() {
    local subject=$1
    local body=$2
    
    echo "$body" | mail -s "$subject" admin@example.com
}

# 在报警部分调用
if [ $ERRORS -gt 0 ]; then
    send_email "网站监控报警" "发现 $ERRORS 个错误"
fi
```

## 2. Slack 通知
需要 Slack Webhook URL：
```bash
send_slack() {
    local message=$1
    local webhook_url="https://hooks.slack.com/services/XXX/XXX/XXX"
    
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"$message\"}" \
        "$webhook_url"
}
```

## 3. Discord 通知
需要 Discord Webhook URL：
```bash
send_discord() {
    local message=$1
    local webhook_url="https://discord.com/api/webhooks/XXX/XXX"
    
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"content\":\"$message\"}" \
        "$webhook_url"
}
```

## 4. Telegram 通知
需要 Telegram Bot Token 和 Chat ID：
```bash
send_telegram() {
    local message=$1
    local bot_token="YOUR_BOT_TOKEN"
    local chat_id="YOUR_CHAT_ID"
    
    curl -X POST \
        -H 'Content-type: application/json' \
        --data "{\"chat_id\":\"$chat_id\",\"text\":\"$message\"}" \
        "https://api.telegram.org/bot$bot_token/sendMessage"
}
```

## 5. 配置步骤
1. 获取相应的 Webhook URL 或 API 密钥
2. 添加到 .env 文件
3. 修改监控脚本使用这些配置
4. 测试报警功能
EOF
    
    echo "报警通知配置指南:"
    echo "----------------"
    cat /tmp/alert-config.md
}

# 查看文档
show_documentation() {
    log_info "查看文档..."
    echo ""
    
    echo "📚 可用文档:"
    echo "-----------"
    
    docs=("DEPLOYMENT.md" "README.md")
    for doc in "${docs[@]}"; do
        if [ -f "$doc" ]; then
            echo "📄 $doc"
        fi
    done
    
    echo ""
    echo "脚本文档:"
    echo "--------"
    echo "🧪 run-tests.sh    - 自动化测试脚本"
    echo "💾 run-backup.sh   - 自动化备份脚本"
    echo "📊 monitor-site.sh - 网站监控脚本"
    echo "🚀 deploy-all.sh   - 一键部署脚本"
    echo "⚙️  setup-deployment.sh - 部署配置脚本"
    echo ""
    echo "查看命令: cat 文件名"
}

# 主循环
while true; do
    show_menu
    read -p "请输入选择 (1-9): " choice
    
    case $choice in
        1)
            run_tests
            ;;
        2)
            run_backup
            ;;
        3)
            run_monitoring
            ;;
        4)
            run_deployment
            ;;
        5)
            run_full_process
            ;;
        6)
            show_status
            ;;
        7)
            system_config
            ;;
        8)
            show_documentation
            ;;
        9)
            echo "再见！👋"
            exit 0
            ;;
        *)
            log_error "无效选择，请重新输入"
            ;;
    esac
    
    echo ""
    read -p "按回车键继续..." -n 1
done