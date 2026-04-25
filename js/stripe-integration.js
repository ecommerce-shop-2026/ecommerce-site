/**
 * Stripe Payment Integration for ShopEasy
 * 
 * This handles real payment processing using Stripe Checkout.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Stripe account at https://dashboard.stripe.com/register
 * 2. Get your Publishable Key (pk_live_...) from Stripe Dashboard
 * 3. Create a Price ID for each product in Stripe Dashboard (Products > Add Product)
 * 4. Update the STRIPE_CONFIG.PRICE_MAP below with your actual Price IDs
 * 5. For the backend: deploy the api/create-checkout-session.js to your server
 * 
 * ALTERNATIVE: For test mode, create a Payment Link in Stripe Dashboard
 * and update STRIPE_CONFIG.PAYMENT_LINK below.
 */

const STRIPE_CONFIG = {
    // === REPLACE THESE WITH YOUR ACTUAL STRIPE KEYS ===
    // Get from https://dashboard.stripe.com/test/apikeys (test mode)
    // or https://dashboard.stripe.com/apikeys (live mode)
    PUBLISHABLE_KEY: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
    
    // === OPTION A: Stripe Payment Link (Easiest - no backend needed) ===
    // Create at https://dashboard.stripe.com/payment-links
    // After creating a payment link for your main product, paste the URL here
    PAYMENT_LINK: null, // e.g. 'https://buy.stripe.com/test_XXXXXXXX'
    
    // === OPTION B: Price IDs (needs a small backend) ===
    // Map your product IDs to Stripe Price IDs
    // Create at: https://dashboard.stripe.com/test/products
    PRICE_MAP: {
        // 'local_product_id': 'price_stripe_id'
        // Example:
        // 1: 'price_1ABC123DEF456',
        // 2: 'price_1ABC789GHI012',
    },
    
    // Backend endpoint for creating checkout sessions
    // Deploy api/create-checkout-session.js to your server
    API_ENDPOINT: '/api/create-checkout-session',
    
    // Currency
    CURRENCY: 'usd',
    
    // Success & Cancel URLs (auto-detected from current page)
    SUCCESS_URL: window.location.origin + '/payment.html?payment=success',
    CANCEL_URL: window.location.origin + '/payment.html?payment=cancelled'
};

// Check if Stripe is loaded
function isStripeReady() {
    return typeof Stripe !== 'undefined';
}

// Initialize Stripe
function initStripe() {
    if (!STRIPE_CONFIG.PUBLISHABLE_KEY || 
        STRIPE_CONFIG.PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY')) {
        console.warn('⚠️ Stripe not configured. Update STRIPE_CONFIG.PUBLISHABLE_KEY in stripe-integration.js');
        return null;
    }
    try {
        return Stripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
    } catch (e) {
        console.error('Failed to initialize Stripe:', e);
        return null;
    }
}

/**
 * Process payment with Stripe
 * @param {Object} cartData - { items: [{id, name, price, quantity}], total, count }
 * @param {Object} customerInfo - { email, firstName, lastName, address, city, zip, country }
 * @returns {Promise<boolean>} - true if redirected to Stripe
 */
async function processStripePayment(cartData, customerInfo) {
    // Check configuration
    if (!STRIPE_CONFIG.PUBLISHABLE_KEY || 
        STRIPE_CONFIG.PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY')) {
        console.log('Stripe not configured, falling back to local payment');
        return false;
    }
    
    // Option A: Use Payment Link (simplest)
    if (STRIPE_CONFIG.PAYMENT_LINK) {
        // Store cart data in sessionStorage for order creation after redirect
        sessionStorage.setItem('shopEasyPendingOrder', JSON.stringify({
            cart: cartData,
            customer: customerInfo,
            timestamp: Date.now()
        }));
        window.location.href = STRIPE_CONFIG.PAYMENT_LINK;
        return true;
    }
    
    // Option B: Create Checkout Session via backend
    try {
        const stripe = initStripe();
        if (!stripe) return false;
        
        // Call our backend to create a Stripe Checkout Session
        const response = await fetch(STRIPE_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cartData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                customer: customerInfo,
                success_url: window.location.origin + '/payment.html?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: window.location.origin + '/payment.html?payment=cancelled'
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        return true;
    } catch (e) {
        console.error('Stripe payment failed:', e);
        showCheckoutNotification('Payment system error. Please try again.', 'error');
        return false;
    }
}

// Handle Stripe redirect back (payment success)
function handleStripeReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Payment success
    if (urlParams.get('payment') === 'success' || urlParams.get('session_id')) {
        // Restore pending order data
        const pendingData = sessionStorage.getItem('shopEasyPendingOrder');
        if (pendingData) {
            try {
                const data = JSON.parse(pendingData);
                // Create local order record
                const now = new Date();
                const dateStr = now.getFullYear().toString() +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0');
                const randomStr = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
                const orderId = 'ORD-' + dateStr + '-' + randomStr;
                
                const order = {
                    id: orderId,
                    date: now.toISOString(),
                    items: data.cart.items,
                    subtotal: data.cart.total,
                    shipping: 0,
                    tax: data.cart.total * 0.08,
                    total: data.cart.total * 1.08,
                    status: 'Paid',
                    shippingMethod: 'Standard Shipping',
                    customer: data.customer,
                    payment: {
                        method: 'Stripe',
                        status: 'completed'
                    }
                };
                
                // Save order
                if (typeof saveOrder === 'function') {
                    saveOrder(order);
                } else {
                    // Fallback save
                    try {
                        let orders = JSON.parse(localStorage.getItem('shopEasyOrders') || '[]');
                        if (!Array.isArray(orders)) orders = [];
                        orders.unshift(order);
                        localStorage.setItem('shopEasyOrders', JSON.stringify(orders));
                    } catch(e) {}
                }
                
                // Clear cart
                if (typeof clearCart === 'function') clearCart();
                
                // Show confirmation
                if (typeof showOrderConfirmation === 'function') {
                    showOrderConfirmation(order);
                }
                
                // Clean up
                sessionStorage.removeItem('shopEasyPendingOrder');
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
            } catch(e) {
                console.error('Failed to process Stripe return:', e);
            }
        }
    }
    
    // Payment cancelled
    if (urlParams.get('payment') === 'cancelled') {
        showCheckoutNotification('Payment was cancelled.', 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
        // Re-enable pay button
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    handleStripeReturn();
});
