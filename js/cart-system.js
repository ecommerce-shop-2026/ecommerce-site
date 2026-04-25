// 全新购物车系统 - 简单可靠版

// 购物车数据（全局）
window.cart = {
    items: [],
    total: 0,
    count: 0
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 初始化购物车系统...');
    
    // 产品数据
    const products = [
        { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "Electronics" },
        { id: 2, name: "Smart Watch Series 5", price: 249.99, category: "Electronics" },
        { id: 3, name: "Premium Cotton T-Shirt", price: 29.99, category: "Fashion" },
        { id: 4, name: "Ceramic Coffee Mug Set", price: 34.99, category: "Home & Living" },
        { id: 5, name: "Organic Face Cream", price: 49.99, category: "Health & Beauty" },
        { id: 6, name: "Fitness Tracker Band", price: 79.99, category: "Health & Beauty" },
        { id: 7, name: "Leather Wallet", price: 45.99, category: "Fashion" },
        { id: 8, name: "Desk Lamp with USB Ports", price: 39.99, category: "Home & Living" }
    ];
    
    // 保存到全局
    window.products = products;
    
    // 从localStorage加载购物车
    function loadCart() {
        try {
            const saved = localStorage.getItem('shopEasyCart');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 兼容旧格式：如果是数组，转成对象格式
                if (Array.isArray(parsed)) {
                    window.cart.items = parsed;
                    window.cart.total = 0;
                    window.cart.count = parsed.length;
                } else if (typeof parsed === 'object' && parsed !== null) {
                    window.cart.items = parsed.items || [];
                    window.cart.total = parsed.total || 0;
                    window.cart.count = parsed.count || 0;
                }
                console.log('已加载购物车:', window.cart);
            }
        } catch (e) {
            console.log('无法加载购物车，使用新购物车');
        }
        updateCartDisplay();
    }
    
    // 保存购物车到localStorage
    function saveCart() {
        try {
            localStorage.setItem('shopEasyCart', JSON.stringify(window.cart));
        } catch (e) {
            console.log('无法保存购物车到localStorage');
        }
    }
    
    // 添加到购物车
    window.addToCart = function(productId, quantity = 1) {
        console.log('添加产品到购物车:', productId);
        
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('产品未找到:', productId);
            return false;
        }
        
        // 检查是否已在购物车中
        const existingIndex = window.cart.items.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            // 更新数量
            window.cart.items[existingIndex].quantity += quantity;
        } else {
            // 添加新项目
            window.cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                category: product.category
            });
        }
        
        // 重新计算
        calculateCart();
        saveCart();
        updateCartDisplay();
        
        // 显示通知
        showNotification(`已添加 ${product.name} 到购物车`);
        
        return true;
    };
    
    // 从购物车移除
    window.removeFromCart = function(productId) {
        window.cart.items = window.cart.items.filter(item => item.id !== productId);
        calculateCart();
        saveCart();
        updateCartDisplay();
        showNotification('已从购物车移除商品');
    };
    
    // 更新数量
    window.updateCartQuantity = function(productId, quantity) {
        const item = window.cart.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = quantity;
                calculateCart();
                saveCart();
                updateCartDisplay();
            }
        }
    };
    
    // 计算购物车
    function calculateCart() {
        window.cart.count = window.cart.items.reduce((total, item) => total + item.quantity, 0);
        window.cart.total = window.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        console.log('购物车计算完成:', window.cart);
    }
    
    // 更新购物车显示
    function updateCartDisplay() {
        // 更新购物车图标 - 查找.cart-count元素
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = window.cart.count;
        });
        
        // 同时更新所有包含购物车图标的元素
        const cartIcons = document.querySelectorAll('.fa-shopping-cart');
        cartIcons.forEach(icon => {
            const parent = icon.parentElement;
            // 检查是否是导航栏中的购物车按钮
            if (parent && parent.classList.contains('btn-cart')) {
                // 确保.cart-count元素存在
                let countSpan = parent.querySelector('.cart-count');
                if (!countSpan) {
                    countSpan = document.createElement('span');
                    countSpan.className = 'cart-count';
                    parent.appendChild(countSpan);
                }
                countSpan.textContent = window.cart.count;
            }
        });
        
        // 如果有购物车页面，更新它
        updateCartPage();
    }
    
    // 更新购物车页面（如果存在）
    function updateCartPage() {
        const cartContainer = document.getElementById('cart-items');
        if (cartContainer) {
            renderCartPage();
        }
    }
    
    // 渲染购物车页面
    function renderCartPage() {
        const container = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        const countElement = document.getElementById('cart-count');
        
        if (!container) return;
        
        if (window.cart.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>购物车是空的</h3>
                    <p>快去添加一些商品吧！</p>
                    <a href="index.html" class="btn btn-primary">继续购物</a>
                </div>
            `;
        } else {
            let html = '';
            window.cart.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p class="item-category">${item.category}</p>
                        <p class="item-price">单价: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-control">
                            <button class="qty-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" min="1" 
                                   onchange="updateCartQuantity(${item.id}, this.value)">
                            <button class="qty-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <div class="item-total">$${itemTotal.toFixed(2)}</div>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                `;
            });
            container.innerHTML = html;
        }
        
        if (totalElement) {
            totalElement.textContent = `$${window.cart.total.toFixed(2)}`;
        }
        
        if (countElement) {
            countElement.textContent = window.cart.count;
        }
    }
    
    // 显示通知
    function showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 绑定所有"添加到购物车"按钮
    function bindAddToCartButtons() {
        const buttons = document.querySelectorAll('.btn-add-to-cart, button');
        let boundCount = 0;
        
        buttons.forEach((button, index) => {
            const buttonText = button.textContent || '';
            if (buttonText.includes('Add to Cart') || buttonText.includes('')) {
                // 确保按钮有 data-id 属性
                const productId = button.getAttribute('data-id') || (index % 8) + 1;
                button.setAttribute('data-id', productId);
                
                // 直接绑定点击事件到每个按钮，不再依赖 main.js 事件委托
                // main.js 的事件委托可能在某些环境（如浏览器自动化工具）中不触发
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('添加产品到购物车(按钮点击):', id);
                    window.addToCart(id);
                });
                
                boundCount++;
            }
        });
        
        console.log(`已绑定 ${boundCount} 个\"添加到购物车\"按钮`);
    }
    
    // 初始化
    loadCart();
    
    // 绑定结算按钮
    function bindCheckoutButton() {
        const checkoutBtns = document.querySelectorAll('.btn-checkout');
        checkoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const cartData = (typeof window.cart !== 'undefined' && window.cart.items)
                    ? window.cart : { items: [], total: 0, count: 0 };
                if (cartData.items.length === 0) {
                    showNotification('Your cart is empty!');
                    return;
                }
                window.location.href = 'payment.html';
            });
        });
        console.log(`已绑定 ${checkoutBtns.length} 个结算按钮`);
    }
    
    // 延迟绑定按钮，确保DOM完全加载
    setTimeout(() => {
        bindAddToCartButtons();
        bindCheckoutButton();
        console.log('🛒 购物车系统初始化完成');
    }, 500);
    
    // 添加CSS样式
    addCartStyles();
});

