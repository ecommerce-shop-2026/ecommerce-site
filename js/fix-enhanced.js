// 增强版电商网站修复脚本
console.log('开始增强修复电商网站功能...');

// 购物车状态
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// 1. 修复购物车功能
function initializeCart() {
    console.log('初始化购物车...');
    
    // 从localStorage加载购物车
    try {
        const savedCart = localStorage.getItem('shopEasyCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            cartCount = parseInt(localStorage.getItem('shopEasyCartCount') || '0');
            cartTotal = parseFloat(localStorage.getItem('shopEasyCartTotal') || '0');
            updateCartDisplay();
        }
    } catch (e) {
        console.error('加载购物车失败:', e);
    }
}

// 2. 添加到购物车函数
function addToCart(productId) {
    console.log('添加到购物车，产品ID:', productId);
    
    // 查找产品
    const product = window.products?.find(p => p.id === productId);
    if (!product) {
        console.error('产品未找到:', productId);
        showNotification('产品未找到', 'error');
        return;
    }
    
    // 检查是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || product.images?.[0]
        });
    }
    
    // 更新购物车状态
    cartCount += 1;
    cartTotal += product.price;
    
    // 保存并更新显示
    saveCart();
    updateCartDisplay();
    
    // 显示成功通知
    showNotification(`已添加到购物车: ${product.name}`, 'success');
}

// 3. 保存购物车到localStorage
function saveCart() {
    try {
        localStorage.setItem('shopEasyCart', JSON.stringify(cart));
        localStorage.setItem('shopEasyCartCount', cartCount.toString());
        localStorage.setItem('shopEasyCartTotal', cartTotal.toString());
    } catch (e) {
        console.error('保存购物车失败:', e);
    }
}

// 4. 更新购物车显示
function updateCartDisplay() {
    // 更新购物车数量显示
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
    
    // 更新购物车总金额
    const totalAmountElements = document.querySelectorAll('.total-amount');
    totalAmountElements.forEach(element => {
        element.textContent = `$${cartTotal.toFixed(2)}`;
    });
    
    // 更新购物车模态框内容
    updateCartModal();
}

// 5. 更新购物车模态框
function updateCartModal() {
    const cartItemsElement = document.getElementById('cartItems');
    if (!cartItemsElement) return;
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>您的购物车是空的</p>
                <button class="btn-continue-shopping" onclick="closeCart()">继续购物</button>
            </div>
        `;
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop'}" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <div class="cart-item-actions">
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });
    
    cartItemsElement.innerHTML = html;
}

// 6. 更新产品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // 更新数量和总价
    const priceChange = item.price * change;
    item.quantity = newQuantity;
    cartCount += change;
    cartTotal += priceChange;
    
    saveCart();
    updateCartDisplay();
}

// 7. 从购物车移除
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    const item = cart[itemIndex];
    cartCount -= item.quantity;
    cartTotal -= item.price * item.quantity;
    cart.splice(itemIndex, 1);
    
    saveCart();
    updateCartDisplay();
    
    showNotification(`已从购物车移除: ${item.name}`, 'warning');
}

// 8. 购物车模态框控制
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        console.error('购物车模态框未找到');
        return;
    }
    
    if (cartModal.style.display === 'block') {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.style.display = 'block';
    updateCartModal();
    
    // 添加关闭事件
    setTimeout(() => {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }, 10);
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.style.display = 'none';
}

// 9. 结账处理
function processCheckout() {
    if (cart.length === 0) {
        showNotification('购物车为空，无法结账', 'error');
        return;
    }
    
    showNotification(`结账成功！总金额: $${cartTotal.toFixed(2)}`, 'success');
    
    // 清空购物车
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    saveCart();
    updateCartDisplay();
    closeCart();
}

// 10. 通知系统
function showNotification(message, type = 'success') {
    console.log('显示通知:', message);
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 
                               'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // 绑定关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// 11. 添加通知样式
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 9999;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.error {
            background: #ef4444;
        }
        
        .notification.warning {
            background: #f59e0b;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 18px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin-left: 15px;
        }
        
        /* 购物车模态框样式 */
        .cart-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .cart-content {
            position: absolute;
            top: 0;
            right: 0;
            width: 400px;
            height: 100%;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
        }
        
        .cart-empty {
            text-align: center;
            padding: 60px 20px;
        }
        
        .cart-empty i {
            font-size: 60px;
            color: #ccc;
            margin-bottom: 20px;
        }
        
        .cart-item {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 15px;
        }
        
        .btn-quantity {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-remove {
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 10px;
        }
        
        .btn-continue-shopping {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);
}

// 12. 绑定事件监听器
function bindEventListeners() {
    console.log('绑定事件监听器...');
    
    // 添加到购物车按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-to-cart')) {
            const button = e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.getAttribute('data-id') || button.getAttribute('data-product-id'));
            if (productId) {
                addToCart(productId);
            }
        }
        
        // 购物车按钮
        if (e.target.closest('.btn-cart') || e.target.closest('.cart-count')) {
            toggleCart();
        }
    });
    
    // 搜索按钮
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                const query = searchInput.value.trim();
                if (query) {
                    showNotification(`搜索: ${query}`, 'info');
                } else {
                    showNotification('请输入搜索关键词', 'warning');
                }
            }
        });
    }
    
    // 退货表单
    const returnForm = document.getElementById('returnRequestForm');
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const orderNumber = document.getElementById('orderNumber').value;
            const email = document.getElementById('email').value;
            const reason = document.getElementById('reason').value;
            
            if (orderNumber && email) {
                showNotification('退货请求已提交！我们将在24小时内联系您。', 'success');
                returnForm.reset();
            } else {
                showNotification('请填写所有必填字段', 'error');
            }
        });
    }
}

// 13. 主修复函数
function enhanceAllFeatures() {
    console.log('开始增强所有功能...');
    
    // 添加通知样式
    addNotificationStyles();
    
    // 初始化购物车
    initializeCart();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 确保产品数据可用
    if (!window.products) {
        console.warn('产品数据未找到，使用默认数据');
        window.products = [
            { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
            { id: 2, name: "Smart Watch Series 5", price: 249.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
            { id: 3, name: "Premium Cotton T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop" },
            { id: 4, name: "Ceramic Coffee Mug Set", price: 34.99, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop" },
            { id: 5, name: "Organic Face Cream", price: 49.99, image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400&h=400&fit=crop" },
            { id: 6, name: "Fitness Tracker Band", price: 79.99, image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop" },
            { id: 7, name: "Leather Wallet", price: 45.99, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" },
            { id: 8, name: "Desk Lamp with USB Ports", price: 59.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop" }
        ];
    }
    
    // 更新产品按钮的data-id属性
    setTimeout(() => {
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        addToCartButtons.forEach((button, index) => {
            if (!button.hasAttribute('data-id')) {
                button.setAttribute('data-id', (index + 1).toString());
            }
        });
    }, 500);
    
    // 显示完成通知
    setTimeout(() => {
        showNotification('网站功能增强完成！所有功能现已可用。');
        console.log('增强修复完成！');
    }, 1000);
}

// 14. 等待页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAllFeatures);
} else {
    enhanceAllFeatures();
}

// 15. 暴露函数到全局作用域
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.processCheckout = processCheckout;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.showNotification = showNotification;