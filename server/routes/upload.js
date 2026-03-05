const express = require('express');
const { upload, processImages } = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

// Загрузка изображений товара
router.post('/images', auth, upload.array('photos', 4), processImages, async (req, res) => {
    try {
        if (!req.savedImages || req.savedImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо загрузить хотя бы одно фото'
            });
        }

        res.json({
            success: true,
            message: `Загружено ${req.savedImages.length} изображений`,
            data: {
                images: req.savedImages,
                slug: req.productSlug
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

module.exports = router;
