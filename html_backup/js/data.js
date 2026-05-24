/* ================================================
   SASMIKA MOBILES — Sample Data Store
   All products, services, categories, and user data
   ================================================ */

const STORE_DATA = {
    categories: [
        { id: 'headsets', name: 'Headsets', icon: '🎧', types: ['Wired', 'Neckband', 'Airpods', 'Over-Ear'] },
        { id: 'chargers', name: 'Chargers', icon: '🔌', types: ['Fast Charger', 'Wireless Charger', 'Car Charger', 'Multi-Port'] },
        { id: 'covers', name: 'Phone Covers', icon: '📱', types: ['Back Case', 'Flip Cover', 'Transparent', 'Silicon'] },
        { id: 'cables', name: 'Cables', icon: '🔗', types: ['USB-C', 'Lightning', 'Micro USB', 'Multi-Cable'] },
        { id: 'speakers', name: 'Speakers', icon: '🔊', types: ['Bluetooth Speaker', 'Portable', 'Party Speaker'] },
        { id: 'powerbanks', name: 'Power Banks', icon: '🔋', types: ['10000mAh', '20000mAh', 'Mini'] },
        { id: 'tempered', name: 'Tempered Glass', icon: '🛡️', types: ['Full Cover', 'Privacy', 'Matte'] },
        { id: 'holders', name: 'Holders & Stands', icon: '🗜️', types: ['Car Mount', 'Desk Stand', 'Ring Holder'] }
    ],

    products: [
        {
            id: 'p001',
            name: 'boAt Rockerz 255 Pro+',
            category: 'headsets',
            type: 'Neckband',
            brand: 'boAt',
            price: 1299,
            offerPrice: 799,
            offerPercent: 38,
            color: 'Active Black',
            specs: 'Bluetooth 5.0 | 40H Playtime | IPX7 Water Resistant | Fast Charge',
            rating: 4.3,
            image: '',
            featured: true,
            stock: 25
        },
        {
            id: 'p002',
            name: 'OnePlus Nord Buds 2',
            category: 'headsets',
            type: 'Airpods',
            brand: 'OnePlus',
            price: 2999,
            offerPrice: 2499,
            offerPercent: 17,
            color: 'Thunder Gray',
            specs: 'ANC | 12.4mm Drivers | 36H Battery | IP55 Rating',
            rating: 4.5,
            image: '',
            featured: true,
            stock: 15
        },
        {
            id: 'p003',
            name: 'Samsung 25W Fast Charger',
            category: 'chargers',
            type: 'Fast Charger',
            brand: 'Samsung',
            price: 1499,
            offerPrice: 899,
            offerPercent: 40,
            color: 'White',
            specs: '25W Super Fast Charging | USB-C | Compact Design | BIS Certified',
            rating: 4.4,
            image: '',
            featured: true,
            stock: 30
        },
        {
            id: 'p004',
            name: 'Spigen Liquid Air Case',
            category: 'covers',
            type: 'Back Case',
            brand: 'Spigen',
            price: 999,
            offerPrice: 699,
            offerPercent: 30,
            color: 'Matte Black',
            specs: 'Military Grade Protection | Slim Fit | Air Cushion | Anti-Slip',
            rating: 4.6,
            image: '',
            featured: true,
            stock: 40
        },
        {
            id: 'p005',
            name: 'Anker USB-C to Lightning Cable',
            category: 'cables',
            type: 'Lightning',
            brand: 'Anker',
            price: 1299,
            offerPrice: 899,
            offerPercent: 31,
            color: 'Black',
            specs: 'MFi Certified | 1.8m | Nylon Braided | Fast Charging Support',
            rating: 4.7,
            image: '',
            featured: true,
            stock: 50
        },
        {
            id: 'p006',
            name: 'JBL Go 3 Portable Speaker',
            category: 'speakers',
            type: 'Bluetooth Speaker',
            brand: 'JBL',
            price: 3999,
            offerPrice: 2999,
            offerPercent: 25,
            color: 'Blue',
            specs: 'Bluetooth 5.1 | 5H Playtime | IP67 Waterproof | JBL Pro Sound',
            rating: 4.5,
            image: '',
            featured: true,
            stock: 12
        },
        {
            id: 'p007',
            name: 'Ambrane 20000mAh Power Bank',
            category: 'powerbanks',
            type: '20000mAh',
            brand: 'Ambrane',
            price: 2499,
            offerPrice: 1499,
            offerPercent: 40,
            color: 'Black',
            specs: '20W Fast Charging | Dual USB | Type-C Input | LED Indicator',
            rating: 4.2,
            image: '',
            featured: true,
            stock: 20
        },
        {
            id: 'p008',
            name: 'boAt Bassheads 100',
            category: 'headsets',
            type: 'Wired',
            brand: 'boAt',
            price: 499,
            offerPrice: 349,
            offerPercent: 30,
            color: 'Black',
            specs: 'Wired Earphones | HD Sound | Tangle-Free Cable | In-line Mic',
            rating: 4.0,
            image: '',
            featured: false,
            stock: 60
        },
        {
            id: 'p009',
            name: 'Mi 10W Wireless Charger',
            category: 'chargers',
            type: 'Wireless Charger',
            brand: 'Xiaomi',
            price: 1299,
            offerPrice: 799,
            offerPercent: 38,
            color: 'Black',
            specs: '10W Qi Charging | LED Indicator | Anti-Slip | Universal Compatible',
            rating: 4.1,
            image: '',
            featured: false,
            stock: 18
        },
        {
            id: 'p010',
            name: 'Ringke Fusion Clear Case',
            category: 'covers',
            type: 'Transparent',
            brand: 'Ringke',
            price: 799,
            offerPrice: 599,
            offerPercent: 25,
            color: 'Clear',
            specs: 'Crystal Clear | Anti-Yellow | Military Drop Test | Slim Design',
            rating: 4.3,
            image: '',
            featured: false,
            stock: 35
        },
        {
            id: 'p011',
            name: 'Baseus 3-in-1 Cable',
            category: 'cables',
            type: 'Multi-Cable',
            brand: 'Baseus',
            price: 699,
            offerPrice: 449,
            offerPercent: 36,
            color: 'Black',
            specs: 'USB-C + Lightning + Micro | Nylon Braided | 1.2m | 3.5A Fast Charge',
            rating: 4.2,
            image: '',
            featured: false,
            stock: 45
        },
        {
            id: 'p012',
            name: 'ScreenGuard Matte Tempered Glass',
            category: 'tempered',
            type: 'Matte',
            brand: 'ScreenGuard',
            price: 399,
            offerPrice: 249,
            offerPercent: 38,
            color: 'Clear',
            specs: 'Anti-Fingerprint | 9H Hardness | Full Glue | Smooth Touch',
            rating: 4.0,
            image: '',
            featured: false,
            stock: 100
        }
    ],

    services: [
        {
            id: 's001',
            name: 'Photo Frames',
            type: 'frame',
            description: 'Custom photo frames with premium print quality. Available in multiple sizes — perfect for gifting memories to your loved ones.',
            icon: '🖼️',
            price: 199,
            deliveryDays: '3-5',
            sizes: ['6x4 inch', '8x6 inch', '10x8 inch', '12x10 inch', 'A4 Size', 'A3 Size'],
            image: ''
        },
        {
            id: 's002',
            name: 'Mug Printing',
            type: 'mug',
            description: 'Get your favorite photos printed on high-quality mugs. Choose from white, magic, and color-changing mugs.',
            icon: '☕',
            price: 249,
            deliveryDays: '2-4',
            mugTypes: ['White Mug', 'Magic Mug', 'Color Changing Mug', 'Inner Color Mug'],
            image: ''
        },
        {
            id: 's003',
            name: 'Custom Pillows',
            type: 'pillow',
            description: 'Personalized photo pillows — a perfect gift for birthdays, anniversaries, and special occasions.',
            icon: '🛋️',
            price: 399,
            deliveryDays: '4-6',
            image: ''
        },
        {
            id: 's004',
            name: 'Phone Backcase',
            type: 'backcase',
            description: 'Custom photo printed phone back cases. Available for all phone models with high-quality UV printing.',
            icon: '📲',
            price: 299,
            deliveryDays: '3-5',
            image: ''
        },
        {
            id: 's005',
            name: 'Custom Bracelets',
            type: 'bracelet',
            description: 'Personalized bracelets with custom names and designs. Great for couples and friends.',
            icon: '📿',
            price: 149,
            deliveryDays: '2-3',
            image: ''
        }
    ],

    offers: [
        {
            id: 'o001',
            title: 'Mega Headset Sale',
            description: 'Up to 50% off on all headsets — wired, neckband, and airpods!',
            discount: '50%',
            validTill: '2025-12-31',
            category: 'headsets',
            badge: '🔥 Hot Deal'
        },
        {
            id: 'o002',
            title: 'Charger Combo Offer',
            description: 'Buy any charger and get a cable FREE!',
            discount: 'Free Cable',
            validTill: '2025-12-31',
            category: 'chargers',
            badge: '🎁 Combo'
        },
        {
            id: 'o003',
            title: 'Custom Gift Bundle',
            description: 'Order any 3 services (frame + mug + pillow) and get 20% off!',
            discount: '20%',
            validTill: '2025-12-31',
            category: 'services',
            badge: '💝 Gift Bundle'
        },
        {
            id: 'o004',
            title: 'New Arrival Discount',
            description: 'Flat ₹100 off on all new arrivals this month!',
            discount: '₹100 OFF',
            validTill: '2025-12-31',
            category: 'all',
            badge: '🆕 New'
        }
    ]
};

