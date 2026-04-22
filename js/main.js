// Product Data with detailed specifications
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        category: "Electronics",
        rating: 4.5,
        reviews: 128,
        icon: "fas fa-headphones",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
        ],
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        specifications: {
            brand: "AudioPro",
            model: "AP-2024",
            connectivity: "Bluetooth 5.2",
            battery: "30 hours",
            charging: "USB-C, Wireless",
            weight: "250g",
            features: ["Noise Cancellation", "Touch Controls", "Voice Assistant", "Foldable Design"]
        },
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Quick charge (5 min = 3 hours)",
            "Hi-Res Audio support",
            "Comfortable memory foam ear cups"
        ]
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        price: 249.99,
        category: "Electronics",
        rating: 4.8,
        reviews: 256,
        icon: "fas fa-clock",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1579586337278-3fecf0d6e8e7?w=600&h=600&fit=crop"
        ],
        description: "Advanced smartwatch with health monitoring, GPS, and LTE connectivity.",
        specifications: {
            brand: "TechWear",
            model: "TW-S5",
            display: "1.78\" AMOLED",
            battery: "48 hours",
            connectivity: "Bluetooth, Wi-Fi, LTE",
            waterResistance: "5 ATM",
            sensors: ["Heart Rate", "ECG", "SpO2", "GPS", "Accelerometer"]
        },
        features: [
            "Health monitoring (ECG, SpO2, Heart Rate)",
            "Built-in GPS",
            "LTE connectivity",
            "Sleep tracking",
            "Water resistant (50m)"
        ]
    },
    {
        id: 3,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        category: "Fashion",
        rating: 4.3,
        reviews: 89,
        icon: "fas fa-tshirt",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop"
        ],
        description: "100% organic cotton t-shirt with premium fit and sustainable production.",
        specifications: {
            material: "100% Organic Cotton",
            weight: "180 GSM",
            fit: "Regular Fit",
            care: "Machine wash cold",
            origin: "Made in USA",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "White", "Gray", "Navy", "Green"]
        },
        features: [
            "100% organic cotton",
            "Sustainable production",
            "Premium stitching",
            "Soft touch finish",
            "Colorfast dye"
        ]
    },
    {
        id: 4,
        name: "Ceramic Coffee Mug Set",
        price: 34.99,
        category: "Home & Living",
        rating: 4.6,
        reviews: 67,
        icon: "fas fa-mug-hot",
        images: [
            "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1577937927131-5a34c0c62b3b?w=600&h=600&fit=crop"
        ],
        description: "Set of 4 premium ceramic mugs with ergonomic handle and dishwasher safe.",
        specifications: {
            material: "Premium Ceramic",
            capacity: "12 oz each",
            microwave: "Yes",
            dishwasher: "Yes",
            set: "4 pieces",
            colors: ["White", "Black", "Blue", "Green"]
        },
        features: [
            "Set of 4 premium mugs",
            "Ergonomic handle design",
            "Microwave and dishwasher safe",
            "Lead-free glaze",
            "Stackable design"
        ]
    },
    {
        id: 5,
        name: "Organic Face Cream",
        price: 49.99,
        category: "Health & Beauty",
        rating: 4.7,
        reviews: 142,
        icon: "fas fa-spa",
        images: [
            "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=600&h=600&fit=crop"
        ],
        description: "Organic face cream with hyaluronic acid and vitamin C for radiant skin.",
        specifications: {
            volume: "50ml",
            skinType: "All skin types",
            ingredients: "Organic, Vegan, Cruelty-free",
            shelfLife: "24 months",
            country: "Made in France",
            keyIngredients: ["Hyaluronic Acid", "Vitamin C", "Jojoba Oil", "Aloe Vera"]
        },
        features: [
            "Hydrates for 24 hours",
            "Reduces fine lines",
            "Brightens complexion",
            "Non-greasy formula",
            "Suitable for all skin types"
        ]
    },
    {
        id: 6,
        name: "Fitness Tracker Band",
        price: 79.99,
        category: "Health & Beauty",
        rating: 4.4,
        reviews: 203,
        icon: "fas fa-running",
        images: [
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop"
        ],
        description: "Advanced fitness tracker with heart rate monitoring and 7-day battery life.",
        specifications: {
            brand: "FitTrack",
            model: "FT-2024",
            display: "1.4\" Color Touch",
            battery: "7 days",
            waterResistance: "IP68",
            connectivity: "Bluetooth 5.0",
            sensors: ["Heart Rate", "SpO2", "Sleep", "Steps", "Calories"]
        },
        features: [
            "24/7 heart rate monitoring",
            "Sleep tracking",
            "Water resistant (IP68)",
            "7-day battery life",
            "Smart notifications"
        ]
    },
    {
        id: 7,
        name: "Leather Wallet",
        price: 45.99,
        category: "Fashion",
        rating: 4.5,
        reviews: 56,
        icon: "fas fa-wallet",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"
        ],
        description: "Genuine leather wallet with RFID protection and multiple card slots.",
        specifications: {
            material: "Genuine Leather",
            color: "Brown",
            dimensions: "4.5\" x 3.5\"",
            slots: "8 card slots, 2 ID windows",
            features: ["RFID Protection", "Coin Pocket", "Bill Compartment"],
            closure: "Snap button"
        },
        features: [
            "Genuine leather construction",
            "RFID blocking technology",
            "Multiple card slots",
            "Coin pocket",
            "Slim design"
        ]
    },
    {
        id: 8,
        name: "Desk Lamp with USB Ports",
        price: 39.99,
        category: "Home & Living",
        rating: 4.2,
        reviews: 78,
        icon: "fas fa-lightbulb",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"
        ],
        description: "Modern LED desk lamp with adjustable brightness and USB charging ports.",
        specifications: {
            brand: "LightPro",
            model: "LP-DL2024",
            lightSource: "LED",
            brightness: "3000K-6000K adjustable",
            power: "USB powered",
            ports: "2x USB-A, 1x USB-C",
            adjustable: "360° rotation"
        },
        features: [
            "Adjustable color temperature",
            "5 brightness levels",
            "3 USB charging ports",
            "Touch controls",
            "Energy efficient LED"
        ]
    }
];

