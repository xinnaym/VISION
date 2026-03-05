const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');

let db = null;

// Сохранение БД в файл
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// Инициализация базы данных
async function initDatabase() {
    const SQL = await initSqlJs();
    
    // Загружаем или создаём новую БД
    try {
        if (fs.existsSync(DB_PATH)) {
            const fileBuffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(fileBuffer);
            console.log('💾 База данных загружена из файла');
        } else {
            db = new SQL.Database();
            console.log('📦 Создана новая база данных');
        }

        // Таблица пользователей
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Таблица товаров
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                brand TEXT NOT NULL,
                category TEXT NOT NULL,
                price INTEGER NOT NULL,
                old_price INTEGER DEFAULT 0,
                rating REAL DEFAULT 4.5,
                reviews INTEGER DEFAULT 0,
                in_stock BOOLEAN DEFAULT 1,
                description TEXT,
                specs TEXT,
                icon TEXT,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Таблица заказов
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                total INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                items TEXT NOT NULL,
                shipping_address TEXT,
                phone TEXT,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Проверка количества товаров
        const result = db.exec('SELECT COUNT(*) as count FROM products');
        const productCount = result.length > 0 ? result[0].values[0][0] : 0;
        
        if (productCount === 0) {
            console.log('📦 Перенос товаров из main.js...');
            migrateProductsFromMainJS();
        }

        saveDatabase();
        console.log('✅ База данных инициализирована');
        
        // Создаём админа после инициализации БД
        createDefaultAdmin();
    } catch (error) {
        console.error('❌ Ошибка инициализации БД:', error);
        throw error;
    }
}

