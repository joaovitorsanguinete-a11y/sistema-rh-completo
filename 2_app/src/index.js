// 1. Importa o CSS do Bootstrap (Correto)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. O resto do arquivo original do React
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// (O seu pode ter uma linha 'reportWebVitals' aqui, não tem problema)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);