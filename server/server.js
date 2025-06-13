const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Загрузка переменных окружения из корневой папки
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Статическая папка для загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));

// Базовый маршрут для проверки API
app.get('/', (req, res) => {
  res.send('API работает');
});

// Обработка ошибок
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`${process.env.MONGO_URI}`);
}); 