// Миграция товаров из main.js
function migrateProductsFromMainJS() {
    const products = [
        {
            name: 'AULA F75',
            brand: 'AULA',
            category: 'Клавиатуры',
            price: 4399,
            old_price: 0,
            rating: 4.8,
            reviews: 124,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Переключатели': 'Cherry MX Red', 'Размер': 'ANSI', 'Подсветка': 'RGB', 'Подключение': 'Bluetooth, USB Type-A, радиоканал' }),
            icon: '../assets/img/products/aula-f75/1.jpg',
            images: JSON.stringify(['../assets/img/products/aula-f75/1.jpg', '../assets/img/products/aula-f75/2.jpg', '../assets/img/products/aula-f75/3.jpg', '../assets/img/products/aula-f75/4.jpg'])
        },
        {
            name: 'Logitech G PRO X SUPERLIGHT 2',
            brand: 'Logitech',
            category: 'Мыши',
            price: 13999,
            old_price: 0,
            rating: 4.9,
            reviews: 89,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Сенсор': '44000 DPI', 'Кнопки': '5 программируемых', 'Вес': '60g', 'Подключение': 'Радиоканал' }),
            icon: '../assets/img/products/logitech-superlight-2/1.jpg',
            images: JSON.stringify(['../assets/img/products/logitech-superlight-2/1.jpg', '../assets/img/products/logitech-superlight-2/2.jpg', '../assets/img/products/logitech-superlight-2/3.jpg', '../assets/img/products/logitech-superlight-2/4.jpg'])
        },
        {
            name: 'Logitech G435',
            brand: 'Logitech',
            category: 'Наушники',
            price: 5399,
            old_price: 0,
            rating: 4.7,
            reviews: 56,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Тип': 'Закрытые', 'Диапазон частот': '20Hz - 20kHz', 'Время работы': 'До 18 часов', 'Подключение': 'Bluetooth, радиоканал' }),
            icon: '../assets/img/products/logitech-g435/1.jpg',
            images: JSON.stringify(['../assets/img/products/logitech-g435/1.jpg', '../assets/img/products/logitech-g435/2.jpg', '../assets/img/products/logitech-g435/3.jpg', '../assets/img/products/logitech-g435/4.jpg'])
        },
        {
            name: 'Коврик для мыши PRO XXL',
            brand: 'Dark Project',
            category: 'Аксессуары',
            price: 2990,
            old_price: 0,
            rating: 4.9,
            reviews: 312,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Размер': '900x400mm', 'Материал': 'Ткань', 'Толщина': '4mm', 'Основание': 'Резина' }),
            icon: '../assets/img/products/dark-project-md3a/1.jpg',
            images: JSON.stringify(['../assets/img/products/dark-project-md3a/1.jpg', '../assets/img/products/dark-project-md3a/2.jpg', '../assets/img/products/dark-project-md3a/3.jpg', '../assets/img/products/dark-project-md3a/4.jpg'])
        },
        {
            name: 'ARDOR GAMING Viper',
            brand: 'ARDOR',
            category: 'Клавиатуры',
            price: 8990,
            old_price: 10990,
            rating: 4.6,
            reviews: 43,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Переключатели': 'CSA Gateron Magnetic', 'Размер': '75%', 'Подсветка': 'RGB', 'Подключение': 'USB Type-A' }),
            icon: '../assets/img/products/ardor-viper/1.jpg',
            images: JSON.stringify(['../assets/img/products/ardor-viper/1.jpg', '../assets/img/products/ardor-viper/2.jpg', '../assets/img/products/ardor-viper/3.jpg', '../assets/img/products/ardor-viper/4.jpg'])
        },
        {
            name: 'Attack Shark R5 Ultra',
            brand: 'Attack Shark',
            category: 'Мыши',
            price: 5899,
            old_price: 0,
            rating: 4.8,
            reviews: 67,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Сенсор': '44000 DPI', 'Кнопки': '7', 'Вес': '42g', 'Подключение': 'Bluetooth, радиоканал' }),
            icon: '../assets/img/products/shark-r5/1.jpg',
            images: JSON.stringify(['../assets/img/products/shark-r5/1.jpg', '../assets/img/products/shark-r5/2.jpg', '../assets/img/products/shark-r5/3.jpg', '../assets/img/products/shark-r5/4.jpg'])
        },
        {
            name: 'ARDOR GAMING Vault',
            brand: 'ARDOR',
            category: 'Наушники',
            price: 22990,
            old_price: 0,
            rating: 4.9,
            reviews: 28,
            in_stock: 0,
            description: '',
            specs: JSON.stringify({ 'Тип': 'Закрытые', 'Диапазон частот': '20Hz - 20kHz', 'Время работы': 'до 28 часов', 'Подключение': 'Bluetooth, проводной, радиоканал' }),
            icon: '../assets/img/products/ardor-vault/1.jpg',
            images: JSON.stringify(['../assets/img/products/ardor-vault/1.jpg', '../assets/img/products/ardor-vault/2.jpg', '../assets/img/products/ardor-vault/3.jpg', '../assets/img/products/ardor-vault/4.jpg'])
        },
        {
            name: 'Подставка для наушников',
            brand: 'ARDOR',
            category: 'Аксессуары',
            price: 1499,
            old_price: 0,
            rating: 4.5,
            reviews: 91,
            in_stock: 1,
            description: '',
            specs: JSON.stringify({ 'Крепление': 'настольная', 'Материал': 'Пластик', 'Подсветка': 'RGB' }),
            icon: '../assets/img/products/ardor-hill/1.jpg',
            images: JSON.stringify(['../assets/img/products/ardor-hill/1.jpg', '../assets/img/products/ardor-hill/2.jpg', '../assets/img/products/ardor-hill/3.jpg', '../assets/img/products/ardor-hill/4.jpg'])
        }
    ];

    const stmt = db.prepare(`
        INSERT INTO products (name, brand, category, price, old_price, rating, reviews, in_stock, description, specs, icon, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of products) {
        stmt.run([
            product.name,
            product.brand,
            product.category,
            product.price,
            product.old_price,
            product.rating,
            product.reviews,
            product.in_stock,
            product.description,
            product.specs,
            product.icon,
            product.images
        ]);
    }
    stmt.free();

    console.log(`✅ Перенесено ${products.length} товаров`);
}

// Создание администратора по умолчанию
function createDefaultAdmin() {
    if (!db) return; // БД ещё не инициализирована
    
    const result = db.exec(`SELECT * FROM users WHERE email = '${process.env.ADMIN_EMAIL}'`);
    const adminExists = result.length > 0 && result[0].values.length > 0;
    
    if (!adminExists) {
        const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
        db.run(`
            INSERT INTO users (email, password, name, role)
            VALUES ('${process.env.ADMIN_EMAIL}', '${hashedPassword}', 'Администратор', 'admin')
        `);
        saveDatabase();
        
        console.log('✅ Создан администратор по умолчанию');
        console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`   Пароль: ${process.env.ADMIN_PASSWORD}`);
    }
}

// Обёртки для запросов
function getDb() {
    return {
        prepare(sql) {
            return {
                run(...params) {
                    const stmt = db.prepare(sql);
                    const result = stmt.run(params);
                    const lastInsertRowid = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
                    stmt.free();
                    saveDatabase();
                    return { lastInsertRowid, changes: result.changes };
                },
                get(...params) {
                    const stmt = db.prepare(sql);
                    stmt.bind(params);
                    if (stmt.step()) {
                        const row = stmt.getAsObject();
                        stmt.free();
                        return row;
                    }
                    stmt.free();
                    return undefined;
                },
                all(...params) {
                    const stmt = db.prepare(sql);
                    stmt.bind(params);
                    const results = [];
                    while (stmt.step()) {
                        results.push(stmt.getAsObject());
                    }
                    stmt.free();
                    return results;
                }
            };
        },
        exec(sql) {
            db.run(sql);
            saveDatabase();
        },
        run(sql) {
            const result = db.run(sql);
            saveDatabase();
            return result;
        }
    };
}

module.exports = { initDatabase, createDefaultAdmin, getDb };
