// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        category: "Electronics",
        rating: 4.5,
        icon: "fas fa-headphones"
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        price: 249.99,
        category: "Electronics",
        rating: 4.8,
        icon: "fas fa-clock"
    },
    {
        id: 3,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        category: "Fashion",
        rating: 4.3,
        icon: "fas fa-tshirt"
    },
    {
        id: 4,
        name: "Ceramic Coffee Mug Set",
        price: 34.99,
        category: "Home & Living",
        rating: 4.6,
        icon: "fas fa-mug-hot"
    },
    {
        id: 5,
        name: "Organic Face Cream",
        price: 49.99,
        category: "Health & Beauty",
        rating: 4.7,
        icon: "fas fa-spa"
    },
    {
        id: 6,
        name: "Fitness Tracker Band",
        price: 79.99,
        category: "Health & Beauty",
        rating: 4.4,
        icon: "fas fa-running"
    },
    {
        id: 7,
        name: "Leather Wallet",
        price: 45.99,
        category: "Fashion",
        rating: 4.5,
        icon: "fas fa-wallet"
    },
    {
        id: 8,
        name: "Desk Lamp with USB Ports",
        price: 39.99,
        category: "Home & Living",
        rating: 4.2,
        icon: "fas fa-lightbulb"
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
    
    // Load cart from localStorage
    loadCart();
    
    // Setup event listeners
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
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">
                ${createStarRating(product.rating)}
                <span class="rating-score">${product.rating}</span>
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
    
    // Update UI
    cartCountElement.textContent = cartCount;
    totalAmountElement.textContent = `$${cartTotal.toFixed(2)}`;
    
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

// Initialize cart display
updateCart();