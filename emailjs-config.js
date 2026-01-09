// PakMegaMart EmailJS Configuration
// Loads credentials from environment variables (.env file)
// DO NOT hardcode sensitive information

// Wait for environment variables to load
let EMAILJS_CONFIG = null;
let EMAIL_INIT_ATTEMPTS = 0;
const MAX_EMAIL_INIT_ATTEMPTS = 5;

// Wait for environment variables to be loaded
function waitForEnvironmentVariablesEmail() {
    return new Promise((resolve) => {
        let attempts = 0;
        const checkEnv = () => {
            if (window.ENV && Object.keys(window.ENV).length > 0) {
                resolve();
            } else if (attempts < 20) {
                attempts++;
                setTimeout(checkEnv, 100);
            } else {
                console.warn('⚠️  Environment variables did not load within timeout');
                resolve();
            }
        };
        checkEnv();
    });
}

function initializeEmailJSConfig() {
    // Get values from environment variables or defaults
    const publicKey = getEnv('EMAILJS_PUBLIC_KEY');
    const serviceId = getEnv('EMAILJS_SERVICE_ID');
    const customerTemplateId = getEnv('EMAILJS_CUSTOMER_TEMPLATE_ID');
    const adminTemplateId = getEnv('EMAILJS_ADMIN_TEMPLATE_ID');
    const adminEmail = getEnv('ADMIN_EMAIL');
    const whatsappNumber = getEnv('WHATSAPP_NUMBER');
    const storeEmail = getEnv('STORE_EMAIL');
    const storeName = getEnv('STORE_NAME');
    const whatsappPhoneId = getEnv('WHATSAPP_PHONE_ID');
    
    if (!publicKey || !serviceId) {
        console.error('❌ EmailJS configuration is incomplete. Missing public key or service ID');
        console.error('   Public Key:', publicKey ? '✅' : '❌');
        console.error('   Service ID:', serviceId ? '✅' : '❌');
        return false;
    }
    
    try {
        // Check if emailjs library is loaded
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS library not loaded');
            return false;
        }
        
        // Initialize EmailJS with public key
        emailjs.init(publicKey);
        
        // Set configuration from environment variables
        EMAILJS_CONFIG = {
            SERVICE_ID: serviceId,
            PUBLIC_KEY: publicKey,
            
            // Email Templates (CRITICAL: These MUST match your EmailJS template IDs)
            TEMPLATES: {
                CUSTOMER_ORDER_CONFIRMATION: customerTemplateId || "template_l8b7462",
                ADMIN_ORDER_RECEIVED: adminTemplateId || "template_vhrd33g"
            },
            
            // Email addresses
            FROM_EMAIL: storeEmail || "orders@pakmegamart.com",
            FROM_NAME: storeName || "PakMegaMart",
            ADMIN_EMAIL: adminEmail || "admin@pakmegamart.com",
            WHATSAPP_NUMBER: whatsappNumber || "+92 326 8502690",
            WHATSAPP_PHONE_ID: whatsappPhoneId || "923268502690"
        };
        
        console.log('✅ EmailJS configuration initialized successfully');
        console.log('   Service ID:', EMAILJS_CONFIG.SERVICE_ID);
        console.log('   Customer Template ID:', EMAILJS_CONFIG.TEMPLATES.CUSTOMER_ORDER_CONFIRMATION);
        console.log('   Admin Template ID:', EMAILJS_CONFIG.TEMPLATES.ADMIN_ORDER_RECEIVED);
        return true;
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        return false;
    }
}

// Wait for EmailJS to be loaded with retry logic
function waitForEmailJS() {
    return new Promise((resolve, reject) => {
        const checkEmailJS = () => {
            if (typeof emailjs !== 'undefined') {
                resolve();
            } else if (EMAIL_INIT_ATTEMPTS < MAX_EMAIL_INIT_ATTEMPTS) {
                EMAIL_INIT_ATTEMPTS++;
                setTimeout(checkEmailJS, 200);
            } else {
                reject(new Error('EmailJS library failed to load after multiple attempts'));
            }
        };
        checkEmailJS();
    });
}

