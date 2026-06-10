// Product Detail Page JavaScript - 1688 Edition
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1688_001';
    
    loadProductDetail(productId);
    setupEventListeners();
    loadRelatedProducts(productId);
});

// Load product detail
function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${product.title} - ShopEasy`;
    
    // Update breadcrumb
    document.getElementById('product-category').textContent = product.category || 'General';
    document.getElementById('product-name').textContent = product.title;
    
    // Update product info
    document.getElementById('detail-product-name').textContent = product.title;
    document.getElementById('detail-description').textContent = product.description || product.short_description || 'Quality product sourced directly from 1688.';
    
    // Price - use suggested_price (USD) as main price
    const usdPrice = product.suggested_price || product.price_usd || product.price || 9.99;
    document.getElementById('detail-price').textContent = `$${Number(usdPrice).toFixed(2)}`;
    
    // Show 1688 wholesale price in CNY
    const cnyEl = document.getElementById('detail-price-cny');
    if (cnyEl) {
        const cnyPrice = product.price_cny || 0;
        cnyEl.textContent = cnyPrice.toFixed(2);
    }
    
    // Rating
    const ratingScore = product.rating || 4.5;
    document.getElementById('detail-rating-score').textContent = ratingScore;
    document.getElementById('detail-review-count').textContent = product.review_count ? `(${product.review_count} reviews)` : '(Featured)';
    
    // Rating stars
    const ratingStars = document.getElementById('detail-rating-stars');
    if (ratingStars) ratingStars.innerHTML = createStarRating(ratingScore);
    
    // SKU
    document.getElementById('product-sku').textContent = `1688-${product.id}`;
    
    // Wishlist button data-id
    var wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn) {
        wishlistBtn.setAttribute('data-id', product.id);
    }
    
    // Check if product is already in wishlist
    if (typeof window.wishlist !== 'undefined') {
        window.wishlist.isWishlisted(product.id);
        setTimeout(function() {
            if (typeof window.wishlist !== 'undefined' && window.wishlist.getAll) {
                var allBtn = document.querySelector('.btn-wishlist[data-id="' + product.id + '"]');
                if (allBtn) {
                    var isFav = window.wishlist.isWishlisted(product.id);
                    var icon = allBtn.querySelector('i');
                    if (icon) {
                        icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
                    }
                    allBtn.classList.toggle('wishlisted', isFav);
                    var textNode = allBtn.childNodes[allBtn.childNodes.length - 1];
                    if (textNode && textNode.nodeType === 3) {
                        textNode.textContent = isFav ? ' In Wishlist' : ' Add to Wishlist';
                    }
                }
            }
        }, 200);
    }
    
    // Main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
        mainImage.alt = product.title;
    }
    
    // Create thumbnails (use main image + related category images)
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = '';
        const images = [product.image_url];
        // Add a few more from same category
        if (product.image_url) {
            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                const img = document.createElement('img');
                img.src = image;
                img.alt = `${product.title} - Image ${index + 1}`;
                img.loading = 'lazy';
                
                thumbnail.appendChild(img);
                thumbnail.addEventListener('click', () => {
                    mainImage.src = image;
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
        }
    }
    
    // Key features from tags
    const featuresList = document.getElementById('key-features-list');
    if (featuresList) {
        featuresList.innerHTML = '';
        const tags = product.tags || [];
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${tag.charAt(0).toUpperCase() + tag.slice(1)}`;
            featuresList.appendChild(li);
        });
        // Add generic features if no tags
        if (tags.length === 0) {
            const defaultFeatures = ['Factory-direct pricing', 'Quality assured', 'Worldwide shipping', 'Easy returns'];
            defaultFeatures.forEach(f => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${f}`;
                featuresList.appendChild(li);
            });
        }
    }
    
    // Specifications table
    const specsTable = document.getElementById('specs-table');
    if (specsTable) {
        specsTable.innerHTML = '';
        const specs = {
            'Category': product.category || 'General',
            'Source': '1688.com',
            'Sourcing Model': 'One-piece dropshipping (一件代发)',
            'Wholesale Price (CNY)': product.price_cny ? `¥${product.price_cny.toFixed(2)}` : 'Contact for price',
            'Suggested Retail (USD)': product.suggested_price ? `$${product.suggested_price.toFixed(2)}` : 'Varies',
        };
        
        // Add tags as features
        if (product.tags && product.tags.length) {
            specs['Tags'] = product.tags.join(', ');
        }
        
        for (const [key, value] of Object.entries(specs)) {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            keyCell.className = 'spec-key';
            keyCell.textContent = key;
            const valueCell = document.createElement('td');
            valueCell.className = 'spec-value';
            valueCell.textContent = value;
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            specsTable.appendChild(row);
        }
    }
    
    // Average rating
    document.getElementById('average-rating').textContent = ratingScore;
    document.getElementById('average-stars').innerHTML = createStarRating(ratingScore);
    document.getElementById('total-reviews').textContent = product.review_count ? `${product.review_count} reviews` : 'New arrival';
}

// Setup event listeners
function setupEventListeners() {
    // Quantity selector
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) quantityInput.value = value - 1;
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 10) quantityInput.value = value + 1;
    });
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 1) quantityInput.value = 1;
        if (value > 10) quantityInput.value = 10;
    });
    
    // Add to cart
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    addToCartBtn.addEventListener('click', function() {
        const productId = new URLSearchParams(window.location.search).get('id') || '1688_001';
        const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
        addToCart(productId, quantity);
        showNotification('Product added to cart!', 'success');
    });
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Star rating input
    const starInputs = document.querySelectorAll('.star-rating-input i');
    starInputs.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
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
                if (index < rating) s.classList.add('hover');
                else s.classList.remove('hover');
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
    
    const relatedProducts = products.filter(p => 
        p.id !== currentProductId && 
        (p.category === currentProduct.category)
    ).slice(0, 4);
    
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    relatedContainer.innerHTML = '';
    
    const items = relatedProducts.length > 0 ? relatedProducts : 
        products.filter(p => p.id !== currentProductId).sort(() => Math.random() - 0.5).slice(0, 4);
    
    items.forEach(product => {
        relatedContainer.appendChild(createRelatedProductCard(product));
    });
}

// Create related product card
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    const price = product.suggested_price || product.price_usd || product.price || 9.99;
    const imgUrl = product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
    
    card.innerHTML = `
        <div class="product-image" onclick="viewProductDetail('${product.id}')">
            <img src="${imgUrl}" alt="${product.title}" loading="lazy" class="product-img">
        </div>
        <div class="product-info">
            <h3 class="product-title" onclick="viewProductDetail('${product.id}')">${product.title}</h3>
            <div class="product-price">$${Number(price).toFixed(2)}</div>
            <button class="btn-add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(notification);
    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());
    setTimeout(() => { if (notification.parentNode) notification.remove(); }, 3000);
}

// Add to cart
function addToCart(productId, quantity = 1) {
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId, quantity);
        updateCartCount();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('shopEasyCart')) || { items: [], total: 0, count: 0 };
    const price = product.suggested_price || product.price_usd || product.price || 9.99;
    
    const existingIndex = cart.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
    } else {
        cart.items.push({
            id: productId,
            name: product.title,
            price: price,
            image: product.image_url,
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

// Update cart count
function updateCartCount() {
    const cartData = (typeof window.cart !== 'undefined' && window.cart.items) 
        ? window.cart : { items: [], total: 0, count: 0 };
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartData.count;
    });
}

// Initialize cart count
updateCartCount();

// Helper: viewProductDetail
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}
