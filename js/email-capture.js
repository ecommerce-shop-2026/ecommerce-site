/**
 * ShopEasy Email Capture — Newsletter + Checkout email collection
 * Stores subscriber emails in localStorage: shopeasy_newsletter_emails
 * Admin page: /admin-emails.html
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'shopeasy_newsletter_emails';
  var POPUP_DELAY = 15000;       // 15 sec delay before popup
  var POPUP_COOLDOWN = 7 * 24 * 3600 * 1000; // 7 days between popups
  var POPUP_STORAGE = 'shopeasy_popup_dismissed';

  // --- Storage helpers ---
  function getEmails() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e) { return []; }
  }

  function saveEmail(addr, source) {
    var emails = getEmails();
    var lower = addr.toLowerCase().trim();
    // Dedup
    if (emails.some(function(e) { return e.email.toLowerCase() === lower; })) {
      return false; // already exists
    }
    emails.push({
      email: lower,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: source || 'popup'
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    return true;
  }

  // --- Validation ---
  function isValidEmail(email) {
    // RFC 5322 simplified — catches 99.9% of real-world addresses
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
  }

  // --- Toast ---
  function showToast(msg, type) {
    var toast = document.getElementById('email-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'email-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 24px;border-radius:8px;font-size:14px;z-index:99999;opacity:0;transition:opacity .3s;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.style.background = type === 'error' ? '#dc2626' : '#16a34a';
    toast.style.color = '#fff';
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(function() { toast.style.opacity = '0'; }, 3000);
  }

  // --- Newsletter Popup ---
  function shouldShowPopup() {
    var dismissed = localStorage.getItem(POPUP_STORAGE);
    if (dismissed) {
      var age = Date.now() - parseInt(dismissed);
      if (age < POPUP_COOLDOWN) return false;
    }
    // Don't show on admin page or checkout
    if (window.location.pathname.indexOf('admin') !== -1) return false;
    if (window.location.pathname.indexOf('payment') !== -1) return false;
    return true;
  }

  function createPopup() {
    if (!shouldShowPopup()) return;

    var overlay = document.createElement('div');
    overlay.className = 'email-popup-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99990;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s;';

    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:16px;padding:32px;max-width:420px;width:90%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.15);';
    card.innerHTML =
      '<button class="email-popup-close" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;line-height:1">&times;</button>' +
      '<div style="text-align:center;font-size:48px;margin-bottom:12px">🎁</div>' +
      '<h3 style="text-align:center;font-size:20px;color:#1e293b;margin:0 0 8px">首单立减 10%</h3>' +
      '<p style="text-align:center;color:#64748b;font-size:14px;margin:0 0 20px">订阅 ShopEasy 邮件，第一时间获取新品上架 & 独家优惠</p>' +
      '<form id="emailPopupForm" style="display:flex;gap:8px">' +
        '<input type="email" id="emailPopupInput" placeholder="输入你的邮箱地址" required style="flex:1;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#e2e8f0\'">' +
        '<button type="submit" style="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:12px 20px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap">订阅</button>' +
      '</form>' +
      '<p style="text-align:center;color:#94a3b8;font-size:12px;margin:12px 0 0">不发送垃圾邮件，随时可取消订阅</p>';

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Close handlers
    var closeBtn = card.querySelector('.email-popup-close');
    var close = function() {
      overlay.remove();
      localStorage.setItem(POPUP_STORAGE, String(Date.now()));
    };
    closeBtn.onclick = close;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });

    // Form submit
    card.querySelector('#emailPopupForm').onsubmit = function(e) {
      e.preventDefault();
      var input = card.querySelector('#emailPopupInput');
      var email = input.value.trim();
      if (!email) return;
      if (!isValidEmail(email)) {
        input.style.borderColor = '#dc2626';
        showToast('请输入有效的邮箱地址', 'error');
        return;
      }
      var isNew = saveEmail(email, 'popup');
      if (isNew) {
        card.innerHTML = '<div style="text-align:center;padding:20px">' +
          '<div style="font-size:64px;margin-bottom:16px">✅</div>' +
          '<h3 style="color:#1e293b;margin:0 0 8px">订阅成功！</h3>' +
          '<p style="color:#64748b;margin:0">优惠码已发送到你的邮箱</p>' +
          '</div>';
        setTimeout(function(){ overlay.remove(); }, 2500);
      } else {
        card.innerHTML = '<div style="text-align:center;padding:20px">' +
          '<div style="font-size:48px;margin-bottom:12px">👋</div>' +
          '<h3 style="color:#1e293b;margin:0 0 8px">你已订阅过了</h3>' +
          '<p style="color:#64748b;margin:0">感谢你的持续关注</p>' +
          '</div>';
        setTimeout(function(){ overlay.remove(); }, 2000);
      }
    };

    // Focus input
    setTimeout(function() {
      card.querySelector('#emailPopupInput').focus();
    }, 400);
  }

  // --- Inline capture (for checkout page) ---
  window.captureEmail = function(email, source) {
    if (!email || !isValidEmail(email)) return { ok: false, reason: 'invalid' };
    var isNew = saveEmail(email, source || 'inline');
    return { ok: true, isNew: isNew };
  };

  // --- Init ---
  // Show popup after delay
  if (document.readyState === 'complete') {
    setTimeout(createPopup, POPUP_DELAY);
  } else {
    window.addEventListener('load', function() {
      setTimeout(createPopup, POPUP_DELAY);
    });
  }

  // Expose for inline forms
  window.NewsletterAPI = {
    subscribe: function(email, source) {
      if (!isValidEmail(email)) return { ok: false, reason: 'invalid' };
      var isNew = saveEmail(email, source);
      return { ok: true, isNew: isNew };
    },
    isValidEmail: isValidEmail
  };

})();