// Helper to get from localStorage or use default
function getStorageData(key) {
    const stored = localStorage.getItem(`sasmika_${key}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function setStorageData(key, data) {
    localStorage.setItem(`sasmika_${key}`, JSON.stringify(data));
}

// Initialize cart and favorites from localStorage
function getCart() {
    return getStorageData('cart') || [];
}

function getFavorites() {
    return getStorageData('favorites') || [];
}

function getOrders() {
    return getStorageData('orders') || [];
}

function getCurrentUser() {
    return getStorageData('currentUser') || null;
}

function getUsers() {
    return getStorageData('users') || [];
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    setStorageData('cart', cart);
    updateCartCount();
    showToast('Added to cart!', 'success');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    setStorageData('cart', cart);
    updateCartCount();
}

function toggleFavorite(productId) {
    let favorites = getFavorites();
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Removed from favorites', 'info');
    } else {
        favorites.push(productId);
        showToast('Added to favorites!', 'success');
    }
    setStorageData('favorites', favorites);
    updateFavCount();
    return favorites.includes(productId);
}

function isFavorite(productId) {
    return getFavorites().includes(productId);
}

function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function updateFavCount() {
    const count = getFavorites().length;
    const badges = document.querySelectorAll('#fav-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function getProduct(id) {
    return STORE_DATA.products.find(p => p.id === id);
}

function getProductsByCategory(categoryId) {
    return STORE_DATA.products.filter(p => p.category === categoryId);
}

function getFeaturedProducts() {
    return STORE_DATA.products.filter(p => p.featured);
}

function searchProducts(query) {
    const q = query.toLowerCase();
    return STORE_DATA.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
}
