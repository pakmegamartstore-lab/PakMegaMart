// PakMegaMart Environment Configuration Loader
// Loads environment variables and makes them accessible throughout the application

(async function loadEnvironmentVariables() {
    // Prevent reloading if already loaded
    if (window.ENV && Object.keys(window.ENV).length > 0) {
        return;
    }

    try {
        const response = await fetch('.env');
        if (!response.ok) {
            console.warn('⚠️ .env file not found. Using fallback configuration.');
            window.ENV = {};
            return;
        }

        const envContent = await response.text();
        const lines = envContent.split('\n');
        
        const env = {};
        lines.forEach(line => {
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) return;
            
            const [key, ...valueParts] = line.split('=');
            const cleanKey = key.trim();
            let cleanValue = valueParts.join('=').trim();
            
            // Remove surrounding quotes if they exist
            if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) || (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
                cleanValue = cleanValue.slice(1, -1);
            }
            
            if (cleanKey) {
                env[cleanKey] = cleanValue;
            }
        });
        
        // Make environment variables globally accessible
        window.ENV = env;
        console.log('✅ Environment variables loaded successfully');
    } catch (error) {
        console.warn('⚠️ Failed to load .env file:', error.message);
        window.ENV = window.ENV || {}; // Ensure ENV is an object
    }
})();

// Function to get environment variable with fallback
function getEnv(key, defaultValue = null) {
    if (window.ENV && typeof window.ENV[key] !== 'undefined' && window.ENV[key] !== '') {
        return window.ENV[key];
    }
    if (defaultValue !== null) {
        return defaultValue;
    }
    return null;
}

// Export for global use
window.getEnv = getEnv;
console.log('✅ Config loader initialized');

