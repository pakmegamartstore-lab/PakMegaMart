# Checkout Flow Guide

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                   SHOPPING EXPERIENCE                        │
│                                                               │
│  1. Browse Products (index.html / products.html)            │
│     ↓                                                        │
│  2. View Product Details & Quick View Modal                │
│     ↓                                                        │
│  3. Add Items to Cart                                       │
│     ↓                                                        │
│  4. Open Shopping Cart Panel (bottom right)                │
│     └→ See cart items, update quantities                   │
│     └→ See subtotal and totals                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                     [CHECKOUT BUTTON]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     CHECKOUT PROCESS                         │
│                                                               │
│    ┌──────────────────────────────────────────────────┐    │
│    │ STEP 1: SHIPPING INFORMATION                    │    │
│    │ ─────────────────────────────────────────────── │    │
│    │ • First Name, Last Name                         │    │
│    │ • Email Address                                 │    │
│    │ • Phone Number                                  │    │
│    │ • Street Address                                │    │
│    │ • City, State, Zip Code                         │    │
│    │ • Country                                       │    │
│    │ • Shipping Method Selection:                    │    │
│    │   - Standard ($9.99) - 5-7 days                │    │
│    │   - Express ($24.99) - 2-3 days                │    │
│    │   - Overnight ($49.99) - Next day              │    │
│    │                                                  │    │
│    │ [Validation Required Before Proceeding]        │    │
│    │              [Continue to Payment →]           │    │
│    └──────────────────────────────────────────────────┘    │
│                            ↓                                │
│    ┌──────────────────────────────────────────────────┐    │
│    │ STEP 2: PAYMENT INFORMATION                     │    │
│    │ ─────────────────────────────────────────────── │    │
│    │                                                  │    │
│    │ Payment Method Selection:                       │    │
│    │ ○ Credit/Debit Card                            │    │
│    │ ○ PayPal                                        │    │
│    │ ○ Apple Pay                                     │    │
│    │                                                  │    │
│    │ Card Details (if Card selected):                │    │
│    │ • Cardholder Name                              │    │
│    │ • Card Number (auto-formatted)                 │    │
│    │ • Expiration Date (MM/YY)                      │    │
│    │ • CVV                                           │    │
│    │ ✓ Billing address same as shipping             │    │
│    │                                                  │    │
│    │ [Validation Required Before Proceeding]        │    │
│    │ [← Previous]              [Review Order →]     │    │
│    └──────────────────────────────────────────────────┘    │
│                            ↓                                │
│    ┌──────────────────────────────────────────────────┐    │
│    │ STEP 3: ORDER REVIEW                            │    │
│    │ ─────────────────────────────────────────────── │    │
│    │                                                  │    │
│    │ Shipping Address Summary                        │    │
│    │ [Edit]                                          │    │
│    │                                                  │    │
│    │ Billing Information Summary                     │    │
│    │ [Edit]                                          │    │
│    │                                                  │    │
│    │ ✓ I agree to terms and conditions             │    │
│    │                                                  │    │
│    │ [← Previous]              [Complete Order]     │    │
│    └──────────────────────────────────────────────────┘    │
│                            ↓                                │
│            [ORDER PROCESSING & CONFIRMATION]               │
│                            ↓                                │
│    ┌──────────────────────────────────────────────────┐    │
│    │ ✓ ORDER CONFIRMED!                              │    │
│    │ ─────────────────────────────────────────────── │    │
│    │                                                  │    │
│    │ Order Number: #ABC123DEF                        │    │
│    │ Estimated Delivery: Jan 15, 2026               │    │
│    │                                                  │    │
│    │ Confirmation email sent to your address        │    │
│    │                                                  │    │
│    │         [Return to Home]                        │    │
│    └──────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Order Summary Sidebar

```
┌────────────────────────────────────┐
│      ORDER SUMMARY (Sticky)         │
├────────────────────────────────────┤
│                                     │
│  Genuine Leather Bifold            │
│  Color: Brown | Qty: 1              │
│                                     │
│  Vintage Leather Bifold            │
│  Color: Black | Qty: 2              │
│                                     │
├────────────────────────────────────┤
│  Subtotal          $547.00          │
│  Shipping            $9.99          │
│  Tax                $43.76          │
├────────────────────────────────────┤
│  TOTAL            $600.75           │
├────────────────────────────────────┤
│  ✓ Free returns within 30 days     │
│  ✓ Authentic leather guarantee    │
│  ✓ Lifetime warranty               │
└────────────────────────────────────┘
```

## Progress Indicator

