import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const cartFromStorage = localStorage.getItem('cartItems');
      return cartFromStorage ? JSON.parse(cartFromStorage) : [];
    } catch (error) {
      console.error('Could not load cart from localStorage', error);
      return [];
    }
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    try {
      // Пересчитываем общую стоимость при изменении корзины
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
      
      // Сохраняем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Could not save cart to localStorage', error);
    }
  }, [cartItems]);

  // Добавление товара в корзину
  const addToCart = (product, quantity = 1) => {
    const existItem = cartItems.find(
      (item) => item.product === product._id
    );

    if (existItem) {
      // Если товар уже в корзине, увеличиваем количество
      setCartItems(
        cartItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Если товара нет в корзине, добавляем его
      setCartItems([...cartItems, { product: product._id, name: product.name, image: product.image, price: product.price, countInStock: product.countInStock, quantity, description: product.description }]);
    }
  };

  // Изменение количества товара в корзине
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // Если количество 0 или меньше, удаляем товар из корзины
      removeFromCart(productId);
    } else {
      // Иначе обновляем количество
      setCartItems(
        cartItems.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.product !== productId));
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 