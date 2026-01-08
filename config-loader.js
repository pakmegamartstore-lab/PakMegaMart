// PakMegaMart Environment Configuration Loader
// Loads environment variables and makes them accessible throughout the application

(async function loadEnvironmentVariables() {
    // Prevent reloading if already loaded
    if (window.ENV) {
        return;
    }

    try {
        const response = await fetch('.env');
        if (!response.ok) {
            throw new Error('Failed to fetch .env file');
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
    } catch (error) {
        window.ENV = {}; // Ensure ENV is an object
    }
})();

// Function to get environment variable with fallback
function getEnv(key, defaultValue = null) {
    if (window.ENV && typeof window.ENV[key] !== 'undefined') {
        return window.ENV[key];
    }
    if (defaultValue !== null) {
        return defaultValue;
    }
    return null;
}

// Export for global use
window.getEnv = getEnv;

