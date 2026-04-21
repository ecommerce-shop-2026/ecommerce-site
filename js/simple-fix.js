// 简化版购物车修复脚本
(function() {
    console.log('注入简化购物车功能...');
    
    // 购物车状态
    let cart = [];
    let cartCount = 0;
    let cartTotal = 0;
    
    // 添加到购物车
    window.addToCart = function(productId) {
        console.log('添加到购物车:', productId);
        
        // 产品数据
        const products = window.products || [
            { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99 },
            { id: 2, name: "Smart Watch Series 5", price: 249.99 },
            { id: 3, name: "Premium Cotton T-Shirt", price: 29.99 },
            { id: 4, name: "Ceramic Coffee Mug Set", price: 34.99 },
            { id: 5, name: "Organic Face Cream", price: 49.99 },
            { id: 6, name: "Fitness Tracker Band", price: 79.99 },
            { id: 7, name: "Leather Wallet", price: 45.99 },
            { id: 8, name: "Desk Lamp with USB Ports", price: 59.99 }
        ];
        
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('产品未找到:', productId);
            return;
        }
        
        // 添加到购物车
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        // 更新计数
        cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // 更新显示
        updateCartDisplay();
        
        console.log('购物车:', cart);
        return true;
    };
    
    // 更新显示
    function updateCartDisplay() {
        // 查找购物车图标
        const cartIcons = document.querySelectorAll('[ref="e3"], .cart-count');
        cartIcons.forEach(icon => {
            if (icon.textContent.includes('')) {
                icon.textContent = ` ${cartCount}`;
            } else {
                icon.textContent = cartCount;
            }
        });
        console.log('购物车显示更新:', cartCount);
    }
    
    // 绑定按钮事件
    function bindButtonEvents() {
        const buttons = document.querySelectorAll('.btn-add-to-cart, button:has(i.fa-cart-plus)');
        buttons.forEach((button, index) => {
            const productId = button.getAttribute('data-id') || (index + 1);
            button.setAttribute('data-id', productId);
            button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                addToCart(parseInt(productId));
                return false;
            };
        });
        console.log('绑定按钮:', buttons.length);
    }
    
    // 初始化
    updateCartDisplay();
    setTimeout(bindButtonEvents, 500);
    
    console.log('购物车功能就绪');
})();