/**
 * ShopEasy Blog - JavaScript functionality
 * Handles search, filtering, pagination, and article reading
 */
(function () {
    'use strict';

    // ============================================================
    // Blog article data
    // ============================================================
    var blogArticles = [
        {
            id: 0,
            title: "10 Smart Shopping Tips to Save Money in 2025",
            category: "shopping-tips",
            date: "Apr 20, 2025",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
            content: [
                "<h2>Maximize Your Savings with These Proven Strategies</h2>",
                "<p>Shopping online doesn't have to break the bank. With the right strategies, you can save significantly on every purchase. Here are our top 10 tips for saving money while shopping online in 2025.</p>",
                "<h3>1. Use Price Tracking Tools</h3>",
                "<p>Tools like CamelCamelCamel and Honey track price history and alert you when items drop to their lowest price. Never pay full price again.</p>",
                "<h3>2. Subscribe to Newsletters</h3>",
                "<p>Many online stores offer a 10-15% discount just for signing up to their email list. Create a dedicated email folder for shopping deals.</p>",
                "<h3>3. Compare Across Platforms</h3>",
                "<p>Don't settle for the first price you see. Use comparison shopping engines to check prices across multiple retailers before making a decision.</p>",
                "<h3>4. Time Your Purchases</h3>",
                "<p>Major sales events like Black Friday, Cyber Monday, and Prime Day offer the deepest discounts. Plan your big purchases around these dates.</p>",
                "<h3>5. Use Cashback Apps</h3>",
                "<p>Rakuten, TopCashback, and similar apps give you a percentage back on purchases made through their links. It's free money.</p>",
                "<h3>6. Check for Coupon Codes</h3>",
                "<p>Before checking out, spend 30 seconds searching for coupon codes. Sites like RetailMeNot and Honey aggregate active codes.</p>",
                "<h3>7. Buy in Bulk (Smartly)</h3>",
                "<p>Non-perishable items, toiletries, and household supplies are often cheaper when bought in bulk. Calculate the per-unit price to ensure real savings.</p>",
                "<h3>8. Use Store Credit Cards Wisely</h3>",
                "<p>Store cards often come with welcome bonuses and exclusive discounts. But pay off the balance immediately to avoid high interest charges.</p>",
                "<h3>9. Abandon Your Cart</h3>",
                "<p>Leave items in your cart for 24-48 hours. Many retailers send a discount code to encourage you to complete the purchase.</p>",
                "<h3>10. Shop Second-Hand First</h3>",
                "<p>For many categories like electronics, furniture, and books, gently used items offer incredible value. Check certified refurbished options too.</p>",
                "<p class='blog-summary'><strong>Bottom line:</strong> A few extra minutes of research before buying can save you hundreds of dollars each month. Happy (smart) shopping!</p>"
            ]
        },
        {
            id: 1,
            title: "Best Wireless Headphones Under $100: Top 5 Picks",
            category: "product-reviews",
            date: "Apr 18, 2025",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=500&fit=crop",
            content: [
                "<h2>We Tested 20+ Headphones So You Don't Have To</h2>",
                "<p>Great sound shouldn't cost a fortune. We spent two weeks testing over 20 wireless headphones under $100 to find the best balance of sound quality, battery life, comfort, and features.</p>",
                "<h3>#1: SoundCore Life Q30 (Best Overall)</h3>",
                "<p>Price: $79.99 | Battery: 40 hours | Features: Active Noise Cancellation, Multipoint Connection. The Q30s punch way above their weight class with ANC that rivals $200 headphones.</p>",
                "<h3>#2: JBL Tune 510BT (Best Value)</h3>",
                "<p>Price: $49.95 | Battery: 40 hours | Features: Pure Bass Sound, Quick Charge. Incredible value with JBL's signature sound and 40-hour battery life.</p>",
                "<h3>#3: Anker Soundcore P3 (Best Earbuds)</h3>",
                "<p>Price: $79.99 | Battery: 7h (28h with case) | Features: ANC, IPX5, Wireless Charging. The best wireless earbuds under $100 with effective noise cancellation.</p>",
                "<h3>#4: Srhythm NC25 (Best for Travel)</h3>",
                "<p>Price: $59.99 | Battery: 60 hours | Features: 60H Playtime, Foldable Design. The battery life champ — perfect for long flights.</p>",
                "<h3>#5: Mack's RB1-BK (Best Budget Pick)</h3>",
                "<p>Price: $29.99 | Battery: 30 hours | Features: Bluetooth 5.3, Lightweight. Unbeatable at this price point. Basic but reliable.</p>",
                "<p class='blog-summary'><strong>Verdict:</strong> For most people, the SoundCore Life Q30 offers the best overall package. But if you're on a tight budget, the JBL Tune 510BT is excellent value.</p>"
            ]
        },
        {
            id: 2,
            title: "Spring 2025 Fashion Trends: What's In This Season",
            category: "fashion",
            date: "Apr 15, 2025",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop",
            content: [
                "<h2>Refresh Your Wardrobe with These Spring Trends</h2>",
                "<p>Spring 2025 is all about bold colors, relaxed silhouettes, and sustainable fashion. Here are the trends you need to know about this season.</p>",
                "<h3>Pastel Palette</h3>",
                "<p>Soft lavender, mint green, and baby blue are dominating this spring. Pair a pastel blazer with white jeans for an effortlessly chic look.</p>",
                "<h3>Oversized Everything</h3>",
                "<p>From blazers to trousers, relaxed fits are in. The key is balancing proportions — oversized top with fitted bottom, or vice versa.</p>",
                "<h3>Sustainable Fabrics</h3>",
                "<p>Organic cotton, recycled polyester, and TENCEL are becoming mainstream. Look for brands that prioritize eco-friendly materials.</p>",
                "<h3>Statement Accessories</h3>",
                "<p>Chunky gold chains, oversized sunglasses, and structured bags are the finishing touches every outfit needs this season.</p>",
                "<h3>Low-Profile Sneakers</h3>",
                "<p>Bulky dad sneakers are out. Slim, minimalist sneakers in neutral tones are the go-to footwear for spring 2025.</p>",
                "<p class='blog-summary'><strong>Style tip:</strong> Start with one or two trend pieces and mix them with your existing wardrobe. No need to overhaul everything at once!</p>"
            ]
        },
        {
            id: 3,
            title: "Smart Home Gadgets That Actually Make Life Easier",
            category: "tech",
            date: "Apr 12, 2025",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
            content: [
                "<h2>Separating Hype from Helpful</h2>",
                "<p>The smart home market is flooded with gadgets, but not all of them are worth your money. We've tested dozens to find the ones that genuinely improve daily life.</p>",
                "<h3>Smart Plugs ($15-30)</h3>",
                "<p>The cheapest entry point into home automation. Control lamps, fans, and small appliances from your phone. Set schedules to simulate occupancy when you're away.</p>",
                "<h3>Smart Thermostat ($100-250)</h3>",
                "<p>Learn your schedule and adjust temperatures automatically. Most users save 10-15% on heating and cooling costs within the first year.</p>",
                "<h3>Video Doorbell ($100-200)</h3>",
                "<p>See and speak to visitors from anywhere. Package detection features alert you when deliveries arrive — no more missed packages.</p>",
                "<h3>Smart Lights ($10-50 per bulb)</h3>",
                "<p>Set schedules, change colors, and control with voice commands. Great for wake-up routines, security, and creating ambiance.</p>",
                "<h3>Robot Vacuum ($200-600)</h3>",
                "<p>Set it and forget it. Modern robot vacuums map your home, avoid obstacles, and empty themselves. Worth every penny for pet owners.</p>",
                "<p class='blog-summary'><strong>Pro tip:</strong> Start with one or two smart plugs ($15 each) to dip your toes in. Then expand gradually as you discover what works for your routine.</p>"
            ]
        },
        {
            id: 4,
            title: "Ultimate Home Office Setup: Ergonomic & Affordable",
            category: "lifestyle",
            date: "Apr 10, 2025",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
            content: [
                "<h2>Work Comfortably Without Breaking the Bank</h2>",
                "<p>A well-designed home office doesn't have to cost thousands. Here's how to create an ergonomic, productive workspace on a budget.</p>",
                "<h3>1. The Desk ($80-200)</h3>",
                "<p>A sturdy desk is the foundation. Look for a standing desk converter ($150-300) if you want to alternate between sitting and standing. Or a simple IKEA desk ($80) works great.</p>",
                "<h3>2. The Chair ($100-300)</h3>",
                "<p>Don't skimp on your chair. The Autonomous ErgoChair Core ($299) or IKEA Markus ($179) offer excellent ergonomics without Herman Miller prices.</p>",
                "<h3>3. Monitor Arm ($30-60)</h3>",
                "<p>A monitor arm frees up desk space and lets you position your screen at eye level. It's the single best ergonomic upgrade under $50.</p>",
                "<h3>4. Keyboard & Mouse ($40-100)</h3>",
                "<p>An ergonomic keyboard and vertical mouse reduce wrist strain. The Logitech ERGO K860 ($99) and MX Vertical ($99) are top picks.</p>",
                "<h3>5. Lighting ($20-50)</h3>",
                "<p>Good lighting reduces eye strain. A desk lamp with adjustable brightness and color temperature makes a huge difference.</p>",
                "<p class='blog-summary'><strong>Budget total:</strong> You can build a solid home office for under $500. Your back and productivity will thank you!</p>"
            ]
        },
        {
            id: 5,
            title: "Online Shopping Safety: Protect Yourself in 2025",
            category: "shopping-tips",
            date: "Apr 8, 2025",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
            content: [
                "<h2>Stay Safe While Shopping Online</h2>",
                "<p>Online shopping is convenient, but it comes with risks. Follow these essential safety tips to protect your personal and financial information.</p>",
                "<h3>1. Shop on Secure Sites Only</h3>",
                "<p>Look for 'https://' and a padlock icon in the address bar before entering payment information. Avoid sites that only show 'http://'.</p>",
                "<h3>2. Use Credit Cards, Not Debit Cards</h3>",
                "<p>Credit cards offer better fraud protection. If your card info is stolen, you can dispute charges without losing access to your bank funds.</p>",
                "<h3>3. Enable Two-Factor Authentication</h3>",
                "<p>Add an extra layer of security to your shopping accounts. 2FA prevents unauthorized access even if your password is compromised.</p>",
                "<h3>4. Avoid Public Wi-Fi for Purchases</h3>",
                "<p>Public Wi-Fi networks are easy targets for hackers. Use a VPN or save your shopping for when you're on a secure network.</p>",
                "<h3>5. Monitor Your Statements</h3>",
                "<p>Regularly check your bank and credit card statements for unauthorized charges. Report suspicious activity immediately.</p>",
                "<p class='blog-summary'><strong>Remember:</strong> If a deal seems too good to be true, it probably is. Trust your instincts and shop smart!</p>"
            ]
        },
        {
            id: 6,
            title: "Budget Smartwatches Compared: Which One Should You Buy?",
            category: "product-reviews",
            date: "Apr 5, 2025",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
            content: [
                "<h2>Great Smartwatches That Won't Break the Bank</h2>",
                "<p>You don't need to spend $400+ for a capable smartwatch. We compared the best options under $200 to find the winner.</p>",
                "<h3>Amazfit Bip 5 ($89.99)</h3>",
                "<p>Best battery life in class at 10 days. Large 1.91-inch display, built-in GPS, and over 120 sport modes. Great for fitness tracking.</p>",
                "<h3>Xiaomi Smart Band 8 Pro ($79.99)</h3>",
                "<p>Excellent value with a vibrant AMOLED display, 14-day battery, and accurate heart rate monitoring. The best bang for your buck.</p>",
                "<h3>Garmin Venu Sq 2 ($199.99)</h3>",
                "<p>Best for serious fitness enthusiasts. Advanced health metrics, body battery, stress tracking, and Garmin's ecosystem. Worth the premium.</p>",
                "<h3>Fossil Gen 6 ($179.99)</h3>",
                "<p>Best for style-conscious users. Runs Wear OS, supports Google Pay, and looks like a traditional watch. Great app ecosystem.</p>",
                "<p class='blog-summary'><strong>Pick:</strong> For most people, the Amazfit Bip 5 offers the best balance of features, battery life, and price. Battery life alone makes it a winner.</p>"
            ]
        },
        {
            id: 7,
            title: "How to Build a Capsule Wardrobe on a Budget",
            category: "fashion",
            date: "Apr 2, 2025",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
            content: [
                "<h2>25 Pieces, Endless Outfits</h2>",
                "<p>A capsule wardrobe simplifies your life, saves money, and reduces decision fatigue. Here's how to build one with just 25 essential pieces.</p>",
                "<h3>The Concept</h3>",
                "<p>A capsule wardrobe consists of versatile, high-quality pieces that can be mixed and matched to create dozens of outfits. The goal: own less, wear more.</p>",
                "<h3>Core Pieces (15 items)</h3>",
                "<p>White t-shirt (2), striped tee, button-down shirt (2), dark jeans, black trousers, blazer, cardigan, little black dress, denim jacket, trench coat, white sneakers, loafers, leather boots.</p>",
                "<h3>Seasonal Additions (5 items)</h3>",
                "<p>Switch these based on the season: swimsuit/shorts (summer), cashmere sweater/wool coat (winter), rain jacket/scarf (spring/fall).</p>",
                "<h3>Accessories (5 items)</h3>",
                "<p>A quality watch, leather belt, crossbody bag, silk scarf, and sunglasses complete every outfit.</p>",
                "<h3>Budget Breakdown</h3>",
                "<p>Start with basics from Uniqlo, H&M, and Target. Slowly upgrade pieces as your budget allows. Total initial investment: $300-500.</p>",
                "<p class='blog-summary'><strong>Result:</strong> 25 pieces that create 50+ unique outfits. Less clutter, more style, and significant savings over time.</p>"
            ]
        },
        {
            id: 8,
            title: "Best Tech Gifts Under $50: Unique Ideas for Any Occasion",
            category: "tech",
            date: "Mar 30, 2025",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
            content: [
                "<h2>Affordable Tech Gifts That Impress</h2>",
                "<p>You don't need to spend a fortune to give a great tech gift. These gadgets under $50 are useful, fun, and they won't break your budget.</p>",
                "<h3>1. Tile Mate ($24.99)</h3>",
                "<p>Never lose your keys again. The Bluetooth tracker works with your phone to find lost items. A practical gift everyone needs.</p>",
                "<h3>2. Anker Power Bank ($25.99)</h3>",
                "<p>A 10,000mAh power bank fits in a pocket and charges a phone 2-3 times. Anker makes the most reliable portable chargers.</p>",
                "<h3>3. Phone Ring Light ($15.99)</h3>",
                "<p>Perfect for video calls, selfies, and content creators. Clips onto your phone for flattering lighting anywhere.</p>",
                "<h3>4. Wireless Charging Pad ($19.99)</h3>",
                "<p>Drop-and-charge convenience for any Qi-compatible phone. Get a 3-in-1 pad that also charges AirPods and Apple Watch.</p>",
                "<h3>5. LED Desk Lamp with USB ($39.99)</h3>",
                "<p>Adjustable brightness, color temperature, and built-in charging ports. A practical upgrade for any desk.</p>",
                "<p class='blog-summary'><strong>Gift tip:</strong> Combine 2-3 items for a themed gift bundle. A 'Home Office Starter Kit' with a power bank, ring light, and desk lamp costs under $70 total.</p>"
            ]
        }
    ];

    var currentPage = 1;
    var postsPerPage = 6;
    var currentCategory = 'all';
    var currentQuery = '';
    var filteredArticles = [];

    // ============================================================
    // Filter & search
    // ============================================================
    function filterArticles() {
        filteredArticles = blogArticles.filter(function (article) {
            var matchesCategory = currentCategory === 'all' || article.category === currentCategory;
            var matchesSearch = !currentQuery ||
                article.title.toLowerCase().indexOf(currentQuery.toLowerCase()) !== -1 ||
                article.content.join(' ').toLowerCase().indexOf(currentQuery.toLowerCase()) !== -1;
            return matchesCategory && matchesSearch;
        });
    }

    // ============================================================
    // Render posts for current page
    // ============================================================
    function renderPosts() {
        filterArticles();

        var grid = document.getElementById('blogGrid');
        var pagination = document.getElementById('blogPagination');
        if (!grid) return;

        var totalPages = Math.ceil(filteredArticles.length / postsPerPage);
        if (totalPages < 1) totalPages = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        var start = (currentPage - 1) * postsPerPage;
        var end = Math.min(start + postsPerPage, filteredArticles.length);
        var pageArticles = filteredArticles.slice(start, end);

        if (pageArticles.length === 0) {
            grid.innerHTML = '<div class="blog-no-results"><i class="fas fa-search"></i><h3>No articles found</h3><p>Try a different search or category.</p></div>';
            if (pagination) pagination.style.display = 'none';
            return;
        }

        var html = '';
        for (var i = 0; i < pageArticles.length; i++) {
            var a = pageArticles[i];
            var catClass = a.category;
            var catLabel = getCategoryLabel(a.category);
            html += '<article class="blog-card" data-category="' + catClass + '" data-date="' + a.date + '">' +
                '<div class="blog-card-image">' +
                    '<img src="' + a.image + '" alt="' + escapeHtml(a.title) + '" loading="lazy">' +
                    '<span class="blog-category-badge">' + escapeHtml(catLabel) + '</span>' +
                '</div>' +
                '<div class="blog-card-body">' +
                    '<div class="blog-meta">' +
                        '<span class="blog-date"><i class="far fa-calendar-alt"></i> ' + a.date + '</span>' +
                        '<span class="blog-read-time"><i class="far fa-clock"></i> ' + a.readTime + '</span>' +
                    '</div>' +
                    '<h3 class="blog-title">' + escapeHtml(a.title) + '</h3>' +
                    '<p class="blog-excerpt">' + getExcerpt(a) + '</p>' +
                    '<a href="#" class="blog-read-more" data-id="' + a.id + '">Read More <i class="fas fa-arrow-right"></i></a>' +
                '</div>' +
            '</article>';
        }
        grid.innerHTML = html;

        // Attach click handlers
        var readMoreLinks = grid.querySelectorAll('.blog-read-more');
        for (var j = 0; j < readMoreLinks.length; j++) {
            readMoreLinks[j].addEventListener('click', function (e) {
                e.preventDefault();
                var id = parseInt(this.getAttribute('data-id'), 10);
                openBlogPost(id);
            });
        }

        // Update pagination
        if (pagination) {
            if (totalPages <= 1) {
                pagination.style.display = 'none';
            } else {
                pagination.style.display = 'flex';
                var pagHtml = '';
                for (var p = 1; p <= totalPages; p++) {
                    pagHtml += '<button class="pagination-btn' + (p === currentPage ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
                }
                pagination.innerHTML = pagHtml;

                var pageBtns = pagination.querySelectorAll('.pagination-btn');
                for (var k = 0; k < pageBtns.length; k++) {
                    pageBtns[k].addEventListener('click', function () {
                        currentPage = parseInt(this.getAttribute('data-page'), 10);
                        renderPosts();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
            }
        }
    }

    function getCategoryLabel(cat) {
        var labels = {
            'shopping-tips': 'Shopping Tips',
            'product-reviews': 'Product Reviews',
            'fashion': 'Fashion',
            'tech': 'Tech',
            'lifestyle': 'Lifestyle'
        };
        return labels[cat] || cat;
    }

    function getExcerpt(article) {
        // Get first paragraph text from content
        for (var i = 0; i < article.content.length; i++) {
            var p = article.content[i];
            if (p.indexOf('<p>') === 0 && p.indexOf('<p class=') !== 0) {
                var text = p.replace(/<[^>]+>/g, '').trim();
                if (text.length > 120) return text.substring(0, 120) + '...';
                return text;
            }
        }
        return 'Read this article for more information...';
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ============================================================
    // Open blog post in modal
    // ============================================================
    window.openBlogPost = function (id) {
        var article = blogArticles[id];
        if (!article) return;

        var body = document.getElementById('blogModalBody');
        var overlay = document.getElementById('blogModalOverlay');
        if (!body || !overlay) return;

        var catLabel = getCategoryLabel(article.category);
        var contentHtml = article.content.join('\n');

        body.innerHTML =
            '<div class="blog-modal-header">' +
                '<img src="' + article.image + '" alt="' + escapeHtml(article.title) + '" loading="lazy" class="blog-modal-image">' +
                '<span class="blog-category-badge">' + escapeHtml(catLabel) + '</span>' +
                '<div class="blog-modal-meta">' +
                    '<span><i class="far fa-calendar-alt"></i> ' + article.date + '</span>' +
                    '<span><i class="far fa-clock"></i> ' + article.readTime + '</span>' +
                '</div>' +
                '<h1 class="blog-modal-title">' + escapeHtml(article.title) + '</h1>' +
            '</div>' +
            '<div class="blog-modal-body">' + contentHtml + '</div>';

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeBlogModal = function () {
        var overlay = document.getElementById('blogModalOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    window.subscribeNewsletter = function (e) {
        e.preventDefault();
        var input = document.querySelector('.newsletter-input');
        if (input && input.value.trim()) {
            alert('Thank you for subscribing! You\'ll receive our latest updates.');
            input.value = '';
        }
        return false;
    };

    // ============================================================
    // Init
    // ============================================================
    function init() {
        // Category tabs
        var tabs = document.querySelectorAll('.blog-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                var parent = this.parentElement;
                var active = parent.querySelector('.active');
                if (active) active.classList.remove('active');
                this.classList.add('active');
                currentCategory = this.getAttribute('data-category');
                currentPage = 1;
                renderPosts();
            });
        }

        // Search input
        var searchInput = document.getElementById('blogSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                currentQuery = this.value.trim();
                currentPage = 1;
                renderPosts();
            });
        }

        // Initial render
        renderPosts();

        // Close modal on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeBlogModal();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
