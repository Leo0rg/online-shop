import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    &:hover {
      color: #bb2d3b;
    }
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 0.5rem;
  }
`;

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch (error) {
      toast.error('Не удалось загрузить пользователей');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/users/${id}`, config);
        toast.success('Пользователь успешно удален');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Не удалось удалить пользователя');
      }
    }
  };

  return (
    <AdminLayout>
      <TitleContainer>
        <h1>Пользователи</h1>
      </TitleContainer>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Администратор</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td data-label="ID">{user._id}</td>
              <td data-label="Имя">{user.name}</td>
              <td data-label="Email"><a href={`mailto:${user.email}`}>{user.email}</a></td>
              <td data-label="Администратор">
                {user.role === 'admin' ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </td>
              <td data-label="Действия">
                <ActionButtons>
                  <Link to={`/admin/users/${user._id}/edit`}>
                    <FaEdit />
                  </Link>
                  <button onClick={() => deleteHandler(user._id)}>
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

export default UserListPage; 