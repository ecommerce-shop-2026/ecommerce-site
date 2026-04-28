<?php
require_once('/var/www/html/wp-load.php');

// 1. Create shipping zone: International (everywhere)
$zone = new WC_Shipping_Zone();
$zone->set_zone_name('International');
$zone->set_zone_locations(array(
    array(
        'code' => '',
        'type' => 'continent'
    )
));
$zone_id = $zone->save();
echo "Created International shipping zone (ID: $zone_id)\n";

// 2. Add Free Shipping method (over $99)
$free_shipping = $zone->add_shipping_method('free_shipping');
$free_settings = get_option('woocommerce_free_shipping_' . $free_shipping . '_settings', array());
$free_settings['title'] = 'Free International Shipping';
$free_settings['requires'] = 'min_amount';
$free_settings['min_amount'] = '99';
update_option('woocommerce_free_shipping_' . $free_shipping . '_settings', $free_settings);
echo "Added Free Shipping method (ID: $free_shipping)\n";

// 3. Add Flat Rate for express
$flat_rate = $zone->add_shipping_method('flat_rate');
$flat_settings = get_option('woocommerce_flat_rate_' . $flat_rate . '_settings', array());
$flat_settings['title'] = 'Express Shipping (5-10 days)';
$flat_settings['cost'] = '12.99';
update_option('woocommerce_flat_rate_' . $flat_rate . '_settings', $flat_settings);
echo "Added Flat Rate method (ID: $flat_rate)\n";

// 4. Set WooCommerce general settings
update_option('woocommerce_store_address', 'Room 1201, Tower A, SOHO Modern');
update_option('woocommerce_store_address_2', 'Guangzhou');
update_option('woocommerce_store_city', 'Guangzhou');
update_option('woocommerce_store_postcode', '510000');
update_option('woocommerce_default_country', 'CN');
update_option('woocommerce_currency', 'USD');
update_option('woocommerce_currency_pos', 'left');
update_option('woocommerce_price_thousand_sep', ',');
update_option('woocommerce_price_decimal_sep', '.');
update_option('woocommerce_weight_unit', 'kg');
update_option('woocommerce_dimension_unit', 'cm');
echo "WooCommerce general settings updated\n";

// 5. Enable guest checkout
update_option('woocommerce_enable_guest_checkout', 'yes');
update_option('woocommerce_enable_checkout_login_reminder', 'no');
update_option('woocommerce_enable_signup_and_login_from_checkout', 'yes');
echo "Checkout settings updated\n";

// 6. Set payment methods
update_option('woocommerce_paypal_settings', array(
    'enabled' => 'yes',
    'title' => 'PayPal',
    'description' => 'Pay via PayPal; you can pay with your credit card if you don\'t have a PayPal account.',
    'email' => 'admin@haitao-store.com',
    'advanced' => array(
        'enable_ipn' => 'yes',
    )
));
echo "Payment methods configured\n";

echo "\nShipping and store setup complete!\n";
