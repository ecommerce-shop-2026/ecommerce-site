#!/bin/bash
# 自动化备份系统
# 备份网站文件和数据库

set -e  # 遇到错误时退出

echo "💾 开始自动化备份"
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

# 配置
BACKUP_DIR="backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_NAME="ecommerce-backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# 创建备份目录
mkdir -p "$BACKUP_PATH"
mkdir -p "$BACKUP_DIR/logs"

log_info "备份将保存到: $BACKUP_PATH"

# 1. 备份网站文件
log_info "1. 备份网站文件..."
tar -czf "$BACKUP_PATH/website-files.tar.gz" \
    --exclude="$BACKUP_DIR" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="*.log" \
    .

if [ $? -eq 0 ]; then
    FILE_SIZE=$(du -h "$BACKUP_PATH/website-files.tar.gz" | cut -f1)
    log_success "网站文件备份完成 ($FILE_SIZE)"
    echo "网站文件备份: $FILE_SIZE" > "$BACKUP_PATH/backup-summary.txt"
else
    log_error "网站文件备份失败"
    exit 1
fi

# 2. 备份数据库（如果有）
log_info "2. 检查数据库备份..."
if [ -f "database.db" ] || [ -d "data" ]; then
    log_info "  发现数据库文件，进行备份..."
    
    # 备份 SQLite 数据库
    if [ -f "database.db" ]; then
        cp "database.db" "$BACKUP_PATH/database.db"
        log_success "SQLite 数据库备份完成"
        echo "SQLite 数据库: 已备份" >> "$BACKUP_PATH/backup-summary.txt"
    fi
    
    # 备份数据目录
    if [ -d "data" ]; then
        tar -czf "$BACKUP_PATH/data-files.tar.gz" "data"
        DATA_SIZE=$(du -h "$BACKUP_PATH/data-files.tar.gz" | cut -f1)
        log_success "数据目录备份完成 ($DATA_SIZE)"
        echo "数据目录: $DATA_SIZE" >> "$BACKUP_PATH/backup-summary.txt"
    fi
else
    log_info "  未发现数据库文件，跳过数据库备份"
    echo "数据库: 无" >> "$BACKUP_PATH/backup-summary.txt"
fi

# 3. 备份配置文件
log_info "3. 备份配置文件..."
CONFIG_FILES=(".env" "vercel.json" "netlify.toml" "package.json" "package-lock.json")
CONFIG_COUNT=0

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$config" ]; then
        cp "$config" "$BACKUP_PATH/"
        CONFIG_COUNT=$((CONFIG_COUNT + 1))
    fi
done

log_success "备份了 $CONFIG_COUNT 个配置文件"
echo "配置文件: $CONFIG_COUNT 个" >> "$BACKUP_PATH/backup-summary.txt"

# 4. 备份 Git 信息
log_info "4. 备份 Git 信息..."
if [ -d ".git" ]; then
    git log --oneline -20 > "$BACKUP_PATH/git-history.txt"
    git status > "$BACKUP_PATH/git-status.txt"
    git remote -v > "$BACKUP_PATH/git-remotes.txt"
    log_success "Git 信息备份完成"
    echo "Git 信息: 已备份" >> "$BACKUP_PATH/backup-summary.txt"
else
    log_info "  不是 Git 仓库，跳过 Git 备份"
    echo "Git 信息: 无" >> "$BACKUP_PATH/backup-summary.txt"
fi

# 5. 创建备份清单
log_info "5. 创建备份清单..."
find . -type f -name "*" ! -path "./$BACKUP_DIR/*" ! -name "*.log" | \
    head -1000 > "$BACKUP_PATH/file-list.txt"

FILE_COUNT=$(wc -l < "$BACKUP_PATH/file-list.txt")
log_success "记录了 $FILE_COUNT 个文件"
echo "文件总数: $FILE_COUNT" >> "$BACKUP_PATH/backup-summary.txt"

# 6. 计算备份大小
log_info "6. 计算备份大小..."
TOTAL_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
echo "总备份大小: $TOTAL_SIZE" >> "$BACKUP_PATH/backup-summary.txt"

