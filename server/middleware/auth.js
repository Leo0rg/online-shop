const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки аутентификации пользователя
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем данные пользователя без пароля
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Не авторизован, токен недействителен');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизован, токен отсутствует');
  }
};

// Middleware для проверки прав администратора
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Недостаточно прав для доступа');
  }
};

module.exports = { protect, admin }; 