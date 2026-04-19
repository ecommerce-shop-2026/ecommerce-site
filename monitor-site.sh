#!/bin/bash
# 网站监控脚本
# 监控网站可用性、性能和错误

set -e  # 遇到错误时退出

echo "📊 开始网站监控"
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

# 配置
MONITOR_DIR="monitoring"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
REPORT_DIR="$MONITOR_DIR/reports/$TIMESTAMP"
mkdir -p "$REPORT_DIR"
mkdir -p "$MONITOR_DIR/logs"

# 网站URL（本地测试）
LOCAL_URL="http://localhost:8000"
GITHUB_URL="https://ecommerce-shop-2026.github.io/ecommerce-site"

log_info "监控报告将保存到: $REPORT_DIR"

# 1. 检查本地服务器
log_info "1. 检查本地服务器..."
if command -v python3 &> /dev/null; then
    # 启动本地服务器（如果未运行）
    if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
        log_info "  启动本地服务器..."
        python3 -m http.server 8000 > "$MONITOR_DIR/logs/server.log" 2>&1 &
        SERVER_PID=$!
        sleep 2
        log_success "  本地服务器已启动 (PID: $SERVER_PID)"
    else
        log_success "  本地服务器已在运行"
    fi
else
    log_warning "  Python3 未安装，跳过本地服务器检查"
fi

# 2. 检查网站可用性
log_info "2. 检查网站可用性..."

check_url() {
    local url=$1
    local name=$2
    
    log_info "  检查 $name ($url)..."
    
    # 使用 curl 检查
    START_TIME=$(date +%s%N)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
    END_TIME=$(date +%s%N)
    RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))  # 毫秒
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        log_success "  $name: 可用 (HTTP $HTTP_CODE, ${RESPONSE_TIME}ms)"
        echo "✅ $name: HTTP $HTTP_CODE, ${RESPONSE_TIME}ms" >> "$REPORT_DIR/availability.txt"
        return 0
    else
        log_error "  $name: 不可用 (HTTP $HTTP_CODE, ${RESPONSE_TIME}ms)"
        echo "❌ $name: HTTP $HTTP_CODE, ${RESPONSE_TIME}ms" >> "$REPORT_DIR/availability.txt"
        return 1
    fi
}

# 检查本地URL
if command -v curl &> /dev/null; then
    check_url "$LOCAL_URL" "本地服务器"
else
    log_warning "  curl 未安装，跳过可用性检查"
fi

# 3. 检查页面加载时间
log_info "3. 检查页面加载时间..."
if command -v curl &> /dev/null; then
    for url in "$LOCAL_URL" "$GITHUB_URL"; do
        log_info "  测试 $url 加载时间..."
        
        # 测试首页加载
        START_TIME=$(date +%s%N)
        curl -s -o /dev/null "$url"
        END_TIME=$(date +%s%N)
        LOAD_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
        
        echo "$url: ${LOAD_TIME}ms" >> "$REPORT_DIR/load-times.txt"
        
        if [ "$LOAD_TIME" -lt 1000 ]; then
            log_success "  $url: 加载快速 (${LOAD_TIME}ms)"
        elif [ "$LOAD_TIME" -lt 3000 ]; then
            log_warning "  $url: 加载较慢 (${LOAD_TIME}ms)"
        else
            log_error "  $url: 加载很慢 (${LOAD_TIME}ms)"
        fi
    done
fi

# 4. 检查资源文件
log_info "4. 检查资源文件..."
RESOURCE_FILES=(
    "css/style.css"
    "js/main.js"
    "js/fix.js"
    "js/product-detail.js"
    "favicon.ico"
)

for resource in "${RESOURCE_FILES[@]}"; do
    if [ -f "$resource" ]; then
        SIZE=$(du -h "$resource" | cut -f1)
        log_success "  $resource: 存在 ($SIZE)"
        echo "✅ $resource: $SIZE" >> "$REPORT_DIR/resources.txt"
    else
        log_error "  $resource: 不存在"
        echo "❌ $resource: 不存在" >> "$REPORT_DIR/resources.txt"
    fi
