#!/bin/bash
# 电商网站监控脚本 - 修复版

echo "🔄 开始网站监控检查..."
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "----------------------------------------"

# 创建必要的目录
mkdir -p monitoring/reports monitoring/logs monitoring/alerts

# 网站URL
MAIN_URL="https://shop2026easy.com"
PRODUCT_URL="https://shop2026easy.com/product-detail.html"

# 生成时间戳
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
REPORT_FILE="monitoring/reports/monitor_$TIMESTAMP.txt"
JSON_FILE="monitoring/reports/monitor_$TIMESTAMP.json"
LAST_CHECK="monitoring/logs/last_check.txt"

# 初始化检查结果
declare -A RESULTS
RESULTS["main_available"]="false"
RESULTS["main_status"]="unknown"
RESULTS["main_time"]="0"
RESULTS["content_ok"]="false"
RESULTS["product_available"]="false"
RESULTS["product_status"]="unknown"
RESULTS["js_cart"]="false"
RESULTS["js_search"]="false"
RESULTS["js_return"]="false"

echo "1. 检查主网站可用性..."
START_TIME=$(date +%s)
if curl -s --head --fail "$MAIN_URL" > /dev/null 2>&1; then
    RESULTS["main_available"]="true"
    RESULTS["main_status"]="200"
    echo "   ✅ 主网站可访问"
else
    echo "   ❌ 主网站不可访问"
fi
END_TIME=$(date +%s)
RESULTS["main_time"]=$((END_TIME - START_TIME))

echo "2. 检查网站内容..."
# 使用curl获取内容并检查，跟随重定向
CONTENT_FILE="/tmp/website_content_$$.html"
curl -s -L "$MAIN_URL" > "$CONTENT_FILE" 2>/dev/null

if grep -q "ShopEasy" "$CONTENT_FILE"; then
    RESULTS["content_ok"]="true"
    echo "   ✅ 网站包含 'ShopEasy' 文本"
else
    # 也检查其他可能的文本
    if grep -q "shopEasy" "$CONTENT_FILE" || grep -q "Shop Easy" "$CONTENT_FILE" || grep -q "ShopEasy" "$CONTENT_FILE"; then
        RESULTS["content_ok"]="true"
        echo "   ✅ 网站包含相关文本"
    else
        echo "   ❌ 网站缺少关键文本"
        # 调试：查看前100个字符
        echo "   调试: 页面开头: $(head -c 100 "$CONTENT_FILE")"
    fi
fi

echo "3. 检查产品详情页..."
if curl -s --head --fail "$PRODUCT_URL" > /dev/null 2>&1; then
    RESULTS["product_available"]="true"
    RESULTS["product_status"]="200"
    echo "   ✅ 产品详情页可访问"
else
    echo "   ❌ 产品详情页不可访问"
fi

echo "4. 检查JavaScript功能..."
# 使用之前下载的内容文件
if grep -q "shopEasyCart\|cartCount\|cart-system" "$CONTENT_FILE"; then
    RESULTS["js_cart"]="true"
    echo "   ✅ 检测到购物车系统"
else
    echo "   ❌ 未检测到购物车系统"
fi

if grep -q "searchInput\|search-container\|searchBtn" "$CONTENT_FILE"; then
    RESULTS["js_search"]="true"
    echo "   ✅ 检测到搜索功能"
else
    echo "   ❌ 未检测到搜索功能"
fi

if grep -q "returnRequestForm\|returnRequest\|return-form" "$CONTENT_FILE"; then
    RESULTS["js_return"]="true"
    echo "   ✅ 检测到返回表单"
else
    echo "   ❌ 未检测到返回表单"
fi

# 清理临时文件
rm -f "$CONTENT_FILE"

# 生成文本报告
echo "生成监控报告..."
cat > "$REPORT_FILE" << EOF
电商网站监控报告
================
检查时间: $(date '+%Y-%m-%d %H:%M:%S')
网站地址: $MAIN_URL

检查结果:
1. 主网站可用性: ${RESULTS["main_available"]} (状态码: ${RESULTS["main_status"]}, 响应时间: ${RESULTS["main_time"]}秒)
2. 网站内容检查: ${RESULTS["content_ok"]}
3. 产品详情页可用性: ${RESULTS["product_available"]} (状态码: ${RESULTS["product_status"]})
4. JavaScript功能:
   - 购物车系统: ${RESULTS["js_cart"]}
   - 搜索功能: ${RESULTS["js_search"]}
   - 返回表单: ${RESULTS["js_return"]}

