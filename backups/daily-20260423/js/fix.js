// 修复电商网站JavaScript功能
console.log('开始修复电商网站功能...');

// 修复1：确保DOM元素正确获取
function fixDomElements() {
    console.log('修复DOM元素获取...');
    
    // 重新获取所有必要的DOM元素
    const elements = {
        productsGrid: document.getElementById('productsGrid'),
        cartModal: document.getElementById('cartModal'),
        cartItems: document.getElementById('cartItems'),
        cartCountElement: document.querySelector('.cart-count'),
        totalAmountElement: document.querySelector('.total-amount'),
        cartCloseBtn: document.querySelector('.cart-close'),
        cartToggleBtn: document.querySelector('.btn-cart'),
        checkoutBtn: document.querySelector('.btn-checkout'),
        returnForm: document.getElementById('returnRequestForm')
    };
    
    console.log('DOM元素状态:', elements);
    return elements;
}

// 修复2：重新绑定事件监听器
function fixEventListeners() {
    console.log('修复事件监听器...');
    
    // 重新绑定购物车按钮
    const cartToggleBtn = document.querySelector('.btn-cart');
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('购物车按钮被点击');
            toggleCart();
        });
    }
    
    // 重新绑定关闭购物车按钮
    const cartCloseBtn = document.querySelector('.cart-close');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('关闭购物车按钮被点击');
            closeCart();
        });
    }
    
    // 重新绑定结账按钮
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('结账按钮被点击');
            processCheckout();
        });
    }
    
    // 重新绑定添加到购物车按钮（使用事件委托）
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-to-cart')) {
            const button = e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            console.log('添加到购物车按钮被点击，产品ID:', productId);
            addToCart(productId);
        }
    });
    
    // 重新绑定退货表单
    const returnForm = document.getElementById('returnRequestForm');
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('退货表单提交');
            
            const orderNumber = document.getElementById('orderNumber').value;
            const email = document.getElementById('email').value;
            const reason = document.getElementById('reason').value;
            
            if (orderNumber && email) {
                showNotification('Return request submitted successfully! We will contact you within 24 hours.');
                returnForm.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
}

// 修复3：添加缺失的函数
function showNotification(message, type = 'success') {
    console.log('显示通知:', message);
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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

// 修复4：添加通知样式
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
    `;
    document.head.appendChild(style);
}

// 修复5：增强购物车功能
function enhanceCartFunctionality() {
    console.log('增强购物车功能...');
    
    // 确保购物车状态持久化
    function saveCart() {
        try {
            localStorage.setItem('shopEasyCart', JSON.stringify(cart));
            localStorage.setItem('shopEasyCartCount', cartCount.toString());
            localStorage.setItem('shopEasyCartTotal', cartTotal.toString());
        } catch (e) {
            console.error('保存购物车失败:', e);
        }
    }
    
    function loadCart() {
        try {
            const savedCart = localStorage.getItem('shopEasyCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                cartCount = parseInt(localStorage.getItem('shopEasyCartCount') || '0');
                cartTotal = parseFloat(localStorage.getItem('shopEasyCartTotal') || '0');
                updateCart();
            }
        } catch (e) {
            console.error('加载购物车失败:', e);
        }
    }
    
    // 覆盖原来的saveCart和loadCart函数
    window.saveCart = saveCart;
    window.loadCart = loadCart;
}

// 修复6：添加产品图片占位符
function addProductImages() {
    console.log('添加产品图片...');
    
    const productImages = {
        1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop',
        3: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        4: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop',
        5: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400&h=400&fit=crop',
        6: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop',
        7: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        8: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop'
    };
    
    // 更新产品数据
    if (window.products) {
        window.products = window.products.map(product => ({
            ...product,
            image: productImages[product.id] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop'
        }));
    }
    
    // 重新加载产品
    if (window.loadProducts) {
        window.loadProducts();
    }
}

// 主修复函数
function fixAllIssues() {
    console.log('开始全面修复...');
    
    // 添加通知样式
    addNotificationStyles();
    
    // 修复DOM元素
    fixDomElements();
    
    // 增强购物车功能
    enhanceCartFunctionality();
    
    // 添加产品图片
    addProductImages();
    
    // 修复事件监听器
    setTimeout(fixEventListeners, 100);
    
    // 显示修复完成通知
    setTimeout(() => {
        showNotification('网站功能修复完成！所有功能现已可用。');
        console.log('修复完成！');
    }, 500);
}

// 等待页面加载完成后执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllIssues);
} else {
    fixAllIssues();
}