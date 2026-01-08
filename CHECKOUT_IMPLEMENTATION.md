# Checkout Implementation Examples

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Payment Gateway Integration](#payment-gateway-integration)
3. [Customization Examples](#customization-examples)
4. [Advanced Features](#advanced-features)
5. [Troubleshooting](#troubleshooting)

---

## Basic Usage

### How to Access Checkout

Users can access checkout by:

1. **From Shopping Cart (index.html or products.html)**
   ```html
   <button onclick="checkout()" class="btn-primary">Checkout</button>
   ```

2. **Direct URL**
   ```
   http://yourdomain.com/checkout.html
   ```

3. **Programmatically**
   ```javascript
   // In main.js
   window.location.href = 'checkout.html';
   ```

### Cart Requirements

Before checkout:
- Cart must have at least 1 item
- Each item must have: id, name, price, image, quantity, color

```javascript
// Example cart item
{
  id: 'genuine-leather-bifold',
  name: 'Genuine Leather Bifold',
  price: 189,
  image: 'public/Genuine Leather Bifold Wallet/Brown.jpg',
  quantity: 1,
  color: 'brown'
}
```

---

## Payment Gateway Integration

### 1. Stripe Integration

Add Stripe SDK to checkout.html:

```html
<script src="https://js.stripe.com/v3/"></script>
```

Add this to the payment form section:

```html
<div id="card-element"></div>
<div id="card-errors" role="alert"></div>
```

Implementation in checkout.html JavaScript:

```javascript
const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();
const cardElement = elements.create('card');

// Only initialize if we're on the payment step
document.addEventListener('DOMContentLoaded', function() {
    if (currentPage === 'checkout') {
        cardElement.mount('#card-element');
    }
});

// Handle card errors
cardElement.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Modified complete order function
async function completeOrder() {
    if (!validateStep(3)) return;

    // Get card token
    const {token} = await stripe.createToken(cardElement);
    
    if (token) {
        // Send payment to server
        const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token.id,
                amount: document.getElementById('grandTotal').textContent,
                email: document.getElementById('email').value,
                orderDetails: getOrderDetails()
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Show success modal
            document.getElementById('orderNumber').textContent = result.orderId;
            document.getElementById('successModal').classList.remove('hidden');
            
            // Clear cart
            cart = [];
            localStorage.removeItem('artisanCart');
            localStorage.removeItem('checkoutData');
        } else {
            alert('Payment failed: ' + result.error);
        }
    }
}
```

### 2. PayPal Integration

Add PayPal SDK:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
```

Implementation:

```javascript
function setupPayPalButton() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            const total = document.getElementById('grandTotal').textContent.replace('$', '');
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                // Successful payment
                document.getElementById('orderNumber').textContent = 
                    orderData.id;
                document.getElementById('successModal')
                    .classList.remove('hidden');
                
                // Clear cart
                cart = [];
                localStorage.removeItem('artisanCart');
                localStorage.removeItem('checkoutData');
            });
        }
    }).render('#paypal-button-container');
}

// Call when payment method is selected
if (paymentMethod === 'paypal') {
    setupPayPalButton();
}
```

### 3. Square Integration

Add Square SDK:

```html
<script src="https://web.squarecdn.com/v1/square.js"></script>
```

Implementation:

```javascript
async function initializeSquare() {
    const web = await Square.Web();
    
    const payments = web.payments('APPLICATION_ID', 'LOCATION_ID');
    const card = await payments.card();
    
    await card.attach('#sq-cardNumber');
    
    return {payments, card};
}

async function processSquarePayment({payments, card}) {
    try {
        const result = await payments.requestCardNonces();
        
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach(e => console.error(e.message));
            return false;
        }
        
        // Send to server for processing
        const response = await fetch('/api/square-payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sourceId: result.nonces[0],
                amount: getTotalAmount(),
                orderDetails: getOrderDetails()
            })
        });
        
        const paymentResult = await response.json();
        return paymentResult.success;
    } catch (error) {
        console.error('Payment failed:', error);
        return false;
    }
}
```

---

## Customization Examples

### 1. Add Discount/Coupon Code

Add to checkout.html in the order summary:

```html
<div class="mt-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
        Discount Code
    </label>
    <div class="flex gap-2">
        <input type="text" id="discountCode" 
               class="input-field px-4 py-2 rounded-lg flex-1" 
               placeholder="Enter code">
        <button type="button" onclick="applyDiscount()" 
                class="btn-primary px-4 py-2 rounded-lg">
            Apply
        </button>
    </div>
    <div id="discountMessage" class="text-sm mt-2"></div>
