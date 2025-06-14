import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaUser, FaBars, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const HeaderContainer = styled.header`
  background:rgb(255, 255, 255);
  color: #fff;
  // padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 1rem 0;
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-family: 'Soledago', sans-serif;
  font-size: 2.5rem;
  color: black;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ menuOpen }) => (menuOpen ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 1rem;
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  color: #969696;
  margin-left: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ccc;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

const CartBadge = styled.span`
  background-color: #f8f9fa;
  color: #343a40;
  border-radius: 50%;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.3rem;
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: black;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">LightJo</Logo>
        <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </Hamburger>
        <NavLinks menuOpen={menuOpen}>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart style={{ marginRight: '0.5rem' }} />
            Корзина
            {cartItemsCount > 0 && <CartBadge>{cartItemsCount}</CartBadge>}
          </NavLink>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin/products" onClick={() => setMenuOpen(false)}>
                  <FaCog style={{ marginRight: '0.5rem' }} />
                  Админка
                </NavLink>
              )}
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                <FaUser style={{ marginRight: '0.5rem' }} />
                Профиль
              </NavLink>
              <NavLink to="/" onClick={() => { logout(); setMenuOpen(false); }}>
                Выйти
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>
              <FaUser style={{ marginRight: '0.5rem' }} />
              Войти
            </NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 