# 电商独立站 - 自动化更新系统

## 🚀 项目简介

这是一个现代化的电商独立站，具备自动更新热卖商品的功能。网站每天自动从多个跨境平台采集热卖商品，智能筛选后更新到网站。

## 🌐 网站功能

### 核心功能：
- ✅ 响应式电商网站设计
- ✅ 商品展示和购物车系统
- ✅ 支付和退货信息页面
- ✅ 自动商品更新系统
- ✅ 智能商品筛选和评分

### 自动化特性：
- **数据采集**：从速卖通、亚马逊、eBay、Temu采集商品
- **智能处理**：7个维度的商品评分系统
- **自动更新**：每天自动更新网站商品
- **监控系统**：健康检查和错误预警

## 📁 文件结构

```
ecommerce-site/
├── index.html                    # 主网站页面
├── auto_products_preview.html    # 自动生成的商品预览
├── css/style.css                 # 网站样式
├── js/main.js                    # 主JavaScript功能
├── js/products_data.js           # 商品数据（JavaScript格式）
├── products/products.json        # 商品数据（JSON格式）
├── vercel.json                   # Vercel部署配置
└── README.md                     # 项目说明
```

## 🚀 部署到Vercel

这个网站已经配置好Vercel部署。只需：

1. 推送到GitHub仓库
2. 在Vercel导入GitHub仓库
3. 自动部署完成

## 🔧 本地开发

```bash
# 启动本地服务器
python -m http.server 8080

# 访问网站
http://localhost:8080
```

## 📊 自动化系统

配套的自动化系统位于 `ecommerce-automation/` 目录，包含：
- 数据采集模块
- 数据处理模块  
- 网站更新模块
- 定时任务配置

## 📞 联系

如有问题或建议，请通过项目Issues反馈。

---
*自动生成于 2026-04-18*