</div>
```

JavaScript implementation:

```javascript
const validCoupons = {
    'SAVE10': 0.10,      // 10% off
    'SAVE20': 0.20,      // 20% off
    'WELCOME5': 0.05,    // 5% off
    'FREESHIP': 0        // Free shipping
};

function applyDiscount() {
    const code = document.getElementById('discountCode').value.toUpperCase();
    const messageEl = document.getElementById('discountMessage');
    
    if (validCoupons[code] !== undefined) {
        const subtotal = parseFloat(
            document.getElementById('subtotal').textContent
        ) || 0;
        
        const discount = subtotal * validCoupons[code];
        const newSubtotal = subtotal - discount;
        
        messageEl.className = 'text-sm mt-2 text-green-600';
        messageEl.textContent = `✓ Discount applied: -$${discount.toFixed(2)}`;
        
        // Recalculate totals
        document.getElementById('subtotal').textContent = 
            `$${newSubtotal.toFixed(2)}`;
        updateTotals();
    } else {
        messageEl.className = 'text-sm mt-2 text-red-600';
        messageEl.textContent = '✗ Invalid coupon code';
    }
}
```

### 2. Change Shipping Methods

Modify shipping method radio buttons:

```html
<div class="space-y-3">
    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer">
        <input type="radio" name="shipping" value="standard" 
               class="w-4 h-4" checked onchange="updateShipping()">
        <div class="ml-4 flex-1">
            <p class="font-medium text-gray-900">
                Standard Shipping
            </p>
            <p class="text-sm text-gray-600">5-7 business days</p>
        </div>
        <span class="font-bold">$9.99</span>
    </label>
    <!-- Add more shipping methods -->
</div>
```

### 3. Add Gift Message

Add to checkout.html:

```html
<div class="mt-6">
    <details>
        <summary class="font-medium cursor-pointer text-gray-900">
            Add a Gift Message
        </summary>
        <div class="mt-3">
            <textarea id="giftMessage" 
                      class="input-field w-full px-4 py-2 rounded-lg"
                      rows="4" 
                      placeholder="Write your message here..."></textarea>
            <p class="text-sm text-gray-600 mt-2">
                (Max 250 characters)
            </p>
        </div>
    </details>
</div>
```

### 4. Change Tax Rates by State

```javascript
const stateTaxRates = {
    'CA': 0.0725,  // California
    'TX': 0.0625,  // Texas
    'NY': 0.0400,  // New York
    'FL': 0.0600,  // Florida
    'default': 0.08
};

function updateTotals() {
    const state = document.getElementById('state').value.toUpperCase();
    const taxRate = stateTaxRates[state] || stateTaxRates['default'];
    
    const subtotal = parseFloat(
        document.getElementById('subtotal').textContent
    ) || 0;
    
    const tax = subtotal * taxRate;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    
    // Continue with other calculations...
}
```

---

## Advanced Features

### 1. Save Customer Information

```javascript
function saveCustomerProfile() {
    const customer = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        addresses: [
            {
                type: 'shipping',
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value
            }
        ],
        createdAt: new Date().toISOString(),
        lastOrderDate: new Date().toISOString()
    };
    
    // Save to localStorage or send to server
    localStorage.setItem('customerProfile', JSON.stringify(customer));
    
    return customer;
}

function loadCustomerProfile() {
    const profile = localStorage.getItem('customerProfile');
    if (profile) {
        const customer = JSON.parse(profile);
        document.getElementById('firstName').value = customer.firstName;
        document.getElementById('lastName').value = customer.lastName;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone;
        
        if (customer.addresses.length > 0) {
            const addr = customer.addresses[0];
            document.getElementById('address').value = addr.address;
            document.getElementById('city').value = addr.city;
            document.getElementById('state').value = addr.state;
            document.getElementById('zipCode').value = addr.zipCode;
            document.getElementById('country').value = addr.country;
        }
    }
}
```

### 2. Order Tracking System

```javascript
function generateOrderTrackingId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

