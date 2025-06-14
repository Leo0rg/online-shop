import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

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

  @media (max-width: 992px) {
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
      // padding-left: 50%;
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
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;

  @media (max-width: 992px) {
    justify-content: flex-start;
  }
`;

const Button = styled.button`
  padding: 0.3rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background-color: #e2e6ea;
  }
`;

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      toast.error('Не удалось загрузить заказы');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsPaidHandler = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/orders/${id}/pay`, {}, config);
      toast.success('Статус оплаты обновлен');
      fetchOrders();
    } catch (error) {
      toast.error('Не удалось обновить статус оплаты');
    }
  };

  const markAsDeliveredHandler = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      toast.success('Статус доставки обновлен');
      fetchOrders();
    } catch (error) {
      toast.error('Не удалось обновить статус доставки');
    }
  };

  return (
    <AdminLayout>
      <h1>Заказы</h1>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пользователь</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Оплачен</th>
            <th>Доставлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td data-label="ID">{order._id}</td>
              <td data-label="Пользователь">{order.user?.name || 'Пользователь удален'}</td>
              <td data-label="Дата">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td data-label="Сумма">{order.totalPrice} ₽</td>
              <td data-label="Оплачен">
                {order.isPaid ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </td>
              <td data-label="Доставлен">
                {order.isDelivered ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </td>
              <td data-label="Действия">
                <ActionButtons>
                  <Button onClick={() => markAsPaidHandler(order._id)} disabled={order.isPaid}>
                    Отметить как оплаченный
                  </Button>
                  <Button onClick={() => markAsDeliveredHandler(order._id)} disabled={order.isDelivered}>
                    Отметить как доставленный
                  </Button>
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export default OrderListPage; 