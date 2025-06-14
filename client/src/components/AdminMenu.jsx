import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AdminMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 5px;
  min-width: 200px;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
  }
`;

const AdminMenuItem = styled(NavLink)`
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  font-weight: 500;

  &.active {
    background-color: #969696;
    color: white;
  }

  &:hover:not(.active) {
    background-color:rgb(207, 207, 207);
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    flex-grow: 1;
    text-align: center;
  }
`;

const AdminMenu = () => {
  return (
    <AdminMenuContainer>
      <AdminMenuItem to="/admin/products">Товары</AdminMenuItem>
      <AdminMenuItem to="/admin/users">Пользователи</AdminMenuItem>
      <AdminMenuItem to="/admin/orders">Заказы</AdminMenuItem>
    </AdminMenuContainer>
  );
};

export default AdminMenu; 