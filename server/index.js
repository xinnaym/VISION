const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const { initDatabase, createDefaultAdmin } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Безопасность
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов
});
app.use('/api', limiter);

// Парсинг
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Статика для загруженных изображений
app.use('/assets/img/products', express.static(path.join(__dirname, '../assets/img/products')));

// Инициализация БД
initDatabase();

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'VISION API is running' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Что-то пошло не так',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 VISION Server запущен на порту ${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api`);
    console.log(`💾 Health: http://localhost:${PORT}/api/health`);
});
