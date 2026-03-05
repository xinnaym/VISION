const express = require('express');
const Joi = require('joi');
const { getDb } = require('../config/database');
const auth = require('../middleware/auth');
const { upload, processImages } = require('../middleware/upload');

const router = express.Router();

// Валидация товара
const productSchema = Joi.object({
    name: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().integer().min(0).required(),
    old_price: Joi.number().integer().min(0).default(0),
    rating: Joi.number().min(0).max(5).default(4.5),
    reviews: Joi.number().integer().min(0).default(0),
    in_stock: Joi.boolean().default(true),
    description: Joi.string().allow('').default(''),
    specs: Joi.string().default('{}') // JSON строка
});

// Получить все товары (с фильтрами)
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const { category, brand, min_price, max_price, search, in_stock, sort } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (brand) {
            query += ' AND brand = ?';
            params.push(brand);
        }

        if (min_price) {
            query += ' AND price >= ?';
            params.push(parseInt(min_price));
        }

        if (max_price) {
            query += ' AND price <= ?';
            params.push(parseInt(max_price));
        }

        if (search) {
            query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (in_stock !== undefined) {
            query += ' AND in_stock = ?';
            params.push(in_stock === 'true' ? 1 : 0);
        }

        // Сортировка
        switch (sort) {
            case 'price_asc':
                query += ' ORDER BY price ASC';
                break;
            case 'price_desc':
                query += ' ORDER BY price DESC';
                break;
            case 'rating':
                query += ' ORDER BY rating DESC';
                break;
            case 'newest':
                query += ' ORDER BY created_at DESC';
                break;
            default:
                query += ' ORDER BY id ASC';
        }

        const products = db.prepare(query).all(...params);

        // Парсим JSON поля
        const parsedProducts = products.map(p => ({
            ...p,
            specs: JSON.parse(p.specs || '{}'),
            images: JSON.parse(p.images || '[]')
        }));

        res.json({
            success: true,
            count: parsedProducts.length,
            data: parsedProducts
        });
    } catch (error) {
        console.error('Ошибка получения товаров:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Получить один товар
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Товар не найден' 
            });
        }

        // Парсим JSON поля
        const parsedProduct = {
            ...product,
            specs: JSON.parse(product.specs || '{}'),
            images: JSON.parse(product.images || '[]')
        };

        res.json({
            success: true,
            data: parsedProduct
        });
    } catch (error) {
        console.error('Ошибка получения товара:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Создать товар (admin)
router.post('/', auth, upload.array('photos', 4), processImages, async (req, res) => {
    try {
        // Проверка на админа
        const db = getDb();
        const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Доступ запрещён' 
            });
        }

        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }

        const { name, brand, category, price, old_price, rating, reviews, in_stock, description, specs } = req.body;

        // Проверка: есть ли загруженные фото
        if (!req.savedImages || req.savedImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо загрузить хотя бы одно фото'
            });
        }

        const icon = req.savedImages[0];
        const images = JSON.stringify(req.savedImages);

        const result = db.prepare(`
            INSERT INTO products (name, brand, category, price, old_price, rating, reviews, in_stock, description, specs, icon, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(name, brand, category, price, old_price, rating, reviews, in_stock, description, specs, icon, images);

        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: 'Товар создан',
            data: {
                ...newProduct,
                specs: JSON.parse(newProduct.specs || '{}'),
                images: JSON.parse(newProduct.images || '[]')
            }
        });
    } catch (error) {
        console.error('Ошибка создания товара:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Обновить товар (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const db = getDb();
        
        // Проверка на админа
        const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Доступ запрещён' 
            });
        }

        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Товар не найден' 
            });
        }

        const { name, brand, category, price, old_price, rating, reviews, in_stock, description, specs } = req.body;

        db.prepare(`
            UPDATE products 
            SET name = ?, brand = ?, category = ?, price = ?, old_price = ?, 
                rating = ?, reviews = ?, in_stock = ?, description = ?, specs = ?
            WHERE id = ?
        `).run(name, brand, category, price, old_price, rating, reviews, in_stock, description, specs, req.params.id);

        const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

        res.json({
            success: true,
            message: 'Товар обновлён',
            data: {
                ...updatedProduct,
                specs: JSON.parse(updatedProduct.specs || '{}'),
                images: JSON.parse(updatedProduct.images || '[]')
            }
        });
    } catch (error) {
        console.error('Ошибка обновления товара:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Удалить товар (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const db = getDb();
        
        // Проверка на админа
        const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Доступ запрещён' 
            });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Товар не найден' 
            });
        }

        db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

        res.json({
            success: true,
            message: 'Товар удалён'
        });
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Добавить отзыв
router.post('/:id/reviews', async (req, res) => {
    try {
        const db = getDb();
        const { rating, comment } = req.body;

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Товар не найден' 
            });
        }

        // Обновляем рейтинг и количество отзывов
        const newReviews = product.reviews + 1;
        const newRating = ((product.rating * product.reviews) + rating) / newReviews;

        db.prepare(`
            UPDATE products 
            SET rating = ?, reviews = ?
            WHERE id = ?
        `).run(parseFloat(newRating.toFixed(1)), newReviews, req.params.id);

        res.json({
            success: true,
            message: 'Отзыв добавлен',
            data: {
                rating: parseFloat(newRating.toFixed(1)),
                reviews: newReviews
            }
        });
    } catch (error) {
        console.error('Ошибка добавления отзыва:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

module.exports = router;
