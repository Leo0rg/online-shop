import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #969696;
  color: white;
  text-decoration: none;
  border-radius: 50rem;

  &:hover {
    background-color:rgb(0, 0, 0);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #dee2e6;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f8f9fa;
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }

    td {
      display: block;
      text-align: right;
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
    //   padding-left: 50%;
    }

    td:before {
      content: attr(data-label);
      position: absolute;
      left: 0.5rem;
      width: 45%;
      padding-right: 1rem;
      white-space: nowrap;
      text-align: left;
      font-weight: bold;
    }

    td:last-child {
      border-bottom: 0;
      padding-left: 50%;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

  a, button {
    color: black;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      color: #969696;
    }
  }

  button {
    color: #dc3545;
    &:hover {
      color: #bb2d3b;
    }
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 0.5rem;
  }
`;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      toast.error('Не удалось загрузить товары');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Товар успешно удален');
        fetchProducts();
      } catch (error) {
        toast.error('Не удалось удалить товар');
      }
    }
  };

  return (
    <AdminLayout>
      <TitleContainer>
        <h1>Товары</h1>
        <AddButton to="/admin/products/new">
          <FaPlus style={{ marginRight: '0.5rem' }} />
          Добавить товар
        </AddButton>
      </TitleContainer>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>В наличии</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td data-label="ID">{product._id}</td>
              <td data-label="Название">{product.name}</td>
              <td data-label="Цена">{product.price} ₽</td>
              <td data-label="Категория">{product.category}</td>
              <td data-label="В наличии">{product.countInStock}</td>
              <td data-label="Действия">
                <ActionButtons>
                  <Link to={`/admin/products/${product._id}/edit`}>
                    <FaEdit />
                  </Link>
                  <button onClick={() => deleteHandler(product._id)}>
                    <FaTrash />
                  </button>
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export default ProductListPage; 