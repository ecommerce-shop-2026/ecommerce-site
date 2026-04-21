// 简化版购物车修复脚本 v2
(function() {
    console.log('注入简化购物车功能 v2...');
    
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
        // 查找购物车图标 - 使用更可靠的方法
        const cartIcon = document.querySelector('[ref="e3"]');
        if (cartIcon) {
            // 保留图标字符，只更新数字
            const currentText = cartIcon.textContent;
            if (currentText.includes('')) {
                cartIcon.textContent = ` ${cartCount}`;
            } else {
                cartIcon.textContent = cartCount.toString();
            }
            console.log('购物车显示更新:', cartCount);
        } else {
            console.log('购物车图标未找到');
        }
    }
    
    // 绑定按钮事件 - 使用更可靠的选择器
    function bindButtonEvents() {
        // 查找所有按钮
        const allButtons = document.querySelectorAll('button');
        let cartButtons = [];
        
        allButtons.forEach((button, index) => {
            const buttonText = button.textContent || '';
            if (buttonText.includes('Add to Cart') || buttonText.includes('')) {
                cartButtons.push(button);
                const productId = index + 1; // 简单映射
                button.setAttribute('data-id', productId);
                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(productId);
                    return false;
                };
            }
        });
        
        console.log('绑定购物车按钮:', cartButtons.length);
        return cartButtons.length;
    }
    
    // 初始化
    updateCartDisplay();
    setTimeout(() => {
        const boundButtons = bindButtonEvents();
        console.log('初始化完成，绑定了', boundButtons, '个按钮');
    }, 1000);
    
    console.log('购物车功能就绪 v2');
})();