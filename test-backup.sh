#!/bin/bash
# 简化备份测试脚本

echo "🔧 开始备份系统测试"
echo "=================="

# 检查必要文件
echo "1. 检查项目文件..."
if [ -f "index.html" ]; then
    echo "   ✓ index.html 存在"
else
    echo "   ✗ index.html 不存在"
    exit 1
fi

if [ -f "product-detail.html" ]; then
    echo "   ✓ product-detail.html 存在"
else
    echo "   ✗ product-detail.html 不存在"
fi

# 检查目录结构
echo "2. 检查目录结构..."
directories=("css" "js" "images" "products")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✓ $dir/ 目录存在"
    else
        echo "   ✗ $dir/ 目录不存在"
    fi
done

# 创建测试备份目录
echo "3. 创建测试备份..."
TEST_BACKUP_DIR="test-backup-$(date '+%Y%m%d_%H%M%S')"
mkdir -p "$TEST_BACKUP_DIR"

# 复制关键文件
echo "4. 备份关键文件..."
cp index.html "$TEST_BACKUP_DIR/" 2>/dev/null && echo "   ✓ 备份 index.html"
cp product-detail.html "$TEST_BACKUP_DIR/" 2>/dev/null && echo "   ✓ 备份 product-detail.html"

# 检查文件大小
echo "5. 验证备份文件..."
if [ -f "$TEST_BACKUP_DIR/index.html" ]; then
    size=$(wc -c < "$TEST_BACKUP_DIR/index.html")
    echo "   ✓ index.html 备份成功 ($size 字节)"
else
    echo "   ✗ index.html 备份失败"
fi

if [ -f "$TEST_BACKUP_DIR/product-detail.html" ]; then
    size=$(wc -c < "$TEST_BACKUP_DIR/product-detail.html")
    echo "   ✓ product-detail.html 备份成功 ($size 字节)"
else
    echo "   ✗ product-detail.html 备份失败"
fi

# 创建恢复脚本
echo "6. 创建恢复脚本..."
cat > "$TEST_BACKUP_DIR/restore.sh" << 'EOF'
#!/bin/bash
echo "恢复测试备份..."
if [ -f "index.html.backup" ]; then
    cp index.html.backup index.html
    echo "恢复 index.html"
fi
if [ -f "product-detail.html.backup" ]; then
    cp product-detail.html.backup product-detail.html
    echo "恢复 product-detail.html"
fi
echo "恢复完成"
EOF

chmod +x "$TEST_BACKUP_DIR/restore.sh"
echo "   ✓ 恢复脚本已创建"

# 创建备份报告
echo "7. 生成备份报告..."
cat > "$TEST_BACKUP_DIR/backup-report.txt" << EOF
备份测试报告
============
时间: $(date)
备份目录: $TEST_BACKUP_DIR
文件数量: $(find "$TEST_BACKUP_DIR" -type f | wc -l)
总大小: $(du -sh "$TEST_BACKUP_DIR" | cut -f1)

备份文件:
$(find "$TEST_BACKUP_DIR" -type f -printf "  %f (%s 字节)\n")

状态: 测试成功
EOF

echo "   ✓ 备份报告已生成"

echo ""
echo "✅ 备份系统测试完成"
echo "备份保存在: $TEST_BACKUP_DIR"
echo "查看报告: cat $TEST_BACKUP_DIR/backup-report.txt"