const express = require('express');
const Joi = require('joi');
const { getDb } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Валидация заказа
const orderSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        icon: Joi.string()
    })).required(),
    total: Joi.number().integer().min(0).required(),
    shipping_address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
});

// Получить все заказы (admin)
router.get('/', auth, async (req, res) => {
    try {
        const db = getDb();
        
        // Проверка на админа
        const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
        if (user.role !== 'admin') {
            // Если не админ, возвращаем только его заказы
            const orders = db.prepare(`
                SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
            `).all(req.user.id);
            
            const parsedOrders = orders.map(o => ({
                ...o,
                items: JSON.parse(o.items || '[]')
            }));
            
            return res.json({
                success: true,
                data: parsedOrders
            });
        }

        // Админ видит все заказы
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        
        const parsedOrders = orders.map(o => ({
            ...o,
            items: JSON.parse(o.items || '[]')
        }));

        res.json({
            success: true,
            count: parsedOrders.length,
            data: parsedOrders
        });
    } catch (error) {
        console.error('Ошибка получения заказов:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Получить один заказ
router.get('/:id', auth, async (req, res) => {
    try {
        const db = getDb();
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Заказ не найден' 
            });
        }

        // Проверка прав (админ или владелец заказа)
        const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
        if (user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Доступ запрещён' 
            });
        }

        const parsedOrder = {
            ...order,
            items: JSON.parse(order.items || '[]')
        };

        res.json({
            success: true,
            data: parsedOrder
        });
    } catch (error) {
        console.error('Ошибка получения заказа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Создать заказ
router.post('/', auth, async (req, res) => {
    try {
        const { error } = orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }

        const db = getDb();
        const { items, total, shipping_address, phone, email } = req.body;

        const result = db.prepare(`
            INSERT INTO orders (user_id, total, items, shipping_address, phone, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(req.user.id, total, JSON.stringify(items), shipping_address, phone, email);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: 'Заказ создан',
            data: {
                ...order,
                items: JSON.parse(order.items || '[]')
            }
        });
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Обновить статус заказа (admin)
router.put('/:id/status', auth, async (req, res) => {
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

        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Неверный статус заказа' 
            });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Заказ не найден' 
            });
        }

        db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

        const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

        res.json({
            success: true,
            message: 'Статус заказа обновлён',
            data: {
                ...updatedOrder,
                items: JSON.parse(updatedOrder.items || '[]')
            }
        });
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Удалить заказ (admin)
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

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Заказ не найден' 
            });
        }

        db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);

        res.json({
            success: true,
            message: 'Заказ удалён'
        });
    } catch (error) {
        console.error('Ошибка удаления заказа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

module.exports = router;
