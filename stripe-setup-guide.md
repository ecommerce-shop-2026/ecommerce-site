# ShopEasy — Stripe Payment Integration Guide

This guide walks you through setting up real credit card payments on ShopEasy using Stripe.

## Overview

The payment flow works like this:

1. User fills checkout form on `payment.html` → clicks "Pay Now"
2. `checkout.js` validates → calls `processStripePayment()` 
3. User is redirected to Stripe's secure checkout page
4. After payment, user returns to ShopEasy → order is saved locally

---

## Step 1: Create a Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with your email (no credit card needed for test mode)
3. Complete the onboarding (can skip business details for now)

---

## Step 2: Get Your API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable Key**: starts with `pk_test_...`
   - **Secret Key**: starts with `sk_test_...`
3. Copy both — never share the Secret Key publicly

---

## Step 3: Configure the Frontend

Edit `js/stripe-integration.js`:

```javascript
// Line ~25 — replace placeholder with your test publishable key
PUBLISHABLE_KEY: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
//     ^--- replace with: 'pk_test_51ABCDEF...'
```

---

## Step 4: Deploy the Backend API

The backend API file is at `api/create-checkout-session.js`.

### Cloudflare Pages (recommended — already hosting the site)

1. Go to https://dash.cloudflare.com/ → Pages → your project
2. **Settings → Environment Variables** → Add variable:
   - Name: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...` (your secret key)
3. **Deploy** → redeploy the site

The API will be available at:
```
https://shop2026easy.com/api/create-checkout-session
```

---

## Step 5: Test with Stripe Test Cards

After deploying, test on your live site:

| Card Number | Result |
|---|---|
| 4242 4242 4242 4242 | ✅ Payment succeeds |
| 4000 0000 0000 0002 | ❌ Payment declined |
| 4000 0025 0000 3155 | ✅ Requires 3D Secure |

Use any future expiry date and any 3-digit CVC.

---

## Step 6: Going Live

When ready to accept real payments:

1. Go to https://dashboard.stripe.com/apikeys
2. Copy the **Live** keys (start with `pk_live_` / `sk_live_`)
3. Update `PUBLISHABLE_KEY` in `stripe-integration.js` to `pk_live_...`
4. Update `STRIPE_SECRET_KEY` environment variable to `sk_live_...`
5. Redeploy

---

## Troubleshooting

**"Stripe not configured" — local fallback is used**
→ You haven't set the publishable key in `stripe-integration.js` yet

**"Failed to create Checkout Session"**
→ Check that `STRIPE_SECRET_KEY` is set in Cloudflare Pages environment variables
→ Check your secret key is valid (starts with `sk_test_` or `sk_live_`)

**User returns to payment.html but nothing happens**
→ The `handleStripeReturn()` function auto-detects `?payment=success` or `?session_id=` in the URL
→ Check the success URL in the API matches your domain

**CORS errors**
→ The API already includes `Access-Control-Allow-Origin: *` headers
→ If using a different domain, ensure both frontend and API are on the same domain

---

## Files Modified

| File | Change |
|---|---|
| `js/stripe-integration.js` | New — Stripe frontend integration (221 lines) |
| `js/checkout.js` | Modified — `processPayment()` now tries Stripe first, falls back to local |
| `payment.html` | Modified — added Stripe.js SDK and stripe-integration.js scripts |
| `api/create-checkout-session.js` | New — Cloudflare Pages Function for Checkout Session creation |

## How to Verify

Go to `payment.html`, add items to cart, fill the form, click Pay Now.

- **Before Step 3**: You'll see the local demo payment (2s simulated delay with confirmation modal)
- **After Step 3+4**: You'll be redirected to Stripe's checkout page, pay with test card, then return to the site with order confirmation
