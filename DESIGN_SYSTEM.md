# Design System & Component Guide

## PakMegaMart - Premium UI Components

### Color Palette

#### Primary Colors
```
Primary Dark: #2D1F0F
- Use: Headlines, primary text, dark backgrounds
- Contrast: WCAG AAA compliant on light backgrounds

Primary Brown: #8B6F47  
- Use: Buttons, accents, hover states
- Contrast: WCAG AA compliant

Neutral Cream: #F5F3F0
- Use: Primary background, card backgrounds
- Contrast: Professional, clean appearance
```

#### Accent Colors
```
Accent Gold: #D4AF37
- Use: Limited luxury touches, hover accents
- Limited use to maintain sophistication

Accent Burgundy: #C41E3A
- Use: Discounts, alerts, urgency indicators
- High visibility

Border Light: #E8E4E0
- Use: Subtle borders, dividers
- Non-intrusive definition
```

---

## Typography System

### Font Families
```
Display (Luxury): 'Playfair Display', serif
- Headlines, product titles, brand elements
- Weight: 600, 700
- Letter spacing: 0.5px

Body (Modern): 'Inter', sans-serif
- Body text, UI copy, descriptions
- Weight: 400, 500, 600
- Line height: 1.6

Accent (Elegance): 'Crimson Text', serif
- Special highlights, testimonials
- Weight: 400, 600
- Use sparingly for impact
```

### Font Sizes & Scale

```
H1: 3.5rem (56px)
- Primary page headlines
- Mobile: 2.25rem

H2: 2.25rem (36px)
- Section headers
- Mobile: 1.75rem

H3: 1.5rem (24px)
- Subsection headers
- Card titles

H4: 1.25rem (20px)
- Supporting headers
- List items

Body Large: 1.125rem (18px)
- Introduction text
- Important body copy

Body: 1rem (16px)
- Primary body text
- Form inputs

Body Small: 0.875rem (14px)
- Secondary text
- Captions

Text XSmall: 0.75rem (12px)
- Fine print
- Metadata
```

### Line Heights & Letter Spacing

```
H1-H4: Line height 1.1-1.4, Letter spacing 0.5px
Body: Line height 1.65, Letter spacing 0.3px
Small: Line height 1.5, Letter spacing 0.2px
```

---

## Button Components

### Primary Button

```html
<!-- HTML -->
<button class="btn-primary">Shop Now</button>

<!-- CSS Classes -->
.btn-primary {
  background: linear-gradient(135deg, #8B6F47 0%, #6B5437 100%);
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 15px rgba(139, 111, 71, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #A08155 0%, #8B6F47 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 111, 71, 0.35);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Secondary Button (Outline)

```html
<!-- HTML -->
<button class="btn-secondary">Learn More</button>

<!-- CSS Classes -->
.btn-secondary {
  background-color: transparent;
  color: white;
  padding: 0.875rem 2rem;
  border: 2px solid white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
}
```

### Quick View Button

```html
<!-- HTML -->
<button class="btn-quick-view">Quick View</button>

<!-- CSS Classes -->
.btn-quick-view {
  width: 100%;
  padding: 0.75rem;
  background: #8B6F47;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-quick-view:hover {
  background: #6B5437;
  transform: translateY(-2px);
}
```

---

## Card Components

### Product Card

```html
<div class="product-card">
  <div class="relative overflow-hidden" style="height: 280px;">
    <img src="wallet.png" alt="Wallet">
    <div class="discount-badge">-23% OFF</div>
  </div>
  <div class="product-info">
    <h3 class="product-title">Genuine Leather Bifold</h3>
    <p class="product-description">Premium leather bifold design...</p>
    <div class="product-price-section">
      <div class="product-price">
        <span class="original-price">PKR 1,300</span>
        <span class="current-price">PKR 999</span>
      </div>
    </div>
    <button class="btn-quick-view">Quick View</button>
  </div>
