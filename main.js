// PakMegaMart - Main JavaScript
// Comprehensive functionality for premium leather wallet website

// Global variables
let cart = JSON.parse(localStorage.getItem('pakMegaMartCart')) || [];
let currentModalProduct = null;
let allProducts = [];

// Product data
const productData = [
    {
        id: 'genuine-leather-bifold',
        name: 'Genuine Leather Bifold',
        price: 999,
        originalPrice: 1300,
        image: 'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Black.png',
        type: 'bifold',
        leather: 'genuine',
        color: 'black',
        description: 'Handcrafted from premium genuine leather with traditional bifold design and hand-stitched details.',
        features: ['6 card slots', '2 bill compartments', 'ID window', 'Durable leather'],
        colorVariants: {
            'black': 'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Black.png',
            'brown': 'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Brown.png',
            'gray': 'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Gray.png',
            'light-gray': 'public/Genuine Leather Bifold Wallet/Genuine Leather Bifold Wallet Light Gray.png'
        }
    },
    {
        id: 'pebbled-leather-long',
        name: 'Pebbled Leather Long Wallet',
        price: 1499,
        originalPrice: 2000,
        image: 'public/Pebbled Leather Long Wallet/Pebbled Leather Long Wallet Black.jpg',
        type: 'long-wallet',
        leather: 'pebbled',
        color: 'black',
        description: 'Sleek pebbled leather long wallet with modern organization and premium craftsmanship.',
        features: ['10 card slots', '3 bill compartments', 'Coin pocket', 'Premium leather'],
        colorVariants: {
            'black': 'public/Pebbled Leather Long Wallet/Pebbled Leather Long Wallet Black.jpg',
            'brown': 'public/Pebbled Leather Long Wallet/Pebbled Leather Long Wallet Brown.jpg',
            'gray': 'public/Pebbled Leather Long Wallet/Pebbled Leather Long Wallet Gray.jpg'
        }
    },
    {
        id: 'vintage-leather-bifold',
        name: 'Vintage Leather Bifold',
        price: 999,
        originalPrice: 1300,
        image: 'public/Vintage Leather Bifold Wallet/Vintage Leather Bifold Wallet Gray.jpg',
        type: 'bifold',
        leather: 'vintage',
        color: 'gray',
        description: 'Vintage-inspired bifold wallet with classic styling and premium construction methods.',
        features: ['8 card slots', '2 bill compartments', 'Heritage design', 'Premium stitching'],
        colorVariants: {
            'black': 'public/Vintage Leather Bifold Wallet/Vintage Leather Bifold Wallet Black.jpg',
            'brown': 'public/Vintage Leather Bifold Wallet/Vintage Leather Bifold Wallet Brown.jpg',
            'gray': 'public/Vintage Leather Bifold Wallet/Vintage Leather Bifold Wallet Gray.jpg'
        }
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    allProducts = [...productData];
    updateCartCounter();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'products':
            initializeProductsPage();
            break;
        case 'about':
            initializeAboutPage();
            break;
    }
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize reveal animations
    setTimeout(initializeRevealAnimations, 100);

    // Highlight active nav link
    highlightActiveNavLink();
}

function getCurrentPage() {
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    if (pageName === 'products.html') return 'products';
    if (pageName === 'about.html') return 'about';
    if (pageName === 'index.html' || pageName === '') return 'index';
    return pageName;
}

// Home page initialization
function initializeHomePage() {
    // Initialize typewriter effect
    if (document.getElementById('typewriter')) {
        const typed = new Typed('#typewriter', {
            strings: [
                'Premium Leather Wallets',
                'Handcrafted Excellence',
                'Timeless Italian Quality'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            cursorChar: '|',
            autoInsertCss: false
        });
    }
    
    // Initialize product carousel
    if (document.getElementById('featuredProducts')) {
        const splide = new Splide('#featuredProducts', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                1024: { perPage: 2 },
                768: { perPage: 1 }
            }
        });
        splide.mount();
    }
}