# 7. 创建恢复脚本
log_info "7. 创建恢复脚本..."
cat > "$BACKUP_PATH/restore.sh" << 'EOF'
#!/bin/bash
# 备份恢复脚本
# 用于从备份中恢复网站

set -e

echo "🔄 开始恢复备份"
echo "========================"

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <备份目录>"
    echo "示例: $0 backups/ecommerce-backup-20241201_120000"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ 错误: 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

# 显示备份信息
echo "备份信息:"
echo "----------"
if [ -f "$BACKUP_DIR/backup-summary.txt" ]; then
    cat "$BACKUP_DIR/backup-summary.txt"
fi

echo ""
read -p "是否继续恢复？(y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "恢复已取消"
    exit 0
fi

# 1. 恢复网站文件
echo "📁 恢复网站文件..."
if [ -f "$BACKUP_DIR/website-files.tar.gz" ]; then
    echo "  正在解压网站文件..."
    tar -xzf "$BACKUP_DIR/website-files.tar.gz"
    echo "  ✅ 网站文件恢复完成"
else
    echo "  ⚠️  未找到网站文件备份"
fi

# 2. 恢复数据库
echo "🗄️  恢复数据库..."
if [ -f "$BACKUP_DIR/database.db" ]; then
    echo "  恢复 SQLite 数据库..."
    cp "$BACKUP_DIR/database.db" .
    echo "  ✅ SQLite 数据库恢复完成"
fi

if [ -f "$BACKUP_DIR/data-files.tar.gz" ]; then
    echo "  恢复数据目录..."
    tar -xzf "$BACKUP_DIR/data-files.tar.gz"
    echo "  ✅ 数据目录恢复完成"
fi

