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
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.substring(0, 19);
        });
    }
    
    // Expiry date formatting
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
});

// Load order summary from cart-system.js data
function loadOrderSummary() {
    const cartData = (typeof window.cart !== 'undefined' && window.cart.items) 
        ? window.cart : { items: [], total: 0, count: 0 };
    
    const orderItems = document.querySelector('.order-items');
    const subtotalEl = document.querySelector('.subtotal');
    const totalEl = document.querySelector('.total');
    
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
    
    // Update totals
    if (subtotalEl) subtotalEl.textContent = `$${cartData.total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${cartData.total.toFixed(2)}`;
    
    // Update cart count in nav
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = cartData.count;
    });
}

// Process payment
function processPayment() {
    // Validate form fields
    const email = document.getElementById('email');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');
    const country = document.getElementById('country');
    const cardNum = document.getElementById('cardNumber');
    
    // Basic validation
    if (!email.value || !email.value.includes('@')) {
        showCheckoutNotification('Please enter a valid email address', 'error');
        email.focus();
        return;
    }
    
    if (!firstName.value || !lastName.value) {
        showCheckoutNotification('Please enter your full name', 'error');
        firstName.focus();
        return;
    }
    
    if (!address.value || !city.value || !zip.value || !country.value) {
        showCheckoutNotification('Please fill in all shipping fields', 'error');
        return;
    }
    
    // Check cart is not empty
    const cartData = (typeof window.cart !== 'undefined' && window.cart.items) 
        ? window.cart : { items: [], total: 0, count: 0 };
    
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
    
    // Simulate payment processing
    setTimeout(function() {
        // Payment successful
        showCheckoutNotification('Payment successful! Order confirmed. 🎉', 'success');
        
        // Clear cart
        if (typeof window.cart !== 'undefined') {
            window.cart.items = [];
            window.cart.count = 0;
            window.cart.total = 0;
            try {
                localStorage.setItem('shopEasyCart', JSON.stringify(window.cart));
            } catch(e) {}
        }
        
        // Reset button
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-check-circle"></i> Order Confirmed';
            payButton.classList.add('btn-success');
        }
        
        // Reload order summary to show empty cart
        loadOrderSummary();
        
        // Show confirmation
        setTimeout(function() {
            alert(`Order confirmed!\n\nThank you for your purchase, ${firstName.value} ${lastName.value}!\n\nA confirmation email will be sent to ${email.value}`);
        }, 500);
        
    }, 2000);
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
