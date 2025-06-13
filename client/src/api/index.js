import axios from 'axios';

// Базовый URL для API
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API для работы с товарами
export const productAPI = {
  // Получить все товары
  getProducts: async () => {
    try {
      const { data } = await axios.get('/api/products');
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Получить товар по ID
  getProductById: async (id) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// API для работы с заказами
export const orderAPI = {
  // Создать заказ
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Получить заказы пользователя
  getMyOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Получить детали заказа
  getOrderById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 