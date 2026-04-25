// Checkout Page Script
// Handles payment form validation, order summary loading, and payment processing

document.addEventListener('DOMContentLoaded', function() {
    console.log('💳 Checkout page initialized');
    
    // Load order summary from cart
    loadOrderSummary();
    
    // Setup pay button
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Card number formatting (每4位加空格)
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.substring(0, 19);
        });
    }
    
    // Expiry date formatting (自动添加斜杠)
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVC number only
    const cvc = document.getElementById('cvc');
    if (cvc) {
        cvc.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // Shipping method change — recalculate totals
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            loadOrderSummary();
        });
    });
    
    // Form实时验证提示 — add validation styling on blur
    const formInputs = document.querySelectorAll('.checkout-form input, .checkout-form select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
});

// Validate a single form field and show inline提示
function validateField(field) {
    const errorEl = field.parentElement.querySelector('.field-error');
    // Remove existing error
    if (errorEl) errorEl.remove();
    
    field.classList.remove('invalid', 'valid');
    
    if (!field.value || field.value.trim() === '') {
        if (field.hasAttribute('required') || field.id !== 'cardName') {
            field.classList.add('invalid');
            // Don't show error for empty optional fields
            if (field.id === 'cardName' && !field.value) return;
            const err = document.createElement('span');
            err.className = 'field-error';
            err.textContent = 'This field is required';
            field.parentElement.appendChild(err);
        }
        return false;
    }
    
    // Email validation
    if (field.id === 'email' && !field.value.includes('@')) {
        field.classList.add('invalid');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'Please enter a valid email address';
        field.parentElement.appendChild(err);
        return false;
    }
    
    // ZIP code validation
    if (field.id === 'zip' && field.value.length < 3) {
        field.classList.add('invalid');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'Please enter a valid ZIP code';
        field.parentElement.appendChild(err);
        return false;
    }
    
    field.classList.add('valid');
    return true;
}

// Load order summary from cart
function loadOrderSummary() {
    const cartData = getCartData();
    
    const orderItems = document.querySelector('.order-items');
    const subtotalEl = document.querySelector('.subtotal');
    const shippingEl = document.querySelector('.shipping-cost');
    const taxEl = document.querySelector('.tax');
    const totalEl = document.querySelector('.total');
    
    // Get selected shipping method
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    let shippingMethod = 'standard';
    let shippingCost = 0;
    if (selectedShipping) {
        shippingMethod = selectedShipping.value;
        // 配送费用计算: standard=free, express=$9.99, overnight=$19.99
        switch(shippingMethod) {
            case 'express': shippingCost = 9.99; break;
            case 'overnight': shippingCost = 19.99; break;
            default: shippingCost = 0;
        }
    }
    
    if (orderItems) {
        if (cartData.items.length === 0) {
            orderItems.innerHTML = `
                <div class="empty-order">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        } else {
            let html = '';
            cartData.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                html += `
                    <div class="order-item">
                        <div class="order-item-info">
                            <h4>${item.name}</h4>
                            <span class="order-item-qty">Qty: ${item.quantity}</span>
                        </div>
                        <span class="order-item-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                `;
            });
            orderItems.innerHTML = html;
        }
    }
    
    // 税费计算（按小计8%计算）
    const subtotal = cartData.total || 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) {
        shippingEl.textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
    }
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Update cart count in nav
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = cartData.count;
    });
}

// Get cart data from localStorage / window.cart
function getCartData() {
    let cartData = { items: [], total: 0, count: 0 };
    
    // First try window.cart (cart-system.js)
    if (typeof window.cart !== 'undefined' && window.cart.items && window.cart.items.length > 0) {
        cartData = window.cart;
    } else {
        // Fallback to localStorage
        try {
            const saved = localStorage.getItem('shopEasyCart');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    cartData.items = parsed;
                    cartData.total = parsed.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    cartData.count = parsed.reduce((sum, item) => sum + item.quantity, 0);
                } else if (typeof parsed === 'object' && parsed !== null) {
                    cartData = parsed;
                }
            }
        } catch(e) {
            console.log('Could not load cart from localStorage');
        }
    }
    
    return cartData;
}

