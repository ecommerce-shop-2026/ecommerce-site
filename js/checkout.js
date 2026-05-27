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
    
    // Payment method switch — toggle between card form and PayPal
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.querySelector('.card-form');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handlePaymentMethodSwitch(this.value);
            // Update active label styling
            document.querySelectorAll('.payment-option').forEach(l => l.classList.remove('active'));
            this.closest('.payment-option').classList.add('active');
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
            const saved = localStorage.getItem('ShopEasyCart');
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

/**
 * Handle payment method switching — show/hide card form vs PayPal buttons
 */
function handlePaymentMethodSwitch(method) {
    var cardForm = document.querySelector('.card-form');
    var paypalContainer = document.getElementById('paypal-button-container');
    
    if (method === 'paypal') {
        // Hide card form, show PayPal
        if (cardForm) cardForm.style.display = 'none';
        
        // Get cart data for PayPal
        var cartData = getCartData();
        if (cartData.items.length === 0) {
            showCheckoutNotification('Your cart is empty. Add items before checkout.', 'error');
            // Switch back to card
            var cardRadio = document.querySelector('input[name="payment"][value="card"]');
            if (cardRadio) cardRadio.checked = true;
            handlePaymentMethodSwitch('card');
            return;
        }
        
        // Calculate totals
        var selectedShipping = document.querySelector('input[name="shipping"]:checked');
        var shippingCost = 0;
        var shippingLabel = 'Standard Shipping';
        if (selectedShipping) {
            switch (selectedShipping.value) {
                case 'express': shippingCost = 9.99; shippingLabel = 'Express Shipping'; break;
                case 'overnight': shippingCost = 19.99; shippingLabel = 'Overnight Shipping'; break;
            }
        }
        
        var subtotal = cartData.total || 0;
        var tax = subtotal * 0.08;
        var total = subtotal + shippingCost + tax;
        
        var paypalOrderData = {
            total: total,
            subtotal: subtotal,
            shipping: shippingCost,
            tax: tax,
            currency: 'USD',
            orderDescription: 'AeroPet Modern Order - ' + cartData.items.length + ' item(s)',
            items: cartData.items
        };
        
        // Render PayPal button
        if (typeof window.renderPayPalButton === 'function') {
            window.renderPayPalButton(
                'paypal-button-container',
                paypalOrderData,
                function onPayPalSuccess(result) {
                    // Payment successful — create order and redirect
                    completePayPalOrder(cartData, shippingCost, shippingLabel, subtotal, tax, total, result);
                },
                function onPayPalError(err) {
                    showCheckoutNotification('PayPal payment failed: ' + (err.message || 'Unknown error'), 'error');
                }
            );
        } else {
            showCheckoutNotification('PayPal is not available. Please choose another payment method.', 'error');
            // Switch back to card
            var cardRadio2 = document.querySelector('input[name="payment"][value="card"]');
            if (cardRadio2) { cardRadio2.checked = true; handlePaymentMethodSwitch('card'); }
        }
        
    } else {
        // Show card form, hide PayPal
        if (cardForm) cardForm.style.display = 'block';
        if (typeof window.hidePayPalButton === 'function') {
            window.hidePayPalButton('paypal-button-container');
        }
    }
}

/**
 * Complete PayPal order — save to localStorage and redirect
 */
function completePayPalOrder(cartData, shippingCost, shippingLabel, subtotal, tax, total, paypalResult) {
    var email = document.getElementById('email');
    var firstName = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var address = document.getElementById('address');
    var city = document.getElementById('city');
    var zip = document.getElementById('zip');
    var country = document.getElementById('country');
    
    // Build customer info
    var customer = {
        email: (email && email.value) || paypalResult.payerEmail || '',
        firstName: (firstName && firstName.value) || paypalResult.payerName.split(' ')[0] || '',
        lastName: (lastName && lastName.value) || paypalResult.payerName.split(' ').slice(1).join(' ') || '',
        address: (address && address.value) || '',
        city: (city && city.value) || '',
        zip: (zip && zip.value) || '',
        country: (country && country.value) || '',
        phone: ''
    };
    
    // Generate order ID
    var now = new Date();
    var dateStr = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    var randomStr = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    var orderId = 'ORD-' + dateStr + '-' + randomStr;
    
    var order = {
        id: orderId,
        date: now.toISOString(),
        items: cartData.items.map(function(item) { return Object.assign({}, item); }),
        subtotal: subtotal,
        shipping: shippingCost,
        tax: tax,
        total: total,
        status: 'Processing',
        shippingMethod: shippingLabel,
        customer: customer,
        payment: {
            method: 'PayPal',
            paypalOrderId: paypalResult.orderID,
            paypalPayerId: paypalResult.payerID
        }
    };
    
    // Save order
    // Save order
    saveOrder(order);
    saveLastOrder(order);
    
    // Sync to DSers
    if (typeof window.dsersIntegration !== 'undefined' && window.dsersIntegration.syncOrder) {
        window.dsersIntegration.syncOrder(order).then(function(r) {
            if (r.success) console.log('DSers synced:', r.dsers_order_id);
        }).catch(function(e) { console.warn('DSers sync:', e); });
    }
    
    // Show confirmation and redirect
    showCheckoutNotification('PayPal payment successful! Order confirmed.', 'success');
    showOrderConfirmation(order);
}

