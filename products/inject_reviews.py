import re, os, sys

target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
os.chdir(target_dir)

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ('index.html', 'product-template.html')]
print(f'Found {len(files)} product pages')

for fname in files:
    if fname == '4k-ultra-hd-drone-with-camera.html':
        print(f'  SKIP {fname} (already done)')
        continue
    
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    ids_found = re.findall(r'data-product-id="(\d+)"', content)
    pid = ids_found[0] if ids_found else 'UNKNOWN'
    print(f'  {fname} -> product ID: {pid}')
    
    changes = 0
    
    # Replace static reviews section
    pattern = r'<!-- Product Reviews Section -->.*?<div class="product-reviews">.*?</div>\s*\n\s*(?=<!-- Related Products -->)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        span = match.span()
        new_html = f'            <!-- Product Reviews Section -->\n            <div class="product-reviews" data-product-id="{pid}">\n                <div class="reviews-container" id="reviewsContainer"></div>\n            </div>\n\n'
        content = content[:span[0]] + new_html + content[span[1]:]
        changes += 1
        print(f'    -> Replaced reviews section')
    
    # Add reviews.js script after <!-- JavaScript -->
    if '<script src="../js/reviews.js"></script>' not in content:
        content = content.replace('<!-- JavaScript -->', '<!-- JavaScript -->\n    <script src="../js/reviews.js"></script>')
        changes += 1
        print(f'    -> Added reviews.js script')
    
    # Add init code before existing DOMContentLoaded
    old_init = "document.addEventListener('DOMContentLoaded', function() {"
    new_init = f"""document.addEventListener('DOMContentLoaded', function() {{
            var container = document.getElementById('reviewsContainer');
            if (container && window.reviews) {{
                window.reviews.renderReviews({pid}, container);
                window.reviews.renderForm({pid}, container);
            }}"""
    
    if f'renderReviews({pid}' not in content:
        content = content.replace(old_init, new_init, 1)
        changes += 1
        print(f'    -> Added init code')
    
    if changes > 0:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'    -> Saved')
    else:
        print(f'    -> No changes')
