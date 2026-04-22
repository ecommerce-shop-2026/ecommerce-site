#!/usr/bin/env python3
"""
电商网站监控脚本
定期检查网站可用性、性能和功能
"""

import requests
import time
import json
import os
from datetime import datetime
from pathlib import Path

# 配置
CONFIG = {
    "website_url": "https://ecommerce-shop-2026.github.io/ecommerce-site",
    "product_detail_url": "https://ecommerce-shop-2026.github.io/ecommerce-site/product-detail.html",
    "timeout": 10,
    "reports_dir": "monitoring/reports",
    "logs_dir": "monitoring/logs",
    "alerts_dir": "monitoring/alerts"
}

def ensure_directories():
    """确保监控目录存在"""
    for dir_path in [CONFIG["reports_dir"], CONFIG["logs_dir"], CONFIG["alerts_dir"]]:
        Path(dir_path).mkdir(parents=True, exist_ok=True)

def check_website_availability(url):
    """检查网站可用性"""
    try:
        start_time = time.time()
        response = requests.get(url, timeout=CONFIG["timeout"])
        response_time = time.time() - start_time
        
        return {
            "available": response.status_code == 200,
            "status_code": response.status_code,
            "response_time": round(response_time, 2),
            "content_length": len(response.content)
        }
    except requests.exceptions.RequestException as e:
        return {
            "available": False,
            "error": str(e),
            "response_time": None
        }

def check_content(url, expected_text):
    """检查页面内容"""
    try:
        response = requests.get(url, timeout=CONFIG["timeout"])
        content = response.text
        
        return {
            "contains_text": expected_text in content,
            "text_found": expected_text if expected_text in content else None
        }
    except Exception as e:
        return {
            "contains_text": False,
            "error": str(e)
        }

def check_javascript_functionality():
    """检查JavaScript功能（通过检查页面是否包含关键JS元素）"""
    try:
        response = requests.get(CONFIG["website_url"], timeout=CONFIG["timeout"])
        content = response.text
        
        checks = {
            "has_cart_system": "shopEasyCart" in content or "cart-system" in content,
            "has_search_function": "searchInput" in content or "search-container" in content,
            "has_return_form": "returnRequestForm" in content,
            "has_product_data": "products = [" in content or "const products" in content
        }
        
        return checks
    except Exception as e:
        return {"error": str(e)}

