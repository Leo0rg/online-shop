import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 100%;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
    position: relative;
    min-height: 100vh;
  }
  
  .container {
    background-color: white;
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  .py-3 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
