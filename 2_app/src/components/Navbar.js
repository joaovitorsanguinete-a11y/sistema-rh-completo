import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Para saber em qual página estamos

  // Função auxiliar para definir se o link está "ativo" (negrito)
  const getClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active fw-bold' : ''}`;
  };

  // Função de Logout (Sair)
  const handleLogout = () => {
    // 1. Apaga os dados de segurança do navegador
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nome');

    // 2. Força o redirecionamento para o Login
    // Usamos window.location.href em vez de navigate() para forçar
    // o App.js a recarregar e esconder este Menu
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow">
      <div className="container">
        {/* Logo / Título */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-people-fill me-2"></i>
          Sistema RH
        </Link>
        
        {/* Botão Hamburguer (para celular) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links do Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={getClass('/')} to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={getClass('/funcionarios')} to="/funcionarios">Funcionários</Link>
            </li>
            <li className="nav-item">
              <Link className={getClass('/cargos')} to="/cargos">Cargos</Link>
            </li>
            
            {/* Divisor visual */}
            <li className="nav-item d-none d-lg-block mx-2 text-white-50">|</li>

            {/* Botão Sair */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-white-50" 
                onClick={handleLogout}
                style={{ textDecoration: 'none' }}
              >
                Sair <i className="bi bi-box-arrow-right ms-1"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;