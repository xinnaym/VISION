// main.js

// Product data
const products = [
    {
        id: 1,
        name: 'Механическая клавиатура PRO X',
        category: 'Клавиатуры',
        price: 12990,
        oldPrice: 15990,
        rating: 4.8,
        reviews: 124,
        icon: '⌨️',
        inStock: true,
        brand: 'Logitech',
        specs: {
            switch: 'Cherry MX Red',
            layout: 'ANSI',
            backlight: 'RGB',
            connection: 'USB-C'
        },
        description: 'Профессиональная механическая клавиатура с переключателями Cherry MX Red. Идеально подходит для игр и печати благодаря линейному ходу и тихой работе.'
    },
    {
        id: 2,
        name: 'Игровая мышь MASTER 3S',
        category: 'Мыши',
        price: 6990,
        oldPrice: 8990,
        rating: 4.9,
        reviews: 89,
        icon: '🖱️',
        inStock: true,
        brand: 'Razer',
        specs: {
            sensor: '26000 DPI',
            buttons: '8 программируемых',
            weight: '75g',
            connection: 'Проводная'
        },
        description: 'Легендарная игровая мышь с сенсором 26000 DPI и оптическими переключателями.'
    },
    {
        id: 3,
        name: 'Беспроводные наушники STUDIO',
        category: 'Наушники',
        price: 15990,
        oldPrice: 19990,
        rating: 4.7,
        reviews: 56,
        icon: '🎧',
        inStock: true,
        brand: 'SteelSeries',
        specs: {
            type: 'Закрытые',
            frequency: '20Hz - 40kHz',
            battery: '30 часов',
            connection: 'Bluetooth 5.2'
        },
        description: 'Студийные беспроводные наушники с активным шумоподавлением и высоким разрешением.'
    },
    {
        id: 4,
        name: 'Коврик для мыши PRO XXL',
        category: 'Аксессуары',
        price: 2990,
        rating: 4.9,
        reviews: 312,
        icon: '⚡',
        inStock: true,
        brand: 'HyperX',
        specs: {
            size: '900x400mm',
            material: 'Ткань',
            thickness: '4mm',
            base: 'Резиновый'
        },
        description: 'Огромный игровой коврик с оптимизированной поверхностью для точного трекинга.'
    },
    {
        id: 5,
        name: 'Компактная клавиатура 60%',
        category: 'Клавиатуры',
        price: 8990,
        oldPrice: 10990,
        rating: 4.6,
        reviews: 43,
        icon: '⌨️',
        inStock: true,
        brand: 'Ducky',
        specs: {
            switch: 'Cherry MX Brown',
            layout: '60%',
            backlight: 'RGB',
            connection: 'USB-C'
        },
        description: 'Компактная 60% клавиатура для минималистов и путешественников.'
    },
    {
        id: 6,
        name: 'Мышь для киберспорта PRO',
        category: 'Мыши',
        price: 8490,
        rating: 4.8,
        reviews: 67,
        icon: '🖱️',
        inStock: true,
        brand: 'Zowie',
        specs: {
            sensor: '3360',
            buttons: '5',
            weight: '70g',
            connection: 'Проводная'
        },
        description: 'Мышь, созданная для профессионального киберспорта. Минимальный вес и максимальная точность.'
    },
    {
        id: 7,
        name: 'Студийные наушники PRO',
        category: 'Наушники',
        price: 22990,
        rating: 4.9,
        reviews: 28,
        icon: '🎧',
        inStock: false,
        brand: 'Beyerdynamic',
        specs: {
            type: 'Открытые',
            frequency: '5Hz - 50kHz',
            impedance: '250 Ohm',
            connection: 'Проводной'
        },
        description: 'Профессиональные студийные наушники для точного мониторинга.'
    },
    {
        id: 8,
        name: 'Держатель для наушников',
        category: 'Аксессуары',
        price: 1990,
        rating: 4.5,
        reviews: 91,
        icon: '⚡',
        inStock: true,
        brand: 'Generic',
        specs: {
            mount: 'Струбцина',
            material: 'Алюминий',
            rgb: '16.8M цветов'
        },
        description: 'Стильный держатель для наушников с RGB подсветкой.'
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
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image">${product.icon}</div>
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
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Но это никогда не поздно исправить :)</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
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
        window.location.href = 'catalog.html';
        return;
    }
    
    document.getElementById('productMainImage').textContent = product.icon;
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
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products logic here
            const filter = this.textContent;
            if (filter === 'Все') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === filter);
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