def generate_report(check_results):
    """生成监控报告"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"{CONFIG['reports_dir']}/monitor_report_{timestamp}.json"
    
    report_data = {
        "timestamp": datetime.now().isoformat(),
        "checks": check_results,
        "summary": {
            "all_passed": all([
                check_results["availability"]["available"],
                check_results["content"]["contains_text"],
                check_results["product_detail"]["available"]
            ]),
            "total_checks": 3,
            "passed_checks": sum([
                1 if check_results["availability"]["available"] else 0,
                1 if check_results["content"]["contains_text"] else 0,
                1 if check_results["product_detail"]["available"] else 0
            ])
        }
    }
    
    # 保存JSON报告
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    
    # 保存简文本报告
    text_report_file = f"{CONFIG['reports_dir']}/monitor_summary_{timestamp}.txt"
    with open(text_report_file, 'w', encoding='utf-8') as f:
        f.write(f"网站监控报告 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 50 + "\n\n")
        
        # 可用性检查
        avail = check_results["availability"]
        f.write("1. 网站可用性:\n")
        if avail["available"]:
            f.write(f"   ✅ 正常 (状态码: {avail['status_code']}, 响应时间: {avail['response_time']}秒)\n")
        else:
            f.write(f"   ❌ 不可用: {avail.get('error', 'Unknown error')}\n")
        
        # 内容检查
        content = check_results["content"]
        f.write("\n2. 内容检查:\n")
        if content["contains_text"]:
            f.write(f"   ✅ 包含 '{content['text_found']}'\n")
        else:
            f.write(f"   ❌ 缺少 'ShopEasy' 文本\n")
        
        # 产品详情页检查
        product = check_results["product_detail"]
        f.write("\n3. 产品详情页:\n")
        if product["available"]:
            f.write(f"   ✅ 正常 (状态码: {product['status_code']})\n")
        else:
            f.write(f"   ❌ 不可用: {product.get('error', 'Unknown error')}\n")
        
        # JavaScript功能检查
        js = check_results["javascript"]
        f.write("\n4. JavaScript功能:\n")
        for func, status in js.items():
            if func != "error":
                f.write(f"   {'✅' if status else '❌'} {func.replace('_', ' ').title()}\n")
        
        # 总结
        f.write("\n" + "=" * 50 + "\n")
        f.write(f"总结: {report_data['summary']['passed_checks']}/{report_data['summary']['total_checks']} 项检查通过\n")
        if report_data['summary']['all_passed']:
            f.write("✅ 所有检查通过 - 网站运行正常\n")
        else:
            f.write("⚠️  部分检查失败 - 需要关注\n")
    
    return report_file, text_report_file

def check_for_alerts(check_results):
    """检查是否需要发送警报"""
    alerts = []
    
    # 网站不可用警报
    if not check_results["availability"]["available"]:
        alerts.append({
            "type": "critical",
            "message": "网站不可访问",
            "details": check_results["availability"]
        })
    
    # 响应时间过长警报
    if check_results["availability"].get("response_time", 0) > 5:
        alerts.append({
            "type": "warning",
            "message": f"网站响应时间过长: {check_results['availability']['response_time']}秒",
            "details": check_results["availability"]
        })
    
    # 内容缺失警报
    if not check_results["content"]["contains_text"]:
        alerts.append({
            "type": "warning",
            "message": "网站内容异常 - 缺少关键文本",
            "details": check_results["content"]
        })
    
    # 保存警报
    if alerts:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        alert_file = f"{CONFIG['alerts_dir']}/alert_{timestamp}.json"
        with open(alert_file, 'w', encoding='utf-8') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "alerts": alerts
            }, f, indent=2, ensure_ascii=False)
        
        # 打印警报
        print("\n🚨 检测到警报:")
        for alert in alerts:
            print(f"  [{alert['type'].upper()}] {alert['message']}")
    
    return alerts

def main():
    """主监控函数"""
    print("🔄 开始网站监控检查...")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    # 确保目录存在
    ensure_directories()
    
    # 执行检查
    check_results = {
        "availability": check_website_availability(CONFIG["website_url"]),
        "content": check_content(CONFIG["website_url"], "ShopEasy"),
        "product_detail": check_website_availability(CONFIG["product_detail_url"]),
        "javascript": check_javascript_functionality()
    }
    
    # 生成报告
    json_report, text_report = generate_report(check_results)
    
    # 检查警报
    alerts = check_for_alerts(check_results)
    
    # 输出结果
    print(f"\n📊 检查完成:")
    print(f"  • 网站可用性: {'✅' if check_results['availability']['available'] else '❌'}")
    print(f"  • 内容检查: {'✅' if check_results['content']['contains_text'] else '❌'}")
    print(f"  • 产品详情页: {'✅' if check_results['product_detail']['available'] else '❌'}")
    
    print(f"\n📁 报告已生成:")
    print(f"  • JSON报告: {json_report}")
    print(f"  • 文本报告: {text_report}")
    
    if alerts:
        print(f"\n🚨 生成 {len(alerts)} 个警报")
    else:
        print(f"\n✅ 无警报 - 一切正常")
    
    # 保存最后检查状态
    last_check_file = f"{CONFIG['logs_dir']}/last_check.json"
    with open(last_check_file, 'w', encoding='utf-8') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "status": "all_passed" if not alerts else "has_alerts",
            "alerts_count": len(alerts)
        }, f, indent=2)
    
    print(f"\n💾 最后检查状态已保存到: {last_check_file}")
    print(f"\n⏰ 下次检查建议: 1小时后")

if __name__ == "__main__":
    main()