// Process payment
async function processPayment() {
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
    
    // Check if PayPal is selected — skip card validation
    var selectedPayment = document.querySelector('input[name="payment"]:checked');
    var isPayPal = selectedPayment && selectedPayment.value === 'paypal';
    
    // Run all validations (skip card fields for PayPal)
    const validations = [
        { field: email, name: 'Email' },
        { field: firstName, name: 'First Name' },
        { field: lastName, name: 'Last Name' },
        { field: address, name: 'Address' },
        { field: city, name: 'City' },
        { field: zip, name: 'ZIP Code' },
        { field: country, name: 'Country' }
    ];
    
    // Add card validations only for non-PayPal
    if (!isPayPal) {
        validations.push(
            { field: cardNum, name: 'Card Number' },
            { field: cardName, name: 'Name on Card' }
        );
    }
    
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
    
    // If PayPal is selected, the PayPal button handles payment — just validate shipping
    if (isPayPal) {
        showCheckoutNotification('Please click the PayPal button below to complete your payment', 'info');
        // Scroll to PayPal button
        var paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) paypalContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    
    // === TRY STRIPE PAYMENT FIRST (if configured) ===
    if (typeof processStripePayment === 'function') {
        const stripeResult = await processStripePayment(cartData, customer);
        
        // If Stripe redirects (Checkout Session or Payment Link), the user leaves this page
        // The function returns { method: 'stripe' | 'payment_link' } before redirect
        if (stripeResult.success) {
            return; // User is being redirected to Stripe — nothing more to do here
        }
        
        // Stripe fell back to local (not configured or error) — continue below
        console.log('Stripe indicated fallback to local payment:', stripeResult.method);
    }
    
    // === LOCAL SIMULATION (Stripe not configured / fallback) ===
    setTimeout(function() {
        // Payment successful — 生成订单号
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        const randomStr = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
        const orderId = 'ORD-' + dateStr + '-' + randomStr;
        
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
                last4: cardNum ? cardNum.value.replace(/\D/g, '').slice(-4) : '4242'
            }
        };
        
        // 保存订单历史到 localStorage
        saveOrder(order);
        
        // 保存到 shopeasy_last_order 供 order-confirmed.html 读取
        saveLastOrder(order);
        
        // 同步到 DSers（一件代发自动下单）
        if (typeof window.dsersIntegration !== 'undefined') {
            window.dsersIntegration.syncOrder(order).then(function(result) {
                if (result.success) {
                    console.log('✅ DSers order synced:', result.dsers_order_id);
                } else {
                    console.warn('⚠️ DSers sync failed:', result.error);
                }
            }).catch(function(err) {
                console.warn('⚠️ DSers sync error:', err);
            });
        }
        
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
        
        // Show order confirmation弹窗
        showOrderConfirmation(order);
        
        // Also show the notification
        showCheckoutNotification('Payment successful! Order confirmed. 🎉', 'success');
        
    }, 2000);
}

// 保存订单到 localStorage
function saveOrder(order) {
    try {
        let orders = [];
        const saved = localStorage.getItem('ShopEasyOrders');
        if (saved) {
            try {
                orders = JSON.parse(saved);
                if (!Array.isArray(orders)) orders = [];
            } catch(e) { orders = []; }
        }
        orders.unshift(order);
        localStorage.setItem('ShopEasyOrders', JSON.stringify(orders));
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
            localStorage.setItem('ShopEasyCart', JSON.stringify(window.cart));
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
        const saved = localStorage.getItem('aeroPetOrders');
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

/**
 * Collect all data for a complete order
 */
window.collectOrderData = function(orderId = null) {
    const cartData = (window.cart && window.cart.items) ? window.cart : { items: [], total: 0 };
    
    // Get values from form
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');
    const country = document.getElementById('country');

    const customer = {
        email: email ? email.value : '',
        firstName: firstName ? firstName.value : '',
        lastName: lastName ? lastName.value : '',
        address: address ? address.value : '',
        city: city ? city.value : '',
        zip: zip ? zip.value : '',
        country: country ? country.value : ''
    };
    
    // Get shipping info
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    let shippingLabel = 'Standard Shipping';
    if (selectedShipping) {
        switch(selectedShipping.value) {
            case 'express': shippingLabel = 'Express Shipping'; break;
            case 'overnight': shippingLabel = 'Overnight Shipping'; break;
        }
    }

    return {
        id: orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer: customer,
        items: cartData.items || [],
        total: cartData.total || 0,
        shippingMethod: shippingLabel,
        timestamp: new Date().toISOString()
    };
};
