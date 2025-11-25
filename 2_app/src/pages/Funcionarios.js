import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await api.get('/funcionarios');
        setFuncionarios(response.data);
      } catch (error) {
        setMensagem({ tipo: 'danger', texto: 'Erro ao buscar funcionários.' });
        console.error(error);
      }
    };

    fetchFuncionarios();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">Gestão de Funcionários</h1>
          <Link to="/funcionarios/novo" className="btn btn-primary">
            Adicionar Novo
          </Link>
        </div>
        <div className="card-body">
          {mensagem.texto && (
            <div className={`alert alert-${mensagem.tipo} py-2`}>
              {mensagem.texto}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Cargo Principal</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Nenhum funcionário cadastrado.
                    </td>
                  </tr>
                ) : (
                  funcionarios.map((func) => (
                    <tr key={func.id}>
                      <td>{func.matricula || 'N/A'}</td>
                      <td>{func.nome}</td>
                      <td>{func.cpf}</td>
                      
                      <td>
                        {func.atribuicoes.length > 0 
                          ? func.atribuicoes[0].cargo.descricao 
                          : 'Sem cargo'
                        }
                      </td>

                      <td>
                        {func.ativo ? (
                          <span className="badge bg-success">Ativo</span>
                        ) : (
                          <span className="badge bg-secondary">Inativo</span>
                        )}
                      </td>
                      
                      <td>
                        {/* Botões de Ações (Placeholder) */}
                        <Link to={`/funcionarios/${func.id}`} className="btn btn-sm btn-info text-white">
  <i className="bi bi-eye"></i> Detalhes
</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Funcionarios;