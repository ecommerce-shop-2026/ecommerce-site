/**
 * PayPal Integration Module for ShopEasy
 * 
 * Handles PayPal payment via the client-side JavaScript SDK.
 * No backend required — works entirely on static GitHub Pages hosting.
 * 
 * Dependencies: PayPal SDK (loaded in payment.html)
 */

(function() {
    'use strict';

    const PAYPAL_CLIENT_ID = 'EGio8dplZepKFlO-dHw3xMrGx9eKu9VI2u9hbJ4UNsRalbiUvzUF7B1zsyE-kWlbz-LH6TV28F3dmPvD';

    var paypalScriptLoaded = false;
    var paypalButtonsRendered = false;

    /**
     * Load PayPal SDK script dynamically
     */
    function loadPayPalSDK(currency) {
        return new Promise(function(resolve, reject) {
            if (paypalScriptLoaded && typeof paypal !== 'undefined') {
                resolve();
                return;
            }

            var script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=' + PAYPAL_CLIENT_ID +
                '&currency=' + (currency || 'USD') +
                '&intent=capture';
            script.onload = function() {
                paypalScriptLoaded = true;
                console.log('PayPal SDK loaded');
                resolve();
            };
            script.onerror = function() {
                console.error('Failed to load PayPal SDK');
                reject(new Error('PayPal SDK failed to load'));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Render PayPal buttons in the specified container
     * @param {string} containerId - DOM element ID for the button container
     * @param {object} orderData - { total, currency, items, orderDescription }
     * @param {function} onSuccess - Callback(orderResult) on successful payment
     * @param {function} onError - Callback(error) on payment failure
     */
    window.renderPayPalButton = function(containerId, orderData, onSuccess, onError) {
        var container = document.getElementById(containerId);
        if (!container) {
            console.error('PayPal container #' + containerId + ' not found');
            return;
        }

        if (paypalButtonsRendered) {
            // Already rendered, just show the container
            container.style.display = 'block';
            return;
        }

        var currency = orderData.currency || 'USD';
        var total = orderData.total || 0;

        if (total <= 0) {
            console.warn('PayPal: order total is $0, cannot render buttons');
            if (onError) onError(new Error('Cart is empty'));
            return;
        }

        loadPayPalSDK(currency).then(function() {
            container.style.display = 'block';

            // Clear any previous buttons
            container.innerHTML = '';

            paypal.Buttons({

                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },

                // Create the order on PayPal
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            description: orderData.orderDescription || 'ShopEasy Order',
                            amount: {
                                currency_code: currency,
                                value: total.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: currency,
                                        value: (orderData.subtotal || total).toFixed(2)
                                    },
                                    shipping: {
                                        currency_code: currency,
                                        value: (orderData.shipping || 0).toFixed(2)
                                    },
                                    tax_total: {
                                        currency_code: currency,
                                        value: (orderData.tax || 0).toFixed(2)
                                    }
                                }
                            },
                            items: (orderData.items || []).map(function(item, i) {
                                return {
                                    name: item.name || ('Item ' + (i + 1)),
                                    quantity: String(item.quantity || 1),
                                    unit_amount: {
                                        currency_code: currency,
                                        value: (item.price || 0).toFixed(2)
                                    }
                                };
                            })
                        }]
                    });
                },

                // Finalize the transaction after buyer approval
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        console.log('PayPal payment captured:', details);

                        // Mark PayPal buttons as rendered so we don't re-render
                        paypalButtonsRendered = true;

                        // Hide the button container
                        container.style.display = 'none';

                        var result = {
                            orderID: data.orderID,
                            payerID: details.payer ? details.payer.payer_id : '',
                            payerName: (details.payer && details.payer.name) ?
                                details.payer.name.given_name + ' ' + details.payer.name.surname :
                                '',
                            payerEmail: details.payer ? details.payer.email : '',
                            status: details.status || 'COMPLETED',
                            method: 'paypal'
                        };

                        if (onSuccess) onSuccess(result);
                    });
                },

                // Handle errors
                onError: function(err) {
                    console.error('PayPal error:', err);
                    if (onError) onError(err);
                },

                // Buyer cancelled the PayPal popup
                onCancel: function(data) {
                    console.log('PayPal payment cancelled by user');
                    if (onError) onError(new Error('Payment cancelled'));
                }

            }).render('#' + containerId);

            paypalButtonsRendered = true;
            console.log('PayPal buttons rendered in #' + containerId);

        }).catch(function(err) {
            console.error('PayPal setup failed:', err);
            if (onError) onError(err);
        });
    };

    /**
     * Hide PayPal buttons (e.g., when switching back to credit card)
     */
    window.hidePayPalButton = function(containerId) {
        var container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
        }
    };

    /**
     * Reset PayPal state (when switching payment methods)
     */
    window.resetPayPal = function(containerId) {
        paypalButtonsRendered = false;
        var container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    };

})();
