import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import AdminLayout from '../../components/AdminLayout';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #969696;
  }
`;

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/users/${id}`, config);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        toast.error('Не удалось загрузить данные пользователя');
      }
    };
    fetchUser();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { name, email, role: isAdmin ? 'admin' : 'user' };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`/api/users/${id}`, userData, config);
      toast.success('Пользователь успешно обновлен');
      navigate('/admin/users');
    } catch (error) {
      toast.error('Ошибка обновления пользователя');
    }
  };

  return (
    <AdminLayout>
      <h1>Редактировать пользователя</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label>Имя</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <CheckboxGroup>
            <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <Label htmlFor="isAdmin">Администратор</Label>
          </CheckboxGroup>
        </FormGroup>
        <Button type="submit">Обновить</Button>
      </Form>
    </AdminLayout>
  );
};

export default UserEditPage; 