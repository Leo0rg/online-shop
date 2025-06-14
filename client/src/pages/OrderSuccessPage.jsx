import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  text-align: center;
`;

const SuccessTitle = styled.h1`
  font-family: 'Soledago', sans-serif;
  font-size: 4rem;
  color: #000;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HomeButton = styled(Link)`
  font-family: 'SF Pro Rounded', sans-serif;
  font-size: 1rem;
  padding: 1rem 3rem;
  border-radius: 20px;
  border: none;
  background-color: #e0e0e0;
  color: #969696;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const OrderSuccessPage = () => {
  return (
    <SuccessContainer>
      <SuccessTitle>Заказ оформлен</SuccessTitle>
      <HomeButton to="/">На главную</HomeButton>
    </SuccessContainer>
  );
};

export default OrderSuccessPage; 