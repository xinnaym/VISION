const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { getDb } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Валидация регистрации
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
});

// Валидация входа
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }

        const { email, password, name } = req.body;
        const db = getDb();

        // Проверка существования пользователя
        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Пользователь с таким email уже существует' 
            });
        }

        // Хеширование пароля
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Создание пользователя
        const result = db.prepare(`
            INSERT INTO users (email, password, name, role)
            VALUES (?, ?, ?, 'user')
        `).run(email, hashedPassword, name);

        // Генерация токена
        const token = jwt.sign(
            { id: result.lastInsertRowid, email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Пользователь зарегистрирован',
            data: {
                id: result.lastInsertRowid,
                email,
                name,
                role: 'user'
            },
            token
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }

        const { email, password } = req.body;
        const db = getDb();

        // Поиск пользователя
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный email или пароль' 
            });
        }

        // Проверка пароля
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный email или пароль' 
            });
        }

        // Генерация токена
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Вход выполнен успешно',
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Получить текущий профиль
router.get('/me', auth, async (req, res) => {
    try {
        const db = getDb();
        const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Пользователь не найден' 
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// Выхход (на клиенте просто удаляем токен)
router.post('/logout', auth, async (req, res) => {
    res.json({
        success: true,
        message: 'Выход выполнен успешно'
    });
});

module.exports = router;
