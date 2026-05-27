/**
 * DSers Order Synchronization Module
 * 
 * Handles pushing successful orders to DSers via the Open API.
 */

window.dsersIntegration = {
    /**
     * Sync a successful order to DSers and save locally for dashboard
     * @param {Object} order - The processed order object from cart/payment
     */
    async syncOrder(order) {
        console.log('📦 Attempting to sync order to DSers:', order.id);

        // 1. SAVE LOCALLY for Admin Dashboard
        try {
            const STORAGE_KEY = 'ShopEasyOrders';
            const existingOrders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            // Prevent duplicates
            if (!existingOrders.find(o => o.id === order.id)) {
                existingOrders.push(order);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(existingOrders));
                console.log('💾 Order saved locally to dashboard.');
            }
        } catch (e) {
            console.warn('Failed to save order locally:', e);
        }

        // 2. SYNC via API Proxy
        const DSERS_API_URL = '/api/sync-order-dsers';

        try {
            const response = await fetch(DSERS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: order.id,
                    customer: order.customer,
                    items: order.items.map(item => ({
                        sku: item.id, // Should match your DSers SKU/Product ID mapping
                        quantity: item.quantity,
                        price: item.price
                    })),
                    payment: order.payment,
                    shipping_method: order.shippingMethod || 'Standard Shipping'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Sync failed');
            }

            const result = await response.json();
            console.log('✅ DSers Sync Successful:', result);
            return { success: true, dsers_order_id: result.dsers_order_id };
        } catch (e) {
            console.error('❌ DSers Sync Error:', e.message);
            // We don't block the user if sync fails, but we log it
            return { success: false, error: e.message };
        }
    }
};
