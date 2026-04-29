#!/bin/bash
# 监控配置脚本
# 创建监控系统和定时任务配置

echo "📊 配置网站监控系统"
echo "=================="

# 创建监控目录结构
echo "1. 创建监控目录结构..."
mkdir -p monitoring/reports
mkdir -p monitoring/logs
mkdir -p monitoring/alerts

echo "   ✓ monitoring/ 目录结构已创建"

# 创建监控配置文件
echo "2. 创建监控配置文件..."
cat > monitoring/monitor-config.json << 'EOF'
{
  "website_url": "https://shop2026easy.com",
  "check_interval_minutes": 30,
  "alerts": {
    "enabled": true,
    "email": "admin@shopeasy.com",
    "webhook": ""
  },
  "checks": {
    "availability": true,
    "response_time": true,
    "javascript_errors": true,
    "broken_links": true,
    "ssl_certificate": true
  },
  "thresholds": {
    "max_response_time_ms": 2000,
    "max_js_errors": 0,
    "max_broken_links": 5
  }
}
EOF

echo "   ✓ 监控配置文件已创建"

# 创建简单的监控脚本
echo "3. 创建监控脚本..."
cat > monitoring/simple-monitor.sh << 'EOF'
#!/bin/bash
# 简单网站监控脚本

CONFIG_FILE="monitoring/monitor-config.json"
LOG_FILE="monitoring/logs/monitor-$(date '+%Y%m%d').log"
REPORT_DIR="monitoring/reports/$(date '+%Y%m%d_%H%M%S')"
mkdir -p "$REPORT_DIR"

# 读取配置
URL=$(grep -o '"website_url": "[^"]*' "$CONFIG_FILE" | cut -d'"' -f4)

echo "=== 网站监控报告 $(date) ===" | tee -a "$LOG_FILE"
echo "监控网址: $URL" | tee -a "$LOG_FILE"

# 检查1: 网站可用性
echo "1. 检查网站可用性..." | tee -a "$LOG_FILE"
if curl -s --head --fail "$URL" > /dev/null 2>&1; then
    echo "   ✓ 网站可访问" | tee -a "$LOG_FILE"
    echo "available: true" > "$REPORT_DIR/availability.txt"
else
    echo "   ✗ 网站不可访问" | tee -a "$LOG_FILE"
    echo "available: false" > "$REPORT_DIR/availability.txt"
fi

# 检查2: 响应时间
echo "2. 测量响应时间..." | tee -a "$LOG_FILE"
START_TIME=$(date +%s%3N)
curl -s -o /dev/null "$URL"
END_TIME=$(date +%s%3N)
RESPONSE_TIME=$((END_TIME - START_TIME))
echo "   响应时间: ${RESPONSE_TIME}ms" | tee -a "$LOG_FILE"
echo "response_time_ms: $RESPONSE_TIME" > "$REPORT_DIR/response_time.txt"

# 检查3: 主页内容
echo "3. 检查主页内容..." | tee -a "$LOG_FILE"
if curl -s "$URL" | grep -q "ShopEasy"; then
    echo "   ✓ 主页包含 'ShopEasy'" | tee -a "$LOG_FILE"
    echo "content_check: passed" > "$REPORT_DIR/content_check.txt"
else
    echo "   ✗ 主页缺少 'ShopEasy'" | tee -a "$LOG_FILE"
    echo "content_check: failed" > "$REPORT_DIR/content_check.txt"
fi

# 生成摘要报告
echo "4. 生成监控报告..." | tee -a "$LOG_FILE"
cat > "$REPORT_DIR/summary.md" << SUMMARY
# 网站监控报告
## $(date)

### 检查结果
1. **网站可用性**: $(if [ -f "$REPORT_DIR/availability.txt" ] && grep -q "true" "$REPORT_DIR/availability.txt"; then echo "✅ 正常"; else echo "❌ 异常"; fi)
2. **响应时间**: ${RESPONSE_TIME}ms
3. **内容检查**: $(if [ -f "$REPORT_DIR/content_check.txt" ] && grep -q "passed" "$REPORT_DIR/content_check.txt"; then echo "✅ 通过"; else echo "❌ 失败"; fi)

### 详细信息
- 监控时间: $(date)
- 目标网址: $URL
- 报告目录: $REPORT_DIR

### 建议
$(if [ $RESPONSE_TIME -gt 2000 ]; then echo "- ⚠️ 响应时间较慢，建议优化"; else echo "- ✅ 响应时间正常"; fi)
$(if [ -f "$REPORT_DIR/availability.txt" ] && grep -q "false" "$REPORT_DIR/availability.txt"; then echo "- ❌ 网站不可访问，请立即检查"; else echo "- ✅ 网站可正常访问"; fi)
SUMMARY

echo "监控完成！报告保存在: $REPORT_DIR/summary.md" | tee -a "$LOG_FILE"
echo "查看报告: cat $REPORT_DIR/summary.md"
EOF

chmod +x monitoring/simple-monitor.sh
echo "   ✓ 监控脚本已创建"

# 创建定时任务配置说明
echo "4. 创建定时任务配置..." | tee -a "$LOG_FILE"
cat > monitoring/cron-setup.md << 'EOF'
# 定时任务配置指南

## Linux/Unix (cron)
```bash
# 编辑crontab
crontab -e

# 添加以下行（每30分钟运行一次监控）
*/30 * * * * cd /path/to/ecommerce-site && ./monitoring/simple-monitor.sh

# 添加每日报告（每天凌晨2点）
0 2 * * * cd /path/to/ecommerce-site && ./monitoring/simple-monitor.sh --daily-report
```

## Windows (任务计划程序)
1. 打开"任务计划程序"
2. 创建基本任务
3. 名称: "网站监控"
4. 触发器: 每天，每30分钟
5. 操作: 启动程序
   - 程序/脚本: `bash`
   - 参数: `-c "cd /path/to/ecommerce-site && ./monitoring/simple-monitor.sh"`

## 手动运行
```bash
cd /path/to/ecommerce-site
./monitoring/simple-monitor.sh
```

## 查看日志
```bash
# 查看今日日志
tail -f monitoring/logs/monitor-$(date '+%Y%m%d').log

# 查看所有报告
ls -la monitoring/reports/
```
EOF

echo "   ✓ 定时任务配置指南已创建"

# 创建运行脚本
echo "5. 创建运行脚本..."
cat > run-monitoring.sh << 'EOF'
#!/bin/bash
# 运行监控系统

echo "启动网站监控..."
echo "================"

# 检查监控目录
if [ ! -d "monitoring" ]; then
    echo "错误: monitoring 目录不存在"
    echo "请先运行: ./setup-monitoring.sh"
    exit 1
fi

# 运行监控
./monitoring/simple-monitor.sh

echo ""
echo "监控系统已运行"
echo "下次运行: ./run-monitoring.sh"
echo "配置定时任务: 查看 monitoring/cron-setup.md"
EOF

chmod +x run-monitoring.sh
echo "   ✓ 运行脚本已创建"

echo ""
echo "✅ 监控系统配置完成"
echo ""
echo "下一步操作:"
echo "1. 运行监控: ./run-monitoring.sh"
echo "2. 配置定时任务: 查看 monitoring/cron-setup.md"
echo "3. 查看监控报告: ls -la monitoring/reports/"
echo ""
echo "监控目录结构:"
find monitoring -type f | sort