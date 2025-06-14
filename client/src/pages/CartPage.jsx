import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaArrowUp } from 'react-icons/fa';

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

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  &:hover {
    background-color: #555;
  }
`;

const CartPage = () => {
  const { cartItems, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [checkScrollTop]);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }
    navigate('/checkout');
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
                    >
                      -
                    </QuantityButton>
                  </QuantitySelector>
                  
                  <CartItemPrice>Цена: {item.price} ₽</CartItemPrice>

                </CartItem>
                {index < cartItems.length - 1 && <ItemSeparator />}
              </React.Fragment>
            )})}
          </CartItems>
          
          <CartActions>
            <CheckoutButton onClick={handleCheckout}>
              Оформить заказ
            </CheckoutButton>
          </CartActions>
        </>
      )}
      <ScrollToTopButton onClick={scrollTop} show={showScroll}>
        <FaArrowUp />
      </ScrollToTopButton>
    </CartContainer>
  );
};

export default CartPage; 