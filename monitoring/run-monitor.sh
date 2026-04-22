#!/bin/bash
# 网站监控启动脚本

echo "🚀 启动电商网站监控系统"
echo "========================"
echo "时间: $(date)"
echo ""

# 检查Python3是否可用
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: Python3 未安装"
    echo "请安装 Python3: sudo apt-get install python3"
    exit 1
fi

# 检查requests库
echo "检查Python依赖..."
if python3 -c "import requests" 2>/dev/null; then
    echo "✅ requests 库已安装"
else
    echo "⚠️  requests 库未安装，正在安装..."
    pip3 install requests --quiet
    if [ $? -eq 0 ]; then
        echo "✅ requests 库安装成功"
    else
        echo "❌ requests 库安装失败"
        echo "请手动安装: pip3 install requests"
        exit 1
    fi
fi

# 运行监控脚本
echo ""
echo "运行网站监控..."
cd "$(dirname "$0")/.."
python3 monitoring/website-monitor.py

# 检查执行结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 监控执行完成"
    echo "报告保存在: monitoring/reports/"
else
    echo ""
    echo "❌ 监控执行失败"
    exit 1
fi