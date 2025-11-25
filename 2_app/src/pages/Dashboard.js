import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get('/dashboard-stats');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="container mt-5 text-center">Carregando estatísticas...</div>;
  if (!stats) return <div className="container mt-5 text-center">Erro ao conectar com o servidor.</div>;

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-4 text-gray-800">Visão Geral</h1>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="row">
        {/* Card Total */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2 border-primary border-3 border-start border-0">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total de Funcionários</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_funcionarios}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-people-fill fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Ativos */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-success border-3 border-start border-0">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Funcionários Ativos</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.ativos}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-person-check-fill fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Cargos */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-info border-3 border-start border-0">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Cargos Cadastrados</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_cargos}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-briefcase-fill fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE RECENTES */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Últimas Contratações</h6>
          <Link to="/funcionarios/novo" className="btn btn-sm btn-primary">Novo Cadastro</Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Cargo Inicial</th>
                  <th>Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentes.map(func => (
                  <tr key={func.id}>
                    <td>{func.nome}</td>
                    <td>{func.cpf}</td>
                    <td>{func.atribuicoes[0]?.cargo?.descricao || '-'}</td>
                    <td>{new Date(func.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
                {stats.recentes.length === 0 && (
                  <tr><td colSpan="4" className="text-center">Nenhum registro recente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-center">
            <Link to="/funcionarios" className="text-decoration-none">Ver todos os funcionários &rarr;</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;