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
