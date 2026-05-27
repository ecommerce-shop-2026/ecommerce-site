/**
 * ShopEasy Product Comparison System
 * Compare up to 4 products side-by-side
 */

var CompareSystem = (function() {
    'use strict';

    var STORAGE_KEY = 'shopeasy_compare';
    var MAX_COMPARE = 4;

    function getCompareList() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch(e) { return []; }
    }

    function saveCompareList(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch(e) {}
    }

    function getProductById(id) {
        if (typeof window.products === 'undefined') return null;
        return window.products.find(function(p) { return String(p.id) === String(id); }) || null;
    }

    function getCompareCount() {
        return getCompareList().length;
    }

    function isInCompare(id) {
        var list = getCompareList();
        return list.some(function(item) { return String(item) === String(id); });
    }

    function addToCompare(id) {
        var list = getCompareList();
        var sid = String(id);

        if (list.some(function(item) { return String(item) === sid; })) {
            showCompareToast('Product already in comparison', 'info');
            return false;
        }

        var product = getProductById(id);
        if (!product) {
            showCompareToast('Product not found', 'error');
            return false;
        }

        if (list.length >= MAX_COMPARE) {
            showCompareToast('Maximum ' + MAX_COMPARE + ' products can be compared', 'warning');
            return false;
        }

        list.push(sid);
        saveCompareList(list);
        updateCompareBadges();
        showCompareToast('Added "' + (product.title || product.name || 'Product') + '" to compare', 'success');
        return true;
    }

    function removeFromCompare(id) {
        var list = getCompareList();
        var sid = String(id);
        var newList = list.filter(function(item) { return String(item) !== sid; });
        saveCompareList(newList);
        updateCompareBadges();
        return true;
    }

    function clearAll() {
        saveCompareList([]);
        updateCompareBadges();
        showCompareToast('Comparison list cleared', 'info');
    }

    function updateCompareBadges() {
        var count = getCompareCount();
        document.querySelectorAll('.compare-count').forEach(function(el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline' : 'none';
        });

        // Highlight active compare items on product cards
        document.querySelectorAll('[data-compare-btn]').forEach(function(btn) {
            var pid = btn.getAttribute('data-product-id');
            if (isInCompare(pid)) {
                btn.classList.add('in-compare');
                btn.querySelector('i').className = 'fas fa-check-circle';
            } else {
                btn.classList.remove('in-compare');
                btn.querySelector('i').className = 'fas fa-plus-circle';
            }
        });
    }

    function showCompareToast(msg, type) {
        type = type || 'info';
        // Try using existing toast system
        if (typeof window.showToast === 'function') {
            window.showToast(msg, type);
            return;
        }
        // Fallback
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:30px;right:30px;padding:14px 24px;border-radius:12px;color:white;font-weight:500;z-index:99999;box-shadow:0 8px 30px rgba(0,0,0,0.2);transition:all 0.4s;transform:translateY(20px);opacity:0;max-width:350px;';
        if (type === 'success') toast.style.background = '#27ae60';
        else if (type === 'warning') toast.style.background = '#f39c12';
        else if (type === 'error') toast.style.background = '#e74c3c';
        else toast.style.background = '#667eea';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 50);
        setTimeout(function() {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 400);
        }, 2500);
    }

    // Initialize on product list pages
    function initProductCards() {
        // Add compare buttons to product cards
        document.querySelectorAll('.product-card, .catalog-card').forEach(function(card) {
            // Don't add if already has compare btn
            if (card.querySelector('[data-compare-btn]')) return;

            var addBtn = card.querySelector('.add-to-cart, .btn-add-to-cart, .btn-primary, a[href*="product"]');
            var pid = null;
            if (addBtn) {
                pid = addBtn.getAttribute('data-product-id') ||
                      addBtn.getAttribute('data-id');
            }
            if (!pid) {
                // Try from link
                var link = card.querySelector('a[href*="product"]');
                if (link) {
                    var href = link.getAttribute('href');
                    var match = href.match(/product[_-]?id[=:](\d+)/i);
                    if (match) pid = match[1];
                }
            }
            if (!pid) return;

            var compareBtn = document.createElement('button');
            compareBtn.className = 'btn-compare-sm';
            compareBtn.setAttribute('data-compare-btn', '');
            compareBtn.setAttribute('data-product-id', pid);
            compareBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
            compareBtn.title = 'Add to Compare';
            compareBtn.style.cssText = 'position:absolute;top:10px;right:40px;background:white;border:1px solid #e0e0e0;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;z-index:5;font-size:0.85rem;box-shadow:0 2px 8px rgba(0,0,0,0.08);';

            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var id = this.getAttribute('data-product-id');
                if (isInCompare(id)) {
                    removeFromCompare(id);
                } else {
                    addToCompare(id);
                }
            });

            // Insert near the cart button area
            var actions = card.querySelector('.product-actions, .card-actions, .product-footer');
            if (actions) {
                actions.appendChild(compareBtn);
            } else {
                card.style.position = 'relative';
                card.appendChild(compareBtn);
            }
        });

        updateCompareBadges();
    }

    return {
        getList: getCompareList,
        getCount: getCompareCount,
        isInCompare: isInCompare,
        add: addToCompare,
        remove: removeFromCompare,
        clear: clearAll,
        getProduct: getProductById,
        initCards: initProductCards,
        updateBadges: updateCompareBadges,
        MAX: MAX_COMPARE
    };
})();

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        CompareSystem.initCards();
    });
} else {
    CompareSystem.initCards();
}

// Expose globally
window.CompareSystem = CompareSystem;
