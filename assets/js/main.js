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
        icon: '../assets/img/products/aula-f75/1.jpg',
        images: [
            '../assets/img/products/aula-f75/1.jpg',
            '../assets/img/products/aula-f75/2.jpg',
            '../assets/img/products/aula-f75/3.jpg',
            '../assets/img/products/aula-f75/4.jpg'
        ],
        inStock: true,
        brand: 'AULA',
        specs: {
            'Переключатели': 'Cherry MX Red',
            'Размер': '75%',
            'Подсветка': 'RGB',
            'Подключение': 'Bluetooth, USB Type-A, радиоканал'
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
        icon: '../assets/img/products/logitech-superlight-2/1.jpg',
        images: [
            '../assets/img/products/logitech-superlight-2/1.jpg',
            '../assets/img/products/logitech-superlight-2/2.jpg',
            '../assets/img/products/logitech-superlight-2/3.jpg',
            '../assets/img/products/logitech-superlight-2/4.jpg'
        ],
        inStock: true,
        brand: 'Logitech',
        specs: {
            'Сенсор': '44000 DPI',
            'Кнопки': '5 программируемых',
            'Вес': '60g',
            'Подключение': 'Радиоканал'
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
        icon: '../assets/img/products/logitech-g435/1.jpg',
        images: [
            '../assets/img/products/logitech-g435/1.jpg',
            '../assets/img/products/logitech-g435/2.jpg',
            '../assets/img/products/logitech-g435/3.jpg',
            '../assets/img/products/logitech-g435/4.jpg'
        ],
        inStock: true,
        brand: 'Logitech',
        specs: {
            'Тип': 'Закрытые',
            'Диапазон частот': '20Hz - 20kHz',
            'Время работы': 'До 18 часов',
            'Подключение': 'Bluetooth, радиоканал'
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
        icon: '../assets/img/products/dark-project-md3a/1.jpg',
        images: [
            '../assets/img/products/dark-project-md3a/1.jpg',
            '../assets/img/products/dark-project-md3a/2.jpg',
            '../assets/img/products/dark-project-md3a/3.jpg',
            '../assets/img/products/dark-project-md3a/4.jpg'
        ],
        inStock: true,
        brand: 'Dark Project',
        specs: {
            'Размер': '900x400mm',
            'Материал': 'Ткань',
            'Толщина': '4mm',
            'Основание': 'Резина'
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
        icon: '../assets/img/products/ardor-viper/1.jpg',
        images: [
            '../assets/img/products/ardor-viper/1.jpg',
            '../assets/img/products/ardor-viper/2.jpg',
            '../assets/img/products/ardor-viper/3.jpg',
            '../assets/img/products/ardor-viper/4.jpg'
        ],
        inStock: true,
        brand: 'ARDOR',
        specs: {
            'Переключатели': 'CSA Gateron Magnetic',
            'Размер': '75%',
            'Подсветка': 'RGB',
            'Подключение': 'USB Type-A'
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
        icon: '../assets/img/products/shark-r5/1.jpg',
        images: [
            '../assets/img/products/shark-r5/1.jpg',
            '../assets/img/products/shark-r5/2.jpg',
            '../assets/img/products/shark-r5/3.jpg',
            '../assets/img/products/shark-r5/4.jpg'
        ],
        inStock: true,
        brand: 'Attack Shark',
        specs: {
            'Сенсор': '44000 DPI',
            'Кнопки': '7',
            'Вес': '42g',
            'Подключение': 'Bluetooth, радиоканал'
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
        icon: '../assets/img/products/ardor-vault/1.jpg',
        images: [
            '../assets/img/products/ardor-vault/1.jpg',
            '../assets/img/products/ardor-vault/2.jpg',
            '../assets/img/products/ardor-vault/3.jpg',
            '../assets/img/products/ardor-vault/4.jpg'
        ],
        inStock: false,
        brand: 'ARDOR',
        specs: {
            'Тип': 'Закрытые',
            'Диапазон частот': '20Hz - 20kHz',
            'Время работы': 'до 28 часов',
            'Подключение': 'Bluetooth, проводной, радиоканал'
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
        icon: '../assets/img/products/ardor-hill/1.jpg',
        images: [
            '../assets/img/products/ardor-hill/1.jpg',
            '../assets/img/products/ardor-hill/2.jpg',
            '../assets/img/products/ardor-hill/3.jpg',
            '../assets/img/products/ardor-hill/4.jpg'
        ],
        inStock: true,
        brand: 'ARDOR',
        specs: {
            'Крепление': 'настольная',
            'Материал': 'Пластик',
            'Подсветка': 'RGB'
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

    // Определяем базовый путь в зависимости от текущей страницы
    const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';

    grid.innerHTML = productsToRender.map(product => `
        <a href="${basePath}product.html?id=${product.id}" class="product-card">
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
        const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <h3 style="margin-bottom: 1rem;">Корзина пуста</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Но это никогда не поздно исправить</p>
                <a href="${basePath}catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        
        if (cartSubtotal) cartSubtotal.textContent = '0 ₽';
        if (cartTotal) cartTotal.textContent = '0 ₽';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.icon}" alt="${item.name}" onerror="this.onerror=null; this.src='../assets/img/placeholder.jpg'">
            </div>
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

    // Определяем базовый путь
    const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';

    if (!product) {
        window.location.href = basePath + 'catalog.html';
        return;
    }

    // Обновляем breadcrumb
    document.getElementById('productTitleBreadcrumb').textContent = product.name;

    // Главное изображение
    const mainImage = document.getElementById('productMainImage');
    if (mainImage) {
        mainImage.innerHTML = `<img src="${product.images[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
    }

    // Миниатюры
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    if (thumbnailsContainer && product.images && product.images.length > 0) {
        thumbnailsContainer.innerHTML = product.images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                <img src="${img}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>
        `).join('');

        // Добавляем обработчики кликов для миниатюр
        thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Убираем активный класс у всех
                thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                // Добавляем активный класс текущей
                this.classList.add('active');
                // Меняем главное изображение
                const newImage = this.dataset.image;
                document.getElementById('productMainImage').innerHTML = 
                    `<img src="${newImage}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
            });
        });
    }

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

    // Рендер похожих товаров (той же категории)
    const similarProductsGrid = document.getElementById('similarProducts');
    if (similarProductsGrid) {
        const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        if (similarProducts.length > 0) {
            similarProductsGrid.innerHTML = similarProducts.map(p => `
                <a href="${basePath}product.html?id=${p.id}" class="product-card">
                    <div class="product-image">
                        <img src="${p.icon}" alt="${p.name}"
                             onerror="this.onerror=null; this.src='../img/placeholder.jpg'">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${p.category.toUpperCase()}</div>
                        <div class="product-title">${p.name}</div>
                        <div class="product-price">${p.price.toLocaleString()} ₽</div>
                        <div class="product-rating">
                            ★ ${p.rating} <span>(${p.reviews})</span>
                        </div>
                        <button class="add-to-cart" onclick="event.preventDefault(); addToCart(${p.id})">
                            В корзину
                        </button>
                    </div>
                </a>
            `).join('');
        } else {
            similarProductsGrid.parentElement.style.display = 'none';
        }
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
const API_URL = 'http://localhost:3000/api';

function initAuthModal() {
    const modal = document.getElementById('authModal');
    const authBtn = document.getElementById('authBtn');
    const closeModal = document.getElementById('closeModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    if (!modal || !authBtn) return;

    // Проверка авторизации при загрузке
    checkAuth();

    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            // Если уже авторизован - идём в профиль
            const path = window.location.pathname;
            const isInPagesFolder = path.includes('pages/');
            const profilePath = isInPagesFolder ? 'profile.html' : 'pages/profile.html';
            window.location.href = profilePath;
        } else {
            modal.classList.add('active');
        }
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

    // Вход
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.data));
                    modal.classList.remove('active');
                    
                    // Если админ - редирект в админку
                    if (result.data.role === 'admin') {
                        localStorage.setItem('adminToken', result.token);
                        window.location.href = 'admin-panel/index.html';
                    } else {
                        showToast(`Добро пожаловать, ${result.data.name}!`);
                        updateAuthButton();
                    }
                } else {
                    showToast(result.message || 'Ошибка входа');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showToast('Ошибка соединения с сервером');
            }
        });
    }

    // Регистрация
    const registerForm = document.getElementById('register');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

            if (password !== confirmPassword) {
                showToast('Пароли не совпадают');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.data));
                    modal.classList.remove('active');
                    showToast('Аккаунт создан!');
                    updateAuthButton();
                } else {
                    showToast(result.message || 'Ошибка регистрации');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showToast('Ошибка соединения с сервером');
            }
        });
    }
}

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('token');
    const authBtn = document.getElementById('authBtn');
    
    if (token && authBtn) {
        updateAuthButton();
    }
}

// Обновление кнопки авторизации
function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (authBtn && user.name) {
        // Определяем путь в зависимости от текущей страницы
        const path = window.location.pathname;
        const isInPagesFolder = path.includes('pages/');
        const profilePath = isInPagesFolder ? 'profile.html' : 'pages/profile.html';
        
        authBtn.textContent = 'Профиль';
        authBtn.href = profilePath;
        authBtn.style.color = 'var(--accent)';
        authBtn.style.fontWeight = '600';
    }
}

// Выход
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
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
            <div class="cart-item-image">
                <img src="${item.icon}" alt="${item.name}" onerror="this.onerror=null; this.src='../assets/img/placeholder.jpg'">
            </div>
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
window.updateAuthButton = updateAuthButton;
window.logout = logout;