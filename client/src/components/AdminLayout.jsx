import React from 'react';
import styled from 'styled-components';
import AdminMenu from './AdminMenu';

const AdminLayoutContainer = styled.div`
  display: flex;
  width: 80%;
  margin: 1rem auto;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const AdminLayout = ({ children }) => {
  return (
    <AdminLayoutContainer>
      <AdminMenu />
      <Content>{children}</Content>
    </AdminLayoutContainer>
  );
};

export default AdminLayout; 