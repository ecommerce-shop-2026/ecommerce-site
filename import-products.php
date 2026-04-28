<?php
require_once('/var/www/html/wp-load.php');

$products = [
    ['sku' => 'RH001', 'name' => 'Wireless Bluetooth Earbuds 5.3', 'regular_price' => 39.99, 'sale_price' => 29.99, 'weight' => 0.08, 'length' => 6.5, 'width' => 5, 'height' => 3, 'category' => 17, 'desc' => 'High-quality wireless Bluetooth 5.3 earbuds with noise cancellation and 48h battery life.'],
    ['sku' => 'RH002', 'name' => 'Portable Power Bank 20000mAh', 'regular_price' => 49.99, 'sale_price' => 39.99, 'weight' => 0.35, 'length' => 14, 'width' => 7, 'height' => 2, 'category' => 18, 'desc' => 'Ultra-slim 20000mAh power bank with dual USB-C and Lightning ports. Fast charging support PD 65W.'],
    ['sku' => 'RH003', 'name' => 'Smart LED Desk Lamp with Touch Control', 'regular_price' => 34.99, 'sale_price' => 27.99, 'weight' => 0.6, 'length' => 42, 'width' => 18, 'height' => 5, 'category' => 25, 'desc' => 'Eye-care LED desk lamp with 3 color temperatures and 7 brightness levels. USB charging port built-in.'],
    ['sku' => 'RH004', 'name' => 'AI Smart Translator Device', 'regular_price' => 89.99, 'sale_price' => 73.99, 'weight' => 0.12, 'length' => 11, 'width' => 5.5, 'height' => 1.2, 'category' => 20, 'desc' => 'Pocket-sized AI translator supporting 137 languages. Offline translation for 8 major languages.'],
    ['sku' => 'RH005', 'name' => 'TWS Gaming Earbuds Low Latency', 'regular_price' => 44.99, 'sale_price' => 34.99, 'weight' => 0.06, 'length' => 6, 'width' => 5, 'height' => 2.8, 'category' => 17, 'desc' => 'Professional gaming earbuds with 35ms ultra-low latency. RGB lighting, ENC noise reduction, 30h battery.'],
    ['sku' => 'RH006', 'name' => 'Smart Fitness Tracker Watch', 'regular_price' => 59.99, 'sale_price' => 49.99, 'weight' => 0.04, 'length' => 4.5, 'width' => 4, 'height' => 1, 'category' => 27, 'desc' => 'Color AMOLED display fitness tracker with heart rate, blood oxygen, sleep monitoring. IP68 waterproof.'],
    ['sku' => 'RH007', 'name' => 'USB-C Hub 7-in-1 Multi Port Adapter', 'regular_price' => 25.99, 'sale_price' => 19.99, 'weight' => 0.06, 'length' => 12, 'width' => 3, 'height' => 1, 'category' => 19, 'desc' => '7-in-1 USB-C hub with HDMI 4K@60Hz, PD 100W, SD/TF reader, USB3.0 x3. Aluminum alloy body.'],
    ['sku' => 'RH008', 'name' => 'Portable Electric Kettle 500ml', 'regular_price' => 32.99, 'sale_price' => 25.99, 'weight' => 0.35, 'length' => 16, 'width' => 13, 'height' => 8, 'category' => 23, 'desc' => 'Collapsible silicone electric travel kettle. 500ml capacity, 100-240V dual voltage. Auto shut-off.'],
    ['sku' => 'RH009', 'name' => 'Wireless Charging Pad 3-in-1', 'regular_price' => 39.99, 'sale_price' => 31.99, 'weight' => 0.15, 'length' => 20, 'width' => 10, 'height' => 1.5, 'category' => 19, 'desc' => '3-in-1 wireless charging station for iPhone/Apple Watch/AirPods. 15W fast charge. Foldable design.'],
    ['sku' => 'RH010', 'name' => 'Bamboo Phone Stand Adjustable', 'regular_price' => 12.99, 'sale_price' => 9.99, 'weight' => 0.08, 'length' => 12, 'width' => 8, 'height' => 1, 'category' => 25, 'desc' => 'Natural bamboo adjustable phone stand. Compatible with all phones and tablets. Eco-friendly.'],
    ['sku' => 'RH011', 'name' => 'Smart Home Security Camera 2K', 'regular_price' => 45.99, 'sale_price' => 36.99, 'weight' => 0.22, 'length' => 8, 'width' => 6, 'height' => 6, 'category' => 21, 'desc' => '2K resolution indoor security camera with night vision, motion detection, two-way audio.'],
    ['sku' => 'RH012', 'name' => 'Fashion Silk Scarf 100% Mulberry', 'regular_price' => 68.99, 'sale_price' => 52.99, 'weight' => 0.08, 'length' => 25, 'width' => 18, 'height' => 1, 'category' => 28, 'desc' => 'Handmade 100% mulberry silk scarf. Various traditional Chinese patterns. 90x90cm. Luxury gift box.'],
    ['sku' => 'RH013', 'name' => 'Ceramic Tea Set Traditional Chinese', 'regular_price' => 79.99, 'sale_price' => 59.99, 'weight' => 1.5, 'length' => 30, 'width' => 20, 'height' => 15, 'category' => 24, 'desc' => 'Handcrafted traditional Chinese Yixing clay tea set. Includes teapot + 4 cups + tea tray.'],
    ['sku' => 'RH014', 'name' => 'Memory Foam Travel Pillow', 'regular_price' => 29.99, 'sale_price' => 22.99, 'weight' => 0.3, 'length' => 12, 'width' => 10, 'height' => 8, 'category' => 29, 'desc' => 'Memory foam travel pillow with cooling gel layer. Ergonomic neck support. Includes compression bag.'],
    ['sku' => 'RH015', 'name' => 'LED Grow Light for Indoor Plants', 'regular_price' => 36.99, 'sale_price' => 28.99, 'weight' => 0.5, 'length' => 25, 'width' => 15, 'height' => 5, 'category' => 26, 'desc' => 'Full spectrum LED grow light for indoor plants. 4 adjustable heads, timer function, 10 dimming levels.'],
];

$count = 0;
foreach ($products as $data) {
    $existing_id = wc_get_product_id_by_sku($data['sku']);
    if ($existing_id) {
        echo "SKU {$data['sku']} already exists (ID: $existing_id), skipping\n";
        continue;
    }
    
    $product = new WC_Product_Simple();
    $product->set_name($data['name']);
    $product->set_slug(sanitize_title($data['sku'] . '-' . $data['name']));
    $product->set_sku($data['sku']);
    $product->set_regular_price($data['regular_price']);
    $product->set_sale_price($data['sale_price']);
    $product->set_description($data['desc']);
    $product->set_weight($data['weight']);
    $product->set_length($data['length']);
    $product->set_width($data['width']);
    $product->set_height($data['height']);
    $product->set_category_ids([$data['category']]);
    $product->set_manage_stock(true);
    $product->set_stock_quantity(100);
    $product->set_stock_status('instock');
    $product->set_catalog_visibility('visible');
    
    $id = $product->save();
    echo "Created product: {$data['sku']} - {$data['name']} (ID: $id)\n";
    $count++;
}

echo "\nTotal imported: $count products\n";
