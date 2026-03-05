// main.js

// Product data
const products = [
    {
        id: 1,
        name: 'AULA F75',
        category: 'Клавиатуры',
        price: 4399,
        oldPrice: 0,
        rating: 4.8,
        reviews: 124,
        icon: '../assets/img/products/AULA_F75.jpg',
        inStock: true,
        brand: 'AULA',
        specs: {
            switch: 'Cherry MX Red',
            layout: 'ANSI',
            backlight: 'RGB',
            connection: ' Bluetooth, USB Type-A, радиоканал'
        },
        description: ''
    },
    {
        id: 2,
        name: 'Logitech G PRO X SUPERLIGHT 2',
        category: 'Мыши',
        price: 13999,
        oldPrice: 0,
        rating: 4.9,
        reviews: 89,
        icon: '../assets/img/products/LOGITECH_SUPERLIGHT_2.jpg',
        inStock: true,
        brand: 'Logitech',
        specs: {
            sensor: '44000 DPI',
            buttons: '5 программируемых',
            weight: '60g',
            connection: 'Радиоканал'
        },
        description: ''
    },
    {
        id: 3,
        name: 'Logitech G435',
        category: 'Наушники',
        price: 5399,
        oldPrice: 0,
        rating: 4.7,
        reviews: 56,
        icon: '../assets/img/products/LOGITECH_G435.jpg',
        inStock: true,
        brand: 'Logitech',
        specs: {
            type: 'Закрытые',
            frequency: '20Hz - 20kHz',
            battery: 'До 18 часов',
            connection: 'Bluetooth, радиоканал'
        },
        description: ''
    },
    {
        id: 4,
        name: 'Коврик для мыши PRO XXL',
        category: 'Аксессуары',
        price: 2990,
        rating: 4.9,
        reviews: 312,
        icon: '../assets/img/products/DARK_PROJECT_MD3A.jpg',
        inStock: true,
        brand: 'Dark Project',
        specs: {
            size: '900x400mm',
            material: 'Ткань',
            thickness: '4mm',
            base: 'Резиновый'
        },
        description: ''
    },
    {
        id: 5,
        name: 'ARDOR GAMING Viper',
        category: 'Клавиатуры',
        price: 8990,
        oldPrice: 10990,
        rating: 4.6,
        reviews: 43,
        icon: '../assets/img/products/ARDOR_GAMING_Viper.jpg',
        inStock: true,
        brand: 'ARDOR',
        specs: {
            switch: 'CSA Gateron Magnetic',
            layout: '75%',
            backlight: 'RGB',
            connection: ' USB Type-A'
        },
        description: ''
    },
    {
        id: 6,
        name: 'Attack Shark R5 Ultra',
        category: 'Мыши',
        price: 5899,
        rating: 4.8,
        reviews: 67,
        icon: '../assets/img/products/SHARK_R5.jpg',
        inStock: true,
        brand: 'Attack Shark',
        specs: {
            sensor: '44000 DPI',
            buttons: '7',
            weight: '42g',
            connection: 'Bluetooth, радиоканал'
        },
        description: ''
    },
    {
        id: 7,
        name: 'ARDOR GAMING Vault',
        category: 'Наушники',
        price: 22990,
        rating: 4.9,
        reviews: 28,
        icon: '../assets/img/products/ARDOR_GAMING_Vault.jpg',
        inStock: false,
        brand: 'ARDOR',
        specs: {
            type: 'Закрытые',
            frequency: '20Hz - 20kHz',
            battery: 'до 28 часов',
            connection: 'Bluetooth, проводной, радиоканал'
        },
        description: ''
    },
    {
        id: 8,
        name: 'Подставка для наушников',
        category: 'Аксессуары',
        price: 1499,
        rating: 4.5,
        reviews: 91,
        icon: '../assets/img/products/ARDOR_GAMING_Hill.jpg',
        inStock: true,
        brand: 'ARDOR',
        specs: {
            mount: 'настольная',
            material: 'Пластик',
            rgb: 'RGB'
        },
        description: ''
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on all pages
    updateCartCount();
    
    // Initialize modals
    initAuthModal();
    
    // Initialize product rendering based on page
    if (document.getElementById('productsGrid')) {
        renderProducts(products);
    }
    
    if (document.getElementById('cartItems')) {
        renderCartPage();
    }
    
    if (document.getElementById('productMainImage')) {
        renderProductPage();
    }
    
    if (document.getElementById('ordersList')) {
        renderProfileOrders();
    }
    
    // Initialize filters
    initFilters();
    
    // Initialize cart functionality
    initCart();
    
    // Initialize profile tabs
    initProfileTabs();
});