function createOrderRecord(orderData) {
    const order = {
        orderId: generateOrderTrackingId(),
        timestamp: new Date().toISOString(),
        customer: {
            name: `${orderData.firstName} ${orderData.lastName}`,
            email: orderData.email,
            phone: orderData.phone
        },
        items: cart,
        shipping: {
            method: orderData.shipping,
            address: `${orderData.address}, ${orderData.city}, 
                     ${orderData.state} ${orderData.zipCode}`,
            cost: getShippingCost(orderData.shipping)
        },
        totals: {
            subtotal: getSubtotal(),
            tax: getTaxAmount(),
            shipping: getShippingCost(orderData.shipping),
            grand: getGrandTotal()
        },
        status: 'pending',
        trackingNumber: generateTrackingNumber(),
        estimatedDelivery: calculateDeliveryDate(
            orderData.shipping
        )
    };
    
    // Save to backend
    saveOrderToDatabase(order);
    
    return order;
}
```

### 3. Email Notification System

```javascript
async function sendOrderConfirmationEmail(orderData) {
    const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            to: orderData.email,
            orderNumber: orderData.orderId,
            customerName: orderData.firstName + ' ' + orderData.lastName,
            items: orderData.items,
            total: orderData.grandTotal,
            estimatedDelivery: orderData.estimatedDelivery,
            trackingLink: `https://yoursite.com/track/${orderData.orderId}`
        })
    });
    
    if (!response.ok) {
        console.error('Failed to send confirmation email');
    }
}
```

### 4. Guest Checkout

Add to checkout.html:

```html
<div class="mb-6">
    <label class="flex items-center">
        <input type="checkbox" id="guestCheckout" class="w-4 h-4">
        <span class="ml-2 text-sm text-gray-700">
            Complete purchase as guest (no account needed)
        </span>
    </label>
</div>
```

### 5. Inventory Management

```javascript
async function checkInventory(productId, quantity) {
    const response = await fetch('/api/check-inventory', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            productId: productId,
            quantity: quantity
        })
    });
    
    const result = await response.json();
    
    if (!result.available) {
        showError(`Only ${result.available_quantity} in stock`);
        return false;
    }
    
    return true;
}
```

---

## Troubleshooting

### Problem: Cart Data Not Persisting

**Cause**: localStorage is disabled or full

**Solution**:
```javascript
// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

// Use fallback if needed
if (!isLocalStorageAvailable()) {
    alert('Please enable local storage in your browser settings');
}
```

### Problem: Form Not Validating

**Cause**: JavaScript errors or field IDs incorrect

**Solution**:
```javascript
// Add console logging to validate
function validateStep(step) {
    console.log(`Validating step ${step}`);
    
    if (step === 1) {
        const firstName = document.getElementById('firstName');
        console.log('First name field:', firstName);
        console.log('First name value:', firstName?.value);
        
        // Continue validation with logging
    }
}
```

### Problem: Shipping Cost Not Updating

**Cause**: Event listener not attached to radio buttons

**Solution**:
```javascript
// Ensure listeners are set up in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Re-attach listeners
    document.querySelectorAll('input[name="shipping"]')
        .forEach(radio => {
            radio.removeEventListener('change', updateCheckoutSummary);
            radio.addEventListener('change', updateCheckoutSummary);
        });
});
```

### Problem: Progress Indicator Not Updating

**Cause**: CSS classes not applied correctly

**Solution**:
```javascript
// Debug progress indicator
function debugProgressIndicator() {
    console.log('Current Step:', currentStep);
    
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`step${i}Indicator`);
        console.log(`Step ${i} classes:`, indicator?.className);
    }
}

// Call before updating
debugProgressIndicator();
updateStepDisplay();
```

### Problem: Payment Fields Not Showing

**Cause**: Payment method radio button not triggering display

**Solution**:
```javascript
// Manually trigger display
function setupPaymentMethodListeners() {
    document.querySelectorAll('input[name="paymentMethod"]')
        .forEach(radio => {
            radio.addEventListener('change', function() {
                console.log('Selected payment:', this.value);
                
                document.getElementById('cardDetails').style.display = 
                    this.value === 'card' ? 'block' : 'none';
                document.getElementById('paypalNotice').style.display = 
                    this.value === 'paypal' ? 'block' : 'none';
                document.getElementById('appleNotice').style.display = 
                    this.value === 'apple' ? 'block' : 'none';
            });
            
            // Trigger on page load
            if (radio.checked) {
                radio.dispatchEvent(new Event('change'));
            }
        });
}
```

---

## Summary

The checkout system is highly customizable and can integrate with:
- Multiple payment processors
- Shipping providers
- Email systems
- CRM platforms
- Analytics tools
- Inventory management systems

For production use, ensure:
- Server-side validation for all inputs
- PCI compliance for payment processing
- SSL/TLS encryption for all data
- Regular security audits
- Proper error handling and logging

---

**Examples Version**: 1.0
**Last Updated**: January 6, 2026
**Status**: Ready for Implementation