done

# 5. 检查 JavaScript 错误
log_info "5. 检查 JavaScript 错误..."
if [ -f "js/main.js" ]; then
    # 简单的语法检查
    if command -v node &> /dev/null; then
        if node -c "js/main.js" 2> "$REPORT_DIR/js-errors.txt"; then
            log_success "  main.js: 语法正确"
            echo "✅ main.js: 语法正确" >> "$REPORT_DIR/js-check.txt"
        else
            log_error "  main.js: 语法错误"
            echo "❌ main.js: 语法错误" >> "$REPORT_DIR/js-check.txt"
            cat "$REPORT_DIR/js-errors.txt"
        fi
    fi
fi

# 6. 检查链接有效性
log_info "6. 检查链接有效性..."
if command -v linkchecker &> /dev/null; then
    log_info "  运行链接检查..."
    linkchecker --check-extern --no-status index.html > "$REPORT_DIR/link-check.txt" 2>&1 || true
    
    # 统计结果
    BROKEN_LINKS=$(grep -c "ERROR 404" "$REPORT_DIR/link-check.txt" || true)
    if [ "$BROKEN_LINKS" -eq 0 ]; then
        log_success "  所有链接正常"
    else
        log_error "  发现 $BROKEN_LINKS 个损坏链接"
    fi
else
    log_warning "  linkchecker 未安装，跳过链接检查"
fi

# 7. 检查文件大小
log_info "7. 检查文件大小..."
find . -name "*.html" -o -name "*.css" -o -name "*.js" | \
    head -20 | while read file; do
    SIZE=$(du -h "$file" | cut -f1)
    echo "$SIZE - $file" >> "$REPORT_DIR/file-sizes.txt"
done

log_info "  文件大小检查完成"

# 8. 检查 Git 状态
log_info "8. 检查 Git 状态..."
if [ -d ".git" ]; then
    git status > "$REPORT_DIR/git-status.txt"
    git log --oneline -5 > "$REPORT_DIR/git-history.txt"
    
    # 检查是否有未提交的更改
    if git diff --quiet; then
        log_success "  Git: 没有未提交的更改"
        echo "✅ Git: 干净" >> "$REPORT_DIR/git-check.txt"
    else
        log_warning "  Git: 有未提交的更改"
        echo "⚠️ Git: 有未提交的更改" >> "$REPORT_DIR/git-check.txt"
    fi
else
    log_info "  不是 Git 仓库，跳过 Git 检查"
fi

# 9. 检查依赖
log_info "9. 检查依赖..."
if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        npm list --depth=0 > "$REPORT_DIR/dependencies.txt" 2>&1 || true
        log_info "  依赖列表已保存"
    fi
fi

# 10. 生成监控报告
log_info "10. 生成监控报告..."
cat > "$REPORT_DIR/monitoring-report.md" << EOF
# 网站监控报告

## 监控信息
- 监控时间: $(date)
- 报告目录: $REPORT_DIR
- 监控脚本: monitor-site.sh

