// Product Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Load product data
    loadProductDetail(productId);
    
    // Setup event listeners
    setupEventListeners();
    
    // Load related products
    loadRelatedProducts(productId);
});

// Load product detail
function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        // Redirect to home if product not found
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${product.name} - ShopEasy`;
    
    // Update breadcrumb
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-name').textContent = product.name;
    
    // Update product info
    document.getElementById('detail-product-name').textContent = product.name;
    document.getElementById('detail-description').textContent = product.description;
    document.getElementById('detail-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detail-rating-score').textContent = product.rating;
    document.getElementById('detail-review-count').textContent = `(${product.reviews} reviews)`;
    
    // Update rating stars
    const ratingStars = document.getElementById('detail-rating-stars');
    ratingStars.innerHTML = createStarRating(product.rating);
    
    // Update SKU
    document.getElementById('product-sku').textContent = product.specifications?.model || `PROD-${product.id}`;
    
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Create thumbnails
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${product.name} - Image ${index + 1}`;
        img.loading = 'lazy';
        
        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            // Update main image
            mainImage.src = image;
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Update key features
    const featuresList = document.getElementById('key-features-list');
    featuresList.innerHTML = '';
    
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        featuresList.appendChild(li);
    });
    
    // Update specifications table
    const specsTable = document.getElementById('specs-table');
    specsTable.innerHTML = '';
    
    if (product.specifications) {
        for (const [key, value] of Object.entries(product.specifications)) {
            const row = document.createElement('tr');
            
            const keyCell = document.createElement('td');
            keyCell.className = 'spec-key';
            keyCell.textContent = formatSpecKey(key);
            
            const valueCell = document.createElement('td');
            valueCell.className = 'spec-value';
            
            if (Array.isArray(value)) {
                valueCell.textContent = value.join(', ');
            } else {
                valueCell.textContent = value;
            }
            
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            specsTable.appendChild(row);
        }
    }
    
    // Update average rating
    document.getElementById('average-rating').textContent = product.rating;
    document.getElementById('average-stars').innerHTML = createStarRating(product.rating);
    document.getElementById('total-reviews').textContent = `${product.reviews} reviews`;
}

// Format specification key for display
function formatSpecKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('Resistance', ' Resistance');
}

// Setup event listeners
function setupEventListeners() {
    // Quantity selector
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 1) quantityInput.value = 1;
        if (value > 10) quantityInput.value = 10;
    });
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    addToCartBtn.addEventListener('click', function() {
        const productId = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
        const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
        
        addToCart(productId, quantity);
        
        // Show success message
        showNotification('Product added to cart!', 'success');
    });
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Star rating input
    const starInputs = document.querySelectorAll('.star-rating-input i');
    starInputs.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Update stars
            starInputs.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            starInputs.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            starInputs.forEach(s => s.classList.remove('hover'));
        });
    });
}

// Load related products
function loadRelatedProducts(currentProductId) {
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return;
    
    // Find related products (same category, excluding current product)
    const relatedProducts = products.filter(p => 
        p.id !== currentProductId && 
        p.category === currentProduct.category
    ).slice(0, 4); // Show up to 4 related products
    
    const relatedContainer = document.getElementById('related-products');
    relatedContainer.innerHTML = '';
    
    if (relatedProducts.length === 0) {
        // If no related products, show random products
        const randomProducts = products
            .filter(p => p.id !== currentProductId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        
        randomProducts.forEach(product => {
            relatedContainer.appendChild(createRelatedProductCard(product));
        });
    } else {
        relatedProducts.forEach(product => {
            relatedContainer.appendChild(createRelatedProductCard(product));
        });
    }
}

// Create related product card
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.innerHTML = `
        <div class="product-image" onclick="viewProductDetail(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="product-img">
        </div>
        <div class="product-info">
            <h3 class="product-title" onclick="viewProductDetail(${product.id})">${product.name}</h3>
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

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Add to cart function (delegated to cart-system.js)
function addToCart(productId, quantity = 1) {
    // Use cart-system.js if available
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId, quantity);
        updateCartCount();
        return;
    }
    
    // Fallback: use localStorage directly
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || { items: [], total: 0, count: 0 };
    
    const existingIndex = cart.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
    } else {
        cart.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            category: product.category
        });
    }
    
    cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    localStorage.setItem('shopEasyCart', JSON.stringify(cart));
    window.cart = cart;
    updateCartCount();
}

// Update cart count (shared with cart-system.js)
function updateCartCount() {
    const cartData = (typeof window.cart !== 'undefined' && window.cart.items) 
        ? window.cart : { items: [], total: 0, count: 0 };
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartData.count;
    });
}

// Initialize cart count
updateCartCount();