import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../api';

const CartContainer = styled.div`
  padding: 2rem 0;
  width: 80%;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem 0;
  }
`;

const CartTitle = styled.h1`
  font-family: 'Soledago', sans-serif;
  font-size: 4rem;
  text-align: left;
  margin-bottom: 2rem;
  color: #000;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
`;

const CartEmpty = styled.div`
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
`;

const CartItems = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 0;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    text-align: center;
  }
`;

const ItemSeparator = styled.div`
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 999px;
  margin: 0;
`;

const CartItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const CartItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const CartItemName = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const CartItemDescription = styled.p`
    color: #000;
    font-size: 1rem;
    margin: 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.2rem;
  color: #000;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
`;

const CartItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #000;
  min-width: 120px;
  text-align: right;

  @media (max-width: 768px) {
    min-width: auto;
    text-align: center;
    margin-top: 0.5rem;
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const CheckoutButton = styled.button`
  background-color: #e0e0e0;
  color: white;
  border: none;
  padding: 0.8rem 6.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'SF Pro Rounded', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: #d0d0d0;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const ShippingForm = styled.div`
  margin-top: 2rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormTitle = styled.h3`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#f8d7da' : '#d4edda'};
  color: ${props => props.error ? '#721c24' : '#155724'};
  border-radius: 4px;
  margin: 1rem 0;
`;

const CartPage = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Наличными при получении');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }
    setShowShippingForm(true);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      setError('Пожалуйста, заполните все поля адреса доставки');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product
      }));
      
      const order = {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
      };
      
      await orderAPI.createOrder(order);
      
      clearCart();
      setSuccess('Заказ успешно оформлен!');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Произошла ошибка при оформлении заказа');
      setLoading(false);
    }
  };
  
  const apiUrl = process.env.REACT_APP_API_URL || '';

  return (
    <CartContainer>
      <CartTitle>КОРЗИНА</CartTitle>
      
      {cartItems.length === 0 ? (
        <CartEmpty>
          <p>Ваша корзина пуста</p>
          <Link to="/">Вернуться к покупкам</Link>
        </CartEmpty>
      ) : (
        <>
          {error && <Message error>{error}</Message>}
          {success && <Message>{success}</Message>}
          
          <CartItems>
            {cartItems.map((item, index) => {
               const imageUrl = item.image && item.image.startsWith('/uploads')
               ? `${apiUrl}${item.image}`
               : item.image;

              return (
              <React.Fragment key={item.product}>
                <CartItem>
                  <CartItemImage src={imageUrl} alt={item.name} />
                  <CartItemInfo>
                      <CartItemName to={`/product/${item.product}`}>{item.name}</CartItemName>
                      <CartItemDescription>{item.description}</CartItemDescription>
                  </CartItemInfo>

                  <QuantitySelector>
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                      disabled={item.quantity >= item.countInStock}
                    >
                      +
                    </QuantityButton>
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </QuantityButton>
                  </QuantitySelector>
                  
                  <CartItemPrice>Цена: {item.price} p.</CartItemPrice>

                </CartItem>
                {index < cartItems.length - 1 && <ItemSeparator />}
              </React.Fragment>
            )})}
          </CartItems>
          
          <CartActions>
            {!showShippingForm && (
              <CheckoutButton onClick={handleCheckout} disabled={loading}>
                {loading ? 'Обработка...' : 'Купить'}
              </CheckoutButton>
            )}
          </CartActions>

          {showShippingForm && (
            <ShippingForm>
              <FormTitle>Адрес доставки</FormTitle>
              <form onSubmit={handlePlaceOrder}>
                <FormGroup>
                  <FormLabel>Адрес</FormLabel>
                  <FormInput 
                    type="text" 
                    name="address" 
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Город</FormLabel>
                  <FormInput 
                    type="text" 
                    name="city" 
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Почтовый индекс</FormLabel>
                  <FormInput 
                    type="text" 
                    name="postalCode" 
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Страна</FormLabel>
                  <FormInput 
                    type="text" 
                    name="country" 
                    value={shippingAddress.country}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Способ оплаты</FormLabel>
                  <FormInput 
                    type="text" 
                    value={paymentMethod}
                    readOnly
                  />
                </FormGroup>
                <CheckoutButton type="submit" disabled={loading}>
                  {loading ? 'Оформление...' : 'Подтвердить заказ'}
                </CheckoutButton>
              </form>
            </ShippingForm>
          )}
        </>
      )}
    </CartContainer>
  );
};

export default CartPage; 