```
Step 1 (Active)        Step 2 (Pending)       Step 3 (Pending)
       ⊙ ──────────────── ○ ──────────────── ○
       
       ↓ (After completion of Step 1)
       
Step 1 (Completed)     Step 2 (Active)        Step 3 (Pending)
       ✓ ──────────────── ⊙ ──────────────── ○
       
       ↓ (After completion of Step 2)
       
Step 1 (Completed)     Step 2 (Completed)     Step 3 (Active)
       ✓ ──────────────── ✓ ──────────────── ⊙
```

## Form Validation Flow

```
┌─────────────────────────────────────┐
│        USER ENTERS DATA              │
├─────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ Client-side Validation          │ │
│  ├─────────────────────────────────┤ │
│  │ • Required fields check         │ │
│  │ • Email format validation       │ │
│  │ • Phone number format           │ │
│  │ • Card number format (if card)  │ │
│  │ • Expiry date format (if card)  │ │
│  └─────────────────────────────────┘ │
│                ↓                      │
│        ┌──────────────┐               │
│        │  VALID?      │               │
│        └──────────────┘               │
│         ↙           ↘                 │
│        NO           YES               │
│         ↓            ↓                │
│    [Error      [Proceed to          │
│     Alert]      Next Step]           │
│                                      │
└─────────────────────────────────────┘
```

## Data Storage

```
┌─────────────────────────────────────┐
│        LOCAL STORAGE KEYS            │
├─────────────────────────────────────┤
│                                      │
│  1. artisanCart                     │
│     └─ Cart items data              │
│        • Product details            │
│        • Selected colors            │
│        • Quantities                 │
│                                      │
│  2. checkoutData                    │
│     └─ Shipping information         │
│        • Customer details           │
│        • Address info               │
│        • Shipping method selected   │
│                                      │
│  Cleared after order completion     │
│                                      │
└─────────────────────────────────────┘
```

## Cart Item Structure

```javascript
{
  id: "genuine-leather-bifold",
  name: "Genuine Leather Bifold",
  price: 189,
  image: "public/Genuine Leather Bifold Wallet/...jpg",
  quantity: 1,
  color: "brown"
}
```

## Calculation Example

```
┌─────────────────────────────────────┐
│     PRICE CALCULATION EXAMPLE        │
├─────────────────────────────────────┤
│                                      │
│ Product 1: Genuine Leather Bifold   │
│   Price: $189 × Quantity: 1         │
│   = $189.00                         │
│                                      │
│ Product 2: Vintage Leather Bifold   │
│   Price: $199 × Quantity: 2         │
│   = $398.00                         │
│                                      │
├─────────────────────────────────────┤
│ Subtotal: $189 + $398 = $587.00     │
│                                      │
│ Shipping (Express): $24.99          │
│                                      │
│ Tax (8%): $587 × 0.08 = $46.96     │
│                                      │
├─────────────────────────────────────┤
│ GRAND TOTAL: $587.00 + $24.99 +    │
│              $46.96 = $658.95       │
│                                      │
└─────────────────────────────────────┘
```

## Navigation Between Steps

```
Current Step: 1 (Shipping)
┌─────────────────────────┐
│  [Hidden]  |  [Next →]  │
└─────────────────────────┘

Current Step: 2 (Payment)
┌──────────────────────────┐
│  [← Previous]  |  [Next →] │
└──────────────────────────┘

Current Step: 3 (Review)
┌───────────────────────────────────┐
│  [← Previous]  |  [Complete Order] │
└───────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────┐
│        ERROR SCENARIOS              │
├─────────────────────────────────────┤
│                                      │
│ ✗ Empty Cart → "Your cart is       │
│               empty!" alert         │
│                                      │
│ ✗ Missing field → "Please fill in  │
│                 all required        │
│                 fields" alert       │
│                                      │
│ ✗ Invalid email → Validation in    │
│                  email input        │
│                                      │
│ ✗ Missing T&C agreement →          │
│   "Please agree to terms" alert    │
│                                      │
│ ✗ Browser localStorage disabled →  │
│   Cart data won't persist          │
│                                      │
└─────────────────────────────────────┘
```

## Files Involved

```
Project Root
│
├── index.html
│   ├── Shopping Cart Panel
│   ├── [Checkout Button]
│   └── Links to checkout.html
│
├── products.html
│   ├── Shopping Cart Panel
│   ├── [Checkout Button]
│   └── Links to checkout.html
│
├── checkout.html (NEW)
│   ├── Step 1: Shipping Form
│   ├── Step 2: Payment Form
│   ├── Step 3: Review & Confirm
│   ├── Order Summary Sidebar
│   ├── Progress Indicator
│   └── Success Modal
│
├── main.js
│   ├── checkout() function → redirects to checkout.html
│   ├── addToCart() → adds to localStorage
│   ├── Cart management functions
│   └── Existing product functionality
│
└── CHECKOUT_DOCUMENTATION.md (NEW)
    └── Complete feature documentation

```

---

**Visual Guide Version**: 1.0
**Last Updated**: January 6, 2026
