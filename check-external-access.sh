#!/bin/bash
# 外网访问验证脚本
# 用于检查网站在外网的可访问性和功能完整性

echo "🔍 ShopEasy 外网访问验证脚本"
echo "=============================="
echo "开始时间: $(date)"
echo ""

# 网站URL
BASE_URL="https://shop2026easy.com"

# 检查的页面列表
PAGES=(
    "/"
    "/product-detail.html"
    "/payment.html"
    "/order-history.html"
    "/wishlist.html"
    "/product-detail.html?id=1"
    "/product-detail.html?id=2"
    "/product-detail.html?id=3"
    "/product-detail.html?id=4"
    "/product-detail.html?id=5"
    "/product-detail.html?id=6"
    "/product-detail.html?id=7"
    "/product-detail.html?id=8"
    "/products/"
    "/products/wireless-bluetooth-headphones-1-ultra-edition.html"
    "/products/wireless-bluetooth-headphones-2-ultra-edition.html"
    "/products/wireless-bluetooth-headphones-3-premium-edition.html"
    "/products/smart-fitness-watch-2-ultra-edition.html"
    "/products/smart-fitness-watch-3-deluxe-edition.html"
    "/sitemap.xml"
    "/robots.txt"
)

# 功能检查
echo "📊 页面可访问性检查"
echo "------------------"

total_pages=${#PAGES[@]}
success_count=0

for page in "${PAGES[@]}"; do
    url="${BASE_URL}${page}"
    echo -n "检查: ${page} ... "
    
    # 使用curl检查HTTP状态码
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo "✅ 正常 (HTTP $status_code)"
        ((success_count++))
    else
        echo "❌ 失败 (HTTP $status_code)"
    fi
    
    # 添加延迟避免请求过快
    sleep 1
done

echo ""
echo "📈 可访问性统计: $success_count/$total_pages 页面正常"

# 检查SEO文件
echo ""
echo "🔍 SEO文件检查"
echo "-------------"

SEO_FILES=("sitemap.xml" "robots.txt")
for file in "${SEO_FILES[@]}"; do
    url="${BASE_URL}/${file}"
    echo -n "检查: ${file} ... "
    
    if curl -s -f "$url" > /dev/null; then
        echo "✅ 存在且可访问"
    else
        echo "❌ 不存在或无法访问"
    fi
done

# 检查响应时间
echo ""
echo "⏱️  性能检查"
echo "----------"

for page in "/" "/products/"; do
    url="${BASE_URL}${page}"
    echo -n "响应时间 ${page}: "
    
    # 测量响应时间
    start_time=$(date +%s%N)
    curl -s -o /dev/null "$url"
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))
    echo "${response_time}ms"
done

# 检查结构化数据
echo ""
echo "🏷️  结构化数据检查"
echo "----------------"

echo -n "检查结构化数据标签... "
if curl -s "${BASE_URL}/" | grep -q "application/ld+json"; then
    echo "✅ 存在"
else
    echo "❌ 不存在"
fi

# 检查移动端友好标签
echo -n "检查移动端优化... "
if curl -s "${BASE_URL}/" | grep -q "viewport"; then
    echo "✅ 已配置"
else
    echo "❌ 未配置"
fi

# 生成报告
echo ""
echo "📋 验证报告"
echo "----------"
echo "验证时间: $(date)"
echo "网站URL: ${BASE_URL}"
echo "总页面数: ${total_pages}"
echo "可访问页面: ${success_count}"
echo "成功率: $((success_count * 100 / total_pages))%"

if [ "$success_count" -eq "$total_pages" ]; then
    echo ""
    echo "🎉 所有检查通过！网站已准备好外网访问。"
    echo ""
    echo "下一步建议:"
    echo "1. 提交到Google Search Console"
    echo "2. 在社交媒体上分享网站"
    echo "3. 开始推广和营销"
else
    echo ""
    echo "⚠️  发现一些问题需要修复。"
    echo "请检查失败的页面并修复问题。"
fi

echo ""
echo "🔗 重要链接:"
echo "- 主站: ${BASE_URL}/"
echo "- 产品目录: ${BASE_URL}/products/"
echo "- 网站地图: ${BASE_URL}/sitemap.xml"
echo "- robots.txt: ${BASE_URL}/robots.txt"

# 保存报告
REPORT_FILE="external-access-report-$(date +%Y%m%d_%H%M%S).txt"
{
    echo "ShopEasy 外网访问验证报告"
    echo "生成时间: $(date)"
    echo "网站URL: ${BASE_URL}"
    echo "总页面: ${total_pages}"
    echo "可访问页面: ${success_count}"
    echo "成功率: $((success_count * 100 / total_pages))%"
} > "$REPORT_FILE"

echo ""
echo "📄 详细报告已保存到: $REPORT_FILE"