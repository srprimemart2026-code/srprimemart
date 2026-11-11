// Initial Products Array
const products = [
    {
        id: 1,
        title: "Men's Premium Bar Bracelet",
        price: 450,
        category: "Jewelry & Accessories",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1611591475155-4282fc289e78?w=500&q=80",
        description: "Elegant, durable stainless steel bar bracelet designed for modern men. Sweat-resistant and perfect for daily wear."
    },
    {
        id: 2,
        title: "Classic Black Leather Wallet",
        price: 750,
        category: "Men's Fashion",
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
        description: "Genuine leather bi-fold wallet featuring multi-card slots and RFID protection."
    },
    {
        id: 3,
        title: "Minimalist Quartz Wristwatch",
        price: 1250,
        category: "Men's Fashion",
        badge: "New",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80",
        description: "Sleek analog watch with scratch-resistant glass and premium strap alignment."
    },
    {
        id: 4,
        title: "TWS Wireless Bluetooth Earbuds",
        price: 1350,
        category: "Gadgets",
        badge: "Sale",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
        description: "Crystal clear sound audio quality with deep bass, low latency, and 24-hour total battery life."
    }
];

// Cart State
let cart = [];
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const cartBadge = document.getElementById('cart-badge');
const cartDrawer = document.getElementById('cart-drawer');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

// Render Product Catalog
function renderProducts() {
    let filtered = products.filter(p => {
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (currentSort === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
        productGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    productGrid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col justify-between group">
            <div class="relative overflow-hidden aspect-square bg-gray-50">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                ${p.badge ? `<span class="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">${p.badge}</span>` : ''}
                <button onclick="openQuickView(${p.id})" class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-indigo-600 p-2.5 rounded-full shadow-md hover:scale-110 transition">
                    <i class="fas fa-eye text-xs"></i>
                </button>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${p.category}</span>
                    <h3 class="text-xs font-bold text-gray-800 mt-1 line-clamp-2 hover:text-indigo-600 transition cursor-pointer" onclick="openQuickView(${p.id})">
                        ${p.title}
                    </h3>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-base font-black text-gray-900">৳${p.price.toLocaleString()}</span>
                    <button onclick="addToCart(${p.id})" class="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Handlers
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchInputMobile = document.getElementById('search-input-mobile');
    
    [searchInput, searchInputMobile].forEach(input => {
        if (!input) return;
        input.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    });

    document.getElementById('mobile-search-toggle')?.addEventListener('click', () => {
        document.getElementById('mobile-search-bar').classList.toggle('hidden');
    });

    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.cat-pill').forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
                b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
            });
            const target = e.currentTarget;
            target.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
            target.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
            activeCategory = target.dataset.category;
            renderProducts();
        });
    });

    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    document.getElementById('open-cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-backdrop').addEventListener('click', closeCart);

    document.getElementById('close-qv-btn').addEventListener('click', closeQuickView);
    document.getElementById('qv-backdrop').addEventListener('click', closeQuickView);
    document.getElementById('close-checkout-btn').addEventListener('click', closeCheckout);
    document.getElementById('checkout-backdrop').addEventListener('click', closeCheckout);

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if(cart.length === 0) {
            showToast("Apnar cart empty!", "error");
            return;
        }
        closeCart();
        openCheckout();
    });

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        closeCheckout();
        cart = [];
        updateCart();
        showToast("Dhonnobad! Order safollo-bhabe grohon kora hoyeche.", "success");
    });
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    showToast(`"${product.title.substring(0, 18)}..." cart-e add hoyeche!`);
}

function updateCartItemQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCart();
}

function updateCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <i class="fas fa-shopping-basket text-4xl mb-2"></i>
                <p class="text-xs font-medium">Cart-e kono product nei</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <img src="${item.image}" class="w-12 h-12 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="text-xs font-bold text-gray-800 line-clamp-1">${item.title}</h4>
                    <span class="text-xs font-extrabold text-indigo-600">৳${(item.price * item.qty).toLocaleString()}</span>
                </div>
                <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
                    <button onclick="updateCartItemQty(${item.id}, -1)" class="text-gray-400 hover:text-gray-700 text-xs px-1">-</button>
                    <span class="text-xs font-bold text-gray-700">${item.qty}</span>
                    <button onclick="updateCartItemQty(${item.id}, 1)" class="text-gray-400 hover:text-gray-700 text-xs px-1">+</button>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = cart.length > 0 ? 60 : 0;
    cartSubtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
    cartTotalEl.textContent = `৳${(subtotal + delivery).toLocaleString()}`;
}

// Drawer & Modal State Helpers
function openCart() {
    cartDrawer.classList.remove('pointer-events-none', 'opacity-0');
    cartPanel.classList.remove('translate-x-full');
}

function closeCart() {
    cartPanel.classList.add('translate-x-full');
    cartDrawer.classList.add('opacity-0', 'pointer-events-none');
}

function openQuickView(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    document.getElementById('qv-image').src = p.image;
    document.getElementById('qv-category').textContent = p.category;
    document.getElementById('qv-title').textContent = p.title;
    document.getElementById('qv-price').textContent = `৳${p.price.toLocaleString()}`;
    document.getElementById('qv-desc').textContent = p.description;

    const addBtn = document.getElementById('qv-add-btn');
    addBtn.onclick = () => {
        addToCart(p.id);
        closeQuickView();
    };

    document.getElementById('quickview-modal').classList.remove('hidden');
}

function closeQuickView() {
    document.getElementById('quickview-modal').classList.add('hidden');
}

function openCheckout() {
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function showToast(msg, type = "info") {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = msg;
    toastIcon.className = type === "error" ? "fas fa-exclamation-circle text-red-400 text-lg" : "fas fa-check-circle text-green-400 text-lg";

    toast.classList.remove('translate-x-full', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}
