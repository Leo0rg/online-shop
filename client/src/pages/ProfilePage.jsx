import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
// import { orderAPI } from '../api';

const ProfileWrapper = styled.div`
  // margin: 2rem auto;
  // padding: 0 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 400px); 
`;

const ProfileContainer = styled.div`
  width: 80%;
`;

const ProfileTitle = styled.h1`
  font-family: 'Soledago', sans-serif;
  font-weight: 500;
  font-size: 48px;
  text-align: start;
  margin-bottom: 2rem;
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 60%;
  max-width: 30rem;
  min-width: 20rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #000;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #000;
  border-radius: 30px;
  font-size: 1rem;
  background-color: #fff;
  color: #000;
  
  &:focus {
    outline: none;
    border-color: #555;
  }
`;

const SubmitButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 50%;
  min-width: 10rem;
  transition: background-color 0.3s ease;
  margin-bottom: 2rem;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#f8d7da' : '#d4edda'};
  color: ${props => props.error ? '#721c24' : '#155724'};
  border-radius: 4px;
  margin-bottom: 1rem;
`;

// const OrdersList = styled.div`
//   margin-top: 1rem;
// `;

// const OrderItem = styled.div`
//   padding: 1rem;
//   border: 1px solid #ced4da;
//   border-radius: 4px;
//   margin-bottom: 1rem;
// `;

// const OrderHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 0.5rem;
  
//   @media (max-width: 576px) {
//     flex-direction: column;
//   }
// `;

// const OrderId = styled.div`
//   font-weight: bold;
// `;

// const OrderDate = styled.div`
//   color: #6c757d;
// `;

// const OrderInfo = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   margin: 0.5rem 0;
  
//   @media (max-width: 576px) {
//     grid-template-columns: 1fr;
//     gap: 0.5rem;
//   }
// `;

// const OrderInfoItem = styled.div`
//   &:before {
//     content: '${props => props.label}: ';
//     font-weight: bold;
//   }
// `;

// const OrderStatus = styled.div`
//   display: inline-block;
//   padding: 0.25rem 0.5rem;
//   border-radius: 4px;
//   font-size: 0.875rem;
//   background-color: ${props => props.paid ? '#d4edda' : '#f8d7da'};
//   color: ${props => props.paid ? '#155724' : '#721c24'};
//   margin-top: 0.5rem;
// `;

// const ViewButton = styled.button`
//   background-color: #6c757d;
//   color: white;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   cursor: pointer;
//   margin-top: 0.5rem;
//   font-size: 0.875rem;
  
//   &:hover {
//     background-color: #5a6268;
//   }
// `;

// const NoOrders = styled.div`
//   padding: 2rem;
//   text-align: center;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #343a40;
    border-color: #343a40 transparent #343a40 transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ProfilePage = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [initialData, setInitialData] = useState({ name: '', email: '' });
  const [isChanged, setIsChanged] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // const [orders, setOrders] = useState([]);
  // const [ordersLoading, setOrdersLoading] = useState(true);
  // const [ordersError, setOrdersError] = useState(null);
  
  useEffect(() => {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setInitialData({ name: user.name || '', email: user.email || ''});
      
      // Загружаем заказы пользователя
      // const fetchOrders = async () => {
      //   try {
      //     const data = await orderAPI.getMyOrders();
      //     setOrders(data);
      //     setOrdersLoading(false);
      //   } catch (error) {
      //     setOrdersError(error.message || 'Ошибка при загрузке заказов');
      //     setOrdersLoading(false);
      //   }
      // };
      
      // fetchOrders();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const isNameChanged = name !== initialData.name;
    const isEmailChanged = email !== initialData.email;
    const isPasswordEntered = password !== '';
    
    setIsChanged(isNameChanged || isEmailChanged || isPasswordEntered);
  }, [name, email, password, initialData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const userData = {};

      if (name !== initialData.name) userData.name = name;
      if (email !== initialData.email) userData.email = email;
      if (password) userData.password = password;

      
      const result = await updateProfile(userData);
      
      if (result.success) {
        setSuccess('Профиль успешно обновлен!');
        setPassword('');
        setConfirmPassword('');
        setInitialData({ name: result.user.name, email: result.user.email });
      } else {
        setError(result.error || 'Ошибка при обновлении профиля');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };
  
  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  if (authLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <ProfileWrapper>
      <ProfileContainer>
        <ProfileTitle>ПРОФИЛЬ</ProfileTitle>
        {error && <Message error>{error}</Message>}
        {success && <Message>{success}</Message>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Имя пользователя</FormLabel>
            <FormInput 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>E-mail</FormLabel>
            <FormInput 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Новый пароль</FormLabel>
            <FormInput 
              type="password"
              placeholder="Введите новый пароль"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Подтвердите новый пароль</FormLabel>
            <FormInput 
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </FormGroup>
          {isChanged && (
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </SubmitButton>
          )}
        </Form>
      </ProfileContainer>
      {/* Ниже раздел с заказами, его мы не трогаем */}
      {/* 
        Здесь может быть ваш код для отображения заказов, 
        который я пока закомментирую, чтобы сфокусироваться на профиле.
        Если нужно будет вернуть, просто раскомментируйте.
      */}
    </ProfileWrapper>
  );
};

export default ProfilePage; 