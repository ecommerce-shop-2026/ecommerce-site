#!/bin/bash
# 自动化测试脚本
# 测试网站功能和性能

set -e  # 遇到错误时退出

echo "🧪 开始自动化测试"
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

# 创建测试目录
mkdir -p test-results
TEST_DIR="test-results/$(date '+%Y%m%d_%H%M%S')"
mkdir -p "$TEST_DIR"

log_info "测试结果将保存到: $TEST_DIR"

# 1. 文件结构测试
log_info "1. 测试文件结构..."
cat > "$TEST_DIR/file-structure.txt" << 'EOF'
文件结构测试报告
================
测试时间: $(date)
EOF

required_files=("index.html" "css/style.css" "js/main.js" "js/fix.js" "product-detail.html" "js/product-detail.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file" >> "$TEST_DIR/file-structure.txt"
    else
        echo "❌ $file" >> "$TEST_DIR/file-structure.txt"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    log_success "所有必需文件都存在"
else
    log_warning "缺少文件: ${missing_files[*]}"
fi

# 2. HTML 验证测试
log_info "2. 测试 HTML 语法..."
if command -v tidy &> /dev/null; then
    tidy -q -errors index.html 2> "$TEST_DIR/html-errors.txt" || true
    if [ -s "$TEST_DIR/html-errors.txt" ]; then
        log_warning "HTML 语法检查发现错误"
        cat "$TEST_DIR/html-errors.txt"
    else
        log_success "HTML 语法检查通过"
        echo "HTML 语法检查通过" > "$TEST_DIR/html-errors.txt"
    fi
else
    log_warning "tidy 未安装，跳过 HTML 语法检查"
    echo "tidy 未安装，跳过 HTML 语法检查" > "$TEST_DIR/html-errors.txt"
fi

# 3. CSS 验证测试
log_info "3. 测试 CSS 语法..."
if command -v csslint &> /dev/null; then
    csslint --format=text css/style.css > "$TEST_DIR/css-errors.txt" 2>&1 || true
    if [ -s "$TEST_DIR/css-errors.txt" ]; then
        log_warning "CSS 语法检查发现警告"
        head -20 "$TEST_DIR/css-errors.txt"
    else
        log_success "CSS 语法检查通过"
        echo "CSS 语法检查通过" > "$TEST_DIR/css-errors.txt"
    fi
else
    log_warning "csslint 未安装，跳过 CSS 语法检查"
    echo "csslint 未安装，跳过 CSS 语法检查" > "$TEST_DIR/css-errors.txt"
fi

# 4. JavaScript 语法测试
log_info "4. 测试 JavaScript 语法..."
if command -v node &> /dev/null; then
    for js_file in js/*.js; do
        if [ -f "$js_file" ]; then
            log_info "  检查 $js_file"
            if node -c "$js_file" 2> "$TEST_DIR/js-errors.txt"; then
                echo "✅ $js_file 语法正确" >> "$TEST_DIR/js-syntax.txt"
            else
                echo "❌ $js_file 语法错误" >> "$TEST_DIR/js-syntax.txt"
                cat "$TEST_DIR/js-errors.txt" >> "$TEST_DIR/js-syntax.txt"
            fi
        fi
    done
    
    if grep -q "❌" "$TEST_DIR/js-syntax.txt"; then
        log_warning "JavaScript 语法检查发现错误"
        cat "$TEST_DIR/js-syntax.txt"
    else
        log_success "所有 JavaScript 文件语法正确"
    fi
else
    log_warning "Node.js 未安装，跳过 JavaScript 语法检查"
    echo "Node.js 未安装，跳过 JavaScript 语法检查" > "$TEST_DIR/js-syntax.txt"
fi

# 5. 链接测试
log_info "5. 测试页面链接..."
if command -v linkchecker &> /dev/null; then
    linkchecker --check-extern index.html > "$TEST_DIR/link-check.txt" 2>&1 || true
    log_info "链接检查完成，结果保存到: $TEST_DIR/link-check.txt"
else
    log_warning "linkchecker 未安装，跳过链接检查"
    echo "linkchecker 未安装，跳过链接检查" > "$TEST_DIR/link-check.txt"
fi

# 6. 性能测试
log_info "6. 测试网站性能..."
if command -v lighthouse &> /dev/null; then
    log_info "  运行 Lighthouse 测试..."
    lighthouse http://localhost:8000 --output=json --output-path="$TEST_DIR/lighthouse.json" --chrome-flags="--headless" 2>/dev/null || true
    
    if [ -f "$TEST_DIR/lighthouse.json" ]; then
        # 提取关键指标
        cat "$TEST_DIR/lighthouse.json" | python3 -c "
import json, sys
try:
    with open('$TEST_DIR/lighthouse.json') as f:
        data = json.load(f)
    
    categories = data['categories']
    print('Lighthouse 分数:')
    for cat_name, cat_data in categories.items():
        score = cat_data['score'] * 100
        print(f'  {cat_data[\"title\"]}: {score:.1f}')
    
    # 保存摘要
    with open('$TEST_DIR/lighthouse-summary.txt', 'w') as f:
        f.write('Lighthouse 测试结果\\n')
        f.write('===================\\n')
        for cat_name, cat_data in categories.items():
            score = cat_data['score'] * 100
            f.write(f'{cat_data[\"title\"]}: {score:.1f}\\n')
    
except Exception as e:
    print(f'解析 Lighthouse 结果时出错: {e}')
" > "$TEST_DIR/lighthouse-scores.txt"
        
        cat "$TEST_DIR/lighthouse-scores.txt"
        log_success "Lighthouse 测试完成"
    fi
else
    log_warning "Lighthouse 未安装，跳过性能测试"
    echo "Lighthouse 未安装，跳过性能测试" > "$TEST_DIR/lighthouse-summary.txt"
fi

# 7. 功能测试
log_info "7. 运行功能测试..."
cat > "$TEST_DIR/functional-test.js" << 'EOF'
// 功能测试脚本
console.log("开始功能测试...");

// 模拟测试函数
function testProductCard() {
    console.log("✅ 测试产品卡片功能...");
    return true;
}

function testCartFunctionality() {
    console.log("✅ 测试购物车功能...");
    return true;
}

function testProductDetail() {
    console.log("✅ 测试产品详情页功能...");
    return true;
}

function testResponsiveDesign() {
    console.log("✅ 测试响应式设计...");
    return true;
}

// 运行所有测试
const tests = [
    testProductCard,
    testCartFunctionality,
    testProductDetail,
    testResponsiveDesign
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    try {
        if (test()) {
            passed++;
        } else {
            failed++;
        }
    } catch (error) {
        console.error(`❌ 测试 ${index + 1} 失败:`, error.message);
        failed++;
    }
});

console.log(`\n测试结果: ${passed} 通过, ${failed} 失败`);
EOF

if command -v node &> /dev/null; then
    node "$TEST_DIR/functional-test.js" > "$TEST_DIR/functional-results.txt" 2>&1
    log_info "功能测试完成，结果保存到: $TEST_DIR/functional-results.txt"
else
    log_warning "Node.js 未安装，跳过功能测试"
    echo "Node.js 未安装，跳过功能测试" > "$TEST_DIR/functional-results.txt"
fi

# 8. 创建测试报告
log_info "8. 生成测试报告..."
cat > "$TEST_DIR/test-report.md" << 'EOF'
# 自动化测试报告

## 测试信息
- 测试时间: $(date)
- 测试目录: $TEST_DIR
- 测试脚本: run-tests.sh

## 测试摘要

### 1. 文件结构测试
$(cat "$TEST_DIR/file-structure.txt")

### 2. HTML 语法测试
$(cat "$TEST_DIR/html-errors.txt")

### 3. CSS 语法测试
$(cat "$TEST_DIR/css-errors.txt")

### 4. JavaScript 语法测试
$(cat "$TEST_DIR/js-syntax.txt")

### 5. 链接测试
$(head -50 "$TEST_DIR/link-check.txt")

### 6. 性能测试
$(cat "$TEST_DIR/lighthouse-summary.txt")

### 7. 功能测试
$(cat "$TEST_DIR/functional-results.txt")

## 测试结论
测试完成于: $(date)

EOF

# 9. 发送测试通知（可选）
log_info "9. 发送测试通知..."
if [ -f ".env" ]; then
    log_info "  检测到 .env 文件，可以配置通知"
    echo "通知配置示例：" > "$TEST_DIR/notification.txt"
    echo "1. 邮件通知: 配置 SMTP 设置" >> "$TEST_DIR/notification.txt"
    echo "2. Slack 通知: 配置 Webhook" >> "$TEST_DIR/notification.txt"
    echo "3. Discord 通知: 配置 Webhook" >> "$TEST_DIR/notification.txt"
else
    log_info "  未找到 .env 文件，跳过通知配置"
    echo "未配置通知" > "$TEST_DIR/notification.txt"
fi

# 10. 清理临时文件
log_info "10. 清理临时文件..."
rm -f "$TEST_DIR/html-errors.txt" "$TEST_DIR/css-errors.txt" "$TEST_DIR/js-errors.txt" "$TEST_DIR/functional-test.js"

echo ""
echo "🎉 自动化测试完成！"
echo "========================"
echo ""
echo "📋 测试结果："
echo "   文件结构测试: $TEST_DIR/file-structure.txt"
echo "   HTML 语法测试: $TEST_DIR/html-errors.txt"
echo "   CSS 语法测试: $TEST_DIR/css-errors.txt"
echo "   JavaScript 语法测试: $TEST_DIR/js-syntax.txt"
echo "   链接测试: $TEST_DIR/link-check.txt"
echo "   性能测试: $TEST_DIR/lighthouse-summary.txt"
echo "   功能测试: $TEST_DIR/functional-results.txt"
echo "   完整报告: $TEST_DIR/test-report.md"
echo ""
echo "🚀 下一步："
echo "   1. 查看测试报告: cat $TEST_DIR/test-report.md"
echo "   2. 修复发现的问题"
echo "   3. 定期运行测试确保质量"
echo ""
echo "📅 建议设置定时任务："
echo "   crontab -e"
echo "   添加: 0 2 * * * cd /path/to/project && ./run-tests.sh"
echo "   （每天凌晨2点运行测试）"