// Process payment
function processPayment() {
    // Validate all form fields
    const email = document.getElementById('email');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');
    const country = document.getElementById('country');
    const cardNum = document.getElementById('cardNumber');
    const cardName = document.getElementById('cardName');
    
    // Run all validations
    const validations = [
        { field: email, name: 'Email' },
        { field: firstName, name: 'First Name' },
        { field: lastName, name: 'Last Name' },
        { field: address, name: 'Address' },
        { field: city, name: 'City' },
        { field: zip, name: 'ZIP Code' },
        { field: country, name: 'Country' }
    ];
    
    let firstInvalid = null;
    let allValid = true;
    
    validations.forEach(v => {
        if (!validateField(v.field)) {
            allValid = false;
            if (!firstInvalid) firstInvalid = v.field;
        }
    });
    
    if (!allValid) {
        showCheckoutNotification('Please fill in all required fields correctly', 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
    }
    
    // Email specific check
    if (!email.value || !email.value.includes('@')) {
        showCheckoutNotification('Please enter a valid email address', 'error');
        email.focus();
        return;
    }
    
    // Get cart data
    const cartData = getCartData();
    
    if (cartData.items.length === 0) {
        showCheckoutNotification('Your cart is empty. Add items before checkout.', 'error');
        return;
    }
    
    // Show processing state
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    // Get shipping method and costs
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    let shippingMethod = 'standard';
    let shippingLabel = 'Standard Shipping';
    let shippingCost = 0;
    if (selectedShipping) {
        shippingMethod = selectedShipping.value;
        switch(shippingMethod) {
            case 'express':
                shippingCost = 9.99;
                shippingLabel = 'Express Shipping';
                break;
            case 'overnight':
                shippingCost = 19.99;
                shippingLabel = 'Overnight Shipping';
                break;
            default:
                shippingCost = 0;
                shippingLabel = 'Standard Shipping';
        }
    }
    
    // Calculate totals
    const subtotal = cartData.total || 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    
    // Simulate payment processing
    setTimeout(function() {
        // Payment successful — 生成订单号
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        const randomStr = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
        const orderId = 'ORD-' + dateStr + '-' + randomStr;
        
        // Build customer info
        const customer = {
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            state: '',
            zip: zip.value,
            country: country.value,
            phone: ''
        };
        
        // Build order object
        const order = {
            id: orderId,
            date: now.toISOString(),
            items: cartData.items.map(item => ({ ...item })),
            subtotal: subtotal,
            shipping: shippingCost,
            tax: tax,
            total: total,
            status: 'Processing',
            shippingMethod: shippingLabel,
            customer: customer,
            payment: {
                method: 'Credit Card',
                last4: cardNum ? cardNum.value.replace(/\\D/g, '').slice(-4) : '4242'
            }
        };
        
        // 保存订单历史到 localStorage
        saveOrder(order);
        
        // 保存到 shopeasy_last_order 供 order-confirmed.html 读取
        saveLastOrder(order);
        
        // Clear cart
        clearCart();
        
        // Reset button
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-check-circle"></i> Order Confirmed';
            payButton.classList.add('btn-success');
        }
        
        // Reload order summary
        loadOrderSummary();
        
        // Show order confirmation弹窗 — 替换简单的alert
        showOrderConfirmation(order);
        
        // Also show the notification
        showCheckoutNotification('Payment successful! Order confirmed. 🎉', 'success');
        
    }, 2000);
}

// 保存订单到 localStorage
function saveOrder(order) {
    try {
        let orders = [];
        const saved = localStorage.getItem('shopEasyOrders');
        if (saved) {
            try {
                orders = JSON.parse(saved);
                if (!Array.isArray(orders)) orders = [];
            } catch(e) { orders = []; }
        }
        orders.unshift(order); // 最新订单在最前面
        localStorage.setItem('shopEasyOrders', JSON.stringify(orders));
        console.log('订单已保存:', order.id);
    } catch(e) {
        console.log('无法保存订单到localStorage');
    }
}

// 清空购物车
function clearCart() {
    if (typeof window.cart !== 'undefined') {
        window.cart.items = [];
        window.cart.count = 0;
        window.cart.total = 0;
        try {
            localStorage.setItem('shopEasyCart', JSON.stringify(window.cart));
        } catch(e) {}
    } else {
        try {
            localStorage.setItem('shopEasyCart', JSON.stringify({ items: [], total: 0, count: 0 }));
        } catch(e) {}
    }
}

