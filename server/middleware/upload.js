const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Хранилище для загружаемых файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Временная папка для загрузки
        const uploadDir = path.join(__dirname, '../../uploads/temp');
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Только изображения!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB максимум
    }
});

// Middleware для обработки и сохранения изображений
async function processImages(req, res, next) {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        const { productName } = req.body;
        if (!productName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Не указано название товара' 
            });
        }

        // Создаём slug из названия
        const slug = productName.toLowerCase()
            .replace(/[^a-z0-9а-яё]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const productsDir = path.join(__dirname, '../../assets/img/products', slug);
        
        // Создаём папку товара
        if (!fs.existsSync(productsDir)) {
            fs.mkdirSync(productsDir, { recursive: true });
        }

        // Обрабатываем каждое изображение
        const savedImages = [];
        
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const imagePath = path.join(productsDir, `${i + 1}.jpg`);

            // Сжимаем и оптимизируем изображение
            await sharp(file.path)
                .resize(1200, 1200, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 85 })
                .toFile(imagePath);

            // Сохраняем относительный путь
            savedImages.push(`../assets/img/products/${slug}/${i + 1}.jpg`);

            // Удаляем временный файл
            fs.unlinkSync(file.path);
        }

        req.savedImages = savedImages;
        req.productSlug = slug;
        next();
    } catch (error) {
        console.error('Ошибка обработки изображений:', error);
        
        // Удаляем временные файлы
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Ошибка обработки изображений',
            error: error.message
        });
    }
}

module.exports = {
    upload,
    processImages
};
