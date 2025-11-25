import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Importe Navigate
import './App.css';

import Navbar from './components/Navbar';
import Login from './pages/Login'; // <-- Importe o Login
import Dashboard from './pages/Dashboard';
import Cargos from './pages/Cargos';
import Funcionarios from './pages/Funcionarios';
import FuncionarioForm from './pages/FuncionarioForm';
import FuncionarioDetalhes from './pages/FuncionarioDetalhes';

function App() {
  // Verifica se o usuário está logado
  const isLogado = !!localStorage.getItem('token');

  return (
    <div className="App bg-light min-vh-100">
      <BrowserRouter>
        
        {/* Só mostra o menu se estiver logado */}
        {isLogado && <Navbar />}

        <div className={isLogado ? "content-wrapper" : ""}>
          <Routes>
            {/* Rota de Login */}
            <Route path="/login" element={<Login />} />

            {/* Se tentar acessar a raiz... */}
            <Route path="/" element={isLogado ? <Dashboard /> : <Navigate to="/login" />} />
            
            {/* Outras rotas (idealmente deveriam ser protegidas também, mas vamos simplificar) */}
            <Route path="/cargos" element={isLogado ? <Cargos /> : <Navigate to="/login" />} />
            <Route path="/funcionarios" element={isLogado ? <Funcionarios /> : <Navigate to="/login" />} />
            <Route path="/funcionarios/novo" element={isLogado ? <FuncionarioForm /> : <Navigate to="/login" />} />
            <Route path="/funcionarios/:id" element={isLogado ? <FuncionarioDetalhes /> : <Navigate to="/login" />} />
          </Routes>
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;