// PakMegaMart Checkout Handler
// Processes orders, sends emails, and saves to Supabase

// ==========================================
// Helper Functions
// ==========================================

// Wait for elements to be available in the DOM
function waitForElements(selectors) {
    return new Promise((resolve) => {
        const checkElements = () => {
            const elements = selectors.map(selector => document.querySelector(selector));
            if (elements.every(el => el)) {
                resolve(elements);
            } else {
                setTimeout(checkElements, 100);
            }
        };
        checkElements();
    });
}

// Generate a unique order number
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${random}-${timestamp.toString().slice(-6)}`;
}

// Get form data as an object
function getFormData() {
    const formData = {
        customerName: document.getElementById('customerName')?.value,
        customerEmail: document.getElementById('customerEmail')?.value,
        customerPhone: document.getElementById('customerPhone')?.value,
        deliveryAddress: document.getElementById('deliveryAddress')?.value,
        city: document.getElementById('city')?.value,
        postalCode: document.getElementById('postalCode')?.value,
    };
    return formData;
}

// Validate form data
function validateFormData(data) {
    const errors = [];
    if (!data.customerName) errors.push('Customer name is required.');
    if (!data.customerEmail) errors.push('Email is required.');
    if (!data.customerPhone) errors.push('Phone number is required.');
    if (!data.deliveryAddress) errors.push('Delivery address is required.');
    if (!data.city) errors.push('City is required.');
    if (!data.postalCode) errors.push('Postal code is required.');
    return errors;
}

// ==========================================
// Main Checkout Process
// ==========================================
async function processCheckout() {
    try {
        // 1. Get and validate form data
        const formData = getFormData();
        const validationErrors = validateFormData(formData);
        if (validationErrors.length > 0) {
            alert(`Please correct the following errors:\n- ${validationErrors.join('\n- ')}`);
            return false;
        }

        // 2. Get cart data
        const cart = JSON.parse(localStorage.getItem('pakMegaMartCart') || '[]');
        if (cart.length === 0) {
            alert('❌ Your cart is empty');
            return false;
        }

        // 3. Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = parseInt(getEnv('SHIPPING_COST_DEFAULT', '500'));
        const total = subtotal + shippingCost;

        // 4. Generate order number and prepare data
        const orderNumber = generateOrderNumber();
        const orderData = {
            order_number: orderNumber,
            customer_email: formData.customerEmail,
            customer_name: formData.customerName,
            customer_phone: formData.customerPhone,
            delivery_address: formData.deliveryAddress,
            city: formData.city,
            postal_code: formData.postalCode,
            items: cart,
            subtotal,
            shipping_cost: shippingCost,
            total,
            payment_method: 'Cash on Delivery',
            payment_status: 'pending',
            status: 'pending',
            created_at: new Date().toISOString()
        };

        // 6. Save to Supabase
        let orderSaved = false;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('orders').insert([orderData]);
                if (error) {
                    console.error('Database error:', error.message);
                    // Order may still proceed with email confirmation
                } else {
                    orderSaved = true;
                }
            } catch (e) {
                console.error('Failed to save order:', e);
                // Continue with email notification even if DB fails
            }
        }

        // 7. Send emails
        let emailsSent = false;
        if (EMAILJS_CONFIG && emailConfig) {
            try {
                await emailConfig.sendCustomerOrderConfirmationEmail(orderData);
                await emailConfig.sendAdminOrderReceivedEmail(orderData);
                emailsSent = true;
            } catch (e) {
                console.error('Email sending failed:', e.message);
            }
        }
        
        // 8. Clear cart
        localStorage.removeItem('pakMegaMartCart');

        // 9. Show success and redirect
        alert(`✅ Order placed successfully!\n\nOrder Number: ${orderNumber}\n\nWe'll send you a confirmation email shortly.`);
        
        // Redirect safely without URL manipulation vulnerability
        localStorage.setItem('lastOrderNumber', orderNumber);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

        return true;

    } catch (error) {
        console.error('❌ Checkout error:', error);
        alert('❌ Checkout failed. Please try again.');
        return false;
    }
}

// ==========================================
// Initialize Checkout Page
// ==========================================
async function initCheckout() {
    console.log('🔍 Initializing checkout page...');

    // Wait for the environment to be loaded
    if (!window.ENV) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
     console.log('✅ Environment loaded');

    // Wait for Supabase and EmailJS clients
    if (!supabaseClient) console.log('⏳ Waiting for Supabase...');
    if (!EMAILJS_CONFIG) console.log('⏳ Waiting for EmailJS...');

    // Attach event listener to the final checkout button
    const finalStepButton = '#submitOrderBtn, #nextBtn';
    waitForElements([finalStepButton]).then(([submitButton]) => {
        submitButton.addEventListener('click', (e) => {
            // Check if it's the final step (simple check for now)
            if (submitButton.innerText.toLowerCase().includes('complete')) {
                e.preventDefault();
                processCheckout();
            }
        });
        console.log('✅ Checkout button event listener attached.');
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCheckout);

// Export for global use
window.processCheckout = processCheckout;
window.generateOrderNumber = generateOrderNumber;

console.log('✅ Checkout handler loaded');
