// PakMegaMart EmailJS Configuration
// Loads credentials from environment variables (.env file)
// DO NOT hardcode sensitive information

// Wait for environment variables to load
let EMAILJS_CONFIG = null;

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
    
    if (!publicKey || !serviceId) {
        console.error('❌ EmailJS configuration is incomplete');
        return false;
    }
    
    try {
        // Initialize EmailJS with public key
        emailjs.init(publicKey);
        
        // Set configuration from environment variables
        EMAILJS_CONFIG = {
            SERVICE_ID: serviceId,
            
            // Email Templates
            TEMPLATES: {
                CUSTOMER_ORDER_CONFIRMATION: customerTemplateId || "template_customer_order_confirmation",
                ADMIN_ORDER_RECEIVED: adminTemplateId || "template_admin_order_received"
            },
            
            // Email addresses
            FROM_EMAIL: storeEmail || "orders@pakmegamart.com",
            FROM_NAME: storeName || "PakMegaMart",
            ADMIN_EMAIL: adminEmail || "admin@pakmegamart.com",
            WHATSAPP_NUMBER: whatsappNumber || "+92 326 8502690"
        };
        
        console.log('✅ EmailJS configuration initialized');
        return true;
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        return false;
    }
}

// Wait for EmailJS to be loaded
function waitForEmailJS() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (typeof emailjs !== 'undefined') {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

// Initialize after the DOM is loaded and EmailJS is available
window.addEventListener('load', () => {
    waitForEmailJS().then(() => {
        initializeEmailJSConfig();
    });
});

// ==========================================
// Send Customer Order Confirmation Email with WhatsApp Link
// ==========================================
async function sendCustomerOrderConfirmationEmail(orderData) {
    try {
        // Ensure config is initialized
        if (!EMAILJS_CONFIG) {
            initializeEmailJSConfig();
        }
        
        const templateParams = {
            to_email: orderData.customer_email,
            to_name: orderData.customer_name,
            order_number: orderData.order_number,
            order_date: new Date(orderData.created_at).toLocaleDateString(),
            items_list: formatItemsList(orderData.items),
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping_cost,
            total: orderData.total,
            delivery_address: `${orderData.delivery_address}, ${orderData.city} ${orderData.postal_code}`,
            customer_phone: orderData.customer_phone,
            whatsapp_number: EMAILJS_CONFIG.WHATSAPP_NUMBER,
            whatsapp_link: `https://wa.me/${getEnv('WHATSAPP_PHONE_ID')}`,
            from_email: EMAILJS_CONFIG.FROM_EMAIL,
            from_name: EMAILJS_CONFIG.FROM_NAME
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATES.CUSTOMER_ORDER_CONFIRMATION,
            templateParams
        );

        console.log("✅ Customer order confirmation email sent:", response);
        return response;
    } catch (error) {
        console.error("❌ Failed to send customer order confirmation email:", error);
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
            initializeEmailJSConfig();
        }
        
        const templateParams = {
            to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
            to_name: "Admin",
            order_number: orderData.order_number,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            delivery_address: `${orderData.delivery_address}, ${orderData.city} ${orderData.postal_code}`,
            items_list: formatItemsList(orderData.items),
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping_cost,
            total: orderData.total,
            order_time: new Date(orderData.created_at).toLocaleString(),
            from_email: EMAILJS_CONFIG.FROM_EMAIL,
            from_name: EMAILJS_CONFIG.FROM_NAME
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATES.ADMIN_ORDER_RECEIVED,
            templateParams
        );

        console.log("✅ Admin order notification email sent:", response);
        return response;
    } catch (error) {
        console.error("❌ Failed to send admin order notification email:", error);
        throw error;
    }
}

// ==========================================
// Helper Functions
// ==========================================

// Format items list for email
function formatItemsList(items) {
    if (!items || items.length === 0) return "No items";
    
    return items.map((item, index) => {
        return `${index + 1}. ${item.name} - PKR ${item.price} x ${item.quantity} = PKR ${item.price * item.quantity}`;
    }).join("\n");
}

// Calculate estimated delivery date (5-7 business days)
function calculateEstimatedDelivery() {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    return deliveryDate.toLocaleDateString();
}

// Generate transaction ID
function generateTransactionId() {
    return "TXN-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Log email activity to database
async function logEmailActivity(email, orderId, notificationType, status = "sent") {
    try {
        if (typeof supabaseDB !== 'undefined' && supabaseDB.logEmailNotification) {
            await supabaseDB.logEmailNotification({
                email: email,
                order_id: orderId,
                notification_type: notificationType,
                status: status,
                sent_at: new Date()
            });
        }
    } catch (error) {
        console.error("Failed to log email activity:", error);
    }
}

// Export for use in other scripts
window.emailConfig = {
    sendCustomerOrderConfirmationEmail,
    sendAdminOrderReceivedEmail,
    logEmailActivity
};

// Debug logging removed for production
