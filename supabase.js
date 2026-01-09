// Supabase Configuration and Client
// Initialize Supabase connection for PakMegaMart
// Loads credentials from environment variables (.env file)

let supabaseClient = null;
let SUPABASE_INIT_ATTEMPTS = 0;
const MAX_SUPABASE_INIT_ATTEMPTS = 10;

// Wait for environment variables to be loaded
function waitForEnvironmentVariables() {
    return new Promise((resolve) => {
        let attempts = 0;
        const checkEnv = () => {
            if (window.ENV && Object.keys(window.ENV).length > 0) {
                resolve();
            } else if (attempts < 20) {
                attempts++;
                setTimeout(checkEnv, 100);
            } else {
                console.warn('⚠️  Environment variables did not load within timeout');
                resolve();
            }
        };
        checkEnv();
    });
}

// Initialize Supabase client using environment variables
function initSupabaseConnection() {
    // Get values with fallback to defaults
    const supabaseUrl = getEnv('SUPABASE_URL');
    const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration is incomplete.');
        console.error('   Required: SUPABASE_URL =', supabaseUrl ? '✅' : '❌');
        console.error('   Required: SUPABASE_ANON_KEY =', supabaseAnonKey ? '✅' : '❌');
        console.warn('ℹ️  Supabase will not be available. Database operations will be skipped.');
        // Return null but don't block page load
        return null;
    }
    
    try {
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded');
            return null;
        }
        
        const client = supabase.createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase client initialized successfully');
        console.log('   URL:', supabaseUrl.substring(0, 30) + '...');
        return client;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase client:', error.message);
        return null;
    }
}

// Wait for Supabase library to be loaded
function waitForSupabase() {
    return new Promise((resolve) => {
        const checkSupabase = () => {
            if (typeof supabase !== 'undefined') {
                resolve();
            } else if (SUPABASE_INIT_ATTEMPTS < MAX_SUPABASE_INIT_ATTEMPTS) {
                SUPABASE_INIT_ATTEMPTS++;
                setTimeout(checkSupabase, 200);
            } else {
                console.warn('⚠️  Supabase library did not load within timeout');
                resolve();
            }
        };
        checkSupabase();
    });
}

// Initialize Supabase when everything is ready
window.addEventListener('load', async () => {
    console.log('🔍 Checking for Supabase library...');
    await waitForEnvironmentVariables();
    await waitForSupabase();
    supabaseClient = initSupabaseConnection();
});

// ==========================================
// PRODUCTS TABLE OPERATIONS
// ==========================================

async function fetchProducts() {
    try {
        if (!supabaseClient) {
            console.warn('⚠️  Supabase not available, skipping product fetch');
            return [];
        }
        const { data, error } = await supabaseClient
            .from('products')
            .select('*');
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getProductById(id) {
    try {
        if (!supabaseClient) {
            console.warn('⚠️  Supabase not available, skipping product fetch');
            return null;
        }
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function addProduct(product) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('products')
            .insert([product]);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

// ==========================================
// ORDERS TABLE OPERATIONS
// ==========================================

async function createOrder(orderData) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([orderData])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

async function getOrdersByEmail(email) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('customer_email', email);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ status: status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
}

// ==========================================
// CART TABLE OPERATIONS
// ==========================================

async function saveCartToDatabase(userId, cartItems) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('carts')
            .upsert([{
                user_id: userId,
                items: JSON.stringify(cartItems),
                updated_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving cart:', error);
        return null;
    }
}

async function getCartFromDatabase(userId) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? JSON.parse(data.items) : [];
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

// ==========================================
// CUSTOMERS TABLE OPERATIONS
// ==========================================

async function createOrUpdateCustomer(customerData) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('customers')
            .upsert([{
                email: customerData.email,
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
                city: customerData.city,
                postal_code: customerData.postal_code,
                updated_at: new Date().toISOString()
            }], { onConflict: 'email' });
        
        if (error && error.code !== 'PGRST116') throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating/updating customer:', error);
        return null;
    }
}

async function getCustomerByEmail(email) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('customers')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('Error fetching customer:', error);
        return null;
    }
}

// ==========================================
// REVIEWS TABLE OPERATIONS
// ==========================================

async function addReview(review) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('reviews')
            .insert([{
                product_id: review.productId,
                customer_name: review.customerName,
                rating: review.rating,
                comment: review.comment,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding review:', error);
        return null;
    }
}

async function getReviewsByProductId(productId) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// ==========================================
// INVENTORY TABLE OPERATIONS
// ==========================================

async function updateInventory(productId, color, quantityChange) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('inventory')
            .select('*')
            .eq('product_id', productId)
            .eq('color', color)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        const newQuantity = (data?.quantity || 0) + quantityChange;
        
        if (data) {
            // Update existing
            const { updateData, updateError } = await supabaseClient
                .from('inventory')
                .update({ quantity: newQuantity })
                .eq('id', data.id);
            
            if (updateError) throw updateError;
            return updateData;
        } else {
            // Insert new
            const { insertData, insertError } = await supabaseClient
                .from('inventory')
                .insert([{
                    product_id: productId,
                    color: color,
                    quantity: newQuantity
                }]);
            
            if (insertError) throw insertError;
            return insertData;
        }
    } catch (error) {
        console.error('Error updating inventory:', error);
        return null;
    }
}