// Cart State
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCountElement = document.querySelector('.cart-count');
const totalAmountElement = document.querySelector('.total-amount');
const cartCloseBtn = document.querySelector('.cart-close');
const cartToggleBtn = document.querySelector('.btn-cart');
const checkoutBtn = document.querySelector('.btn-checkout');
const returnForm = document.getElementById('returnRequestForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();
    
    // NOTE: Cart functionality is now handled by cart-system.js
    // Disabling main.js cart initialization to avoid conflicts
    // loadCart(); // Disabled - handled by cart-system.js
    
    // Setup event listeners (excluding cart events)
    setupEventListeners();
    
    // Setup smooth scrolling for navigation links
    setupSmoothScrolling();
});

// Load products to the grid
function loadProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.innerHTML = `
        <div class="product-image" onclick="viewProductDetail(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="product-img">
            <div class="product-overlay">
                <button class="btn-quick-view" onclick="event.stopPropagation(); viewProductDetail(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title" onclick="viewProductDetail(${product.id})">${product.name}</h3>
            <div class="product-category">${product.category}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">
                ${createStarRating(product.rating)}
                <span class="rating-score">${product.rating}</span>
                <span class="review-count">(${product.reviews})</span>
            </div>
            <div class="product-features">
                ${product.features.slice(0, 2).map(feature => 
                    `<span class="feature-tag">${feature}</span>`
                ).join('')}
            </div>
            <button class="btn-add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Create star rating HTML
function createStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-to-cart')) {
            const button = e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Cart toggle
        if (e.target.closest('.btn-cart')) {
            e.preventDefault();
            toggleCart();
        }
        
        // Cart close
        if (e.target.closest('.cart-close')) {
            closeCart();
        }
        
        // Checkout button
        if (e.target.closest('.btn-checkout')) {
            processCheckout();
        }
    });
    
    // Return form submission
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReturnRequest();
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartModal.style.display === 'block' && 
            !cartModal.contains(e.target) && 
            !e.target.closest('.btn-cart')) {
            closeCart();
        }
    });
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            const navActions = document.querySelector('.nav-actions');
            
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navActions.style.display = navActions.style.display === 'flex' ? 'none' : 'flex';
            
            if (window.innerWidth <= 768) {
                if (navMenu.style.display === 'flex') {
                    navMenu.style.flexDirection = 'column';
                    navMenu.style.position = 'absolute';
                    navMenu.style.top = '100%';
                    navMenu.style.left = '0';
                    navMenu.style.right = '0';
                    navMenu.style.background = 'white';
                    navMenu.style.padding = '20px';
                    navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }
            }
        });
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
        }
        updateCart();
    }
}

function updateCart() {
    // Calculate totals
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update UI only if elements exist
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    if (totalAmountElement) {
        totalAmountElement.textContent = `$${cartTotal.toFixed(2)}`;
    }
    
    // Update cart items display
    updateCartDisplay();
    
    // Save to localStorage
    saveCart();
}

function updateCartDisplay() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-quantity minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="btn-quantity plus" data-id="${item.id}">+</button>
                <button class="btn-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Add event listeners to cart item controls
    cartItems.querySelectorAll('.btn-quantity.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) {
                updateCartQuantity(id, item.quantity - 1);
            }
        });
    });
    
    cartItems.querySelectorAll('.btn-quantity.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) {
                updateCartQuantity(id, item.quantity + 1);
            }
        });
    });
    
    cartItems.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function toggleCart() {
    if (cartModal.style.display === 'block') {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Simulate payment processing
    showNotification('Processing payment...');
    
    setTimeout(() => {
        showNotification('Payment successful! Order confirmed.');
        
        // Clear cart
        cart = [];
        updateCart();
        closeCart();
        
        // Show order confirmation
        alert(`Order confirmed! Total: $${cartTotal.toFixed(2)}\nThank you for your purchase!`);
    }, 2000);
}

// Return Request Functions
function submitReturnRequest() {
    const formData = new FormData(returnForm);
    const orderNumber = formData.get('orderNumber') || 'N/A';
    const email = formData.get('email') || 'N/A';
    const reason = formData.get('reason') || 'No reason provided';
    
    showNotification('Return request submitted successfully!');
    
    // Simulate API call
    setTimeout(() => {
        alert(`Return request received!\n\nOrder: ${orderNumber}\nEmail: ${email}\n\nWe will contact you within 24 hours with return instructions.`);
        returnForm.reset();
    }, 1000);
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// LocalStorage Functions
function saveCart() {
    try {
        localStorage.setItem('shopEasyCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Failed to save cart:', e);
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem('shopEasyCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    } catch (e) {
        console.error('Failed to load cart:', e);
    }
}

// Product Detail Functions
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Initialize cart display
updateCart();

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchBtn || !searchResults) return;
    
    let searchTimeout;
    
    // Search on input
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    // Search on button click
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }
        
        const searchTerm = query.toLowerCase().trim();
        const results = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    }
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}" class="search-result-image">
                <div class="search-result-info">
                    <div class="search-result-name">${product.name}</div>
                    <div class="search-result-price">$${product.price.toFixed(2)}</div>
                    <div class="search-result-category">${product.category}</div>
                </div>
            `;
            
            resultItem.addEventListener('click', function() {
                viewProductDetail(product.id);
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            
            searchResults.appendChild(resultItem);
        });
        
        searchResults.style.display = 'block';
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initReturnForm();
});

