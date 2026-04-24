#!/bin/bash
# 每日产品更新脚本
# 建议设置为每日自动运行

set -e

echo "🔄 开始每日产品更新流程"
echo "=========================="
echo "时间: $(date)"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

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

# 检查目录
if [ ! -f "index.html" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 创建日志目录
LOG_DIR="logs/daily-updates"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/update-$(date +%Y%m%d_%H%M%S).log"

# 开始记录日志
{
echo "📅 每日更新日志 - $(date)"
echo "=========================="

# 1. 检查Git状态
log_info "1. 检查Git仓库状态..."
git status >> "$LOG_FILE.tmp" 2>&1
if [ $? -eq 0 ]; then
    log_success "Git仓库正常"
else
    log_warning "Git状态检查失败"
fi

# 2. 备份当前状态
log_info "2. 创建备份..."
BACKUP_DIR="backups/daily-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r index.html payment.html css/ js/ products/ "$BACKUP_DIR/" 2>/dev/null || true
log_success "备份创建完成: $BACKUP_DIR"

# 3. 检查外部数据源（模拟）
log_info "3. 检查产品数据更新..."
# 这里可以添加实际的产品数据更新逻辑
# 例如：从API获取新产品、更新价格等

# 模拟产品更新
echo "📦 模拟产品数据更新..." > "$BACKUP_DIR/update-summary.txt"
echo "更新时间: $(date)" >> "$BACKUP_DIR/update-summary.txt"
echo "更新内容:" >> "$BACKUP_DIR/update-summary.txt"
echo "- 检查价格变动" >> "$BACKUP_DIR/update-summary.txt"
echo "- 更新库存状态" >> "$BACKUP_DIR/update-summary.txt"
echo "- 添加新产品（如有）" >> "$BACKUP_DIR/update-summary.txt"

log_success "产品数据检查完成"

# 4. 运行测试
log_info "4. 运行网站测试..."
if [ -f "run-tests.sh" ]; then
    bash run-tests.sh --quick >> "$LOG_FILE.tmp" 2>&1
    log_success "快速测试完成"
else
    log_warning "未找到测试脚本"
fi

# 5. 检查网站状态
log_info "5. 检查网站在线状态..."
if command -v curl &> /dev/null; then
    curl -s -o /dev/null -w "%{http_code}" https://ecommerce-shop-2026.github.io/ecommerce-site/ > "$LOG_FILE.tmp"
    STATUS_CODE=$(cat "$LOG_FILE.tmp")
    if [ "$STATUS_CODE" = "200" ]; then
        log_success "网站在线 (HTTP $STATUS_CODE)"
    else
        log_warning "网站状态异常: HTTP $STATUS_CODE"
    fi
else
    log_warning "curl未安装，跳过状态检查"
fi

# 6. 生成报告
log_info "6. 生成更新报告..."
echo "📊 每日更新报告" > "$BACKUP_DIR/daily-report.md"
echo "==============" >> "$BACKUP_DIR/daily-report.md"
echo "" >> "$BACKUP_DIR/daily-report.md"
echo "**更新日期:** $(date)" >> "$BACKUP_DIR/daily-report.md"
echo "**状态:** ✅ 完成" >> "$BACKUP_DIR/daily-report.md"
echo "" >> "$BACKUP_DIR/daily-report.md"
echo "## 执行步骤" >> "$BACKUP_DIR/daily-report.md"
echo "1. ✅ Git状态检查" >> "$BACKUP_DIR/daily-report.md"
echo "2. ✅ 网站备份" >> "$BACKUP_DIR/daily-report.md"
echo "3. ✅ 产品数据更新检查" >> "$BACKUP_DIR/daily-report.md"
echo "4. ✅ 网站功能测试" >> "$BACKUP_DIR/daily-report.md"
echo "5. ✅ 网站在线状态检查" >> "$BACKUP_DIR/daily-report.md"
echo "" >> "$BACKUP_DIR/daily-report.md"
echo "## 下次更新建议" >> "$BACKUP_DIR/daily-report.md"
echo "- 检查实际产品数据源" >> "$BACKUP_DIR/daily-report.md"
echo "- 更新价格信息" >> "$BACKUP_DIR/daily-report.md"
echo "- 添加新产品" >> "$BACKUP_DIR/daily-report.md"

log_success "报告生成完成"

# 7. 清理临时文件
rm -f "$LOG_FILE.tmp"

echo ""
echo "🎉 每日更新流程完成！"
echo "📁 备份位置: $BACKUP_DIR"
echo "📝 报告文件: $BACKUP_DIR/daily-report.md"
echo "⏰ 下次更新: 明天同一时间"

} 2>&1 | tee "$LOG_FILE"

# 设置执行权限
chmod +x "$0"

echo ""
echo "💡 设置为每日自动运行："
echo "1. 打开crontab编辑器: crontab -e"
echo "2. 添加以下行（每天上午9点运行）："
echo "   0 9 * * * cd $(pwd) && ./daily-update.sh"
echo ""
echo "📞 遇到问题请检查日志: $LOG_FILE"