async function getInventoryByProductId(productId) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('inventory')
            .select('*')
            .eq('product_id', productId);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
}

// ==========================================
// ENHANCED ORDER OPERATIONS
// ==========================================

async function createCompleteOrder(orderData) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        
        // Generate order number
        const orderNumber = '#' + Math.floor(Math.random() * 1000000);
        
        // First, create or get customer
        let customerId = null;
        const existingCustomer = await getCustomerByEmail(orderData.email);
        
        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const { data: newCustomer, error: customerError } = await supabaseClient
                .from('customers')
                .insert([{
                    email: orderData.email,
                    first_name: orderData.first_name,
                    last_name: orderData.last_name,
                    phone: orderData.phone,
                    address: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    zip_code: orderData.zip_code,
                    country: orderData.country
                }])
                .select()
                .single();
            
            if (customerError) throw customerError;
            customerId = newCustomer.id;
        }
        
        // Create order
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert([{
                order_number: orderNumber,
                customer_id: customerId,
                customer_email: orderData.email,
                status: 'pending',
                payment_method: orderData.payment_method,
                payment_status: 'unpaid',
                subtotal: orderData.subtotal,
                shipping_cost: orderData.shipping_cost || 160,
                total: orderData.total,
                shipping_address: {
                    first_name: orderData.first_name,
                    last_name: orderData.last_name,
                    address: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    zip_code: orderData.zip_code,
                    country: orderData.country,
                    phone: orderData.phone
                },
                notes: orderData.notes || null,
                estimated_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }])
            .select()
            .single();
        
        if (orderError) throw orderError;
        
        // Insert order items
        if (orderData.items && orderData.items.length > 0) {
            const orderItems = orderData.items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                product_price: item.price,
                quantity: item.quantity,
                color: item.color,
                item_total: item.price * item.quantity
            }));
            
            const { error: itemsError } = await supabaseClient
                .from('order_items')
                .insert(orderItems);
            
            if (itemsError) throw itemsError;
        }
        
        // Add initial status history
        await supabaseClient
            .from('order_status_history')
            .insert([{
                order_id: order.id,
                status: 'pending',
                notes: 'Order created'
            }]);
        
        return {
            ...order,
            order_number: orderNumber
        };
    } catch (error) {
        console.error('Error creating complete order:', error);
        return null;
    }
}

async function getOrderDetails(orderId) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (orderError) throw orderError;
        
        const { data: items, error: itemsError } = await supabaseClient
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        
        if (itemsError) throw itemsError;
        
        const { data: history, error: historyError } = await supabaseClient
            .from('order_status_history')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false });
        
        if (historyError) throw historyError;
        
        return {
            ...order,
            items: items || [],
            status_history: history || []
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}

async function updateOrderStatusWithHistory(orderId, newStatus, notes = '') {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        
        const { error: updateError } = await supabaseClient
            .from('orders')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId);
        
        if (updateError) throw updateError;
        
        const { error: historyError } = await supabaseClient
            .from('order_status_history')
            .insert([{
                order_id: orderId,
                status: newStatus,
                notes: notes
            }]);
        
        if (historyError) throw historyError;
        
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}

// ==========================================
// INVENTORY OPERATIONS
// ==========================================

async function checkProductStock(productId) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('inventory')
            .select('*')
            .eq('product_id', productId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || { quantity_available: 0 };
    } catch (error) {
        console.error('Error checking stock:', error);
        return { quantity_available: 0 };
    }
}

async function reserveStock(productId, quantity) {
    try {
        if (!supabaseClient) throw new Error('Supabase client not initialized');
        const { data, error } = await supabaseClient
            .from('inventory')
            .update({
                quantity_reserved: supabaseClient.raw('quantity_reserved + ' + quantity),
                updated_at: new Date().toISOString()
            })
            .eq('product_id', productId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error reserving stock:', error);
        return null;
    }
}

// Export functions for use in main.js
window.supabaseDB = {
    // Products
    fetchProducts,
    getProductById,
    addProduct,
    // Orders
    createOrder,
    createCompleteOrder,
    getOrdersByEmail,
    getOrderDetails,
    updateOrderStatus,
    updateOrderStatusWithHistory,
    // Customers
    createOrUpdateCustomer,
    getCustomerByEmail,
    // Cart (deprecated but kept for compatibility)
    saveCartToDatabase,
    getCartFromDatabase,
    // Reviews
    addReview,
    getReviewsByProductId,
    // Inventory
    updateInventory,
    getInventoryByProductId,
    checkProductStock,
    reserveStock
};