// Initialize after the DOM is loaded and EmailJS is available
window.addEventListener('load', async () => {
    console.log('🔍 Checking for EmailJS library...');
    try {
        await waitForEnvironmentVariablesEmail();
        await waitForEmailJS();
        console.log('✅ EmailJS library detected. Initializing configuration...');
        const success = initializeEmailJSConfig();
        if (!success) {
            console.error('⚠️ Failed to initialize EmailJS config');
        }
    } catch (error) {
        console.error('❌ EmailJS initialization error:', error.message);
        console.warn('⚠️ Email functionality may not be available');
    }
});

// ==========================================
// Send Customer Order Confirmation Email with WhatsApp Link
// ==========================================
async function sendCustomerOrderConfirmationEmail(orderData) {
    try {
        if (!EMAILJS_CONFIG) {
            const initialized = initializeEmailJSConfig();
            if (!initialized) {
                throw new Error('EmailJS configuration not initialized');
            }
        }
        
        if (!orderData.customer_email) {
            throw new Error('Customer email is missing');
        }
        
        // Calculate estimated delivery date
        const today = new Date();
        const minDeliveryDate = new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days
        const maxDeliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        
        const templateParams = {
            to_email: orderData.customer_email,
            to_name: orderData.customer_name,
            order_number: orderData.order_number,
            order_date: new Date(orderData.created_at).toLocaleDateString('en-PK'),
            items_list: formatItemsList(orderData.items),
            items_count: orderData.items.length,
            subtotal: Math.round(orderData.subtotal).toLocaleString('en-PK'),
            shipping_cost: Math.round(orderData.shipping_cost).toLocaleString('en-PK'),
            total: Math.round(orderData.total).toLocaleString('en-PK'),
            delivery_address: orderData.delivery_address,
            city: orderData.city,
            postal_code: orderData.postal_code,
            customer_phone: orderData.customer_phone,
            payment_method: orderData.payment_method || 'Cash on Delivery',
            estimated_delivery_min: minDeliveryDate.toLocaleDateString('en-PK'),
            estimated_delivery_max: maxDeliveryDate.toLocaleDateString('en-PK'),
            whatsapp_number: EMAILJS_CONFIG.WHATSAPP_NUMBER,
            whatsapp_link: `https://wa.me/${EMAILJS_CONFIG.WHATSAPP_PHONE_ID}?text=Hi%20PakMegaMart%2C%20I%20have%20a%20question%20about%20order%20${orderData.order_number}`,
            store_name: EMAILJS_CONFIG.FROM_NAME,
            store_email: EMAILJS_CONFIG.FROM_EMAIL,
            from_email: EMAILJS_CONFIG.FROM_EMAIL,
            from_name: EMAILJS_CONFIG.FROM_NAME
        };
        
        console.log('📧 Sending customer order confirmation email to:', templateParams.to_email);
        console.log('   Template ID:', EMAILJS_CONFIG.TEMPLATES.CUSTOMER_ORDER_CONFIRMATION);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATES.CUSTOMER_ORDER_CONFIRMATION,
            templateParams
        );

        console.log("✅ Customer order confirmation email sent successfully:", response.status);
        
        // Log email activity
        await logEmailActivity(
            orderData.customer_email,
            orderData.order_number,
            'order_confirmation',
            'sent'
        );
        
        return response;
    } catch (error) {
        console.error("❌ Failed to send customer order confirmation email:", error);
        await logEmailActivity(
            orderData.customer_email,
            orderData.order_number,
            'order_confirmation',
            'failed'
        );
        throw error;
    }
}

