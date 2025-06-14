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

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #D9D9D9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  color: black;

  &:hover {
    background-color: #969696;
  }
`;

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
        } catch (error) {
          toast.error('Не удалось загрузить данные товара');
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post('/api/products/upload', formData, config);
      setImage(data);
      setUploading(false);
      toast.success('Изображение успешно загружено');
    } catch (error) {
      toast.error('Ошибка загрузки изображения');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const productData = { name, price, image, category, countInStock, description };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.put(`/api/products/${id}`, productData, config);
        toast.success('Товар успешно обновлен');
      } else {
        await axios.post('/api/products', productData, config);
        toast.success('Товар успешно создан');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error('Ошибка сохранения товара');
    }
  };

  return (
    <AdminLayout>
      <h1>{isEditing ? 'Редактировать товар' : 'Добавить товар'}</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label>Название</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Цена</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Изображение</Label>
          <Input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Введите URL или загрузите файл" />
          <Input type="file" onChange={uploadFileHandler} />
          {uploading && <p>Загрузка...</p>}
        </FormGroup>
        <FormGroup>
          <Label>Категория</Label>
          <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Количество на складе</Label>
          <Input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Описание</Label>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </FormGroup>
        <Button type="submit">
          {isEditing ? 'Обновить' : 'Создать'}
        </Button>
      </Form>
    </AdminLayout>
  );
};

export default ProductEditPage; 