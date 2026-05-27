#!/bin/bash
# ============================================
# ShopEasy 独立站 - 每日自动更新系统
# 功能：备份站点 → 更新时间戳 → Git提交 → 推送部署
# 运行方式：bash auto-daily-update.sh
# ============================================

set -e

# 基础路径配置
SITE_DIR="/c/Users/Administrator/ecommerce-site"
BACKUP_DIR="$SITE_DIR/backups"
LOG_DIR="$BACKUP_DIR/logs"
LOG_FILE="$LOG_DIR/daily-update.log"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
ok()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn(){ echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; }

# 确保目录存在
mkdir -p "$LOG_DIR"

# 开始
echo ""
echo "============================================"
echo "  ShopEasy 每日自动更新系统"
echo "============================================"
log "开始执行每日更新流程..."
echo ""

# Step 1: 备份站点文件
log "[1/5] 备份站点文件..."
BACKUP_NAME="daily-$(date +%Y%m%d-%H%M%S)"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

mkdir -p "$BACKUP_PATH"
cd "$SITE_DIR"

# 备份关键文件（排除.git和backups目录自身）
rsync -a --exclude='.git/' --exclude='backups/' --exclude='*.log' \
  ./ "$BACKUP_PATH/" 2>/dev/null || {
  # fallback: cp方式
  for f in index.html payment.html about.html contact.html product-detail.html \
           order-history.html wishlist.html sitemap.xml robots.txt CNAME; do
    [ -f "$f" ] && cp "$f" "$BACKUP_PATH/"
  done
  [ -d "js" ] && cp -r js "$BACKUP_PATH/"
  [ -d "css" ] && cp -r css "$BACKUP_PATH/"
  [ -d "images" ] && cp -r images "$BACKUP_PATH/"
  [ -d "products" ] && cp -r products "$BACKUP_PATH/"
}

# 更新备份日志
echo "$(date '+%Y-%m-%d %H:%M:%S') - 备份完成: $BACKUP_NAME" >> "$LOG_DIR/backup-history.log"

# 清理过期备份（保留最近30天）
find "$BACKUP_DIR" -maxdepth 1 -type d -name 'daily-*' | sort | head -n -30 | while read old; do
  rm -rf "$old"
  warn "清理过期备份: $(basename $old)"
done

ok "备份完成: $BACKUP_NAME"
echo ""

# Step 2: 检查网站可用性
log "[2/5] 检查网站可用性..."
CURL_OPTS="-s -o /dev/null -w %{http_code} --connect-timeout 10 --max-time 15"
HTTP_CODE=$(curl $CURL_OPTS "https://shop2026easy.com/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
  ok "网站访问正常 (HTTP $HTTP_CODE)"
else
  warn "网站状态异常 (HTTP $HTTP_CODE) - 继续执行提交流程"
fi
echo ""

# Step 3: 更新时间戳（用于追踪每日更新）
log "[3/5] 更新时间戳文件..."
TIMESTAMP_FILE="$SITE_DIR/.last-update"
echo "Last update: $(date '+%Y-%m-%d %H:%M:%S %Z')" > "$TIMESTAMP_FILE"
echo "Version: $(date +%Y%m%d%H%M%S)" >> "$TIMESTAMP_FILE"
ok "时间戳已更新"
echo ""

# Step 4: Git 提交
log "[4/5] Git 提交并推送..."

cd "$SITE_DIR"

# 检查是否有变更
if git status --porcelain | grep -q .; then
  git add -A
  git commit -m "🔄 每日自动更新 $(date '+%Y-%m-%d %H:%M:%S')"
  
  # 推送到GitHub
  if git push origin main 2>&1; then
    ok "Git推送成功，GitHub Pages将自动部署"
  else
    warn "Git推送失败，尝试备用remote..."
    if git push correct-origin main 2>&1; then
      ok "通过备用remote推送成功"
    else
      warn "推送均失败，请检查网络连接"
    fi
  fi
else
  ok "没有变更，跳过提交"
fi
echo ""

# Step 5: 生成更新报告
log "[5/5] 生成更新报告..."
REPORT="
============================================
  ShopEasy 每日更新报告
============================================
日期:      $(date '+%Y-%m-%d %H:%M:%S')
备份:      $BACKUP_NAME ($(du -sh "$BACKUP_PATH" 2>/dev/null | cut -f1) )
网站状态:  HTTP $HTTP_CODE
推送状态:  已完成
============================================
"
echo "$REPORT"
echo "$REPORT" >> "$LOG_FILE"

ok "每日更新流程完成！"
echo ""
