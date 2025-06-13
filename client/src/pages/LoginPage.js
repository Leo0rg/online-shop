import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const LoginContainer = styled.div`
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #343a40;
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
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #6c757d;
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

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login, user } = useContext(AuthContext);
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
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
      
    } catch (err) {
      setError('Произошла ошибка при входе. Попробуйте позже.');
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginTitle>Вход в аккаунт</LoginTitle>
      
      {error && <Message error>{error}</Message>}
      
      <Form onSubmit={handleSubmit}>
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
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </SubmitButton>
      </Form>
      
      <RegisterLink>
        Нет аккаунта?{' '}
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
          Зарегистрироваться
        </Link>
      </RegisterLink>
    </LoginContainer>
  );
};

export default LoginPage; 