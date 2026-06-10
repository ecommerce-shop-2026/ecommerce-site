     1|// Product Data with detailed specifications
     2|const products = [
     3|    {
     4|        id: 1,
     5|        name: "Wireless Bluetooth Headphones",
     6|        price: 89.99,
     7|        category: "Electronics",
     8|        rating: 4.5,
     9|        reviews: 128,
    10|        icon: "fas fa-headphones",
    11|        images: [
    12|            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    13|            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
    14|            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
    15|        ],
    16|        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    17|        specifications: {
    18|            brand: "AudioPro",
    19|            model: "AP-2024",
    20|            connectivity: "Bluetooth 5.2",
    21|            battery: "30 hours",
    22|            charging: "USB-C, Wireless",
    23|            weight: "250g",
    24|            features: ["Noise Cancellation", "Touch Controls", "Voice Assistant", "Foldable Design"]
    25|        },
    26|        features: [
    27|            "Active Noise Cancellation",
    28|            "30-hour battery life",
    29|            "Quick charge (5 min = 3 hours)",
    30|            "Hi-Res Audio support",
    31|            "Comfortable memory foam ear cups"
    32|        ]
    33|    },
    34|    {
    35|        id: 2,
    36|        name: "Smart Watch Series 5",
    37|        price: 249.99,
    38|        category: "Electronics",
    39|        rating: 4.8,
    40|        reviews: 256,
    41|        icon: "fas fa-clock",
    42|        images: [
    43|            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    44|            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
    45|            "https://images.unsplash.com/photo-1579586337278-3fecf0d6e8e7?w=600&h=600&fit=crop"
    46|        ],
    47|        description: "Advanced smartwatch with health monitoring, GPS, and LTE connectivity.",
    48|        specifications: {
    49|            brand: "TechWear",
    50|            model: "TW-S5",
    51|            display: "1.78\" AMOLED",
    52|            battery: "48 hours",
    53|            connectivity: "Bluetooth, Wi-Fi, LTE",
    54|            waterResistance: "5 ATM",
    55|            sensors: ["Heart Rate", "ECG", "SpO2", "GPS", "Accelerometer"]
    56|        },
    57|        features: [
    58|            "Health monitoring (ECG, SpO2, Heart Rate)",
    59|            "Built-in GPS",
    60|            "LTE connectivity",
    61|            "Sleep tracking",
    62|            "Water resistant (50m)"
    63|        ]
    64|    },
    65|    {
    66|        id: 3,
    67|        name: "Premium Cotton T-Shirt",
    68|        price: 29.99,
    69|        category: "Fashion",
    70|        rating: 4.3,
    71|        reviews: 89,
    72|        icon: "fas fa-tshirt",
    73|        images: [
    74|            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    75|            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop",
    76|            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop"
    77|        ],
    78|        description: "100% organic cotton t-shirt with premium fit and sustainable production.",
    79|        specifications: {
    80|            material: "100% Organic Cotton",
    81|            weight: "180 GSM",
    82|            fit: "Regular Fit",
    83|            care: "Machine wash cold",
    84|            origin: "Made in USA",
    85|            sizes: ["S", "M", "L", "XL", "XXL"],
    86|            colors: ["Black", "White", "Gray", "Navy", "Green"]
    87|        },
    88|        features: [
    89|            "100% organic cotton",
    90|            "Sustainable production",
    91|            "Premium stitching",
    92|            "Soft touch finish",
    93|            "Colorfast dye"
    94|        ]
    95|    },
    96|    {
    97|        id: 4,
    98|        name: "Ceramic Coffee Mug Set",
    99|        price: 34.99,
   100|        category: "Home & Living",
   101|        rating: 4.6,
   102|        reviews: 67,
   103|        icon: "fas fa-mug-hot",
   104|        images: [
   105|            "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
   106|            "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
   107|            "https://images.unsplash.com/photo-1577937927131-5a34c0c62b3b?w=600&h=600&fit=crop"
   108|        ],
   109|        description: "Set of 4 premium ceramic mugs with ergonomic handle and dishwasher safe.",
   110|        specifications: {
   111|            material: "Premium Ceramic",
   112|            capacity: "12 oz each",
   113|            microwave: "Yes",
   114|            dishwasher: "Yes",
   115|            set: "4 pieces",
   116|            colors: ["White", "Black", "Blue", "Green"]
   117|        },
   118|        features: [
   119|            "Set of 4 premium mugs",
   120|            "Ergonomic handle design",
   121|            "Microwave and dishwasher safe",
   122|            "Lead-free glaze",
   123|            "Stackable design"
   124|        ]
   125|    },
   126|    {
   127|        id: 5,
   128|        name: "Organic Face Cream",
   129|        price: 49.99,
   130|        category: "Health & Beauty",
   131|        rating: 4.7,
   132|        reviews: 142,
   133|        icon: "fas fa-spa",
   134|        images: [
   135|            "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=600&h=600&fit=crop",
   136|            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
   137|            "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=600&h=600&fit=crop"
   138|        ],
   139|        description: "Organic face cream with hyaluronic acid and vitamin C for radiant skin.",
   140|        specifications: {
   141|            volume: "50ml",
   142|            skinType: "All skin types",
   143|            ingredients: "Organic, Vegan, Cruelty-free",
   144|            shelfLife: "24 months",
   145|            country: "Made in France",
   146|            keyIngredients: ["Hyaluronic Acid", "Vitamin C", "Jojoba Oil", "Aloe Vera"]
   147|        },
   148|        features: [
   149|            "Hydrates for 24 hours",
   150|            "Reduces fine lines",
   151|            "Brightens complexion",
   152|            "Non-greasy formula",
   153|            "Suitable for all skin types"
   154|        ]
   155|    },
   156|    {
   157|        id: 6,
   158|        name: "Fitness Tracker Band",
   159|        price: 79.99,
   160|        category: "Health & Beauty",
   161|        rating: 4.4,
   162|        reviews: 203,
   163|        icon: "fas fa-running",
   164|        images: [
   165|            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop",
   166|            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop",
   167|            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop"
   168|        ],
   169|        description: "Advanced fitness tracker with heart rate monitoring and 7-day battery life.",
   170|        specifications: {
   171|            brand: "FitTrack",
   172|            model: "FT-2024",
   173|            display: "1.4\" Color Touch",
   174|            battery: "7 days",
   175|            waterResistance: "IP68",
   176|            connectivity: "Bluetooth 5.0",
   177|            sensors: ["Heart Rate", "SpO2", "Sleep", "Steps", "Calories"]
   178|        },
   179|        features: [
   180|            "24/7 heart rate monitoring",
   181|            "Sleep tracking",
   182|            "Water resistant (IP68)",
   183|            "7-day battery life",
   184|            "Smart notifications"
   185|        ]
   186|    },
   187|    {
   188|        id: 7,
   189|        name: "Leather Wallet",
   190|        price: 45.99,
   191|        category: "Fashion",
   192|        rating: 4.5,
   193|        reviews: 56,
   194|        icon: "fas fa-wallet",
   195|        images: [
   196|            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
   197|            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
   198|            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"
   199|        ],
   200|        description: "Genuine leather wallet with RFID protection and multiple card slots.",
   201|        specifications: {
   202|            material: "Genuine Leather",
   203|            color: "Brown",
   204|            dimensions: "4.5\" x 3.5\"",
   205|            slots: "8 card slots, 2 ID windows",
   206|            features: ["RFID Protection", "Coin Pocket", "Bill Compartment"],
   207|            closure: "Snap button"
   208|        },
   209|        features: [
   210|            "Genuine leather construction",
   211|            "RFID blocking technology",
   212|            "Multiple card slots",
   213|            "Coin pocket",
   214|            "Slim design"
   215|        ]
   216|    },
   217|    {
   218|        id: 8,
   219|        name: "Desk Lamp with USB Ports",
   220|        price: 39.99,
   221|        category: "Home & Living",
   222|        rating: 4.2,
   223|        reviews: 78,
   224|        icon: "fas fa-lightbulb",
   225|        images: [
   226|            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
   227|            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
   228|            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"
   229|        ],
   230|        description: "Modern LED desk lamp with adjustable brightness and USB charging ports.",
   231|        specifications: {
   232|            brand: "LightPro",
   233|            model: "LP-DL2024",
   234|            lightSource: "LED",
   235|            brightness: "3000K-6000K adjustable",
   236|            power: "USB powered",
   237|            ports: "2x USB-A, 1x USB-C",
   238|            adjustable: "360° rotation"
   239|        },
   240|        features: [
   241|            "Adjustable color temperature",
   242|            "5 brightness levels",
   243|            "3 USB charging ports",
   244|            "Touch controls",
   245|            "Energy efficient LED"
   246|        ]
   247|    },
   248|    {
   249|        id: 9,
   250|        name: "4K Ultra HD Drone with Camera",
   251|    price: 399.99,
   252|    category: "Electronics",
   253|    rating: 4.7,
   254|    reviews: 312,
   255|    icon: "fas fa-drone",
   256|    isNew: true,
   257|    isSale: true,
   258|    originalPrice: 549.99,
   259|    discount: 27,
   260|    images: [
   261|      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&h=600&fit=crop",
   262|      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&h=600&fit=crop",
   263|      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop"
   264|    ],
   265|    description: "Professional 4K drone with 3-axis gimbal, 30-minute flight time, and intelligent tracking mode.",
   266|    specifications: {
   267|      brand: "SkyVision",
   268|      model: "SV-Pro4K",
   269|      camera: "4K 60fps HDR",
   270|      gimbal: "3-axis stabilized",
   271|      flightTime: "30 minutes",
   272|      range: "5 km",
   273|      features: ["GPS Return-to-Home", "Obstacle Avoidance", "Follow Me Mode", "Waypoint Navigation"]
   274|    },
   275|    features: [
   276|      "4K HDR video at 60fps",
   277|      "3-axis gimbal stabilization",
   278|      "30-minute flight time",
   279|      "5 km transmission range",
   280|      "Obstacle avoidance sensors"
   281|    ]
   282|  },
   283|  {
   284|    id: 10,
   285|    name: "Smart Home Security Camera 360°",
   286|    price: 79.99,
   287|    category: "Electronics",
   288|    rating: 4.5,
   289|    reviews: 567,
   290|    icon: "fas fa-video",
   291|    isNew: true,
   292|    images: [
   293|      "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600&h=600&fit=crop",
   294|      "https://images.unsplash.com/photo-1591102972654-3ea125c0ae60?w=600&h=600&fit=crop",
   295|      "https://images.unsplash.com/photo-1591102972654-3ea125c0ae60?w=600&h=600&fit=crop"
   296|    ],
   297|    description: "360° panoramic security camera with night vision, two-way audio, and AI motion detection.",
   298|    specifications: {
   299|      brand: "SafeHome",
   300|      model: "SH-360Pro",
   301|      resolution: "2K QHD",
   302|      fieldOfView: "360° horizontal, 120° vertical",
   303|      nightVision: "IR up to 30ft",
   304|      audio: "Two-way with noise cancellation",
   305|      storage: "MicroSD up to 256GB / Cloud"
   306|    },
   307|    features: [
   308|      "2K QHD resolution",
   309|      "360° panoramic view",
   310|      "AI motion detection alerts",
   311|      "Two-way audio talk",
   312|      "Night vision up to 30ft"
   313|    ]
   314|  },
   315|  {
   316|    id: 11,
   317|    name: "Portable Blender USB-C Rechargeable",
   318|    price: 34.99,
   319|    category: "Home & Living",
   320|    rating: 4.4,
   321|    reviews: 890,
   322|    icon: "fas fa-blender",
   323|    isNew: true,
   324|    isSale: true,
   325|    originalPrice: 49.99,
   326|    discount: 30,
   327|    images: [
   328|      "https://images.unsplash.com/photo-1622484211816-c35a14c1fef2?w=600&h=600&fit=crop",
   329|      "https://images.unsplash.com/photo-1571935443042-d0a5b29b6cf7?w=600&h=600&fit=crop",
   330|      "https://images.unsplash.com/photo-1622484211816-c35a14c1fef2?w=600&h=600&fit=crop"
   331|    ],
   332|    description: "Portable USB-C rechargeable blender, perfect for smoothies on-the-go. 6-blade design, 400ml capacity.",
   333|    specifications: {
   334|      brand: "BlendGo",
   335|      model: "BG-400",
   336|      capacity: "400ml",
   337|      power: "120W",
   338|      battery: "3000mAh USB-C",
   339|      blades: "6 stainless steel",
   340|      material: "Tritan plastic, BPA-free"
   341|    },
   342|    features: [
   343|      "USB-C rechargeable",
   344|      "6-blade stainless steel",
   345|      "400ml BPA-free bottle",
   346|      "IPX5 water resistant",
   347|      "30-second blend cycle"
   348|    ]
   349|  },
   350|  {
   351|    id: 12,
   352|    name: "Massage Gun Deep Tissue",
   353|    price: 89.99,
   354|    category: "Health & Beauty",
   355|    rating: 4.6,
   356|    reviews: 423,
   357|    icon: "fas fa-hand-holding-heart",
   358|    isSale: true,
   359|    originalPrice: 129.99,
   360|    discount: 31,
   361|    images: [
   362|      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop",
   363|      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop",
   364|      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop"
   365|    ],
   366|    description: "Deep tissue massage gun with 6 speed levels, 4 head attachments, and ultra-quiet brushless motor.",
   367|    specifications: {
   368|      brand: "RelaxPro",
   369|      model: "RP-6000",
   370|      speeds: "6 levels (1200-3200 rpm)",
   371|      motor: "Brushless, ultra-quiet",
   372|      battery: "2600mAh lithium",
   373|      attachments: "4 heads (ball, bullet, fork, flat)",
   374|      noise: "Under 45dB"
   375|    },
   376|    features: [
   377|      "6 speed intensity levels",
   378|      "4 interchangeable heads",
   379|      "Brushless quiet motor",
   380|      "Long battery life (6 hours)",
   381|      "Ergonomic grip design"
   382|    ]
   383|  }
   384|];
   385|
   386|// DOM Elements
   387|const productsGrid = document.getElementById('productsGrid');
   388|const cartModal = document.getElementById('cartModal');
   389|const cartItems = document.getElementById('cartItems');
   390|const cartCountElement = document.querySelector('.cart-count');
   391|const totalAmountElement = document.querySelector('.total-amount');
   392|const cartCloseBtn = document.querySelector('.cart-close');
   393|const cartToggleBtn = document.querySelector('.btn-cart');
   394|const checkoutBtn = document.querySelector('.btn-checkout');
   395|const returnForm = document.getElementById('returnRequestForm');
   396|
   397|// Initialize the page
   398|document.addEventListener('DOMContentLoaded', function() {
   399|    // Load products
   400|    loadProducts();
   401|    
   402|    // Load deals (new arrivals & hot sales)
   403|    loadDeals();
   404|    
   405|    // NOTE: Cart functionality is now handled by cart-system.js
   406|    // Disabling main.js cart initialization to avoid conflicts
   407|    // loadCart(); // Disabled - handled by cart-system.js
   408|    
   409|    // Setup event listeners (excluding cart events)
   410|    setupEventListeners();
   411|    
   412|    // Setup smooth scrolling for navigation links
   413|    setupSmoothScrolling();
   414|});
   415|
   416|// Load products to the grid
   417|function loadProducts() {
   418|    if (!productsGrid) return;
   419|    
   420|    productsGrid.innerHTML = '';
   421|    
   422|    products.forEach(product => {
   423|        const productCard = createProductCard(product);
   424|        productsGrid.appendChild(productCard);
   425|    });
   426|}
   427|
   428|// Load deals (new arrivals + hot sales) to the deals grid
   429|function loadDeals() {
   430|    const dealsGrid = document.getElementById('dealsGrid');
   431|    if (!dealsGrid) return;
   432|
   433|    dealsGrid.innerHTML = '';
   434|
   435|    // Filter: new arrivals (isNew) or on sale (isSale)
   436|    const deals = products.filter(p => p.isNew || p.isSale);
   437|
   438|    deals.forEach(product => {
   439|        const card = document.createElement('div');
   440|        card.className = 'product-card deal-card';
   441|        card.setAttribute('data-id', product.id);
   442|        
   443|        let badges = '';
   444|        if (product.isNew) badges += '<span class="badge badge-new">New</span>';
   445|        if (product.isSale) {
   446|            const discount = product.discount ? Math.round(product.discount) : 0;
   447|            badges += `<span class="badge badge-sale">-${discount}%</span>`;
   448|        }
   449|        
   450|        let priceHtml = `<div class="product-price">$${product.price.toFixed(2)}</div>`;
   451|        if (product.isSale && product.originalPrice) {
   452|            priceHtml = `<div class="product-price"><span class="original-price">$${product.originalPrice.toFixed(2)}</span> $${product.price.toFixed(2)}</div>`;
   453|        }
   454|
   455|        card.innerHTML = `
   456|            <div class="product-image" onclick="viewProductDetail('${product.id}')">
   457|                <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="product-img">
   458|                ${badges}
   459|                <div class="product-overlay">
   460|                    <button class="btn-quick-view" onclick="event.stopPropagation(); viewProductDetail(${product.id})">
   461|                        <i class="fas fa-eye"></i> Quick View
   462|                    </button>
   463|                </div>
   464|            </div>
   465|            <div class="product-info">
   466|                <h3 class="product-title" onclick="viewProductDetail('${product.id}')">${product.name}</h3>
   467|                <div class="product-category">${product.category}</div>
   468|                ${priceHtml}
   469|                <button class="btn-add-to-cart" data-id="${product.id}">
   470|                    <i class="fas fa-cart-plus"></i> Add to Cart
   471|                </button>
   472|            </div>
   473|        `;
   474|        dealsGrid.appendChild(card);
   475|    });
   476|}
   477|
   478|// Create product card HTML
   479|function createProductCard(product) {
   480|    const card = document.createElement('div');
   481|    card.className = 'product-card';
   482|    card.setAttribute('data-id', product.id);
   483|    card.innerHTML = `
   484|        <div class="product-image" onclick="viewProductDetail('${product.id}')">
   485|            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="product-img">
   486|            <div class="product-overlay">
   487|                <button class="btn-quick-view" onclick="event.stopPropagation(); viewProductDetail(${product.id})">
   488|                    <i class="fas fa-eye"></i> Quick View
   489|                </button>
   490|            </div>
   491|        </div>
   492|        <div class="product-info">
   493|            <h3 class="product-title" onclick="viewProductDetail('${product.id}')">${product.name}</h3>
   494|            <div class="product-category">${product.category}</div>
   495|            <div class="product-price">$${product.price.toFixed(2)}</div>
   496|            <div class="product-rating">
   497|                ${createStarRating(product.rating)}
   498|                <span class="rating-score">${product.rating}</span>
   499|                <span class="review-count">(${product.reviews})</span>
   500|            </div>
   501|