## 1. 可用性检查
\`\`\`
$(cat "$REPORT_DIR/availability.txt" 2>/dev/null || echo "无数据")
\`\`\`

## 2. 加载时间
\`\`\`
$(cat "$REPORT_DIR/load-times.txt" 2>/dev/null || echo "无数据")
\`\`\`

## 3. 资源文件
\`\`\`
$(cat "$REPORT_DIR/resources.txt" 2>/dev/null || echo "无数据")
\`\`\`

## 4. JavaScript 检查
\`\`\`
$(cat "$REPORT_DIR/js-check.txt" 2>/dev/null || echo "无数据")
\`\`\`

## 5. 链接检查
发现 $(grep -c "ERROR 404" "$REPORT_DIR/link-check.txt" 2>/dev/null || echo "0") 个损坏链接

## 6. 文件大小
前20个文件：
\`\`\`
$(head -10 "$REPORT_DIR/file-sizes.txt" 2>/dev/null || echo "无数据")
\`\`\`

## 7. Git 状态
\`\`\`
$(cat "$REPORT_DIR/git-check.txt" 2>/dev/null || echo "不是 Git 仓库")
\`\`\`

## 8. 系统状态
- 磁盘使用: $(df -h . | tail -1 | awk '{print $5}')
- 内存使用: $(free -h | grep Mem | awk '{print $3 "/" $2}')
- CPU负载: $(uptime | awk -F'load average:' '{print $2}')

## 9. 建议
1. 修复发现的错误和警告
2. 优化加载时间超过1秒的页面
3. 确保所有资源文件存在
4. 定期运行监控脚本

## 10. 报警阈值
- 可用性: < 99.9% (错误)
- 加载时间: > 3秒 (警告)
- 损坏链接: > 0 (警告)
- 文件缺失: > 0 (错误)

---
*监控完成于: $(date)*
EOF

# 11. 发送报警（如果发现问题）
log_info "11. 检查是否需要发送报警..."

ERRORS=0
WARNINGS=0

# 检查错误
if [ -f "$REPORT_DIR/availability.txt" ] && grep -q "❌" "$REPORT_DIR/availability.txt"; then
    ERRORS=$((ERRORS + 1))
fi

if [ -f "$REPORT_DIR/resources.txt" ] && grep -q "❌" "$REPORT_DIR/resources.txt"; then
    ERRORS=$((ERRORS + 1))
fi

if [ -f "$REPORT_DIR/js-check.txt" ] && grep -q "❌" "$REPORT_DIR/js-check.txt"; then
    ERRORS=$((ERRORS + 1))
fi

# 检查警告
if [ -f "$REPORT_DIR/load-times.txt" ] && grep -q "很慢" "$REPORT_DIR/load-times.txt"; then
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "$REPORT_DIR/git-check.txt" ] && grep -q "⚠️" "$REPORT_DIR/git-check.txt"; then
    WARNINGS=$((WARNINGS + 1))
fi

# 生成报警摘要
cat > "$REPORT_DIR/alert-summary.txt" << EOF
监控报警摘要
============
时间: $(date)
错误: $ERRORS 个
警告: $WARNINGS 个

详细报告: $REPORT_DIR/monitoring-report.md
EOF

if [ $ERRORS -gt 0 ] || [ $WARNINGS -gt 0 ]; then
    log_warning "发现 $ERRORS 个错误和 $WARNINGS 个警告"
    
    # 这里可以添加发送报警的代码
    # 例如：发送邮件、Slack消息等
    echo "📧 报警摘要已保存到: $REPORT_DIR/alert-summary.txt"
    echo "   可以配置自动发送到："
    echo "   - 邮件: 使用 mail 命令"
    echo "   - Slack: 使用 webhook"
    echo "   - Discord: 使用 webhook"
else
    log_success "没有发现错误或警告"
fi

# 12. 清理（停止本地服务器）
if [ ! -z "$SERVER_PID" ]; then
    log_info "停止本地服务器..."
    kill $SERVER_PID 2>/dev/null || true
fi

echo ""
echo "🎉 网站监控完成！"
echo "========================"
echo ""
echo "📋 监控结果："
echo "   错误: $ERRORS 个"
echo "   警告: $WARNINGS 个"
echo "   报告: $REPORT_DIR/monitoring-report.md"
echo "   报警摘要: $REPORT_DIR/alert-summary.txt"
echo ""
echo "🚀 下一步："
echo "   1. 查看监控报告: cat $REPORT_DIR/monitoring-report.md"
echo "   2. 修复发现的问题"
echo "   3. 配置自动报警"
echo ""
echo "📅 建议设置定时监控："
echo "   crontab -e"
echo "   添加: */30 * * * * cd /path/to/project && ./monitor-site.sh"
echo "   （每30分钟运行一次监控）"
echo ""
echo "🔔 报警配置："
echo "   编辑脚本，添加邮件/Slack/Discord通知"
echo "   配置报警阈值"
echo "   设置维护窗口"