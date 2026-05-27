/**
 * Stripe Payment Integration for ShopEasy
 * 
 * Handles real payment processing using Stripe Checkout Sessions.
 * 
 * ===== SETUP INSTRUCTIONS =====
 * 1. Create a Stripe account: https://dashboard.stripe.com/register
 * 2. Get your keys from: https://dashboard.stripe.com/apikeys
 * 3. Deploy api/create-checkout-session.js to Cloudflare Pages:
 *    - Place in /functions/api/create-checkout-session.js
 *    - Set env var STRIPE_SECRET_KEY = sk_live_...
 * 4. Set STRIPE_CONFIG.PUBLISHABLE_KEY below
 * 5. Set STRIPE_CONFIG.API_ENDPOINT to your deployed function URL
 * 
 * ===== TEST MODE =====
 * Use test keys (see Stripe docs) to test without real charges.
 * Test card: 4242 4242 4242 4242 (any expiry/CVC)
 */

const STRIPE_CONFIG = {
    // === STEP 1: Replace with your Stripe Publishable Key ===
    // Test: replace with your publishable key (starts with pk_)
    PUBLISHABLE_KEY: null, // <--- Replace with your Stripe publishable key

    // === STEP 2: Set your deployed API endpoint ===
    // Cloudflare Pages: '/api/create-checkout-session' (same domain, auto)
    // After deploying to your custom domain, just leave this as-is
    API_ENDPOINT: '/api/create-checkout-session',

    // === OPTIONAL: Stripe Payment Link (backup method, no backend needed) ===
    // Create at: https://dashboard.stripe.com/payment-links
    // If set AND the API endpoint fails, this will be used as fallback
    PAYMENT_LINK: null, // e.g. 'https://buy.stripe.com/test_XXXXXXXX'

    // Currency
    CURRENCY: 'usd',

    // URLs
    SUCCESS_URL: window.location.origin + '/payment.html?payment=success',
    CANCEL_URL: window.location.origin + '/payment.html?payment=cancelled'
};

/**
 * Check if the Stripe.js SDK is loaded
 */
function isStripeReady() {
    return typeof Stripe !== 'undefined';
}

/**
 * Initialize Stripe instance
 */
function initStripe() {
    if (!STRIPE_CONFIG.PUBLISHABLE_KEY ||
        typeof STRIPE_CONFIG.PUBLISHABLE_KEY !== 'string') {
        console.warn('⚠️ Stripe not configured. Set PUBLISHABLE_KEY in stripe-integration.js');
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
 * Is Stripe properly configured?
 */
function isStripeConfigured() {
    return STRIPE_CONFIG.PUBLISHABLE_KEY &&
        typeof STRIPE_CONFIG.PUBLISHABLE_KEY === 'string';
}

/**
 * Process payment via Stripe Checkout Session
 * @param {Object} cartData - { items: [{id, name, price, quantity}], total, count }
 * @param {Object} customerInfo - { email, firstName, lastName, address, city, zip, country }
 * @returns {Promise<Object>} - { success, method } — method is 'stripe', 'payment_link', or 'local'
 */
async function processStripePayment(cartData, customerInfo) {
    if (!isStripeConfigured()) {
        console.log('Stripe not configured, falling back to local demo payment');
        return { success: false, method: 'local' };
    }

    // Option A: Payment Link (simplest, no backend needed)
    if (STRIPE_CONFIG.PAYMENT_LINK) {
        sessionStorage.setItem('shopEasyPendingOrder', JSON.stringify({
            cart: cartData,
            customer: customerInfo,
            timestamp: Date.now()
        }));
        window.location.href = STRIPE_CONFIG.PAYMENT_LINK;
        return { success: true, method: 'payment_link' };
    }

    // Option B: Checkout Session via backend API
    try {
        const stripe = initStripe();
        if (!stripe) return { success: false, method: 'local' };

        const response = await fetch(STRIPE_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cartData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                customer: customerInfo,
                success_url: window.location.origin + '/payment.html?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: STRIPE_CONFIG.CANCEL_URL
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return { success: true, method: 'stripe' };
    } catch (e) {
        console.error('Stripe payment failed:', e);
        return { success: false, method: 'local', error: e.message };
    }
}

/**
 * Handle Stripe redirect back (payment success or cancelled)
 * Called on payment.html load — checks URL params
 */
function handleStripeReturn() {
    const urlParams = new URLSearchParams(window.location.search);

    // Payment success
    if (urlParams.get('payment') === 'success' || urlParams.get('session_id')) {
        const pendingData = sessionStorage.getItem('shopEasyPendingOrder');
        if (pendingData) {
            try {
                const data = JSON.parse(pendingData);
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

                if (typeof saveOrder === 'function') {
                    saveOrder(order);
                } else {
                    try {
                        let orders = JSON.parse(localStorage.getItem('shopEasyOrders') || '[]');
                        if (!Array.isArray(orders)) orders = [];
                        orders.unshift(order);
                        localStorage.setItem('shopEasyOrders', JSON.stringify(orders));
                    } catch (e) { /* ignore */ }
                }

                if (typeof window.clearCart === 'function') window.clearCart();
                if (typeof showOrderConfirmation === 'function') {
                    showOrderConfirmation(order);
                }

                sessionStorage.removeItem('shopEasyPendingOrder');
                window.history.replaceState({}, document.title, window.location.pathname);

            } catch (e) {
                console.error('Failed to process Stripe return:', e);
            }
        }
    }

    // Payment cancelled
    if (urlParams.get('payment') === 'cancelled') {
        if (typeof showCheckoutNotification === 'function') {
            showCheckoutNotification('Payment was cancelled.', 'error');
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
        }
    }
}

// Run on script load (not DOMContentLoaded — same pattern as cart-system.js)
// Stripe return handling reads URL params, which are available immediately
handleStripeReturn();