总结:
- 网站基本功能: $([ "${RESULTS["main_available"]}" = "true" ] && [ "${RESULTS["content_ok"]}" = "true" ] && [ "${RESULTS["product_available"]}" = "true" ] && echo "✅ 正常" || echo "⚠️ 异常")
- JavaScript功能: $([ "${RESULTS["js_cart"]}" = "true" ] && [ "${RESULTS["js_search"]}" = "true" ] && [ "${RESULTS["js_return"]}" = "true" ] && echo "✅ 完整" || echo "⚠️ 不完整")

建议:
$(if [ "${RESULTS["main_available"]}" = "false" ]; then echo "- 立即检查网站部署状态"; fi)
$(if [ "${RESULTS["content_ok"]}" = "false" ]; then echo "- 检查网站内容完整性"; fi)
$(if [ "${RESULTS["product_available"]}" = "false" ]; then echo "- 修复产品详情页访问问题"; fi)
$(if [ "${RESULTS["js_cart"]}" = "false" ]; then echo "- 检查购物车JavaScript功能"; fi)
$(if [ "${RESULTS["js_search"]}" = "false" ]; then echo "- 检查搜索功能JavaScript"; fi)
$(if [ "${RESULTS["js_return"]}" = "false" ]; then echo "- 检查返回表单JavaScript"; fi)

详细报告:
主网站响应时间: ${RESULTS["main_time"]}秒
检查完成时间: $(date '+%Y-%m-%d %H:%M:%S')
EOF

# 生成JSON报告
cat > "$JSON_FILE" << EOF
{
  "timestamp": "$(date '+%Y-%m-%dT%H:%M:%S')",
  "website_url": "$MAIN_URL",
  "checks": {
    "main_website": {
      "available": ${RESULTS["main_available"]},
      "status_code": "${RESULTS["main_status"]}",
      "response_time_seconds": ${RESULTS["main_time"]}
    },
    "content": {
      "contains_shopeasy": ${RESULTS["content_ok"]}
    },
    "product_detail": {
      "available": ${RESULTS["product_available"]},
      "status_code": "${RESULTS["product_status"]}"
    },
    "javascript": {
      "cart_system": ${RESULTS["js_cart"]},
      "search_function": ${RESULTS["js_search"]},
      "return_form": ${RESULTS["js_return"]}
    }
  },
  "summary": {
    "all_passed": $([ "${RESULTS["main_available"]}" = "true" ] && [ "${RESULTS["content_ok"]}" = "true" ] && [ "${RESULTS["product_available"]}" = "true" ] && echo "true" || echo "false"),
    "passed_checks": $(echo "${RESULTS[@]}" | tr ' ' '\n' | grep -c "true"),
    "total_checks": ${#RESULTS[@]},
    "status": "$([ "${RESULTS["main_available"]}" = "true" ] && echo "operational" || echo "degraded")"
  }
}
EOF

# 保存最后检查状态
{
    echo "timestamp=$(date '+%Y-%m-%d %H:%M:%S')"
    echo "main_available=${RESULTS["main_available"]}"
    echo "content_ok=${RESULTS["content_ok"]}"
    echo "product_available=${RESULTS["product_available"]}"
    echo "js_cart=${RESULTS["js_cart"]}"
    echo "js_search=${RESULTS["js_search"]}"
    echo "js_return=${RESULTS["js_return"]}"
    echo "response_time=${RESULTS["main_time"]}"
} > "$LAST_CHECK"

# 检查是否需要警报
ALERTS=()
if [ "${RESULTS["main_available"]}" = "false" ]; then
    ALERTS+=("🚨 严重: 主网站不可访问 - 需要立即处理")
fi
if [ "${RESULTS["product_available"]}" = "false" ]; then
    ALERTS+=("⚠️  警告: 产品详情页不可访问 - 影响用户体验")
fi
if [ "${RESULTS["js_cart"]}" = "false" ]; then
    ALERTS+=("⚠️  警告: 购物车功能异常 - 影响销售转化")
fi
if [ "${RESULTS["js_search"]}" = "false" ]; then
    ALERTS+=("⚠️  警告: 搜索功能异常 - 影响产品发现")
fi

if [ ${#ALERTS[@]} -gt 0 ]; then
    echo ""
    echo "检测到警报:"
    for alert in "${ALERTS[@]}"; do
        echo "  $alert"
    done
    # 保存警报
    ALERT_FILE="monitoring/alerts/alert_$TIMESTAMP.txt"
    printf "%s\n" "${ALERTS[@]}" > "$ALERT_FILE"
    echo "警报已保存到: $ALERT_FILE"
fi

echo ""
echo "📊 监控完成!"
echo "报告文件: $REPORT_FILE"
echo "JSON报告: $JSON_FILE"
echo "最后检查: $LAST_CHECK"
echo ""
echo "✅ 下次检查建议: 1小时后"
echo "📈 监控统计: $(echo "${RESULTS[@]}" | tr ' ' '\n' | grep -c "true")/${#RESULTS[@]} 项检查通过"