// Products page initialization
function initializeProductsPage() {
    renderProducts();
    
    // Get URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        // Check the appropriate filter
        const checkbox = document.querySelector(`input[data-filter="type"][value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
            applyFilters();
        }
    }
}

// About page initialization
function initializeAboutPage() {
    // Initialize any about page specific functionality
    // This could include timeline animations, team member interactions, etc.
}

// Product rendering and filtering
function renderProducts(products = allProducts) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productGrid.appendChild(productCard);
    });
    
    // Update product count
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = `Showing ${products.length} products`;
    }
    
    // Trigger reveal animations for new products
    setTimeout(() => {
        const productElements = productGrid.querySelectorAll('.reveal-element');
        productElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, index * 100);
        });
    }, 50);
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card rounded-2xl overflow-hidden shadow-lg reveal-element';
    card.style.transitionDelay = `${index * 50}ms`;
    
    const discountPercent = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    
    card.innerHTML = `
        <div class="relative overflow-hidden" style="height: 280px;">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover cursor-pointer transition-transform duration-500" onclick="openQuickView('${product.id}')">
            ${product.originalPrice ? `<div class="absolute top-4 right-4 discount-badge">-${discountPercent}% OFF</div>` : ''}
        </div>
        <div class="product-info p-6">
            <h3 class="product-title font-display font-semibold text-lg mb-2">${product.name}</h3>
            <p class="product-description text-gray-600 text-sm mb-4">${product.description}</p>
            <div class="product-price-section mb-4">
                <div class="product-price flex flex-col gap-1">
                    ${product.originalPrice ? `<span class="original-price text-gray-500 line-through text-sm">PKR ${product.originalPrice.toLocaleString()}</span>` : ''}
                    <span class="current-price font-semibold text-lg text-accent-burgundy">PKR ${product.price.toLocaleString()}</span>
                </div>
            </div>
            <button class="btn-quick-view w-full btn-primary py-2 rounded-lg font-medium" onclick="openQuickView('${product.id}')">
                Quick View
            </button>
        </div>
    `;
    
    return card;
}

// Filter functionality
function applyFilters() {
    const typeFilters = getCheckedFilters('type');
    const leatherFilters = getCheckedFilters('leather');
    const colorFilters = getCheckedFilters('color');
    const maxPrice = parseInt(document.getElementById('priceRange')?.value || 2500);
    
    let filteredProducts = allProducts.filter(product => {
        const typeMatch = typeFilters.length === 0 || typeFilters.includes(product.type);
        const leatherMatch = leatherFilters.length === 0 || leatherFilters.includes(product.leather);
        const colorMatch = colorFilters.length === 0 || colorFilters.includes(product.color);
        const priceMatch = product.price <= maxPrice;
        
        return typeMatch && leatherMatch && colorMatch && priceMatch;
    });
    
    renderProducts(filteredProducts);
}

function getCheckedFilters(filterType) {
    const checkboxes = document.querySelectorAll(`input[data-filter="${filterType}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function updatePriceRange(value) {
    const priceValue = document.getElementById('priceValue');
    if (priceValue) {
        priceValue.textContent = `PKR ${value}`;
    }
    applyFilters();
}

function clearFilters() {
    // Uncheck all filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    
    // Reset price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 2500;
        updatePriceRange(2500);
    }
    
    // Show all products
    renderProducts();
}

function sortProducts(sortBy) {
    let sortedProducts = [...allProducts];
    
    switch(sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // Reverse order for newest (assuming array order represents newness)
            sortedProducts.reverse();
            break;
    }
    
    renderProducts(sortedProducts);
}

// Quick view modal functionality
function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found with ID:', productId);
        return;
    }
    
    currentModalProduct = product;
    const modal = document.getElementById('quickViewModal');
    
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    // Populate modal content
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalColor = document.getElementById('modalColor');

    if (modalColor && product.colorVariants) {
        // Clear previous options
        modalColor.innerHTML = '';

        // Populate with new color options
        for (const color in product.colorVariants) {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color.charAt(0).toUpperCase() + color.slice(1).replace('-', ' ');
            modalColor.appendChild(option);
        }
    }
    
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalPrice) {
        if (product.originalPrice) {
            modalPrice.innerHTML = `<span class="text-gray-500 line-through mr-2">PKR ${product.originalPrice}</span><span class="text-red-600">PKR ${product.price}</span>`;
        } else {
            modalPrice.textContent = `PKR ${product.price}`;
        }
    }
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalQuantity) modalQuantity.value = 1;
    
    // Determine the default color based on the product.color property
    let defaultColor = product.color || 'brown';
    
    // Set color dropdown to the product's default color
    if (modalColor && product.colorVariants) {
        if (product.colorVariants[defaultColor]) {
            modalColor.value = defaultColor;
        } else {
            // Fallback to first available color if default doesn't exist
            const firstColor = Object.keys(product.colorVariants)[0];
            if (firstColor) {
                defaultColor = firstColor;
                modalColor.value = firstColor;
            }
        }
    }
    
    // Set the image to match the selected color
    if (modalImage && product.colorVariants && product.colorVariants[defaultColor]) {
        modalImage.src = product.colorVariants[defaultColor];
        modalImage.alt = product.name;
    }
    
    // Set up add to cart button
    const addToCartBtn = document.getElementById('modalAddToCart');
    if (addToCartBtn) {
        addToCartBtn.onclick = (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
            const color = document.getElementById('modalColor').value || defaultColor;
            const selectedImage = product.colorVariants[color] || product.image;
            addToCart(productId, product.name, product.price, selectedImage, quantity, color);
            closeQuickView();
        };
    }
    
    // Show modal - remove hidden class and make visible
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate modal content in with anime.js if available
    if (typeof anime !== 'undefined') {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            anime.set(modalContent, { scale: 0.8, opacity: 0 });
            anime({
                targets: modalContent,
                scale: 1,
                opacity: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        }
    }
}

