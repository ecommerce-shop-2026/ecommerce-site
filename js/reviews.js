/**
 * ShopEasy Reviews System
 * Complete product evaluation system with localStorage persistence
 * 
 * Data structure: { productId: [{ id, userName, rating, title, comment, date, verified }] }
 * localStorage key: 'shopEasyReviews'
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'shopEasyReviews';

    // ============================
    // CSS Style Injection
    // ============================
    function injectStyles() {
        const styleId = 'shopEasyReviewsStyles';
        if (document.getElementById(styleId)) return;

        const css = `
            /* Reviews Summary */
            .reviews-summary {
                display: grid;
                grid-template-columns: 280px 1fr;
                gap: 40px;
                padding: 30px;
                background: linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%);
                border-radius: 16px;
                margin-bottom: 35px;
                border: 1px solid #e8f0fe;
            }

            .average-rating {
                text-align: center;
                padding: 15px 0;
            }

            .rating-number {
                font-size: 56px;
                font-weight: 700;
                color: #1e293b;
                line-height: 1;
                margin-bottom: 8px;
            }

            .average-rating .stars-large {
                display: flex;
                justify-content: center;
                gap: 4px;
                font-size: 24px;
                color: #f59e0b;
                margin-bottom: 10px;
            }

            .total-reviews {
                font-size: 15px;
                color: #64748b;
                font-weight: 500;
            }

            .rating-distribution {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 8px 0;
            }

            .rating-bar {
                display: grid;
                grid-template-columns: 60px 1fr 40px;
                align-items: center;
                gap: 12px;
                font-size: 13px;
            }

            .rating-bar span:first-child {
                color: #475569;
                font-weight: 500;
                text-align: right;
            }

            .bar-container {
                height: 10px;
                background: #e2e8f0;
                border-radius: 5px;
                overflow: hidden;
                position: relative;
            }

            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #f59e0b, #f97316);
                border-radius: 5px;
                transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .rating-bar span:last-child {
                color: #64748b;
                font-weight: 500;
                text-align: left;
            }

            /* Review Cards */
            .reviews-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 35px;
            }

            .review-card {
                background: white;
                border: 1px solid #e9edf4;
                border-radius: 12px;
                padding: 24px;
                transition: box-shadow 0.2s ease;
            }

            .review-card:hover {
                box-shadow: 0 4px 16px rgba(0,0,0,0.06);
            }

            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
                flex-wrap: wrap;
                gap: 8px;
            }

            .review-user-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .review-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 16px;
                flex-shrink: 0;
            }

            .review-user-name {
                font-weight: 600;
                color: #1e293b;
                font-size: 15px;
            }

            .review-date {
                font-size: 13px;
                color: #94a3b8;
            }

            .review-rating {
                display: flex;
                gap: 2px;
                color: #f59e0b;
                font-size: 16px;
            }

            .review-verified {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: #d1fae5;
                color: #065f46;
                font-size: 11px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
                white-space: nowrap;
            }

            .review-verified i {
                font-size: 10px;
            }

            .review-title {
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 8px;
                margin-top: 4px;
            }

            .review-comment {
                font-size: 14px;
                line-height: 1.7;
                color: #475569;
            }

            /* Review Form */
            .review-form-container {
                background: white;
                border: 1px solid #e9edf4;
                border-radius: 12px;
                padding: 30px;
                margin-top: 10px;
            }

            .review-form-container h3 {
                font-size: 20px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-group {
                margin-bottom: 18px;
            }

            .form-group label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 6px;
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                font-size: 15px;
                font-family: inherit;
                transition: border-color 0.3s, box-shadow 0.3s;
                background: #f9fafb;
                box-sizing: border-box;
            }

            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                background: white;
            }

            .form-group textarea {
                resize: vertical;
                min-height: 100px;
            }

            .form-group input.error,
            .form-group textarea.error {
                border-color: #ef4444;
                background: #fef2f2;
            }

            .rating-input-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 18px;
            }

            .rating-input-wrapper label {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0;
            }

            .review-star-input {
                display: flex;
                gap: 4px;
                font-size: 28px;
                cursor: pointer;
            }

            .review-star-input i {
                color: #d1d5db;
                transition: color 0.15s ease, transform 0.15s ease;
            }

            .review-star-input i.active,
            .review-star-input i.hover {
                color: #f59e0b;
            }

            .review-star-input i.hover {
                transform: scale(1.15);
            }

            .rating-text {
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                min-width: 70px;
            }

            .btn-submit-review {
                padding: 14px 32px;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .btn-submit-review:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(59,130,246,0.3);
            }

            .btn-submit-review:active {
                transform: translateY(0);
            }

            .btn-submit-review:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }

            /* Empty state */
            .reviews-empty {
                text-align: center;
                padding: 50px 20px;
                color: #94a3b8;
            }

            .reviews-empty i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }

            .reviews-empty p {
                font-size: 16px;
            }

            /* Success message */
            .review-success-msg {
                background: #d1fae5;
                border: 1px solid #a7f3d0;
                color: #065f46;
                padding: 16px 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 15px;
                font-weight: 500;
                animation: reviewFadeIn 0.4s ease;
            }

            .review-success-msg i {
                font-size: 20px;
            }

            .review-error-msg {
                background: #fee2e2;
                border: 1px solid #fecaca;
                color: #991b1b;
                padding: 12px 16px;
                border-radius: 10px;
                margin-top: 12px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: reviewFadeIn 0.3s ease;
            }

            .review-error-msg i {
                font-size: 16px;
            }

            @keyframes reviewFadeIn {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @media (max-width: 768px) {
                .reviews-summary {
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 20px;
                }
                .rating-number {
                    font-size: 42px;
                }
                .review-card {
                    padding: 18px;
                }
                .review-form-container {
                    padding: 20px;
                }
                .review-header {
                    flex-direction: column;
                }
                .review-verified {
                    align-self: flex-start;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ============================
    // Sample data generation
    // ============================
    const sampleUserNames = [
        'Alice M.', 'Bob K.', 'Carol S.', 'David L.', 'Emma W.',
        'Frank P.', 'Grace H.', 'Henry Z.', 'Ivy R.', 'Jack C.',
        'Karen Y.', 'Leo D.', 'Maria T.', 'Nathan B.', 'Olivia F.'
    ];

    const sampleTitles = [
        'Great product!', 'Highly recommend', 'Good value for money',
        'Exceeded expectations', 'Solid purchase', 'Love it!',
        'Worth every penny', 'Better than expected', 'Nice quality',
        'Perfect gift', 'Excellent build quality', 'Very satisfied',
        'Happy with my purchase', 'Decent product', 'Amazing!',
        'Would buy again', 'Top notch quality', 'Really impressed',
        'Good but could improve', 'Fantastic experience'
    ];

    const sampleComments = [
        'Really impressed with the quality. The materials feel premium and it arrived earlier than expected.',
        'I have been using this for a week now and it works perfectly. Highly recommend to anyone looking for a good product.',
        'Great value for the price. Does exactly what it claims and the customer service was helpful when I had a question.',
        'Exceeded my expectations in every way. The packaging was nice and the product itself feels well-made.',
        'Solid product overall. A few minor things could be improved but nothing major. Happy with my purchase.',
        'Love this! The quality is fantastic and it looks even better in person. Shipping was fast too.',
        'Would definitely recommend. I did a lot of research before buying and this was the best option by far.',
        'Perfect for what I needed it for. The design is thoughtful and the materials are high quality.',
        'Very satisfied with this purchase. It arrived quickly and the quality matches the description perfectly.',
        'I bought this as a gift and the recipient loved it. Great presentation and excellent functionality.',
        'Good quality product. Works as described and feels durable. Would buy from this brand again.',
        'Really happy with this. The build quality is excellent and it has some nice features I didnt expect.'
    ];

    function generateSampleReviews() {
        const data = {};
        const ratingWeights = [5, 4, 3, 2, 1];
        const ratingProbs = [0.40, 0.35, 0.15, 0.07, 0.03]; // realistic distribution

        for (let productId = 1; productId <= 8; productId++) {
            const numReviews = 3 + Math.floor(Math.random() * 3); // 3-5
            const reviews = [];

            for (let i = 0; i < numReviews; i++) {
                // Weighted random rating
                const r = Math.random();
                let cumProb = 0;
                let rating = 5;
                for (let j = 0; j < ratingWeights.length; j++) {
                    cumProb += ratingProbs[j];
                    if (r < cumProb) {
                        rating = ratingWeights[j];
                        break;
                    }
                }

                const daysAgo = Math.floor(Math.random() * 180) + 1; // 1-180 days ago
                const reviewDate = new Date();
                reviewDate.setDate(reviewDate.getDate() - daysAgo);

                reviews.push({
                    id: 'rev_' + productId + '_' + i + '_' + Date.now(),
                    userName: sampleUserNames[Math.floor(Math.random() * sampleUserNames.length)],
                    rating: rating,
                    title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
                    comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
                    date: reviewDate.toISOString().split('T')[0],
                    verified: Math.random() > 0.3 // ~70% are verified purchases
                });
            }

            // Sort by date descending
            reviews.sort((a, b) => b.date.localeCompare(a.date));
            data[productId] = reviews;
        }

        return data;
    }

    // ============================
    // Data Management
    // ============================
    function loadData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if we have data for products 1-8
                let hasAllProducts = true;
                for (let id = 1; id <= 8; id++) {
                    if (!parsed[id] || !Array.isArray(parsed[id]) || parsed[id].length === 0) {
                        hasAllProducts = false;
                        break;
                    }
                }
                if (hasAllProducts) return parsed;
            }
        } catch (e) {
            // Ignore parse errors, regenerate
        }

        // Initialize with sample data
        const data = generateSampleReviews();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    }

    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save reviews to localStorage:', e);
        }
    }

    function getData() {
        return loadData();
    }

    // ============================
    // Public API
    // ============================
    const ReviewsAPI = {
        /**
         * Get all reviews for a product
         * @param {number} productId
         * @returns {Array} Array of review objects
         */
        getReviews: function(productId) {
            const data = getData();
            return data[productId] || [];
        },

        /**
         * Add a review for a product
         * @param {number} productId
         * @param {object} reviewData - { userName, rating, title, comment }
         * @returns {object} The newly created review
         */
        addReview: function(productId, reviewData) {
            if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }
            if (!reviewData.comment || reviewData.comment.trim() === '') {
                throw new Error('Comment is required');
            }

            const data = getData();
            if (!data[productId]) {
                data[productId] = [];
            }

            const newReview = {
                id: 'rev_' + productId + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                userName: (reviewData.userName && reviewData.userName.trim()) ? reviewData.userName.trim() : 'Anonymous',
                rating: Math.round(reviewData.rating),
                title: (reviewData.title && reviewData.title.trim()) ? reviewData.title.trim() : '',
                comment: reviewData.comment.trim(),
                date: new Date().toISOString().split('T')[0],
                verified: true
            };

            data[productId].unshift(newReview);
            saveData(data);
            return newReview;
        },

        /**
         * Get average rating and total count for a product
         * @param {number} productId
         * @returns {object} { average, count }
         */
        getAverageRating: function(productId) {
            const reviews = this.getReviews(productId);
            if (!reviews || reviews.length === 0) {
                return { average: 0, count: 0 };
            }

            const total = reviews.reduce((sum, r) => sum + r.rating, 0);
            return {
                average: Math.round((total / reviews.length) * 10) / 10,
                count: reviews.length
            };
        },

        /**
         * Get rating distribution percentages for a product
         * @param {number} productId
         * @returns {object} { 5: %, 4: %, 3: %, 2: %, 1: % }
         */
        getRatingDistribution: function(productId) {
            const reviews = this.getReviews(productId);
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            if (!reviews || reviews.length === 0) {
                return distribution;
            }

            reviews.forEach(r => {
                const star = Math.min(5, Math.max(1, Math.round(r.rating)));
                distribution[star]++;
            });

            const total = reviews.length;
            const result = {};
            for (let i = 5; i >= 1; i--) {
                result[i] = Math.round((distribution[i] / total) * 100);
            }
            return result;
        },

        /**
         * Render all reviews for a product into a container
         * @param {number} productId
         * @param {string|Element} containerSelector - CSS selector or DOM element
         */
        renderReviews: function(productId, containerSelector) {
            const container = typeof containerSelector === 'string'
                ? document.querySelector(containerSelector)
                : containerSelector;

            if (!container) {
                console.error('Reviews container not found:', containerSelector);
                return;
            }

            const reviews = this.getReviews(productId);
            const avgData = this.getAverageRating(productId);
            const distribution = this.getRatingDistribution(productId);

            // Clear container
            container.innerHTML = '';

            // --- Summary Section ---
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'reviews-summary';

            // Average rating
            const avgDiv = document.createElement('div');
            avgDiv.className = 'average-rating';

            const ratingNum = document.createElement('div');
            ratingNum.className = 'rating-number';
            ratingNum.textContent = avgData.count > 0 ? avgData.average.toFixed(1) : '0.0';

            const starsDiv = document.createElement('div');
            starsDiv.className = 'stars-large';
            starsDiv.innerHTML = this._createStarHTML(avgData.average, 24);

            const totalReviews = document.createElement('div');
            totalReviews.className = 'total-reviews';
            totalReviews.textContent = avgData.count > 0
                ? avgData.count + ' review' + (avgData.count !== 1 ? 's' : '')
                : 'No reviews yet';

            avgDiv.appendChild(ratingNum);
            avgDiv.appendChild(starsDiv);
            avgDiv.appendChild(totalReviews);

            // Distribution
            const distDiv = document.createElement('div');
            distDiv.className = 'rating-distribution';

            const starLabels = ['5 stars', '4 stars', '3 stars', '2 stars', '1 star'];
            for (let i = 5; i >= 1; i--) {
                const bar = document.createElement('div');
                bar.className = 'rating-bar';

                const labelSpan = document.createElement('span');
                labelSpan.textContent = starLabels[5 - i];

                const barContainer = document.createElement('div');
                barContainer.className = 'bar-container';

                const barFill = document.createElement('div');
                barFill.className = 'bar-fill';
                barFill.style.width = distribution[i] + '%';

                barContainer.appendChild(barFill);

                const pctSpan = document.createElement('span');
                pctSpan.textContent = distribution[i] + '%';

                bar.appendChild(labelSpan);
                bar.appendChild(barContainer);
                bar.appendChild(pctSpan);
                distDiv.appendChild(bar);
            }

            summaryDiv.appendChild(avgDiv);
            summaryDiv.appendChild(distDiv);
            container.appendChild(summaryDiv);

            // --- Reviews List ---
            const listDiv = document.createElement('div');
            listDiv.className = 'reviews-list';

            if (!reviews || reviews.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'reviews-empty';
                emptyDiv.innerHTML = '<i class="far fa-comment-dots"></i><p>No reviews yet. Be the first to review this product!</p>';
                listDiv.appendChild(emptyDiv);
            } else {
                reviews.forEach(review => {
                    const card = this._createReviewCard(review);
                    listDiv.appendChild(card);
                });
            }

            container.appendChild(listDiv);
        },

        /**
         * Render review form into a container
         * @param {number} productId
         * @param {string|Element} containerSelector - CSS selector or DOM element
         */
        renderReviewForm: function(productId, containerSelector) {
            const container = typeof containerSelector === 'string'
                ? document.querySelector(containerSelector)
                : containerSelector;

            if (!container) {
                console.error('Review form container not found:', containerSelector);
                return;
            }

            // Clear container
            container.innerHTML = '';

            // Create form container
            const formContainer = document.createElement('div');
            formContainer.className = 'review-form-container';

            const heading = document.createElement('h3');
            heading.innerHTML = '<i class="fas fa-pen"></i> Write a Review';
            formContainer.appendChild(heading);

            // Rating input
            const ratingWrapper = document.createElement('div');
            ratingWrapper.className = 'rating-input-wrapper';

            const ratingLabel = document.createElement('label');
            ratingLabel.textContent = 'Your Rating:';
            ratingWrapper.appendChild(ratingLabel);

            const starInput = document.createElement('div');
            starInput.className = 'review-star-input';

            let currentRating = 0;
            const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
            const ratingTextSpan = document.createElement('span');
            ratingTextSpan.className = 'rating-text';
            ratingTextSpan.textContent = '';

            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = 'far fa-star';
                star.dataset.value = i;

                star.addEventListener('mouseenter', function() {
                    const val = parseInt(this.dataset.value);
                    const allStars = starInput.querySelectorAll('i');
                    allStars.forEach((s, idx) => {
                        if (idx < val) s.classList.add('hover');
                        else s.classList.remove('hover');
                    });
                    ratingTextSpan.textContent = ratingTexts[val];
                });

                star.addEventListener('mouseleave', function() {
                    const allStars = starInput.querySelectorAll('i');
                    allStars.forEach(s => s.classList.remove('hover'));
                    ratingTextSpan.textContent = currentRating > 0 ? ratingTexts[currentRating] : '';
                });

                star.addEventListener('click', function() {
                    const val = parseInt(this.dataset.value);
                    currentRating = val;
                    const allStars = starInput.querySelectorAll('i');
                    allStars.forEach((s, idx) => {
                        if (idx < val) {
                            s.className = 'fas fa-star active';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                    ratingTextSpan.textContent = ratingTexts[val];
                });

                starInput.appendChild(star);
            }

            ratingWrapper.appendChild(starInput);
            ratingWrapper.appendChild(ratingTextSpan);
            formContainer.appendChild(ratingWrapper);

            // User name field
            const nameGroup = document.createElement('div');
            nameGroup.className = 'form-group';
            const nameLabel = document.createElement('label');
            nameLabel.setAttribute('for', 'review-name');
            nameLabel.textContent = 'Your Name (optional):';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'review-name';
            nameInput.placeholder = 'Enter your name';
            nameGroup.appendChild(nameLabel);
            nameGroup.appendChild(nameInput);
            formContainer.appendChild(nameGroup);

            // Title field
            const titleGroup = document.createElement('div');
            titleGroup.className = 'form-group';
            const titleLabel = document.createElement('label');
            titleLabel.setAttribute('for', 'review-title');
            titleLabel.textContent = 'Review Title (optional):';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.id = 'review-title';
            titleInput.placeholder = 'Summarize your experience';
            titleGroup.appendChild(titleLabel);
            titleGroup.appendChild(titleInput);
            formContainer.appendChild(titleGroup);

            // Comment field
            const commentGroup = document.createElement('div');
            commentGroup.className = 'form-group';
            const commentLabel = document.createElement('label');
            commentLabel.setAttribute('for', 'review-comment');
            commentLabel.textContent = 'Your Review: *';
            const commentTextarea = document.createElement('textarea');
            commentTextarea.id = 'review-comment';
            commentTextarea.placeholder = 'Share your experience with this product...';
            commentTextarea.rows = 4;
            commentGroup.appendChild(commentLabel);
            commentGroup.appendChild(commentTextarea);
            formContainer.appendChild(commentGroup);

            // Submit button
            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn-submit-review';
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
            formContainer.appendChild(submitBtn);

            // Success message placeholder
            const successMsg = document.createElement('div');
            successMsg.style.display = 'none';
            successMsg.className = 'review-success-msg';
            successMsg.innerHTML = '<i class="fas fa-check-circle"></i><span>Thank you! Your review has been submitted successfully.</span>';
            formContainer.appendChild(successMsg);

            // Error message placeholder
            const errorMsg = document.createElement('div');
            errorMsg.style.display = 'none';
            errorMsg.className = 'review-error-msg';
            formContainer.appendChild(errorMsg);

            container.appendChild(formContainer);

            // --- Submit handler ---
            submitBtn.addEventListener('click', function() {
                // Clear previous errors
                errorMsg.style.display = 'none';
                commentTextarea.classList.remove('error');
                ratingTextSpan.textContent = currentRating > 0 ? ratingTexts[currentRating] : '';

                // Validation
                if (currentRating === 0) {
                    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please select a rating.';
                    errorMsg.style.display = 'flex';
                    return;
                }

                const comment = commentTextarea.value.trim();
                if (!comment) {
                    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please write a review comment.';
                    errorMsg.style.display = 'flex';
                    commentTextarea.classList.add('error');
                    return;
                }

                const userName = nameInput.value.trim() || 'Anonymous';
                const title = titleInput.value.trim() || '';

                // Save review
                try {
                    ReviewsAPI.addReview(productId, {
                        userName: userName,
                        rating: currentRating,
                        title: title,
                        comment: comment
                    });

                    // Show success
                    successMsg.style.display = 'flex';
                    errorMsg.style.display = 'none';

                    // Reset form
                    currentRating = 0;
                    starInput.querySelectorAll('i').forEach(s => s.className = 'far fa-star');
                    nameInput.value = '';
                    titleInput.value = '';
                    commentTextarea.value = '';
                    ratingTextSpan.textContent = '';

                    // Re-render reviews list if it exists
                    const reviewsListContainer = container.closest('.tab-pane')?.querySelector('.reviews-summary')?.parentNode;
                    if (reviewsListContainer && reviewsListContainer !== container) {
                        ReviewsAPI.renderReviews(productId, reviewsListContainer);
                    } else {
                        // Try to find a reviews-list parent or sibling
                        const parentSection = container.closest('#reviews');
                        if (parentSection) {
                            // Re-render into the reviews tab's content area (excluding the form)
                            const summaryArea = parentSection.querySelector('.reviews-summary');
                            if (summaryArea) {
                                // Replace the summary and list but keep the form
                                ReviewsAPI.renderReviews(productId, parentSection);
                                // Re-append the form
                                parentSection.appendChild(container);
                            } else {
                                ReviewsAPI.renderReviews(productId, parentSection);
                                parentSection.appendChild(container);
                            }
                        }
                    }

                    // Auto hide success message after 4 seconds
                    setTimeout(function() {
                        successMsg.style.display = 'none';
                    }, 4000);

                } catch (e) {
                    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + e.message;
                    errorMsg.style.display = 'flex';
                }
            });
        },

        // ============================
        // Internal helpers
        // ============================

        _createReviewCard: function(review) {
            const card = document.createElement('div');
            card.className = 'review-card';

            // Header
            const header = document.createElement('div');
            header.className = 'review-header';

            const userInfo = document.createElement('div');
            userInfo.className = 'review-user-info';

            const avatar = document.createElement('div');
            avatar.className = 'review-avatar';
            avatar.textContent = review.userName.charAt(0).toUpperCase();

            const nameDateDiv = document.createElement('div');

            const nameSpan = document.createElement('div');
            nameSpan.className = 'review-user-name';
            nameSpan.textContent = review.userName;

            const dateSpan = document.createElement('div');
            dateSpan.className = 'review-date';
            dateSpan.textContent = review.date;

            nameDateDiv.appendChild(nameSpan);
            nameDateDiv.appendChild(dateSpan);

            userInfo.appendChild(avatar);
            userInfo.appendChild(nameDateDiv);

            const metaDiv = document.createElement('div');
            metaDiv.style.cssText = 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;';

            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'review-rating';
            ratingDiv.innerHTML = this._createStarHTML(review.rating, 16);

            metaDiv.appendChild(ratingDiv);

            if (review.verified) {
                const badge = document.createElement('span');
                badge.className = 'review-verified';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Verified Purchase';
                metaDiv.appendChild(badge);
            }

            header.appendChild(userInfo);
            header.appendChild(metaDiv);
            card.appendChild(header);

            // Title
            if (review.title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'review-title';
                titleDiv.textContent = review.title;
                card.appendChild(titleDiv);
            }

            // Comment
            const commentDiv = document.createElement('div');
            commentDiv.className = 'review-comment';
            commentDiv.textContent = review.comment;
            card.appendChild(commentDiv);

            return card;
        },

        _createStarHTML: function(rating, fontSize) {
            const full = Math.floor(rating);
            const half = rating - full >= 0.25 && rating - full < 0.75;
            const empty = 5 - full - (half ? 1 : 0);
            const size = 'font-size:' + fontSize + 'px;';
            let html = '';
            for (let i = 0; i < full; i++) {
                html += '<i class="fas fa-star" style="' + size + '"></i>';
            }
            if (half) {
                html += '<i class="fas fa-star-half-alt" style="' + size + '"></i>';
            }
            for (let i = 0; i < empty; i++) {
                html += '<i class="far fa-star" style="' + size + '"></i>';
            }
            return html;
        }
    };

    // ============================
    // Initialize
    // ============================

    // Inject CSS styles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
        injectStyles();
    }

    // Ensure data exists on first load
    getData();

    // Expose to global scope
    window.reviews = ReviewsAPI;

    // Legacy alias for backward compatibility
    window.ReviewsAPI = ReviewsAPI;

})();
