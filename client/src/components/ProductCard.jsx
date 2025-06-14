import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid transparent;
  box-shadow: 0px 4px 57.1px -19px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  position: relative;
  padding-bottom: 2rem;
  padding-top: 2rem;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-family: 'SF Pro Rounded', sans-serif;
  font-weight: 500;
  color: #ACACAC;
  margin-bottom: 8px;
  font-size: 24px;
`;

const CardPrice = styled.div`
  font-family: 'SF Pro Rounded', sans-serif;
  font-size: 16px;
  color: #ACACAC;
`;

const QuantitySelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const QuantityButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0 10px;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`;

const QuantityDisplay = styled.span`
  color: white;
  font-size: 14px;
`;

const BuyButton = styled.button`
  background-color:rgb(175, 175, 175);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 50rem;
  cursor: pointer;
  font-family: 'SF Pro Rounded', sans-serif;
  font-size: 14px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  
  &:hover {
    background-color:rgb(97, 97, 97);
  }
  
  &:disabled {
    background-color:rgb(27, 27, 27);
    cursor: not-allowed;
  }
`;

const ProductCard = ({ product, onAddToCart, isAdded, cartItem, updateQuantity }) => {

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (cartItem) {
      updateQuantity(cartItem.product, newQuantity);
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const imageUrl = product.image && product.image.startsWith('/') 
    ? `${apiUrl}${product.image}` 
    : product.image;

  return (
    <Card>
      <CardImage src={imageUrl} alt={product.name} />
      <CardBody>
        <CardTitle>{product.name}</CardTitle>
        <CardPrice>{product.price} ₽</CardPrice>
      </CardBody>
      <BuyButton 
        onClick={!isAdded ? handleAddToCart : undefined}
        disabled={!isAdded && product.countInStock === 0}
      >
        {isAdded ? (
          <QuantitySelector>
            <QuantityButton onClick={() => handleQuantityChange(cartItem.quantity - 1)}>-</QuantityButton>
            <QuantityDisplay>{cartItem.quantity} шт.</QuantityDisplay>
            <QuantityButton 
              onClick={() => handleQuantityChange(cartItem.quantity + 1)}
              disabled={cartItem.quantity >= product.countInStock}
            >
              +
            </QuantityButton>
          </QuantitySelector>
        ) : (
          product.countInStock > 0 ? 'В корзину' : 'Нет в наличии'
        )}
      </BuyButton>
    </Card>
  );
};

export default ProductCard; 