</div>

/* CSS Classes */
.product-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid #E8E4E0;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(139, 111, 71, 0.15);
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D1F0F;
  margin-bottom: 0.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-price-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8B6F47;
}
```

### Discount Badge

```html
<div class="discount-badge">-23% OFF</div>

/* CSS */
.discount-badge {
  background: #C41E3A;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
```

### Testimonial Card

```html
<div class="testimonial-card">
  <div class="flex mb-4">
    <span class="text-gold">★★★★★</span>
  </div>
  <p class="mb-4 text-gray-700">"Exceptional quality and craftsmanship..."</p>
  <p class="font-semibold text-primary-dark">John Smith</p>
</div>

/* CSS */
.testimonial-card {
  background: white;
  backdrop-filter: blur(10px);
  border: 1px solid #E8E4E0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.testimonial-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
```

---

## Navigation Components

### Sticky Header

```html
<nav class="sticky-header">
  <!-- Brand -->
  <div>PakMegaMart</div>
  
  <!-- Links -->
  <div class="nav-links">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">Products</a>
    <a href="#" class="nav-link">About</a>
    <a href="#" class="nav-link">Contact</a>
  </div>
  
  <!-- Cart -->
  <button class="relative">
    <svg><!-- cart icon --></svg>
    <span class="cart-counter">3</span>
  </button>
</nav>

/* CSS */
nav {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.97);
  border-bottom: 1px solid #E8E4E0;
  position: sticky;
  top: 0;
  z-index: 40;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
  font-weight: 500;
  color: #2D1F0F;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #8B6F47;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #8B6F47;
}

.nav-link:hover::after {
  width: 100%;
}

.cart-counter {
  background: #C41E3A;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -8px;
  right: -8px;
  font-weight: 700;
}
```

---

## Animation Guidelines

### Easing Functions

```
Standard: 0.3s ease
Smooth Elastic: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
Slow Elastic: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Micro-interactions

```
Hover Effects:
- Cards: translateY(-12px)
- Buttons: translateY(-2px)
- Images: scale(1.05)

Transitions:
- All 0.3-0.5s with smooth easing
- Staggered animations for multiple elements (50-100ms delay)

Scroll Animations:
- Fade-in with translateY(30px) → translateY(0)
- Staggered by 100ms per element
```

---

## Responsive Breakpoints

```
Mobile: < 640px
- H1: 2.25rem
- Button padding: 1rem 1.5rem
- Card grid: 1 column
- Stacked navigation

Tablet: 640px - 1024px
- H1: 3rem
- Button padding: 0.875rem 2rem
- Card grid: 2 columns
- Horizontal navigation

Desktop: > 1024px
- H1: 3.5rem
- Button padding: 0.875rem 2rem
- Card grid: 3 columns
- Full navigation
```

---

## Accessibility Standards

### Color Contrast
- WCAG AAA: 7:1 (AAA standard for critical elements)
- WCAG AA: 4.5:1 (minimum for body text)
- All colors meet or exceed AA standards

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Spacing: 8px between interactive elements

### Focus States
- Visible focus ring (2px outline)
- High contrast (4.5:1 minimum)
- Not removed or hidden

### Keyboard Navigation
- Logical tab order
- Semantic HTML structure
- Proper heading hierarchy

---

## Implementation Checklist

- [ ] Color palette implemented in CSS variables
- [ ] Typography hierarchy applied correctly
- [ ] All buttons have hover and active states
- [ ] Cards have proper shadows and transitions
- [ ] Navigation is sticky and responsive
- [ ] Discount badges visible on sale items
- [ ] Mobile breakpoints tested
- [ ] Accessibility standards met
- [ ] Animations tested for smoothness
- [ ] Form inputs have proper styling
- [ ] Focus states visible
- [ ] Touch targets adequate on mobile

---

**This design system ensures consistency, accessibility, and premium appearance across all pages.**