// 显示订单确认弹窗（带动画效果）
function showOrderConfirmation(order) {
    // Remove any existing confirmation
    const existing = document.querySelector('.order-confirmation-overlay');
    if (existing) existing.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'order-confirmation-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Format date
    const orderDate = new Date(order.date);
    const dateFormatted = orderDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    overlay.innerHTML = `
        <div class="order-confirmation-modal" style="
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.8);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        ">
            <!-- Success animation -->
            <div class="confirmation-checkmark" style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #28a745, #20c997);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                transform: scale(0);
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ">
                <i class="fas fa-check" style="color: white; font-size: 36px;"></i>
            </div>
            
            <h2 style="margin: 0 0 8px; color: #28a745; font-size: 1.5em;">Order Confirmed! 🎉</h2>
            <p style="color: #666; margin: 0 0 20px; font-size: 0.95em;">Thank you for your purchase, ${order.customer.firstName}!</p>
            
            <div style="
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                text-align: left;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                ">
                    <span style="color: #666;">Order ID</span>
                    <span style="font-weight: 600; color: #333; font-family: monospace;">${order.id}</span>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                ">
                    <span style="color: #666;">Date</span>
                    <span style="color: #333;">${dateFormatted}</span>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                ">
                    <span style="color: #666;">Items</span>
                    <span style="color: #333;">${order.items.length} item(s)</span>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                ">
                    <span style="color: #666;">Shipping</span>
                    <span style="color: #333;">${order.shippingMethod}</span>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                ">
                    <span style="color: #666;">Total Paid</span>
                    <span style="font-weight: 700; color: #28a745; font-size: 1.1em;">$${order.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="
                background: #fff3cd;
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 20px;
                text-align: left;
                font-size: 0.85em;
                color: #856404;
            ">
                <i class="fas fa-info-circle"></i> A confirmation email has been sent to <strong>${order.customer.email}</strong>
            </div>
            
            <button class=\"btn btn-primary\" onclick=\"window.location.href='order-confirmed.html'\" style=\"
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 1em;
                cursor: pointer;
                transition: background 0.2s;
                width: 100%;
            ">
                <i class="fas fa-check-circle"></i> Continue Shopping
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        const checkmark = overlay.querySelector('.confirmation-checkmark');
        const modal = overlay.querySelector('.order-confirmation-modal');
        if (checkmark) checkmark.style.transform = 'scale(1)';
        if (modal) modal.style.transform = 'scale(1)';
    }, 50);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOrderConfirmation();
        }
    });
}

// Close order confirmation modal
window.closeOrderConfirmation = function() {
    const overlay = document.querySelector('.order-confirmation-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        const modal = overlay.querySelector('.order-confirmation-modal');
        if (modal) modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            // Redirect to index
            window.location.href = 'index.html';
        }, 300);
    }
};

// loadOrderHistory() — 加载最近订单
function loadOrderHistory() {
    try {
        const saved = localStorage.getItem('shopEasyOrders');
        if (!saved) return [];
        const orders = JSON.parse(saved);
        if (!Array.isArray(orders)) return [];
        return orders;
    } catch(e) {
        console.log('Could not load order history');
        return [];
    }
}

// Show notification on checkout page
function showCheckoutNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.checkout-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'checkout-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.background = '#dc3545';
    } else {
        notification.style.background = '#28a745';
    }
    
    notification.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Save the last completed order data for order-confirmed.html
 */
function saveLastOrder(order) {
    try {
        var shippingData = {
            email: order.customer.email,
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            address: order.customer.address,
            city: order.customer.city,
            zip: order.customer.zip,
            country: order.customer.country
        };
        
        var orderData = {
            orderId: order.id,
            total: '$' + order.total.toFixed(2),
            items: order.items.map(function(item) {
                return { name: item.name, quantity: item.quantity, price: '$' + (item.price * item.quantity).toFixed(2) };
            }),
            shipping: shippingData
        };
        
        localStorage.setItem('shopeasy_last_order', JSON.stringify(orderData));
        sessionStorage.setItem('shopeasy_last_order', JSON.stringify(orderData));
        console.log('Last order saved for confirmation page:', order.id);
    } catch(e) {
        console.log('Could not save last order data');
    }
}
