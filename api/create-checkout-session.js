/**
 * Stripe Create Checkout Session API
 * 
 * Deploy as a Cloudflare Pages Function.
 * 
 * INSTALLATION:
 * 1. Place in: /functions/api/create-checkout-session.js
 *    (or keep in /api/ if your Pages build config points to root)
 * 
 * 2. Set environment variable in Cloudflare Dashboard:
 *    Name: STRIPE_SECRET_KEY
 *    Value: sk_test_XXXXXXXXXXXXXX (test) or sk_live_XXXXXXXXXXXXXX (live)
 *    Get from: https://dashboard.stripe.com/apikeys
 * 
 * 3. Deploy to Cloudflare Pages — auto-detected as a Function
 */

// Stripe secret key from environment variable
const STRIPE_SECRET_KEY = typeof process !== 'undefined' && process.env
    ? process.env.STRIPE_SECRET_KEY
    : undefined;

/**
 * Cloudflare Pages onRequest handler
 * 
 * Called when a POST request hits /api/create-checkout-session
 * 
 * @param {Object} context - Cloudflare Pages Function context
 * @returns {Response} JSON response with session ID or error
 */
export async function onRequest(context) {
    const { request } = context;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            }
        });
    }

    // Only accept POST
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check if Stripe is configured
    if (!STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ 
            error: 'Stripe not configured. Set STRIPE_SECRET_KEY environment variable in Cloudflare Pages dashboard.',
            hint: 'Go to Cloudflare Dashboard > Pages > your-project > Settings > Environment Variables > Add variable > Name: STRIPE_SECRET_KEY, Value: sk_test_...'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }

    try {
        const body = await request.json();
        const { items, customer, success_url, cancel_url } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return new Response(JSON.stringify({ error: 'No items provided' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Build line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.id ? `Product #${item.id}` : undefined,
                },
                unit_amount: Math.round(parseFloat(item.price) * 100), // Stripe uses cents
            },
            quantity: parseInt(item.quantity) || 1,
        }));

        // Build URL-encoded body for Stripe API
        const params = new URLSearchParams();
        params.append('payment_method_types[]', 'card');
        params.append('mode', 'payment');
        params.append('success_url', success_url || (request.url.split('/api/')[0] + '/payment.html?payment=success'));
        params.append('cancel_url', cancel_url || (request.url.split('/api/')[0] + '/payment.html?payment=cancelled'));

        if (customer && customer.email) {
            params.append('customer_email', customer.email);
        }

        lineItems.forEach((item, i) => {
            params.append(`line_items[${i}][price_data][currency]`, item.price_data.currency);
            params.append(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
            params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
            params.append(`line_items[${i}][quantity]`, String(item.quantity));
        });

        // Call Stripe API
        const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        const session = await stripeResponse.json();

        if (!stripeResponse.ok) {
            throw new Error(session.error?.message || `Stripe API error (${stripeResponse.status})`);
        }

        return new Response(JSON.stringify({ id: session.id, url: session.url }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}
