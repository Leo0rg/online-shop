import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const RegisterContainer = styled.div`
  margin: 2rem auto;
  padding: 2rem 6rem;
  border: 1px solid #e9ecef;
  border-radius: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const RegisterTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #343a40;
  font-family: 'Soledago', sans-serif;
  font-size: 4rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #ced4da;
  border-radius: 3rem;
  font-size: 1rem;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  background-color: #D9D9D9;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 3rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #969696;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#f8d7da' : '#D9D9D9'};
  color: ${props => props.error ? '#721c24' : 'white'};
  border-radius: 3rem;
  margin-bottom: 1rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color:rgb(165, 165, 165);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем redirect из query параметров
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await register(name, email, password);
      
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
      
    } catch (err) {
      setError('Произошла ошибка при регистрации. Попробуйте позже.');
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterTitle>Регистрация</RegisterTitle>
      
      {error && <Message error>{error}</Message>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Имя</FormLabel>
          <FormInput 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormInput 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Пароль</FormLabel>
          <FormInput 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Подтверждение пароля</FormLabel>
          <FormInput 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
            required
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </SubmitButton>
      </Form>
      
      <LoginLink>
        Уже есть аккаунт?{' '}
        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
          Войти
        </Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default RegisterPage; 