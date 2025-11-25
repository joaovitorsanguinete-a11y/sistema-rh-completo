import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Envia email e senha para o backend
      const response = await api.post('/login', { email, password });

      // 2. Recebe o TOKEN de segurança
      const token = response.data.token;
      const nomeUsuario = response.data.user.nome;

      // 3. Salva o token no navegador (para o usuário continuar logado)
      localStorage.setItem('token', token);
      localStorage.setItem('usuario_nome', nomeUsuario);

      // 4. Manda o usuário para o Dashboard
      // Força um recarregamento para atualizar o menu (se tiver lógica de esconder menu)
      window.location.href = '/'; 

    } catch (err) {
      setError('E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="font-weight-light my-1">Login RH</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input 
                    className="form-control" 
                    id="inputEmail" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="inputEmail">Endereço de E-mail</label>
                </div>
                <div className="form-floating mb-3">
                  <input 
                    className="form-control" 
                    id="inputPassword" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="inputPassword">Senha</label>
                </div>
                
                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="d-grid gap-2 mt-4">
                  <button className="btn btn-primary btn-lg" type="submit">Entrar</button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small text-muted">Sistema de Gestão v2.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;