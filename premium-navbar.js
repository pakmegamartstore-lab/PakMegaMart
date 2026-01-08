// ================== PREMIUM RESPONSIVE NAVBAR ==================
// Scroll behavior detection and navbar animation system
// Optimized for performance with throttling and direction detection

class PremiumNavbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
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
