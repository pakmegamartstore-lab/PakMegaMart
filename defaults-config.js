// PakMegaMart Global Configuration Defaults
// This file sets up default values if environment variables aren't loaded
// Load this BEFORE other scripts

(function() {
    // Default values (fallback if .env not loaded)
    // ⚠️ SECURITY WARNING: Never hardcode real credentials here
    // These are PLACEHOLDER values - load actual values from .env file
    const DEFAULT_CONFIG = {
        EMAILJS_SERVICE_ID: 'your_service_id',
        EMAILJS_PUBLIC_KEY: 'your_public_key',
        EMAILJS_PRIVATE_KEY: 'your_private_key', // NEVER expose private key in client-side code!
        EMAILJS_CUSTOMER_TEMPLATE_ID: 'your_customer_template_id',
        EMAILJS_ADMIN_TEMPLATE_ID: 'your_admin_template_id',
        SUPABASE_URL: 'https://your-project.supabase.co',
        SUPABASE_ANON_KEY: 'your_anon_key',
        ADMIN_EMAIL: 'admin@pakmegamart.com',
        WHATSAPP_NUMBER: '+92-326-8502690',
        WHATSAPP_PHONE_ID: '923268502690',
        STORE_NAME: 'PakMegaMart',
        STORE_EMAIL: 'orders@pakmegamart.com',
        STORE_PHONE: '+92-326-8502690',
        SHIPPING_COST_DEFAULT: '500',
        SHIPPING_DAYS_MIN: '5',
        SHIPPING_DAYS_MAX: '7',
        NODE_ENV: 'production'
    };

    // Initialize global ENV object if it doesn't exist
    if (!window.ENV) {
        window.ENV = {};
    }

    // Apply defaults only if the key is not already set in window.ENV
    for (const key in DEFAULT_CONFIG) {
        if (typeof window.ENV[key] === 'undefined') {
            window.ENV[key] = DEFAULT_CONFIG[key];
        }
    }

    // Enhanced getEnv function with defaults
    function getEnv(key, defaultValue = null) {
        if (window.ENV && typeof window.ENV[key] !== 'undefined') {
            return window.ENV[key];
        }
        if (defaultValue !== null) {
            return defaultValue;
        }
        return null;
    }

    // Make getEnv global
    window.getEnv = getEnv;
})();