// Return Form Functionality
function initReturnForm() {
    const returnForm = document.getElementById('returnRequestForm');
    
    if (!returnForm) return;
    
    returnForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderNumber = returnForm.querySelector('input[type="text"]').value;
        const email = returnForm.querySelector('input[type="email"]').value;
        const reason = returnForm.querySelector('textarea').value;
        
        // Validate form
        if (!orderNumber || !email) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showFormMessage('Processing your return request...', 'info');
        
        // Simulate API call delay
        setTimeout(() => {
            // Save to localStorage for demo purposes
            const returnRequest = {
                orderNumber,
                email,
                reason,
                date: new Date().toISOString(),
                status: 'pending'
            };
            
            saveReturnRequest(returnRequest);
            
            // Show success message
            showFormMessage('Return request submitted successfully! We will contact you within 24 hours.', 'success');
            
            // Reset form
            returnForm.reset();
        }, 1500);
    });
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = returnForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Add to form
        returnForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function saveReturnRequest(request) {
        try {
            // Get existing requests or create new array
            const existingRequests = JSON.parse(localStorage.getItem('shopEasyReturnRequests')) || [];
            
            // Add new request
            existingRequests.push(request);
            
            // Save back to localStorage
            localStorage.setItem('shopEasyReturnRequests', JSON.stringify(existingRequests));
            
            console.log('Return request saved:', request);
        } catch (error) {
            console.error('Failed to save return request:', error);
        }
    }
}

