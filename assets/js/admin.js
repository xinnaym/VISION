// admin.js

const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('adminToken');
let currentEditId = null;
let deleteId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Проверка валидности токена
    validateToken();
    
    renderProductsTable();
    initModalHandlers();
    initFilters();
});

// Проверка валидности токена
async function validateToken() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (!result.success) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
    }
}

// Инициализация обработчиков модальных окон
function initModalHandlers() {
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const closeProductModal = document.getElementById('closeModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const addSpecBtn = document.getElementById('addSpecBtn');

    // Открытие модального окна добавления
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            modalTitle.textContent = 'Добавить товар';
            productForm.reset();
            document.getElementById('productId').value = '';
            currentEditId = null;
            document.getElementById('specsContainer').innerHTML = '';
            productModal.classList.add('active');
        });
    }

    // Закрытие модального окна товара
    if (closeProductModal) {
        closeProductModal.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Закрытие модального окна удаления
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
    }
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
    }

    // Подтверждение удаления
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (deleteId !== null) {
                deleteProductRequest(deleteId);
            }
        });
    }

    // Отправка формы
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProductRequest();
            closeModal();
        });
    }

    // Добавление характеристики
    if (addSpecBtn) {
        addSpecBtn.addEventListener('click', function() {
            addSpecField();
        });
    }

    // Закрытие по клику вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModalFunc();
        }
    });
}

// Сохранение товара (добавление/редактирование)
async function saveProductRequest() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const brand = document.getElementById('productBrand').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const oldPrice = parseInt(document.getElementById('productOldPrice').value) || 0;
    const rating = parseFloat(document.getElementById('productRating').value) || 4.5;
    const reviews = 0;
    const inStock = document.getElementById('productInStock').value === 'true';
    const description = document.getElementById('productDescription').value;

    // Сбор характеристик
    const specs = {};
    document.querySelectorAll('.spec-row').forEach(row => {
        const key = row.querySelector('.spec-key').value;
        const value = row.querySelector('.spec-value-input').value;
        if (key && value) {
            specs[key] = value;
        }
    });

    const productData = {
        name,
        brand,
        category,
        price,
        old_price: oldPrice,
        rating,
        reviews,
        in_stock: inStock,
        description,
        specs: JSON.stringify(specs)
    };

    try {
        let response;
        
        if (id) {
            // Редактирование
            response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Добавление нового (без фото пока)
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        }

        const result = await response.json();
        
        if (result.success) {
            renderProductsTable();
            showToast(result.message || 'Товар сохранён');
        } else {
            alert(result.message || 'Ошибка сохранения');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка соединения с сервером');
    }
}

// Удаление товара
async function deleteProductRequest(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        
        if (result.success) {
            renderProductsTable();
            showToast('Товар удалён');
        } else {
            alert(result.message || 'Ошибка удаления');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка соединения с сервером');
    }
}

// Рендер таблицы товаров
async function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';

    try {
        let url = `${API_URL}/products`;
        const params = [];
        
        if (searchTerm) {
            params.push(`search=${encodeURIComponent(searchTerm)}`);
        }
        if (categoryFilter) {
            params.push(`category=${encodeURIComponent(categoryFilter)}`);
        }
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Ошибка загрузки</td></tr>`;
            return;
        }

        const filtered = result.data;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Товары не найдены
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(product => `
            <tr class="admin-table-row">
                <td>
                    <div class="admin-product-thumb">
                        <img src="${product.icon}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.src='../assets/img/placeholder.jpg'">
                    </div>
                </td>
                <td>
                    <div class="admin-product-name">${product.name}</div>
                    <div class="admin-product-id">ID: ${product.id}</div>
                </td>
                <td>${product.category}</td>
                <td>${product.brand}</td>
                <td>
                    <div class="admin-price">
                        <span>${product.price.toLocaleString()} ₽</span>
                        ${product.old_price ? `<span class="admin-old-price">${product.old_price.toLocaleString()} ₽</span>` : ''}
                    </div>
                </td>
                <td>
                    <span class="admin-status ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
                        ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                </td>
                <td>
                    <div class="admin-actions">
                        <button class="admin-icon-btn" title="Редактировать" onclick="editProduct(${product.id})">✏️</button>
                        <button class="admin-icon-btn delete" title="Удалить" onclick="deleteProduct(${product.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Ошибка загрузки</td></tr>`;
    }
}

// Редактирование товара
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Ошибка загрузки товара');
            return;
        }
        
        const product = result.data;
        currentEditId = id;
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Редактировать товар';

        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.old_price || '';
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productInStock').value = product.in_stock.toString();
        document.getElementById('productDescription').value = product.description || '';

        // Характеристики
        const specsContainer = document.getElementById('specsContainer');
        specsContainer.innerHTML = '';
        if (product.specs) {
            Object.entries(product.specs).forEach(([key, value]) => {
                addSpecField(key, value);
            });
        }

        document.getElementById('productModal').classList.add('active');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка загрузки данных товара');
    }
}

// Удаление товара (показ модального окна)
function deleteProduct(id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.add('active');
}

// Добавление поля характеристики
function addSpecField(key = '', value = '') {
    const container = document.getElementById('specsContainer');
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
    row.innerHTML = `
        <input type="text" class="admin-input spec-key" placeholder="Название (напр: Переключатели)" value="${key}" style="flex: 1;">
        <input type="text" class="admin-input spec-value-input" placeholder="Значение (напр: Cherry MX Red)" value="${value}" style="flex: 1;">
        <button type="button" class="admin-icon-btn delete" onclick="this.parentElement.remove()" style="width: 36px;">✕</button>
    `;
    container.appendChild(row);
}

// Инициализация фильтров
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(renderProductsTable, 300);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderProductsTable);
    }
}

// Закрытие модальных окон
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function closeDeleteModalFunc() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteId = null;
}

// Toast уведомления
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--bg-card);
        border: 1px solid var(--accent);
        color: var(--text);
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 500;
        z-index: 2000;
        animation: toastAppear 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Глобальные функции для доступа из HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