// Update product image when color is selected
function updateProductImage() {
    if (!currentModalProduct) return;
    
    const selectedColor = document.getElementById('modalColor').value;
    const colorVariants = currentModalProduct.colorVariants;
    
    if (colorVariants && colorVariants[selectedColor]) {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = colorVariants[selectedColor];
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    // Animate out with anime.js if available
    if (typeof anime !== 'undefined') {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            anime({
                targets: modalContent,
                scale: 0.8,
                opacity: 0,
                duration: 200,
                easing: 'easeInCubic',
                complete: () => {
                    // Hide modal
                    modal.style.display = 'none';
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        }
    } else {
        // Fallback if anime.js not available
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('modalQuantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, currentValue + change);
    quantityInput.value = newValue;
}

// Shopping cart functionality
function addToCart(id, name, price, image, quantity = 1, color = 'default') {
    // Validate inputs
    if (!id || !name || price <= 0 || !image || quantity <= 0) {
        console.error('Invalid cart item data', { id, name, price, image, quantity });
        return;
    }
    
    const existingItem = cart.find(item => item.id === id && item.color === color);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity,
            color
        });
    }
    
    saveCart();
    updateCartCounter();
    updateCartDisplay();
    showCartNotification(name, quantity);
}

function removeFromCart(id, color = 'default') {
    cart = cart.filter(item => !(item.id === id && item.color === color));
    saveCart();
    updateCartCounter();
    updateCartDisplay();
}

function updateCartQuantity(id, color, newQuantity) {
    const item = cart.find(item => item.id === id && item.color === color);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(id, color);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCounter();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('pakMegaMartCart', JSON.stringify(cart));
}

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cartCounter');
    if (counter) {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function toggleCart() {
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const floatingCart = document.querySelector('.cart-float-container');
    const waFloating = document.querySelector('.wa-float-container');
    
    if (cartPanel.classList.contains('translate-x-full')) {
        // Open cart
        cartPanel.classList.remove('translate-x-full');
        cartOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // mark document when cart is open so floating UI can react via CSS
        document.body.classList.add('cart-open');
        updateCartDisplay();
        // hide floating cart and WhatsApp icons while cart panel is open
        try {
            if (floatingCart) floatingCart.style.display = 'none';
            if (waFloating) waFloating.style.display = 'none';
        } catch (e) {
            console.warn('Could not hide floating icons', e);
        }
    } else {
        // Close cart
        cartPanel.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        // remove cart-open marker
        document.body.classList.remove('cart-open');
        // restore floating cart icon visibility based on cart contents; always show WhatsApp
        try {
            if (floatingCart) {
                const stored = JSON.parse(localStorage.getItem('pakMegaMartCart')) || [];
                const total = stored.reduce((s, it) => s + (it.quantity||0), 0);
                floatingCart.style.display = total > 0 ? 'flex' : 'none';
            }
            if (waFloating) waFloating.style.display = 'flex';
        } catch (e) {
            console.warn('Could not restore floating icons visibility', e);
        }
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg mb-4">Your cart is empty</p><p class="text-gray-400 text-sm">Add some premium wallets to get started</p></div>';
        cartTotal.textContent = 'PKR 0.00';
    } else {
        let total = 0;
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 truncate">${item.name}</h4>
                    <p class="text-sm text-gray-600">Color: <span class="capitalize">${item.color}</span></p>
                    <p class="text-sm text-gray-700 mb-2">Unit: PKR ${item.price.toLocaleString()}</p>
                    <div class="flex items-center space-x-2">
                        <button class="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors font-medium text-gray-700" onclick="updateCartQuantity('${item.id}', '${item.color}', ${item.quantity - 1})">−</button>
                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                        <button class="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors font-medium text-gray-700" onclick="updateCartQuantity('${item.id}', '${item.color}', ${item.quantity + 1})">+</button>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">Subtotal: <span class="font-semibold text-gray-900">PKR ${itemTotal.toLocaleString()}</span></p>
                </div>
                <button class="flex-shrink-0 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200" title="Remove item" onclick="removeFromCart('${item.id}', '${item.color}')">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `PKR ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

function showCartNotification(productName, quantity = 1) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${quantity}x ${productName} added to cart</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [100, 0],
        duration: 300,
        easing: 'easeOutCubic',
        complete: () => {
            // Auto remove after 3 seconds
            setTimeout(() => {
                anime({
                    targets: notification,
                    translateX: [0, 100],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInCubic',
                    complete: () => {
                        document.body.removeChild(notification);
                    }
                });
            }, 3000);
        }
    });
}


function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Scroll animations
function initializeScrollAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for better visual effect
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal-element').forEach(el => {
        observer.observe(el);
    });
}

function highlightActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index' && (linkPage.includes('index.html') || linkPage === '/')) || (linkPage.includes(currentPage) && currentPage !== 'index')) {
            link.classList.add('text-gray-900', 'font-bold');
            link.classList.remove('text-gray-700');
        }
    });
}

// Utility functions
function formatPrice(price) {
    return `PKR ${price.toFixed(2)}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Initialize price range slider
document.addEventListener('DOMContentLoaded', function() {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            updatePriceRange(this.value);
        });
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Reinitialize any size-dependent features
    const currentPage = getCurrentPage();
    if (currentPage === 'index') {
        // Reinitialize carousel if needed
        const splide = document.querySelector('#featuredProducts');
        if (splide && splide.splide) {
            splide.splide.refresh();
        }
    }
}, 250));

// Close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const quickViewModal = document.getElementById('quickViewModal');
        const cartPanel = document.getElementById('cartPanel');
        
        if (quickViewModal && !quickViewModal.classList.contains('hidden')) {
            closeQuickView();
        }
        
        if (cartPanel && !cartPanel.classList.contains('translate-x-full')) {
            toggleCart();
        }
    }
});

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.changeQuantity = changeQuantity;
window.updateProductImage = updateProductImage;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.sortProducts = sortProducts;
window.updatePriceRange = updatePriceRange;
window.checkout = checkout;

