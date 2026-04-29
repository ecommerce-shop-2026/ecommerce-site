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
    PUBLISHABLE_KEY: 'pk_test_TYooMQauvdEDq54NiTphI7jx', // Stripe public test key

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

/**
 * Show inline Stripe setup guide (triggered by clicking demo badge link)
 * Replaces the page content temporarily with setup instructions
 */
function showStripeGuide() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    
    var box = document.createElement('div');
    box.style.cssText = 'background:#1a1a2e;border:1px solid #FFD700;border-radius:12px;padding:28px;max-width:560px;width:100%;color:#FFF8DC;max-height:80vh;overflow-y:auto;';
    box.onclick = function(e) { e.stopPropagation(); };
    
    box.innerHTML = `
        <h3 style="color:#FFD700;margin:0 0 12px 0;">🔧 Enable Live Payments</h3>
        <div style="font-size:14px;line-height:1.7;">
        <p><b>✅ Stripe key is configured!</b><br>
        Publishable key is set. To process real payments, you need a backend server.</p>
        <p><b>Option 1: Deploy Cloudflare Pages Function (recommended)</b><br>
        → Create account at <a href="https://dash.cloudflare.com" target="_blank" style="color:#87CEEB;">cloudflare.com</a><br>
        → Set up Pages project linked to <code style="background:#333;padding:2px 6px;border-radius:4px;">ecommerce-shop-2026/ecommerce-site</code><br>
        → Go to Settings → Environment Variables → Add:<br>
        <code style="background:#333;padding:2px 6px;border-radius:4px;">STRIPE_SECRET_KEY</code> = <code style="background:#333;padding:2px 6px;border-radius:4px;">sk_test_...</code><br>
        → The <code style="background:#333;padding:2px 6px;border-radius:4px;">api/create-checkout-session.js</code> function auto-deploys</p>
        <p><b>Option 2: Use Stripe Payment Link (simplest)</b><br>
        → Go to <a href="https://dashboard.stripe.com/payment-links" target="_blank" style="color:#87CEEB;">dashboard.stripe.com/payment-links</a><br>
        → Create a Payment Link → Copy URL<br>
        → Set <code style="background:#333;padding:2px 6px;border-radius:4px;">PAYMENT_LINK</code> in <code style="background:#333;padding:2px 6px;border-radius:4px;">js/stripe-integration.js</code></p>
        <p><b>Need a Stripe account?</b><br>
        → <a href="https://dashboard.stripe.com/register" target="_blank" style="color:#87CEEB;">dashboard.stripe.com/register</a><br>
        → Then get keys at <a href="https://dashboard.stripe.com/apikeys" target="_blank" style="color:#87CEEB;">dashboard.stripe.com/apikeys</a></p>
        </div>
        <div style="margin-top:16px;padding:12px;background:#16213e;border-radius:8px;font-size:13px;color:#B8860B;">
        <b>💡 While testing:</b> Demo mode handles payments locally. Test with any card info.
        </div>
        <button onclick="this.closest(&quot;[style*='fixed']&quot;).remove()" style="margin-top:16px;width:100%;padding:10px;background:#FFD700;color:#1a1a2e;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Got it</button>
    `;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}