// ======================
// 图片懒加载功能
// ======================

function initLazyLoading() {
    console.log('初始化图片懒加载...');
    
    // 获取所有需要懒加载的图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        // 使用IntersectionObserver API（现代浏览器）
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px开始加载
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // 回退方案：滚动事件监听
        console.log('IntersectionObserver不可用，使用回退方案');
        let ticking = false;
        
        function checkImages() {
            lazyImages.forEach(img => {
                if (isInViewport(img)) {
                    loadImage(img);
                }
            });
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    checkImages();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 初始检查
        checkImages();
    }
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // 添加加载类
    img.classList.add('lazy-image', 'placeholder');
    
    // 创建新的Image对象预加载
    const image = new Image();
    image.src = src;
    
    image.onload = function() {
        // 设置实际src
        img.src = src;
        
        // 移除data-src属性
        img.removeAttribute('data-src');
        
        // 添加加载完成类
        img.classList.remove('placeholder');
        setTimeout(() => {
            img.classList.add('loaded');
        }, 100);
        
        console.log(`图片加载完成: ${src}`);
    };
    
    image.onerror = function() {
        console.error(`图片加载失败: ${src}`);
        img.classList.remove('lazy-image', 'placeholder');
        img.classList.add('loaded');
    };
}

// ======================
// 图片优化工具函数
// ======================

function optimizeProductImages() {
    console.log('优化产品图片...');
    
    // 获取所有产品图片
    const productImages = document.querySelectorAll('.product-card img, .product-image img');
    
    productImages.forEach(img => {
        // 添加懒加载属性
        if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            
            // 设置低质量占位符
            const src = img.src;
            if (src.includes('unsplash.com')) {
                // 对于Unsplash图片，使用小尺寸版本作为占位符
                const placeholderSrc = src.replace(/w=\d+&h=\d+/, 'w=50&h=50&blur=10');
                img.src = placeholderSrc;
            } else {
                // 对于其他图片，使用空白data URL
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            }
            
            // 添加懒加载类
            img.classList.add('lazy-image');
        }
    });
}

// ======================
// WebP格式检测和回退
// ======================

function checkWebPSupport() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            const isSupported = (webP.height === 2);
            window.webPSupported = isSupported;
            console.log(`WebP支持: ${isSupported}`);
            resolve(isSupported);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// ======================
// 响应式图片处理
// ======================

function setupResponsiveImages() {
    // 根据设备像素比和屏幕宽度选择合适的图片尺寸
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    
    console.log(`设备信息: DPR=${dpr}, 屏幕宽度=${screenWidth}px`);
    
    // 可以根据需要实现更复杂的响应式图片逻辑
    // 例如：为不同屏幕尺寸加载不同分辨率的图片
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('ShopEasy initialized');
    
    // 检查WebP支持
    await checkWebPSupport();
    
    // Initialize all components
    initCart();
    initSearch();
    initReturnForm();
    initProductCards();
    initQuickView();
    initCategoryFilters();
    
    // 初始化图片优化
    optimizeProductImages();
    initLazyLoading();
    setupResponsiveImages();
    
    // Update cart count on page load
    updateCartCount();
    
    // Check for any stored return requests
    checkStoredReturnRequests();
    
    console.log('所有组件初始化完成');
});

// 监听窗口大小变化，重新设置响应式图片
window.addEventListener('resize', setupResponsiveImages);