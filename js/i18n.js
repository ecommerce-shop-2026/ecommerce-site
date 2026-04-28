/**
 * ShopEasy i18n Multi-Language System
 * Supports EN (English) and CN (Chinese) with easy extensibility
 */

var i18n = (function() {
    'use strict';

    var STORAGE_KEY = 'shopeasy_lang';
    var DEFAULT_LANG = 'en';

    var translations = {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.products': 'Products',
            'nav.categories': 'Categories',
            'nav.payment': 'Payment',
            'nav.blog': 'Blog',
            'nav.myorders': 'My Orders',
            'nav.wishlist': 'Wishlist',
            'nav.returns': 'Returns',
            'nav.support': 'Support',
            'nav.viewall': 'View All Products',
            'nav.signin': 'Sign In',
            'nav.register': 'Register',
            'nav.signout': 'Sign Out',
            'nav.search': 'Search products...',

            // Homepage: Hero
            'hero.title': 'Discover Amazing Products',
            'hero.subtitle': 'Shop the latest trends with unbeatable prices and fast delivery worldwide.',
            'hero.shopnow': 'Shop Now',
            'hero.learnmore': 'Learn More',

            // Homepage: Hot Deals
            'deals.title': 'Hot Deals & New Arrivals',
            'deals.viewall': 'View All Products',

            // Homepage: Categories
            'cat.title': 'Shop by Category',
            'cat.electronics': 'Electronics',
            'cat.home': 'Home & Living',
            'cat.sports': 'Sports & Outdoors',
            'cat.beauty': 'Beauty & Health',
            'cat.fashion': 'Fashion',

            // Homepage: Featured Products
            'featured.title': 'Featured Products',
            'featured.viewall': 'View All',
            'featured.addtocart': 'Add to Cart',

            // Products page
            'products.title': 'All Products',
            'products.filter': 'Filter by Category',
            'products.sort': 'Sort by',
            'products.sort.default': 'Default',
            'products.sort.price-low': 'Price: Low to High',
            'products.sort.price-high': 'Price: High to Low',
            'products.sort.rating': 'Rating',
            'products.viewdetails': 'View Details',
            'products.outofstock': 'Out of Stock',

            // Product Detail
            'pd.price': 'Price',
            'pd.rating': 'Rating',
            'pd.reviews': 'reviews',
            'pd.features': 'Features',
            'pd.description': 'Description',
            'pd.addtocart': 'Add to Cart',
            'pd.buynow': 'Buy Now',
            'pd.quantity': 'Qty',
            'pd.instock': 'In Stock',
            'pd.brand': 'Brand',
            'pd.category': 'Category',
            'pd.share': 'Share',

            // Cart
            'cart.title': 'Shopping Cart',
            'cart.empty': 'Your cart is empty',
            'cart.total': 'Total',
            'cart.checkout': 'Proceed to Checkout',
            'cart.continue': 'Continue Shopping',
            'cart.remove': 'Remove',

            // Checkout
            'checkout.title': 'Checkout',
            'checkout.contact': 'Contact Information',
            'checkout.email': 'Email Address',
            'checkout.shipping': 'Shipping Address',
            'checkout.firstname': 'First Name',
            'checkout.lastname': 'Last Name',
            'checkout.address': 'Address',
            'checkout.city': 'City',
            'checkout.zip': 'ZIP Code',
            'checkout.country': 'Country',
            'checkout.payment': 'Payment Method',
            'checkout.card': 'Credit Card',
            'checkout.cardnum': 'Card Number',
            'checkout.expiry': 'Expiry Date',
            'checkout.cvc': 'CVC',
            'checkout.cardname': 'Name on Card',
            'checkout.shipmethod': 'Shipping Method',
            'checkout.standard': 'Standard Shipping',
            'checkout.express': 'Express Shipping',
            'checkout.overnight': 'Overnight Shipping',
            'checkout.free': 'Free',
            'checkout.back': 'Back to Cart',
            'checkout.pay': 'Pay Now',
            'checkout.summary': 'Order Summary',
            'checkout.subtotal': 'Subtotal',
            'checkout.shipping': 'Shipping',
            'checkout.tax': 'Tax',

            // Order Confirmed
            'oc.title': 'Order Confirmed!',
            'oc.subtitle': 'Thank you for your purchase. Your order has been placed successfully.',
            'oc.summary': 'Order Summary',
            'oc.shippingto': 'Shipping To',
            'oc.vieworders': 'View My Orders',
            'oc.continueshop': 'Continue Shopping',
            'oc.emailnotice': 'A confirmation email has been sent to your email address.',

            // Order History
            'oh.title': 'My Orders',
            'oh.all': 'All Orders',
            'oh.search': 'Search by order ID or product name...',
            'oh.empty': "You haven't placed any orders yet.",
            'oh.details': 'Details',
            'oh.reorder': 'Reorder',
            'oh.total': 'Total',
            'oh.continue': 'Continue Shopping',

            // Auth
            'auth.signin': 'Sign In',
            'auth.register': 'Create Account',
            'auth.email': 'Email Address',
            'auth.password': 'Password',
            'auth.name': 'Full Name',
            'auth.confirm': 'Confirm Password',
            'auth.remember': 'Remember me',
            'auth.terms': 'I agree to the Terms of Service',
            'auth.forgot': 'Forgot Password?',
            'auth.or': 'Or continue with',
            'auth.noaccount': "Don't have an account?",
            'auth.hasaccount': 'Already have an account?',

            // Blog
            'blog.title': 'Our Blog',
            'blog.search': 'Search articles...',
            'blog.all': 'All',
            'blog.readmore': 'Read More',
            'blog.related': 'Related Articles',
            'blog.share': 'Share this article',

            // Footer
            'footer.desc': 'Your trusted online shopping destination for quality products at great prices.',
            'footer.quicklinks': 'Quick Links',
            'footer.customerservice': 'Customer Service',
            'footer.contactinfo': 'Contact Info',
            'footer.returns': 'Returns & Refunds',
            'footer.shipping': 'Shipping Policy',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service',
            'footer.faq': 'FAQ',
            'footer.rights': 'All rights reserved.',

            // Common
            'common.loading': 'Loading...',
            'common.error': 'Something went wrong',
            'common.success': 'Success',
            'common.close': 'Close',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.submit': 'Submit',
            'common.search': 'Search',
            'common.back': 'Back',
            'common.next': 'Next',

            // Product Reviews
            'review.title': 'Customer Reviews',
            'review.write': 'Write a Review',
            'review.rating': 'Rating',
            'review.name': 'Your Name',
            'review.email': 'Your Email',
            'review.content': 'Your Review',
            'review.submit': 'Submit Review',
            'review.thanks': 'Thank you for your review!',
            'review.empty': 'No reviews yet. Be the first to review!',
            'review.avg': 'Average Rating',
            'review.total': 'total reviews',
        },

        zh: {
            // Navigation
            'nav.home': '首页',
            'nav.products': '产品',
            'nav.categories': '分类',
            'nav.payment': '支付',
            'nav.blog': '博客',
            'nav.myorders': '我的订单',
            'nav.wishlist': '收藏夹',
            'nav.returns': '退换货',
            'nav.support': '客服',
            'nav.viewall': '查看全部产品',
            'nav.signin': '登录',
            'nav.register': '注册',
            'nav.signout': '退出登录',
            'nav.search': '搜索商品...',

            // Homepage: Hero
            'hero.title': '发现优质好物',
            'hero.subtitle': '超值价格，全球速递，尽享最新潮流。',
            'hero.shopnow': '立即抢购',
            'hero.learnmore': '了解更多',

            // Homepage: Hot Deals
            'deals.title': '热卖推荐 & 新品上市',
            'deals.viewall': '查看全部产品',

            // Homepage: Categories
            'cat.title': '分类选购',
            'cat.electronics': '电子产品',
            'cat.home': '家居生活',
            'cat.sports': '运动户外',
            'cat.beauty': '健康美容',
            'cat.fashion': '时尚配饰',

            // Homepage: Featured Products
            'featured.title': '精选产品',
            'featured.viewall': '查看全部',
            'featured.addtocart': '加入购物车',

            // Products page
            'products.title': '全部产品',
            'products.filter': '按分类筛选',
            'products.sort': '排序方式',
            'products.sort.default': '默认排序',
            'products.sort.price-low': '价格从低到高',
            'products.sort.price-high': '价格从高到低',
            'products.sort.rating': '评分',
            'products.viewdetails': '查看详情',
            'products.outofstock': '暂时缺货',

            // Product Detail
            'pd.price': '价格',
            'pd.rating': '评分',
            'pd.reviews': '条评价',
            'pd.features': '产品特点',
            'pd.description': '产品描述',
            'pd.addtocart': '加入购物车',
            'pd.buynow': '立即购买',
            'pd.quantity': '数量',
            'pd.instock': '有货',
            'pd.brand': '品牌',
            'pd.category': '分类',
            'pd.share': '分享',

            // Cart
            'cart.title': '购物车',
            'cart.empty': '购物车是空的',
            'cart.total': '合计',
            'cart.checkout': '去结算',
            'cart.continue': '继续购物',
            'cart.remove': '删除',

            // Checkout
            'checkout.title': '结算',
            'checkout.contact': '联系方式',
            'checkout.email': '邮箱地址',
            'checkout.shipping': '配送地址',
            'checkout.firstname': '名',
            'checkout.lastname': '姓',
            'checkout.address': '地址',
            'checkout.city': '城市',
            'checkout.zip': '邮编',
            'checkout.country': '国家',
            'checkout.payment': '支付方式',
            'checkout.card': '信用卡',
            'checkout.cardnum': '卡号',
            'checkout.expiry': '有效期',
            'checkout.cvc': '安全码',
            'checkout.cardname': '持卡人姓名',
            'checkout.shipmethod': '配送方式',
            'checkout.standard': '标准配送',
            'checkout.express': '加急配送',
            'checkout.overnight': '次日达',
            'checkout.free': '免费',
            'checkout.back': '返回购物车',
            'checkout.pay': '立即支付',
            'checkout.summary': '订单摘要',
            'checkout.subtotal': '小计',
            'checkout.shipping': '运费',
            'checkout.tax': '税费',

            // Order Confirmed
            'oc.title': '下单成功！',
            'oc.subtitle': '感谢您的购买，订单已成功提交。',
            'oc.summary': '订单摘要',
            'oc.shippingto': '配送地址',
            'oc.vieworders': '查看我的订单',
            'oc.continueshop': '继续购物',
            'oc.emailnotice': '确认邮件已发送到您的邮箱。',

            // Order History
            'oh.title': '我的订单',
            'oh.all': '全部订单',
            'oh.search': '搜索订单号或商品名...',
            'oh.empty': '您还没有任何订单。',
            'oh.details': '详情',
            'oh.reorder': '再次购买',
            'oh.total': '合计',
            'oh.continue': '继续购物',

            // Auth
            'auth.signin': '登录',
            'auth.register': '创建账号',
            'auth.email': '邮箱地址',
            'auth.password': '密码',
            'auth.name': '姓名',
            'auth.confirm': '确认密码',
            'auth.remember': '记住我',
            'auth.terms': '我已同意服务条款',
            'auth.forgot': '忘记密码？',
            'auth.or': '或使用以下方式',
            'auth.noaccount': '还没有账号？',
            'auth.hasaccount': '已有账号？',

            // Blog
            'blog.title': '我们的博客',
            'blog.search': '搜索文章...',
            'blog.all': '全部',
            'blog.readmore': '阅读全文',
            'blog.related': '相关文章',
            'blog.share': '分享本文',

            // Footer
            'footer.desc': '您值得信赖的在线购物平台，优质商品，超值价格。',
            'footer.quicklinks': '快速链接',
            'footer.customerservice': '客户服务',
            'footer.contactinfo': '联系方式',
            'footer.returns': '退换货政策',
            'footer.shipping': '配送政策',
            'footer.privacy': '隐私政策',
            'footer.terms': '服务条款',
            'footer.faq': '常见问题',
            'footer.rights': '版权所有。',

            // Common
            'common.loading': '加载中...',
            'common.error': '出错了',
            'common.success': '成功',
            'common.close': '关闭',
            'common.save': '保存',
            'common.cancel': '取消',
            'common.delete': '删除',
            'common.edit': '编辑',
            'common.submit': '提交',
            'common.search': '搜索',
            'common.back': '返回',
            'common.next': '下一步',

            // Product Reviews
            'review.title': '客户评价',
            'review.write': '写评价',
            'review.rating': '评分',
            'review.name': '您的姓名',
            'review.email': '您的邮箱',
            'review.content': '评价内容',
            'review.submit': '提交评价',
            'review.thanks': '感谢您的评价！',
            'review.empty': '暂无评价，快来第一个评价吧！',
            'review.avg': '平均评分',
            'review.total': '条评价',
        }
    };

    var currentLang = DEFAULT_LANG;

    // Load saved language
    function init() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && translations[saved]) {
                currentLang = saved;
            }
        } catch(e) {}
        applyTranslations();
    }

    // Get current language code
    function getLang() {
        return currentLang;
    }

    // Set language
    function setLang(langCode) {
        if (!translations[langCode]) return false;
        currentLang = langCode;
        try {
            localStorage.setItem(STORAGE_KEY, langCode);
        } catch(e) {}
        applyTranslations();
        // Dispatch event for other scripts
        var event = new CustomEvent('languageChanged', { detail: { lang: langCode } });
        document.dispatchEvent(event);
        return true;
    }

    // Toggle between EN and CN
    function toggle() {
        var newLang = currentLang === 'en' ? 'zh' : 'en';
        return setLang(newLang);
    }

    // Translate a single key
    function t(key) {
        if (translations[currentLang] && translations[currentLang][key]) {
            return translations[currentLang][key];
        }
        // Fallback to English
        if (translations.en && translations.en[key]) {
            return translations.en[key];
        }
        return key;
    }

    // Apply translations to all elements with data-i18n attribute
    function applyTranslations() {
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var text = t(key);

            // Handle placeholder, value, or text content
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.getAttribute('data-i18n-attr') === 'placeholder') {
                    el.setAttribute('placeholder', text);
                } else {
                    el.value = text;
                }
            } else if (el.getAttribute('data-i18n-attr') === 'placeholder') {
                el.setAttribute('placeholder', text);
            } else if (el.getAttribute('data-i18n-attr') === 'title') {
                el.setAttribute('title', text);
            } else {
                el.textContent = text;
            }
        });

        // Update lang switcher button text
        var switchers = document.querySelectorAll('[data-i18n-switcher]');
        switchers.forEach(function(el) {
            var label = el.querySelector('[data-i18n-switcher-label]');
            if (currentLang === 'zh') {
                el.innerHTML = '<i class="fas fa-language"></i> <span data-i18n-switcher-label>EN</span>';
            } else {
                el.innerHTML = '<i class="fas fa-language"></i> <span data-i18n-switcher-label>\u4E2D\u6587</span>';
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    }

    // Expose public API
    return {
        init: init,
        getLang: getLang,
        setLang: setLang,
        toggle: toggle,
        t: t,
        apply: applyTranslations
    };
})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { i18n.init(); });
} else {
    i18n.init();
}
