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

// Get form data from checkout.html fields
function getFormDataFromCheckout() {
    const formData = {
        customerName: (document.getElementById('firstName')?.value || '') + ' ' + (document.getElementById('lastName')?.value || ''),
        customerEmail: document.getElementById('email')?.value,
        customerPhone: document.getElementById('phone')?.value,
        deliveryAddress: document.getElementById('address')?.value,
        city: document.getElementById('city')?.value,
        state: document.getElementById('state')?.value,
        postalCode: document.getElementById('zipCode')?.value,
        country: document.getElementById('country')?.value,
    };
    return formData;
}

// Validate form data
function validateFormData(data) {
    const errors = [];
    if (!data.customerName || data.customerName.trim() === ' ') errors.push('Name is required.');
    if (!data.customerEmail) errors.push('Email is required.');
    if (!data.customerPhone) errors.push('Phone number is required.');
    if (!data.deliveryAddress) errors.push('Delivery address is required.');
    if (!data.city) errors.push('City is required.');
    if (!data.postalCode) errors.push('Postal code is required.');
    
    // Email validation
    if (data.customerEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.customerEmail)) {
            errors.push('Invalid email format.');
        }
    }
    
    // Phone validation
    if (data.customerPhone) {
        const phoneDigits = data.customerPhone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            errors.push('Phone number must be at least 10 digits.');
        }
    }
    
    return errors;
}

// ==========================================
// Main Checkout Process (called from checkout.html completeOrder)
// ==========================================
async function processCheckout() {
    try {
        // 1. Get and validate form data
        const formData = getFormDataFromCheckout();
        const validationErrors = validateFormData(formData);
        if (validationErrors.length > 0) {
            console.error('Validation errors:', validationErrors);
            return { success: false, error: validationErrors.join('\n') };
        }

        // 2. Get cart data
        const cart = JSON.parse(localStorage.getItem('pakMegaMartCart') || '[]');
        if (cart.length === 0) {
            return { success: false, error: 'Your cart is empty' };
        }

        // 3. Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = 160; // Fixed shipping cost
        const total = subtotal + shippingCost;

        // 4. Generate order number and prepare data
        const orderNumber = generateOrderNumber();
        const orderData = {
            order_number: orderNumber,
            customer_email: formData.customerEmail,
            customer_name: formData.customerName.trim(),
            customer_phone: formData.customerPhone,
            delivery_address: formData.deliveryAddress,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
            items: cart,
            subtotal,
            shipping_cost: shippingCost,
            total,
            payment_method: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod',
            payment_status: 'pending',
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('📦 Order prepared:', orderNumber);

        // 5. Save to Supabase
        let orderSaved = false;
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                console.log('💾 Saving order to Supabase...');
                const { data, error } = await supabaseClient
                    .from('orders')
                    .insert([orderData]);
                
                if (error) {
                    console.warn('⚠️  Supabase save warning:', error.message);
                    // Don't fail - continue with email
                } else {
                    orderSaved = true;
                    console.log('✅ Order saved to Supabase');
                }
            } catch (e) {
                console.warn('⚠️  Failed to save order to database:', e.message);
            }
        } else {
            console.warn('⚠️  Supabase not available, skipping database save');
        }

        // 6. Send emails
        let emailsSent = false;
        if (typeof emailConfig !== 'undefined' && emailConfig && EMAILJS_CONFIG) {
            try {
                console.log('📧 Sending emails...');
                await emailConfig.sendCustomerOrderConfirmationEmail(orderData);
                console.log('✅ Customer email sent');
                
                await emailConfig.sendAdminOrderReceivedEmail(orderData);
                console.log('✅ Admin email sent');
                
                emailsSent = true;
            } catch (e) {
                console.error('❌ Email sending failed:', e.message);
                // Don't fail checkout - emails are secondary
            }
        } else {
            console.warn('⚠️  EmailJS not available, skipping email send');
        }
        
        // 7. Success response
        return {
            success: true,
            orderNumber: orderNumber,
            message: 'Order placed successfully!',
            database: orderSaved,
            email: emailsSent
        };

    } catch (error) {
        console.error('❌ Checkout error:', error);
        return { success: false, error: error.message || 'An error occurred during checkout' };
    }
}

// ==========================================
// Initialize Checkout Page
// ==========================================
async function initCheckout() {
    console.log('🔍 Initializing checkout page...');

    // Wait for environment to be loaded
    if (!window.ENV) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('✅ Checkout handler initialized and ready');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCheckout);

// Export for global use
window.processCheckout = processCheckout;
window.generateOrderNumber = generateOrderNumber;
window.getFormDataFromCheckout = getFormDataFromCheckout;

console.log('✅ Checkout handler loaded successfully');