# 3. 恢复配置文件
echo "⚙️  恢复配置文件..."
for config in "$BACKUP_DIR"/*; do
    filename=$(basename "$config")
    case "$filename" in
        *.json|*.toml|.env|package.json|package-lock.json)
            if [ -f "$config" ] && [ "$filename" != "backup-summary.txt" ]; then
                echo "  恢复 $filename..."
                cp "$config" .
            fi
            ;;
    esac
done

echo "✅ 配置文件恢复完成"

# 4. 验证恢复
echo "🔍 验证恢复..."
if [ -f "index.html" ]; then
    echo "  ✅ index.html 存在"
else
    echo "  ❌ index.html 不存在，恢复可能不完整"
fi

if [ -f "css/style.css" ]; then
    echo "  ✅ style.css 存在"
else
    echo "  ❌ style.css 不存在"
fi

if [ -f "js/main.js" ]; then
    echo "  ✅ main.js 存在"
else
    echo "  ❌ main.js 不存在"
fi

echo ""
echo "🎉 备份恢复完成！"
echo "========================"
echo ""
echo "📋 下一步："
echo "   1. 测试网站功能: 打开 index.html"
echo "   2. 检查配置文件: 验证 .env 等配置"
echo "   3. 运行测试: ./run-tests.sh"
echo ""
echo "⚠️  注意："
echo "   - 如果恢复后有问题，请检查文件权限"
echo "   - 确保所有依赖已安装"
echo "   - 验证数据库连接（如果有）"
EOF

chmod +x "$BACKUP_PATH/restore.sh"
log_success "恢复脚本已创建"

# 8. 创建备份报告
log_info "8. 创建备份报告..."
cat > "$BACKUP_PATH/backup-report.md" << EOF
# 备份报告

## 备份信息
- 备份时间: $(date)
- 备份名称: $BACKUP_NAME
- 备份目录: $BACKUP_PATH
- 总大小: $TOTAL_SIZE

## 备份内容
$(cat "$BACKUP_PATH/backup-summary.txt")

## 文件清单
共 $FILE_COUNT 个文件，前1000个文件：
\`\`\`
$(head -20 "$BACKUP_PATH/file-list.txt")
...
\`\`\`

## Git 状态
\`\`\`
$(if [ -f "$BACKUP_PATH/git-status.txt" ]; then cat "$BACKUP_PATH/git-status.txt"; else echo "不是 Git 仓库"; fi)
\`\`\`

## 恢复说明
要恢复此备份，请运行：
\`\`\`bash
chmod +x $BACKUP_PATH/restore.sh
$BACKUP_PATH/restore.sh $BACKUP_PATH
\`\`\`

## 注意事项
1. 恢复前请确保有当前数据的备份
2. 恢复会覆盖现有文件
3. 恢复后请验证网站功能

---
*备份创建于: $(date)*
EOF

# 9. 清理旧备份（保留最近7天）
log_info "9. 清理旧备份..."
if [ -d "$BACKUP_DIR" ]; then
    find "$BACKUP_DIR" -type d -name "ecommerce-backup-*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
    log_success "已清理7天前的旧备份"
fi

# 10. 备份到远程（可选）
log_info "10. 配置远程备份..."
cat > "$BACKUP_PATH/remote-backup.md" << 'EOF'
# 远程备份配置指南

## 1. 备份到 AWS S3
```bash
# 安装 AWS CLI
pip install awscli

# 配置
aws configure

# 上传备份
aws s3 sync backups/ s3://your-bucket-name/ecommerce-backups/
```

## 2. 备份到 Google Cloud Storage
```bash
# 安装 gcloud CLI
curl https://sdk.cloud.google.com | bash

# 配置
gcloud init

# 上传备份
gsutil -m cp -r backups/* gs://your-bucket-name/ecommerce-backups/
```

## 3. 备份到 Dropbox
```bash
# 使用 rclone
rclone config
rclone sync backups/ dropbox:ecommerce-backups/
```

## 4. 备份到 GitHub
```bash
# 创建备份仓库
git init backup-repo
cd backup-repo
git remote add origin https://github.com/yourname/ecommerce-backups.git

# 添加备份
cp -r ../backups/ecommerce-backup-* .
git add .
git commit -m "Backup $(date)"
git push origin main
```

## 5. 自动同步脚本
创建 `sync-backup.sh`：
```bash
#!/bin/bash
# 同步备份到远程

BACKUP_DIR="backups"
LATEST_BACKUP=$(ls -td $BACKUP_DIR/ecommerce-backup-* | head -1)

# 同步到 S3
aws s3 sync $LATEST_BACKUP s3://your-bucket/ecommerce-backups/latest/

# 发送通知
echo "备份已同步到远程" | mail -s "备份同步完成" admin@example.com
```

## 6. 监控备份状态
- 设置日志监控
- 配置报警通知
- 定期验证备份完整性
EOF

# 11. 记录备份日志
log_info "11. 记录备份日志..."
echo "$(date '+%Y-%m-%d %H:%M:%S') - 备份完成: $BACKUP_NAME ($TOTAL_SIZE)" >> "$BACKUP_DIR/logs/backup-history.log"

echo ""
echo "🎉 自动化备份完成！"
echo "========================"
echo ""
echo "📋 备份详情："
echo "   备份名称: $BACKUP_NAME"
echo "   备份位置: $BACKUP_PATH"
echo "   总大小: $TOTAL_SIZE"
echo "   备份报告: $BACKUP_PATH/backup-report.md"
echo "   恢复脚本: $BACKUP_PATH/restore.sh"
echo ""
echo "🚀 下一步："
echo "   1. 验证备份: ls -la $BACKUP_PATH/"
echo "   2. 测试恢复: $BACKUP_PATH/restore.sh $BACKUP_PATH"
echo "   3. 配置远程备份: 查看 $BACKUP_PATH/remote-backup.md"
echo ""
echo "📅 建议设置定时备份："
echo "   crontab -e"
echo "   添加: 0 1 * * * cd /path/to/project && ./run-backup.sh"
echo "   （每天凌晨1点运行备份）"
echo ""
echo "🔒 安全建议："
echo "   - 加密敏感备份"
echo "   - 使用强密码保护"
echo "   - 定期测试恢复流程"
echo "   - 多地备份（3-2-1规则）"