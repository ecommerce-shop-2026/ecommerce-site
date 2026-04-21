#!/bin/bash
# 简单网站监控脚本

echo "🌐 网站监控检查"
echo "=============="
echo "时间: $(date)"
echo ""

# 检查网站可用性
echo "1. 检查网站可用性..."
URL="https://ecommerce-shop-2026.github.io/ecommerce-site"
if curl -s --head --fail "$URL" > /dev/null 2>&1; then
    echo "   ✅ 网站可访问: $URL"
    echo "available: true" > monitoring/last-check.txt
else
    echo "   ❌ 网站不可访问: $URL"
    echo "available: false" > monitoring/last-check.txt
fi

# 检查主页内容
echo "2. 检查主页内容..."
if curl -s "$URL" | grep -q "ShopEasy"; then
    echo "   ✅ 主页包含 'ShopEasy'"
    echo "content: ok" >> monitoring/last-check.txt
else
    echo "   ⚠️  主页缺少 'ShopEasy'"
    echo "content: warning" >> monitoring/last-check.txt
fi

# 检查产品详情页
echo "3. 检查产品详情页..."
if curl -s "https://ecommerce-shop-2026.github.io/ecommerce-site/product-detail.html" | grep -q "404"; then
    echo "   ❌ 产品详情页返回404错误"
    echo "product_detail: 404" >> monitoring/last-check.txt
else
    echo "   ✅ 产品详情页正常"
    echo "product_detail: ok" >> monitoring/last-check.txt
fi

# 生成报告
REPORT_FILE="monitoring/reports/check-$(date '+%Y%m%d_%H%M%S').txt"
echo "监控报告 $(date)" > "$REPORT_FILE"
echo "=================" >> "$REPORT_FILE"
cat monitoring/last-check.txt >> "$REPORT_FILE"

echo ""
echo "📋 监控完成"
echo "报告保存到: $REPORT_FILE"
echo ""
echo "当前状态:"
cat monitoring/last-check.txt