/**
 * ShopEasy Authentication System
 * User registration, login, session management via localStorage
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'shopeasy_users';
    const SESSION_KEY = 'shopeasy_session';

    // --- Utility Functions ---

    /** Get all registered users */
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch(e) {
            return {};
        }
    }

    /** Save users */
    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    /** Get current logged-in user */
    function getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
        } catch(e) {
            return null;
        }
    }

    /** Set current session */
    function setSession(user) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        // Also notify other pages via custom event
        localStorage.setItem('shopeasy_auth_event', Date.now().toString());
    }

    /** Clear session */
    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.setItem('shopeasy_auth_event', Date.now().toString());
    }

    /** Validate email format */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /** Check password strength */
    function getPasswordStrength(password) {
        if (password.length < 6) return { level: 'weak', text: 'Weak - too short' };
        var score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        if (score <= 1) return { level: 'weak', text: 'Weak' };
        if (score <= 2) return { level: 'medium', text: 'Medium' };
        return { level: 'strong', text: 'Strong' };
    }

    /** Hash a simple password (not crypto-secure, localStorage demo only) */
    function hashPassword(password) {
        var hash = 0;
        for (var i = 0; i < password.length; i++) {
            var char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'h' + Math.abs(hash).toString(16);
    }

    // --- Password Strength Indicator ---

    function setupPasswordStrength() {
        var regPassword = document.getElementById('regPassword');
        var strengthBar = document.getElementById('strengthBar');
        var strengthText = document.getElementById('strengthText');
        if (!regPassword) return;

        regPassword.addEventListener('input', function() {
            var pwd = regPassword.value;
            if (pwd.length === 0) {
                strengthBar.className = 'strength-bar';
                strengthText.textContent = '';
                return;
            }
            var result = getPasswordStrength(pwd);
            strengthBar.className = 'strength-bar ' + result.level;
            strengthText.textContent = 'Password strength: ' + result.text;
            strengthText.style.color = result.level === 'weak' ? '#e74c3c' :
                                        result.level === 'medium' ? '#f39c12' : '#27ae60';
        });
    }

    // --- Tab Switching ---

    function setupTabs() {
        var tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Update tab states
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                // Show corresponding form
                var target = tab.getAttribute('data-tab');
                document.querySelectorAll('.auth-form').forEach(function(f) { f.classList.remove('active'); });
                var form = document.getElementById('form' + target.charAt(0).toUpperCase() + target.slice(1));
                if (form) form.classList.add('active');
                // Clear errors
                document.querySelectorAll('.error-msg').forEach(function(e) { e.classList.remove('show'); });
                document.querySelectorAll('.input-error').forEach(function(e) { e.classList.remove('input-error'); });
            });
        });
    }

    // --- Login Handler ---

    function setupLogin() {
        var form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('loginEmail').value.trim();
            var password = document.getElementById('loginPassword').value;
            var emailError = document.getElementById('loginEmailError');
            var passError = document.getElementById('loginPassError');
            var emailInput = document.getElementById('loginEmail');
            var passInput = document.getElementById('loginPassword');

            // Reset errors
            emailError.classList.remove('show');
            passError.classList.remove('show');
            emailInput.classList.remove('input-error');
            passInput.classList.remove('input-error');

            // Validate
            if (!isValidEmail(email)) {
                emailError.classList.add('show');
                emailInput.classList.add('input-error');
                return;
            }
            if (password.length < 6) {
                passError.textContent = 'Incorrect email or password';
                passError.classList.add('show');
                passInput.classList.add('input-error');
                return;
            }

            // Check credentials
            var users = getUsers();
            var hashed = hashPassword(password);
            var user = users[email];

            if (!user || user.password !== hashed) {
                passError.textContent = 'Incorrect email or password';
                passError.classList.add('show');
                passInput.classList.add('input-error');
                return;
            }

            // Login success
            var sessionUser = {
                name: user.name,
                email: user.email,
                joined: user.joined || Date.now()
            };
            if (document.getElementById('rememberMe').checked) {
                // Remember me: save to localStorage instead of sessionStorage
                try {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
                } catch(e) {
                    setSession(sessionUser);
                }
            } else {
                setSession(sessionUser);
            }

            showSuccess('Welcome back, ' + user.name + '!', 'You have been signed in successfully.');
        });
    }

    // --- Register Handler ---

    function setupRegister() {
        var form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('regName').value.trim();
            var email = document.getElementById('regEmail').value.trim();
            var password = document.getElementById('regPassword').value;
            var confirm = document.getElementById('regConfirm').value;
            var agree = document.getElementById('agreeTerms');

            var nameError = document.getElementById('regNameError');
            var emailError = document.getElementById('regEmailError');
            var confirmError = document.getElementById('regConfirmError');
            var nameInput = document.getElementById('regName');
            var emailInput = document.getElementById('regEmail');
            var confirmInput = document.getElementById('regConfirm');

            // Reset
            [nameError, emailError, confirmError].forEach(function(e) { e.classList.remove('show'); });
            [nameInput, emailInput, confirmInput].forEach(function(e) { e.classList.remove('input-error'); });

            // Validate name
            if (name.length < 2) {
                nameError.classList.add('show');
                nameInput.classList.add('input-error');
                return;
            }

            // Validate email
            if (!isValidEmail(email)) {
                emailError.textContent = 'Please enter a valid email';
                emailError.classList.add('show');
                emailInput.classList.add('input-error');
                return;
            }

            // Validate password strength
            if (password.length < 6) {
                var passInput = document.getElementById('regPassword');
                passInput.classList.add('input-error');
                alert('Password must be at least 6 characters');
                return;
            }

            // Validate confirm
            if (password !== confirm) {
                confirmError.classList.add('show');
                confirmInput.classList.add('input-error');
                return;
            }

            // Validate terms
            if (!agree.checked) {
                alert('Please agree to the Terms & Privacy Policy');
                return;
            }

            // Check if email already exists
            var users = getUsers();
            if (users[email]) {
                emailError.textContent = 'An account with this email already exists';
                emailError.classList.add('show');
                emailInput.classList.add('input-error');
                return;
            }

            // Register user
            users[email] = {
                name: name,
                email: email,
                password: hashPassword(password),
                joined: Date.now(),
                orders: []
            };
            saveUsers(users);

            // Auto-login
            var sessionUser = { name: name, email: email, joined: Date.now() };
            setSession(sessionUser);

            showSuccess('Welcome, ' + name + '!', 'Your account has been created successfully.');
        });
    }

    // --- Success State ---

    function showSuccess(title, text) {
        // Hide forms
        document.querySelectorAll('.auth-form').forEach(function(f) { f.classList.remove('active'); });
        document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
        // Show success
        var success = document.getElementById('authSuccess');
        if (success) {
            document.getElementById('successTitle').textContent = title;
            document.getElementById('successText').textContent = text;
            success.classList.add('show');
        }
    }

    // --- Social Login Simulation ---

    function setupSocialLogin() {
        var googleBtn = document.getElementById('btnGoogleLogin');
        var githubBtn = document.getElementById('btnGithubLogin');

        if (googleBtn) {
            googleBtn.addEventListener('click', function() {
                simulateSocialLogin('Google', 'google_user_' + Date.now());
            });
        }
        if (githubBtn) {
            githubBtn.addEventListener('click', function() {
                simulateSocialLogin('GitHub', 'github_user_' + Date.now());
            });
        }
    }

    function simulateSocialLogin(provider, email) {
        var users = getUsers();
        if (!users[email]) {
            users[email] = {
                name: provider + ' User',
                email: email,
                password: 'social_login',
                joined: Date.now(),
                orders: []
            };
            saveUsers(users);
        }
        var sessionUser = { name: provider + ' User', email: email, joined: Date.now() };
        setSession(sessionUser);
        showSuccess('Signed in with ' + provider, 'You have been authenticated via ' + provider + '.');
    }

    // --- Forgot Password ---

    function setupForgotPassword() {
        var link = document.getElementById('forgotPassword');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var email = prompt('Enter your email address to reset your password:');
                if (email && isValidEmail(email)) {
                    var users = getUsers();
                    if (users[email]) {
                        alert('A password reset link has been sent to ' + email + ' (demo: this is a simulation)');
                    } else {
                        alert('No account found with this email address.');
                    }
                } else if (email) {
                    alert('Please enter a valid email address.');
                }
            });
        }
    }

    // --- Continue Shopping Handler ---

    function setupContinue() {
        var btn = document.getElementById('btnContinue');
        if (btn) {
            btn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
    }

    // --- Nav Toggle ---

    function setupNavToggle() {
        var toggle = document.getElementById('navToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                document.querySelector('.nav-menu').classList.toggle('active');
            });
        }
    }

    // --- Initialize ---

    function init() {
        setupTabs();
        setupLogin();
        setupRegister();
        setupPasswordStrength();
        setupSocialLogin();
        setupForgotPassword();
        setupContinue();
        setupNavToggle();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
