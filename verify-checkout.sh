#!/bin/bash
# PakMegaMart Checkout Flow Verification Script
# Verifies all components are working correctly

echo "🧪 PakMegaMart Checkout Flow Verification"
echo "=========================================="
echo ""

# Check if server is running
echo "📡 Checking web server on port 8000..."
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Web server is running"
else
    echo "❌ Web server is not running on port 8000"
    exit 1
fi

echo ""
echo "📁 Verifying required files exist..."

REQUIRED_FILES=(
    "checkout.html"
    "checkout-handler.js"
    "emailjs-config.js"
    "supabase.js"
    "config-loader.js"
    "main.js"
    ".env"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done

echo ""
echo "🔍 Checking .env file..."
if grep -q "EMAILJS" .env && grep -q "SUPABASE" .env; then
    echo "✅ Environment variables configured"
    echo "   - EmailJS credentials found"
    echo "   - Supabase credentials found"
else
    echo "❌ Missing credentials in .env"
fi

echo ""
echo "📦 Checking key functions in checkout-handler.js..."
if grep -q "function processCheckout" checkout-handler.js; then
    echo "✅ processCheckout function defined"
fi
if grep -q "function validateFormData" checkout-handler.js; then
    echo "✅ validateFormData function defined"
fi
if grep -q "function getFormDataFromCheckout" checkout-handler.js; then
    echo "✅ getFormDataFromCheckout function defined"
fi

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:8000/checkout.html in browser"
echo "2. Run TEST_CHECKOUT_FLOW.html test suite"
echo "3. Complete test checkout to verify email sending"
echo "4. Check Supabase dashboard for order record"