// ==========================================
// Send Admin Order Received Notification Email
// ==========================================
async function sendAdminOrderReceivedEmail(orderData) {
    try {
        // Ensure config is initialized
        if (!EMAILJS_CONFIG) {
            const initialized = initializeEmailJSConfig();
            if (!initialized) {
                throw new Error('EmailJS configuration not initialized');
            }
        }
        
        if (!EMAILJS_CONFIG.ADMIN_EMAIL) {
            throw new Error('Admin email is not configured');
        }
        
        const templateParams = {
            to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
            to_name: "Admin Team",
            order_number: orderData.order_number,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            delivery_address: orderData.delivery_address,
            city: orderData.city,
            postal_code: orderData.postal_code,
            items_list: formatItemsList(orderData.items),
            items_count: orderData.items.length,
            subtotal: Math.round(orderData.subtotal).toLocaleString('en-PK'),
            shipping_cost: Math.round(orderData.shipping_cost).toLocaleString('en-PK'),
            total: Math.round(orderData.total).toLocaleString('en-PK'),
            payment_method: orderData.payment_method || 'Cash on Delivery',
            payment_status: orderData.payment_status || 'pending',
            order_status: orderData.status || 'pending',
            order_time: new Date(orderData.created_at).toLocaleString('en-PK'),
            from_email: EMAILJS_CONFIG.FROM_EMAIL,
            from_name: EMAILJS_CONFIG.FROM_NAME
        };

        console.log('📧 Sending admin order notification email to:', templateParams.to_email);
        console.log('   Template ID:', EMAILJS_CONFIG.TEMPLATES.ADMIN_ORDER_RECEIVED);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATES.ADMIN_ORDER_RECEIVED,
            templateParams
        );

        console.log("✅ Admin order notification email sent successfully:", response.status);
        
        // Log email activity
        await logEmailActivity(
            EMAILJS_CONFIG.ADMIN_EMAIL,
            orderData.order_number,
            'admin_notification',
            'sent'
        );
        
        return response;
    } catch (error) {
        console.error("❌ Failed to send admin order notification email:", error);
        await logEmailActivity(
            EMAILJS_CONFIG.ADMIN_EMAIL,
            orderData.order_number,
            'admin_notification',
            'failed'
        );
        throw error;
    }
}

// ==========================================
// Helper Functions
// ==========================================

// Format items list for email
function formatItemsList(items) {
    if (!items || items.length === 0) return "No items in order";
    
    return items.map((item, index) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const total = price * quantity;
        return `${index + 1}. ${item.name} - PKR ${price.toLocaleString('en-PK')} x ${quantity} = PKR ${total.toLocaleString('en-PK')}`;
    }).join("\n");
}

// Calculate estimated delivery date (5-7 business days)
function calculateEstimatedDelivery() {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    return deliveryDate.toLocaleDateString('en-PK');
}

// Generate transaction ID
function generateTransactionId() {
    return "TXN-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Log email activity to database
async function logEmailActivity(email, orderId, notificationType, status = "sent") {
    try {
        if (!supabaseClient) {
            console.warn('Supabase not available for logging email activity');
            return;
        }
        
        const { data, error } = await supabaseClient
            .from('email_logs')
            .insert([{
                email: email,
                order_id: orderId,
                notification_type: notificationType,
                status: status,
                sent_at: new Date().toISOString()
            }]);
        
        if (error) {
            console.warn('Failed to log email activity:', error.message);
        } else {
            console.log('✅ Email activity logged successfully');
        }
    } catch (error) {
        console.warn("Failed to log email activity:", error.message);
        // Don't throw - logging failure shouldn't break the email sending flow
    }
}

// Validate email configuration
function validateEmailConfiguration() {
    if (!EMAILJS_CONFIG) {
        console.error('❌ EmailJS configuration not initialized');
        return false;
    }
    
    const required = ['SERVICE_ID', 'PUBLIC_KEY', 'FROM_EMAIL', 'ADMIN_EMAIL'];
    const templates = ['CUSTOMER_ORDER_CONFIRMATION', 'ADMIN_ORDER_RECEIVED'];
    
    for (let key of required) {
        if (!EMAILJS_CONFIG[key]) {
            console.error(`❌ Missing configuration: ${key}`);
            return false;
        }
    }
    
    for (let template of templates) {
        if (!EMAILJS_CONFIG.TEMPLATES[template]) {
            console.error(`❌ Missing template configuration: ${template}`);
            return false;
        }
    }
    
    console.log('✅ Email configuration is valid');
    return true;
}

// Export for use in other scripts
window.emailConfig = {
    sendCustomerOrderConfirmationEmail,
    sendAdminOrderReceivedEmail,
    logEmailActivity,
    validateEmailConfiguration,
    getConfig: () => EMAILJS_CONFIG
};

// Debug logging for production
console.log('✅ EmailJS config module loaded and ready');
console.log('   Use emailConfig.validateEmailConfiguration() to check setup');
