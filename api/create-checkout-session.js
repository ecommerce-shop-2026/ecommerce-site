/**
 * Stripe Create Checkout Session API
 * 
 * Deploy options:
 * 1. Cloudflare Pages Functions: place in /functions/api/create-checkout-session.js
 * 2. Netlify Functions: place in /netlify/functions/create-checkout-session.js
 * 3. Vercel Serverless: place in /api/create-checkout-session.js
 * 
 * Requirements:
 * 1. Set STRIPE_SECRET_KEY as environment variable in your deployment platform
 *    Get from: https://dashboard.stripe.com/test/apikeys (test: sk_test_...)
 *    or https://dashboard.stripe.com/apikeys (live: sk_live_...)
 * 
 * 2. Create products and prices in Stripe Dashboard:
 *    https://dashboard.stripe.com/test/products
 *    Then update PRICE_MAP in stripe-integration.js
 */

// Stripe secret key from environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function onRequest(context) {
    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
    
    // Only accept POST
    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Check if Stripe is configured
    if (!stripeSecretKey) {
        return new Response(JSON.stringify({ 
            error: 'Stripe not configured. Set STRIPE_SECRET_KEY environment variable.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const { items, customer, success_url, cancel_url } = await context.request.json();
        
        // Build line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
        }));
        
        // Create Stripe Checkout Session
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[]': 'card',
                'mode': 'payment',
                'success_url': success_url,
                'cancel_url': cancel_url,
                'customer_email': customer.email,
                ...lineItems.reduce((acc, item, i) => {
                    acc[`line_items[${i}][price_data][currency]`] = item.price_data.currency;
                    acc[`line_items[${i}][price_data][product_data][name]`] = item.price_data.product_data.name;
                    acc[`line_items[${i}][price_data][unit_amount]`] = item.price_data.unit_amount;
                    acc[`line_items[${i}][quantity]`] = item.quantity;
                    return acc;
                }, {})
            })
        });
        
        const session = await response.json();
        
        if (!response.ok) {
            throw new Error(session.error?.message || 'Failed to create session');
        }
        
        return new Response(JSON.stringify({ id: session.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