// 添加购物车相关样式
function addCartStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .cart-notification.show {
            transform: translateX(0);
        }
        
        .cart-notification i {
            font-size: 1.2em;
        }
        
        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .empty-cart i {
            color: #ddd;
            margin-bottom: 20px;
        }
        
        .empty-cart h3 {
            margin: 10px 0;
            color: #333;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            background: white;
        }
        
        .item-info h4 {
            margin: 0 0 5px 0;
            color: #333;
        }
        
        .item-category {
            color: #666;
            font-size: 0.9em;
            margin: 0 0 5px 0;
        }
        
        .item-price {
            color: #28a745;
            font-weight: bold;
            margin: 0;
        }
        
        .item-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .quantity-control {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .qty-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .qty-btn:hover {
            background: #f8f9fa;
        }
        
        .quantity-control input {
            width: 50px;
            height: 30px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        
        .item-total {
            font-weight: bold;
            color: #333;
            min-width: 80px;
            text-align: right;
        }
        
        .btn-remove {
            background: #dc3545;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-remove:hover {
            background: #c82333;
        }
        
        /* 购物车页面样式 */
        .cart-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #007bff;
        }
        
        .cart-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
        
        .summary-total {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            border-top: 2px solid #dee2e6;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .btn-checkout {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 1.1em;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }
        
        .btn-checkout:hover {
            background: #218838;
        }
        
        /* 结账页面样式 */
        .checkout-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
        }
        
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        
        .payment-method {
            border: 2px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .payment-method:hover {
            border-color: #007bff;
        }
        
        .payment-method.selected {
            border-color: #28a745;
            background: #f8fff9;
        }
        
        .payment-method i {
            font-size: 2em;
            margin-bottom: 10px;
            color: #666;
        }
        
        .order-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-top: 30px;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .order-total {
            font-size: 1.3em;
            font-weight: bold;
            color: #333;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #dee2e6;
        }
    `;
    
    document.head.appendChild(style);
}