# VISION Backend

Бэкенд для интернет-магазина игровой периферии VISION.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
cd server
npm install
```

### 2. Настройка
Создайте файл `.env` в папке `server/`:
```env
PORT=3000
JWT_SECRET=your-super-secret-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://127.0.0.1:5500
ADMIN_EMAIL=admin@vision.ru
ADMIN_PASSWORD=Admin123!
```

### 3. Запуск
```bash
# Продакшен
npm start

# Разработка (с авто-рестартом)
npm run dev
```

Сервер запустится на `http://localhost:3000`

## 📁 Структура проекта

```
server/
├── config/
│   └── database.js       # Инициализация БД
├── routes/
│   ├── auth.js           # /api/auth/*
│   ├── products.js       # /api/products/*
│   ├── orders.js         # /api/orders/*
│   └── upload.js         # /api/upload/*
├── middleware/
│   ├── auth.js           # Проверка JWT
│   └── upload.js         # Загрузка фото
├── index.js              # Главный файл
├── .env                  # Переменные окружения
└── database.db           # Файл БД (создаётся автоматически)
```

## 🔌 API Endpoints

### Auth
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Профиль (требуется токен) |
| POST | `/api/auth/logout` | Выход |

### Products
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/products` | Список товаров |
| GET | `/api/products/:id` | Один товар |
| POST | `/api/products` | Создать (admin) |
| PUT | `/api/products/:id` | Обновить (admin) |
| DELETE | `/api/products/:id` | Удалить (admin) |
| POST | `/api/products/:id/reviews` | Добавить отзыв |

**Параметры для GET /api/products:**
- `category` - фильтр по категории
- `brand` - фильтр по бренду
- `min_price` - минимальная цена
- `max_price` - максимальная цена
- `search` - поиск по названию
- `in_stock` - только в наличии (true/false)
- `sort` - сортировка (price_asc, price_desc, rating, newest)

### Orders
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/orders` | Мои заказы / Все (admin) |
| GET | `/api/orders/:id` | Детали заказа |
| POST | `/api/orders` | Создать заказ |
| PUT | `/api/orders/:id/status` | Статус (admin) |
| DELETE | `/api/orders/:id` | Удалить (admin) |

### Upload
| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/upload/images` | Загрузка фото |

## 🔐 Авторизация

Для доступа к защищённым эндпоинтам добавьте заголовок:
```
Authorization: Bearer <ваш_token>
```

## 📸 Загрузка изображений

Пример запроса для создания товара с фото:

```bash
POST http://localhost:3000/api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: AULA F75
brand: AULA
category: Клавиатуры
price: 4399
photos: [file1.jpg, file2.jpg, file3.jpg, file4.jpg]
```

Изображения автоматически:
1. Сжимаются до 1200x1200
2. Сохраняются в `assets/img/products/{slug}/`
3. Переименовываются в `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`

## 👤 Администратор по умолчанию

```
Email: admin@vision.ru
Пароль: Admin123!
```

Смените пароль в продакшене!

## 🗄️ База данных

SQLite (файл `database.db`). Автоматически создаётся при первом запуске и мигрирует товары из `assets/js/main.js`.

## 🛠️ Технологии

- **Node.js** + **Express** - сервер
- **sql.js** - SQLite на JavaScript
- **multer** + **sharp** - загрузка и оптимизация фото
- **bcryptjs** - хеширование паролей
- **jsonwebtoken** - JWT токены
- **joi** - валидация данных

## 📝 Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Иван"}'
```

### Вход
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vision.ru","password":"Admin123!"}'
```

### Получение товаров
```bash
curl http://localhost:3000/api/products?category=Клавиатуры&sort=price_asc
```

### Создание заказа
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [{"id":1,"name":"AULA F75","price":4399,"quantity":1}],
    "total": 4399,
    "shipping_address": "Москва, ул. Тверская 12",
    "phone": "+79991234567",
    "email": "user@example.com"
  }'
```

## ⚠️ Важно

- Бэкенд хранит данные в файле `database.db` - делайте бэкапы
- Для продакшена используйте HTTPS
- Смените `JWT_SECRET` на уникальный ключ
- Ограничьте доступ к админским эндпоинтам
