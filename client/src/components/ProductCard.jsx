import React, { useContext } from 'react';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';

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

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    console.log('product',product);
    addToCart(product, 1);
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
        onClick={handleAddToCart}
        disabled={product.countInStock === 0}
      >
        {product.countInStock > 0 ? 'В корзину' : 'Нет в наличии'}
      </BuyButton>
    </Card>
  );
};

export default ProductCard; 