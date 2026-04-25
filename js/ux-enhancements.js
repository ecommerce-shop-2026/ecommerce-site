/**
 * UX Enhancements for ShopEasy
 * Handles: loading animation, notifications, back-to-top, responsive nav, image lazyload, ripple effects
 * All CSS is injected via JS to avoid conflicts with style.css
 */

(function() {
    'use strict';

    // ============================================================
    // 1. INJECT ALL UX-RELATED CSS
    // ============================================================
    function injectUXStyles() {
        var style = document.createElement('style');
        style.id = 'ux-enhancements-styles';
        style.textContent = [
            /* ---- Page Loader ---- */
            '#page-loader {',
                'position: fixed;',
                'top: 0; left: 0; right: 0; bottom: 0;',
                'background: #ffffff;',
                'z-index: 999999;',
                'display: flex;',
                'flex-direction: column;',
                'align-items: center;',
                'justify-content: center;',
                'transition: opacity 0.5s ease, visibility 0.5s ease;',
            '}',
            '#page-loader.fade-out {',
                'opacity: 0;',
                'visibility: hidden;',
                'pointer-events: none;',
            '}',
            '#page-loader .loader-spinner {',
                'width: 48px; height: 48px;',
                'border: 4px solid #e0e0e0;',
                'border-top-color: #007bff;',
                'border-radius: 50%;',
                'animation: ux-loader-spin 0.8s linear infinite;',
            '}',
            '#page-loader .loader-text {',
                'margin-top: 16px;',
                'font-family: "Inter", "Poppins", sans-serif;',
                'font-size: 14px;',
                'color: #6c757d;',
                'letter-spacing: 1px;',
            '}',
            '@keyframes ux-loader-spin {',
                'to { transform: rotate(360deg); }',
            '}',

            /* ---- Notification System ---- */
            '#notification-container {',
                'position: fixed;',
                'top: 20px; right: 20px;',
                'z-index: 99999;',
                'display: flex;',
                'flex-direction: column;',
                'align-items: flex-end;',
                'gap: 10px;',
                'pointer-events: none;',
                'max-width: 400px;',
                'width: auto;',
            '}',
            '.ux-notification {',
                'display: flex;',
                'align-items: center;',
                'gap: 12px;',
                'padding: 14px 20px;',
                'border-radius: 8px;',
                'box-shadow: 0 4px 20px rgba(0,0,0,0.15);',
                'font-family: "Inter", "Poppins", sans-serif;',
                'font-size: 14px;',
                'font-weight: 500;',
                'line-height: 1.4;',
                'color: #fff;',
                'pointer-events: auto;',
                'cursor: pointer;',
                'transform: translateX(120%);',
                'opacity: 0;',
                'transition: transform 0.4s ease, opacity 0.4s ease;',
                'min-width: 280px;',
                'max-width: 100%;',
                'position: relative;',
                'word-break: break-word;',
            '}',
            '.ux-notification.show {',
                'transform: translateX(0);',
                'opacity: 1;',
            '}',
            '.ux-notification.ux-success { background: #28a745; }',
            '.ux-notification.ux-error { background: #dc3545; }',
            '.ux-notification.ux-info { background: #007bff; }',
            '.ux-notification.ux-warning { background: #ffc107; color: #333; }',
            '.ux-notification i { font-size: 18px; flex-shrink: 0; }',
            '.ux-notification .notif-close {',
                'position: absolute;',
                'top: 6px; right: 8px;',
                'font-size: 12px;',
                'opacity: 0.6;',
                'transition: opacity 0.2s;',
            '}',
            '.ux-notification .notif-close:hover { opacity: 1; }',
            '@media (max-width: 480px) {',
                '#notification-container {',
                    'right: 10px; left: 10px;',
                    'max-width: none;',
                '}',
                '.ux-notification { min-width: auto; }',
            '}',

            /* ---- Back to Top Button ---- */
            '#back-to-top {',
                'position: fixed;',
                'bottom: 30px; right: 30px;',
                'width: 44px; height: 44px;',
                'border-radius: 50%;',
                'background: #007bff;',
                'color: #fff;',
                'border: none;',
                'cursor: pointer;',
                'display: flex;',
                'align-items: center;',
                'justify-content: center;',
                'font-size: 18px;',
                'opacity: 0;',
                'visibility: hidden;',
                'transform: translateY(20px);',
                'transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease, background 0.2s;',
                'z-index: 9999;',
                'box-shadow: 0 2px 10px rgba(0,123,255,0.3);',
            '}',
            '#back-to-top.visible {',
                'opacity: 0.7;',
                'visibility: visible;',
                'transform: translateY(0);',
            '}',
            '#back-to-top:hover {',
                'opacity: 1;',
                'background: #0056b3;',
                'box-shadow: 0 4px 15px rgba(0,123,255,0.4);',
            '}',
            '@media (max-width: 768px) {',
                '#back-to-top { bottom: 20px; right: 20px; width: 40px; height: 40px; font-size: 16px; }',
            '}',

            /* ---- Mobile Nav Toggle ---- */
            '.nav-toggle {',
                'display: none;',
                'background: none;',
                'border: none;',
                'font-size: 24px;',
                'cursor: pointer;',
                'color: #333;',
                'padding: 8px;',
                'line-height: 1;',
                'z-index: 1001;',
            '}',
            '@media (max-width: 768px) {',
                '.nav-toggle { display: block; }',
                '.nav-menu {',
                    'display: none !important;',
                    'position: absolute;',
                    'top: 100%; left: 0; right: 0;',
                    'background: #fff;',
                    'box-shadow: 0 8px 24px rgba(0,0,0,0.12);',
                    'z-index: 1000;',
                    'border-radius: 0 0 12px 12px;',
                    'padding: 12px 0;',
                    'max-height: 0;',
                    'overflow: hidden;',
                    'transition: max-height 0.35s ease, padding 0.35s ease;',
                '}',
                '.nav-menu.active {',
                    'display: block !important;',
                    'max-height: 600px;',
                    'padding: 12px 0;',
                '}',
                '.nav-menu .nav-list {',
                    'flex-direction: column;',
                    'gap: 0;',
                '}',
                '.nav-menu .nav-item { width: 100%; }',
                '.nav-menu .nav-link {',
                    'display: block;',
                    'padding: 12px 20px;',
                    'border-bottom: 1px solid #f0f0f0;',
                '}',
                '.nav-menu .nav-link:last-child { border-bottom: none; }',
                /* fix nav-container for mobile */
                '.navbar .nav-container, .navbar .container {',
                    'flex-wrap: wrap;',
                    'position: relative;',
                '}',
                '.nav-actions .btn-login, .nav-actions .btn-register { display: none; }',
            '}',
            '@media (max-width: 480px) {',
                '.nav-actions { gap: 5px; }',
                '.search-container { max-width: 140px; }',
            '}',

            /* ---- Ripple Effect ---- */
            '.ux-ripple {',
                'position: relative;',
                'overflow: hidden;',
            '}',
            '.ux-ripple .ripple-effect {',
                'position: absolute;',
                'border-radius: 50%;',
                'background: rgba(255,255,255,0.4);',
                'transform: scale(0);',
                'animation: ux-ripple-anim 0.6s ease-out;',
                'pointer-events: none;',
            '}',
            '@keyframes ux-ripple-anim {',
                'to { transform: scale(4); opacity: 0; }',
            '}',

            /* ---- Image Lazy Load Fade-in ---- */
            '.ux-lazy-image {',
                'opacity: 0;',
                'transition: opacity 0.5s ease;',
            '}',
            '.ux-lazy-image.loaded {',
                'opacity: 1;',
            '}',
            '.ux-img-shimmer {',
                'position: relative;',
                'overflow: hidden;',
                'background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);',
                'background-size: 200% 100%;',
                'animation: ux-shimmer 1.5s infinite;',
                'min-height: 100px;',
            '}',
            '@keyframes ux-shimmer {',
                '0% { background-position: 200% 0; }',
                '100% { background-position: -200% 0; }',
            '}',

            /* ---- Responsive grid helpers (injected here as extra safety) ---- */
            '@media (max-width: 768px) {',
                '.products-grid { grid-template-columns: repeat(2, 1fr) !important; }',
            '}',
            '@media (max-width: 480px) {',
                '.products-grid { grid-template-columns: 1fr !important; }',
            '}',
            '@media (max-width: 768px) {',
                '.wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }',
            '}',
            '@media (max-width: 480px) {',
                '.wishlist-grid { grid-template-columns: 1fr !important; }',
            '}',
        ].join('\n');
        document.head.appendChild(style);
    }

    // ============================================================
    // 2. PAGE LOADER
    // ============================================================
    function createPageLoader() {
        var loader = document.getElementById('page-loader');
        if (loader) return loader;

        loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = '<div class="loader-spinner"></div><div class="loader-text">Loading...</div>';

        // Insert as first child of body
        if (document.body.firstChild) {
            document.body.insertBefore(loader, document.body.firstChild);
        } else {
            document.body.appendChild(loader);
        }
        return loader;
    }

    function hidePageLoader() {
        var loader = document.getElementById('page-loader');
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
            // After transition, set display:none
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }
    }

    // ============================================================
    // 3. NOTIFICATION SYSTEM
    // ============================================================
    function createNotificationContainer() {
        var container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    var notificationContainer = null;

    // Icon map
    var NOTIF_ICONS = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    // Map type to CSS class
    var NOTIF_CLASSES = {
        success: 'ux-success',
        error: 'ux-error',
        info: 'ux-info',
        warning: 'ux-warning'
    };

    function showNotification(message, type, duration) {
        if (!notificationContainer) {
            notificationContainer = createNotificationContainer();
        }

        type = type || 'success';
        duration = (typeof duration === 'number') ? duration : 3000;
        var iconClass = NOTIF_ICONS[type] || 'fa-check-circle';
        var typeClass = NOTIF_CLASSES[type] || 'ux-success';

        // Create notification element
        var notif = document.createElement('div');
        notif.className = 'ux-notification ' + typeClass;
        notif.innerHTML = '<i class="fas ' + iconClass + '"></i><span>' + escapeHtml(message) + '</span>';

        // Click to dismiss
        notif.addEventListener('click', function() {
            dismissNotification(notif);
        });

        // Insert at the top (newest first)
        if (notificationContainer.firstChild) {
            notificationContainer.insertBefore(notif, notificationContainer.firstChild);
        } else {
            notificationContainer.appendChild(notif);
        }

        // Trigger show animation
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                notif.classList.add('show');
            });
        });

        // Auto dismiss
        var timer = setTimeout(function() {
            dismissNotification(notif);
        }, duration);

        // Store timer on element so we can cancel if manually dismissed
        notif._dismissTimer = timer;

        return notif;
    }

    function dismissNotification(notif) {
        if (notif._dismissed) return;
        notif._dismissed = true;
        if (notif._dismissTimer) {
            clearTimeout(notif._dismissTimer);
        }
        notif.classList.remove('show');
        setTimeout(function() {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 400);
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ============================================================
    // 4. BACKWARD-COMPATIBLE showNotification (from cart-system)
    // ============================================================
    window.showNotification = function(message) {
        return showNotification(message, 'success', 3000);
    };

    // ============================================================
    // 5. GLOBAL notify API
    // ============================================================
    window.notify = function(message, type, duration) {
        return showNotification(message, type, duration);
    };

    // ============================================================
    // 6. BACK TO TOP BUTTON
    // ============================================================
    function createBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (btn) return btn;

        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Back to top');
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);
        return btn;
    }

    function handleScroll() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    // ============================================================
    // 7. MOBILE NAV TOGGLE
    // ============================================================
    function setupMobileNav() {
        var toggle = document.getElementById('navToggle');
        if (!toggle) return;

        // Find nav-menu - could be .nav-menu or .nav-links
        var navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
        if (!navMenu) return;

        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            var icon = toggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !toggle.contains(e.target)) {
                navMenu.classList.remove('active');
                var icon = toggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // Close on nav link click
        var links = navMenu.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                var icon = toggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
    }

    // ============================================================
    // 8. RIPPLE EFFECT ON TOUCH/BUTTONS
    // ============================================================
    function setupRippleEffect() {
        // Add ripple class to all buttons (excluding those that already have specific handlers)
        var buttons = document.querySelectorAll('button, .btn, .btn-primary, .btn-secondary, .btn-add-to-cart, .btn-wishlist, .btn-checkout, .btn-login, .btn-register, .btn-search, .btn-submit, .btn-pay, .btn-hero, a.btn-hero');
        buttons.forEach(function(btn) {
            if (btn.classList.contains('nav-toggle') || btn.classList.contains('ux-ripple')) return;
            btn.classList.add('ux-ripple');
            btn.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });
    }

    function createRipple(e, element) {
        var rect = element.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left - size/2;
        var y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top - size/2;

        var ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.appendChild(ripple);
        setTimeout(function() {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // ============================================================
    // 9. IMAGE LAZY LOAD FADE-IN + SHIMMER
    // ============================================================
    function setupLazyImages() {
        var images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            // Skip if already processed
            if (img.classList.contains('ux-lazy-image')) return;
            img.classList.add('ux-lazy-image');

            // If already loaded, show immediately
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('loaded');
                return;
            }

            // Create a shimmer placeholder wrapper
            var parent = img.parentNode;
            if (parent && !parent.classList.contains('ux-img-shimmer')) {
                parent.classList.add('ux-img-shimmer');
            }

            // When image loads, remove shimmer and fade in
            img.addEventListener('load', function() {
                img.classList.add('loaded');
                if (parent) {
                    parent.classList.remove('ux-img-shimmer');
                }
            });

            img.addEventListener('error', function() {
                // Still show the image (broken icon) but remove shimmer
                img.classList.add('loaded');
                if (parent) {
                    parent.classList.remove('ux-img-shimmer');
                }
            });
        });

        // Observe dynamically added images
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        var imgs = node.querySelectorAll ? node.querySelectorAll('img[loading="lazy"]') : [];
                        imgs.forEach(function(img) {
                            if (!img.classList.contains('ux-lazy-image')) {
                                img.classList.add('ux-lazy-image');
                                var p = img.parentNode;
                                if (!img.complete || img.naturalWidth === 0) {
                                    if (p && !p.classList.contains('ux-img-shimmer')) {
                                        p.classList.add('ux-img-shimmer');
                                    }
                                    img.addEventListener('load', function() {
                                        img.classList.add('loaded');
                                        if (p) p.classList.remove('ux-img-shimmer');
                                    });
                                    img.addEventListener('error', function() {
                                        img.classList.add('loaded');
                                        if (p) p.classList.remove('ux-img-shimmer');
                                    });
                                } else {
                                    img.classList.add('loaded');
                                }
                            }
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    function init() {
        // Inject CSS first
        injectUXStyles();

        // Create page loader (insert as first child of body)
        createPageLoader();

        // Create notification container
        notificationContainer = createNotificationContainer();

        // Create back-to-top button
        createBackToTop();

        // Setup mobile nav
        setupMobileNav();

        // Setup ripple effect (deferred slightly to ensure all buttons exist)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(setupRippleEffect, 100);
                setTimeout(setupLazyImages, 200);
            });
        } else {
            setTimeout(setupRippleEffect, 100);
            setTimeout(setupLazyImages, 200);
        }

        // Scroll listener for back-to-top
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Hide loader when page is fully loaded
        if (document.readyState === 'complete') {
            hidePageLoader();
        } else {
            window.addEventListener('load', hidePageLoader);
            // Fallback: if load event doesn't fire quickly, hide after 2 seconds anyway
            setTimeout(hidePageLoader, 2000);
        }
    }

    // Run init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