// Cart functions
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function addToCart(productId, quantity = 1, options = {}) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            selectedOptions: options
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} добавлен в корзину`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (document.getElementById('cartItems')) {
        renderCartPage();
    }
    
    showToast('Товар удален из корзины');
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (document.getElementById('cartItems')) {
            renderCartPage();
        } else {
            updateCartCount();
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render functions
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = productsToRender.map(product => `
        <a href="pages/product.html?id=${product.id}" class="product-card">
            <div class="product-image">
                <img src="${product.icon}" alt="${product.name}" 
                     onerror="this.onerror=null; this.src='../img/placeholder.jpg'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div class="product-rating">
                    ★ ${product.rating} <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" onclick="event.preventDefault(); addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </a>
    `).join('');
}
function renderCartPage() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <h3 style="margin-bottom: 1rem;">Корзина пуста</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Но это никогда не поздно исправить</p>
                <a href="pages/catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        
        if (cartSubtotal) cartSubtotal.textContent = '0 ₽';
        if (cartTotal) cartTotal.textContent = '0 ₽';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + shipping;
    
    if (cartSubtotal) cartSubtotal.textContent = `${subtotal.toLocaleString()} ₽`;
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'Бесплатно' : `${shipping.toLocaleString()} ₽`;
    if (cartTotal) cartTotal.textContent = `${total.toLocaleString()} ₽`;
}

function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'pages/catalog.html';
        return;
    }
    
    document.getElementById('productMainImage').textContent = url;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = `${product.price.toLocaleString()} ₽`;
    document.getElementById('productOldPrice').textContent = product.oldPrice ? `${product.oldPrice.toLocaleString()} ₽` : '';
    document.getElementById('productRating').innerHTML = `★ ${product.rating} <span>(${product.reviews} отзывов)</span>`;
    document.getElementById('productAvailability').innerHTML = product.inStock ? 
        '<span style="color: var(--success);">В наличии</span>' : 
        '<span style="color: var(--danger);">Нет в наличии</span>';
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productDescription').textContent = product.description;
    
    // Render specs
    const specsList = document.getElementById('productSpecs');
    if (specsList) {
        specsList.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-name">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    // Set up add to cart button
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.onclick = function() {
            const quantity = parseInt(document.getElementById('productQuantity').textContent);
            addToCart(product.id, quantity);
        };
    }
    
    // Quantity buttons
    const quantityEl = document.getElementById('productQuantity');
    document.getElementById('quantityMinus').onclick = function() {
        let val = parseInt(quantityEl.textContent);
        if (val > 1) quantityEl.textContent = val - 1;
    };
    document.getElementById('quantityPlus').onclick = function() {
        let val = parseInt(quantityEl.textContent);
        if (val < 10) quantityEl.textContent = val + 1;
    };
}

function renderProfileOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    // Mock orders data
    const orders = [
        {
            id: 'ORD-001',
            date: '15 марта 2024',
            total: 25980,
            status: 'delivered',
            items: ['Механическая клавиатура PRO X', 'Игровая мышь MASTER 3S']
        },
        {
            id: 'ORD-002',
            date: '20 марта 2024',
            total: 8990,
            status: 'processing',
            items: ['Компактная клавиатура 60%']
        }
    ];
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div>
                <h4 style="margin-bottom: 0.5rem;">Заказ ${order.id}</h4>
                <p style="color: var(--text-secondary);">${order.date}</p>
                <p style="margin-top: 0.5rem;">${order.items.join(', ')}</p>
            </div>
            <div>
                <span class="order-status status-${order.status}">
                    ${order.status === 'delivered' ? 'Доставлен' : 'В обработке'}
                </span>
            </div>
            <div style="font-weight: 700; color: var(--accent);">
                ${order.total.toLocaleString()} ₽
            </div>
        </div>
    `).join('');
}

// Filter functions
const categoryMap = {
    'keyboards': 'Клавиатуры',
    'mice': 'Мыши',
    'headphones': 'Наушники',
    'accessories': 'Аксессуары'
};

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Проверяем URL-параметр category
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    
    if (urlCategory && categoryMap[urlCategory]) {
        const categoryName = categoryMap[urlCategory];
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === categoryName) {
                btn.classList.add('active');
            }
        });
        const filtered = products.filter(p => p.category === categoryName);
        renderProducts(filtered);
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// Auth modal
function initAuthModal() {
    const modal = document.getElementById('authModal');
    const authBtn = document.getElementById('authBtn');
    const closeModal = document.getElementById('closeModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (!modal || !authBtn) return;
    
    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            authForms.forEach(f => f.classList.remove('active'));
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });
    
    // Form submissions
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modal.classList.remove('active');
            showToast('Добро пожаловать!');
        });
    }
    
    const registerForm = document.getElementById('register');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modal.classList.remove('active');
            showToast('Аккаунт создан');
        });
    }
}

// Profile tabs
function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const contents = document.querySelectorAll('.profile-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(content => {
                if (content.id === `${tabName}Tab`) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
}

// Cart sidebar
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (!cartIcon || !cartSidebar) return;
    
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        renderCartSidebar();
    });
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
}

function renderCartSidebar() {
    const cartItems = document.getElementById('cartSidebarItems');
    const cartTotal = document.getElementById('cartSidebarTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Корзина пуста</p>';
        if (cartTotal) cartTotal.textContent = '0 ₽';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (cartTotal) cartTotal.textContent = `${getCartTotal().toLocaleString()} ₽`;
}

// Toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;