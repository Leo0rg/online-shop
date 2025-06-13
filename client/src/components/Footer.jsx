import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FooterContainer = styled.footer`
  background: #e0e0e0;
  padding: 4rem 0 2rem;
  width: 100%;
`;

const FooterContent = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-family: 'Soledago', sans-serif;
  font-size: 4rem;
  color: #ffffff;
  font-weight: bold;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    font-size: 3rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
    width: 100%;
    justify-content: space-around;
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 1.1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.9rem;
`;

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <FooterContainer>
      <FooterContent>
        <Logo to="/">LIGHTJO</Logo>
        <LinksContainer>
          <LinkColumn>
            <ColumnTitle>Магазин</ColumnTitle>
            <FooterLink to="/">Главная</FooterLink>
            <FooterLink to="/products">Товары</FooterLink>
            <FooterLink to="/cart">Корзина</FooterLink>
          </LinkColumn>
          <LinkColumn>
            <ColumnTitle>Аккаунт</ColumnTitle>
            {user ? (
              <FooterLink to="/profile">Профиль</FooterLink>
            ) : (
              <>
                <FooterLink to="/login">Войти</FooterLink>
                <FooterLink to="/register">Регистрация</FooterLink>
              </>
            )}
          </LinkColumn>
        </LinksContainer>
      </FooterContent>
      <Copyright>LightJo &copy; {new Date().getFullYear()}</Copyright>
    </FooterContainer>
  );
};

export default Footer; 