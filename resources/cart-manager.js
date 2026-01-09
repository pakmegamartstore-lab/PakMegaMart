/**
 * Cart Manager - Handles cart count updates for floating cart badge
 */

function initializeCartManager() {
    const cartCountElement = document.querySelector('.cart-count');

    if (!cartCountElement) {
        console.info('ℹ️  Cart count element not found - continuing without it (may not be on this page)');
        // Don't retry indefinitely - just continue without cart count updates
        return;
    }

    console.log('✅ Cart manager initialized');

    // Function to calculate total item quantity in cart
    function getTotalItemsFromStorage() {
        try {
            const cart = JSON.parse(localStorage.getItem('pakMegaMartCart')) || [];
            return cart.reduce((sum, it) => sum + (it.quantity || 0), 0);
        } catch (e) {
            console.error('Error reading cart from storage', e);
            return 0;
        }
    }

    // Function to update cart display
    function updateCartDisplay() {
        try {
            const totalItems = getTotalItemsFromStorage();
            console.log('Floating cart total items:', totalItems);

            // Update floating cart count badge
            if (cartCountElement) {
                cartCountElement.textContent = totalItems;
                cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
            }

            // Also update navbar cart counter if it exists
            const navbarCounter = document.getElementById('cartCounter');
            if (navbarCounter) {
                navbarCounter.textContent = totalItems;
                navbarCounter.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart display:', error);
        }
    }

    // Initial update
    updateCartDisplay();

    // Listen for storage changes (cart updates from other tabs/windows)
    window.addEventListener('storage', updateCartDisplay);

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartDisplay);

    // Monitor localStorage changes within the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'pakMegaMartCart') {
            console.log('Cart updated in localStorage');
            updateCartDisplay();
        }
    };

    // Also listen for direct updates to the navbar counter
    const observer = new MutationObserver(() => {
        updateCartDisplay();
    });
    
    const navbarCounter = document.getElementById('cartCounter');
    if (navbarCounter) {
        observer.observe(navbarCounter, { characterData: true, subtree: true });
    }
}

// Listen for components to be loaded
window.addEventListener('componentsLoaded', initializeCartManager);

// Also try initializing on DOM ready with retry logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCartManager, 100);
    });
} else {
    setTimeout(initializeCartManager, 100);
}
