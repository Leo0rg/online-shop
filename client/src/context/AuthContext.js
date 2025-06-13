import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Загрузка пользователя по токену
  const loadUser = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('/api/auth/profile', config);
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Регистрация нового пользователя
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка регистрации',
      };
    }
  };

  // Вход пользователя
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка входа',
      };
    }
  };

  // Обновление профиля пользователя
  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put('/api/users/profile', userData, config);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка обновления профиля',
      };
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 