// ================== PREMIUM RESPONSIVE NAVBAR ==================
// Scroll behavior detection and navbar animation system
// Optimized for performance with throttling and direction detection

class PremiumNavbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        
        // Skip initialization if navbar doesn't exist (e.g., on checkout page)
        if (!this.navbar) {
            console.info('ℹ️  Navbar element not found - skipping navbar initialization (not on this page)');
            return;
        }
        
        this.lastScrollY = 0;
        this.currentScrollY = 0;
        this.scrollDirection = 'up';
        this.isNavbarVisible = true;
        this.ticking = false;
        this.scrollThreshold = 50; // Minimum scroll distance to trigger direction change
        this.transparencyThreshold = 5; // Pixels before navbar becomes solid
        this.isHomePage = this.detectPage() === 'index';
        
        this.init();
    }
    
    detectPage() {
        const path = window.location.pathname;
        if (path.includes('products')) return 'products';
        if (path.includes('about')) return 'about';
        if (path.includes('checkout')) return 'checkout';
        return 'index';
    }
    
    init() {
        // Add scroll event listener with throttling
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        
        // Initial navbar state
        this.updateNavbarState();
    }
    
    onScroll() {
        this.currentScrollY = window.scrollY;
        
        // Use requestAnimationFrame for smooth 60fps updates
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateNavbarState();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    updateNavbarState() {
        // Detect scroll direction with threshold
        const scrollDifference = this.currentScrollY - this.lastScrollY;
        
        if (Math.abs(scrollDifference) > this.scrollThreshold) {
            this.scrollDirection = scrollDifference > 0 ? 'down' : 'up';
            this.lastScrollY = this.currentScrollY;
        }
        
        // Update navbar background - transparency ONLY on home page
        if (this.isHomePage) {
            this.updateNavbarBackground();
        }
        
        // Update navbar visibility based on scroll direction
        this.updateNavbarVisibility();
    }
    
    updateNavbarBackground() {
        // Transparent ONLY on home page when at the very top (scroll < 5px)
        // Once scrolled even slightly, navbar becomes solid permanently
        const isAtTop = this.currentScrollY < this.transparencyThreshold;
        
        if (isAtTop) {
            this.navbar.classList.remove('navbar-solid');
            this.navbar.classList.add('navbar-transparent');
        } else {
            this.navbar.classList.remove('navbar-transparent');
            this.navbar.classList.add('navbar-solid');
        }
    }
    
    updateNavbarVisibility() {
        // Scrolling down: hide navbar (except when at top)
        // Scrolling up: show navbar
        if (!this.navbar) return; // Navbar not available on this page
        
        const shouldHide = this.scrollDirection === 'down' && this.currentScrollY > 100;
        
        if (shouldHide && this.isNavbarVisible) {
            this.navbar.classList.add('navbar-hide');
            this.navbar.classList.remove('navbar-show');
            this.isNavbarVisible = false;
        } else if (!shouldHide && !this.isNavbarVisible) {
            this.navbar.classList.remove('navbar-hide');
            this.navbar.classList.add('navbar-show');
            this.isNavbarVisible = true;
        }
    }
}

// Initialize premium navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PremiumNavbar();
});
