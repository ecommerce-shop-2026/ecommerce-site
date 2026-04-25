import json
import re
import os

# 读取产品数据
with open('products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 读取模板
with open('product-template.html', 'r', encoding='utf-8') as f:
    template = f.read()

print(f"找到 {len(data['products'])} 个产品，生成前5个页面...")

# 生成前5个产品页面
for i, product in enumerate(data['products'][:5]):
    # 准备数据
    product_id = product.get('id', '')
    product_name = product.get('title', '')
    product_price = product.get('price', 0)
    original_price = product.get('original_price', '')
    category = product.get('category', '')
    rating = product.get('rating', 0)
    review_count = product.get('review_count', 0)
    image_url = product.get('image_url', 'https://via.placeholder.com/600x600')
    shipping_info = product.get('shipping_info', '标准配送')
    estimated_delivery = product.get('estimated_delivery', '7-15天')
    sales_volume = product.get('sales_volume', 0)
    tags = product.get('tags', [])
    
    # 生成slug
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', product_name.lower()).strip('-')
    
    # 计算折扣
    discount_percent = ''
    if original_price and float(original_price) > 0:
        discount = (1 - float(product_price) / float(original_price)) * 100
        discount_percent = str(round(discount))
    
    # 生成星级
    full_stars = int(rating)
    half_star = 1 if rating - full_stars >= 0.5 else 0
    empty_stars = 5 - full_stars - half_star
    
    star_rating = '★' * full_stars + '½' * half_star + '☆' * empty_stars
    star_rating_full = '★' * full_stars + '½' * half_star + '☆' * empty_stars
    
    # 生成描述
    description = f"{product_name} 是一款优质的{category}产品。具有出色的性能和可靠性，受到{review_count}位客户的好评。"
    
    # 生成规格
    specifications = [
        {'key': '品牌', 'value': 'ShopEasy优选'},
        {'key': '型号', 'value': product_id},
        {'key': '分类', 'value': category},
        {'key': '评分', 'value': f'{rating}/5.0'},
        {'key': '配送', 'value': shipping_info},
        {'key': '预计送达', 'value': estimated_delivery},
        {'key': '已售数量', 'value': f'{sales_volume}件'}
    ]
    
    # 替换模板变量
    page_content = template
    
    # 基本替换
    replacements = {
        '{{PRODUCT_NAME}}': product_name,
        '{{PRODUCT_DESCRIPTION}}': description,
        '{{PRODUCT_CATEGORY}}': category,
        '{{PRODUCT_TAGS}}': ', '.join(tags),
        '{{PRODUCT_SLUG}}': slug,
        '{{PRODUCT_IMAGE}}': image_url,
        '{{PRODUCT_ID}}': product_id,
        '{{PRODUCT_PRICE}}': str(product_price),
        '{{ORIGINAL_PRICE}}': str(original_price) if original_price else '',
        '{{DISCOUNT_PERCENT}}': discount_percent,
        '{{PRODUCT_RATING}}': str(rating),
        '{{REVIEW_COUNT}}': str(review_count),
        '{{SHIPPING_INFO}}': shipping_info,
        '{{ESTIMATED_DELIVERY}}': estimated_delivery,
        '{{SALES_VOLUME}}': str(sales_volume),
        '{{STAR_RATING}}': star_rating,
        '{{STAR_RATING_FULL}}': star_rating_full
    }
    
    for key, value in replacements.items():
        page_content = page_content.replace(key, value)
    
    # 处理数组数据
    # 规格
    specs_html = ''
    for spec in specifications:
        specs_html += f'<li><strong>{spec["key"]}:</strong> {spec["value"]}</li>\n                            '
    page_content = page_content.replace('{{#each SPECIFICATIONS}}\n                            <li><strong>{{this.key}}:</strong> {{this.value}}</li>\n                            {{/each}}', specs_html)
    
    # 标签
    tags_html = ''
    for tag in tags[:5]:  # 只显示前5个标签
        tags_html += f'<span class="tag">{tag}</span>\n                            '
    page_content = page_content.replace('{{#each PRODUCT_TAGS_ARRAY}}\n                            <span class="tag">{{this}}</span>\n                            {{/each}}', tags_html)
    
    # 条件语句处理
    if original_price:
        page_content = page_content.replace('{{#if ORIGINAL_PRICE}}', '')
        page_content = page_content.replace('{{/if}}', '')
    else:
        # 移除折扣部分
        page_content = re.sub(r'\{\{#if ORIGINAL_PRICE}}.*?\{\{/if}}', '', page_content, flags=re.DOTALL)
    
    # 写入文件
    output_file = f'{slug}.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
    print(f'生成: {output_file}')

print('产品页面生成完成！')