# Google Search Console 提交指南

## 验证域名所有权
1. 打开 https://search.google.com/search-console
2. 用 Google 账号登录
3. 选择 "URL prefix" → 输入 `https://shop2026easy.com`
4. 验证方式选 **HTML tag**
5. 复制那串 meta tag，例如：
   `<meta name="google-site-verification" content="xxxxxxxxxxx">`
6. 保存到一个文本文件，我帮你加到所有页面的 <head> 中

## 提交 Sitemap
1. 验证通过后，在 Search Console 左侧点 **Sitemaps**
2. 输入 `sitemap.xml`
3. 点 Submit

## 检查收录
1. 左侧点 **URL Inspection**
2. 输入 https://shop2026easy.com/
3. 点 "Request Indexing"
