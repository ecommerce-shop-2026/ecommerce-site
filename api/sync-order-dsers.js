/**
 * DSers Order Sync API Proxy (Cloudflare Pages Function)
 * 
 * Securely forwards orders to DSers Open API using your secret credentials.
 */

const DSERS_API_TOKEN = typeof process !== 'undefined' && process.env
    ? process.env.DSERS_API_TOKEN
    : undefined;

export async function onRequest(context) {
    const { request } = context;

    // Handle CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    if (!DSERS_API_TOKEN) {
        return new Response(JSON.stringify({ 
            error: 'DSers API not configured. Set DSERS_API_TOKEN in Cloudflare Dashboard.' 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const orderData = await request.json();

        // 1. Map site order to DSers API format
        // Ref: https://api.dsers.com/ (You'll need to adapt based on actual DSers API version)
        const dsersPayload = {
            order_number: orderData.order_id,
            shipping_address: {
                first_name: orderData.customer.firstName,
                last_name: orderData.customer.lastName,
                address1: orderData.customer.address,
                city: orderData.customer.city,
                zip: orderData.customer.zip,
                country_code: orderData.customer.country || 'US',
                phone: orderData.customer.phone
            },
            products: orderData.items.map(item => ({
                sku: item.sku,
                quantity: item.quantity
            }))
        };

        // 2. Forward to DSers
        const dsersResponse = await fetch('https://api.dsers.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DSERS_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dsersPayload)
        });

        const result = await dsersResponse.json();

        if (!dsersResponse.ok) {
            return new Response(JSON.stringify(result), { 
                status: dsersResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ 
            message: 'Order synced to DSers', 
            dsers_order_id: result.order_id 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
