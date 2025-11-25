import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function FuncionarioDetalhes() {
  const { id } = useParams();
  const [funcionario, setFuncionario] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('atribuicoes');
  
  // Estados para Nova Atribuição
  const [exibirFormAtribuicao, setExibirFormAtribuicao] = useState(false);
  const [novaAtribuicao, setNovaAtribuicao] = useState({
    cargo_id: '', tipo_vinculo: 'CONTRATADO', turno: 'Manhã', data_inicio_atribuicao: '', principal: false
  });

  // Estados para Novo Documento
  const [exibirFormDocumento, setExibirFormDocumento] = useState(false);
  const [novoDocumento, setNovoDocumento] = useState({ titulo: '', categoria: 'Contrato', arquivo: null });

  const carregarDados = useCallback(async () => {
    try {
      const response = await api.get(`/funcionarios/${id}`);
      setFuncionario(response.data);
      setLoading(false);
    } catch (error) {
      alert('Erro ao carregar dados.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarDados();
    api.get('/cargos').then(res => setCargos(res.data));
  }, [carregarDados]);

  // --- AÇÕES DE ATRIBUIÇÃO ---
  const handleSalvarAtribuicao = async (e) => {
    e.preventDefault();
    try {
      await api.post('/atribuicoes', { ...novaAtribuicao, funcionario_id: id });
      alert('Atribuição salva!');
      setExibirFormAtribuicao(false);
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar atribuição.');
    }
  };

  const handleExcluirAtribuicao = async (id) => {
    if (window.confirm('Excluir esta atribuição?')) {
      try { await api.delete(`/atribuicoes/${id}`); carregarDados(); } catch (e) { alert('Erro ao excluir.'); }
    }
  };

  // --- AÇÕES DE DOCUMENTO (NOVO!) ---
  const handleSalvarDocumento = async (e) => {
    e.preventDefault();
    
    if (!novoDocumento.arquivo) {
      alert("Selecione um arquivo!");
      return;
    }

    // Para enviar arquivos, usamos FormData, não JSON comum
    const formData = new FormData();
    formData.append('funcionario_id', id);
    formData.append('titulo', novoDocumento.titulo);
    formData.append('categoria', novoDocumento.categoria);
    formData.append('arquivo', novoDocumento.arquivo);

    try {
      await api.post('/documentos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Documento enviado!');
      setExibirFormDocumento(false);
      setNovoDocumento({ titulo: '', categoria: 'Contrato', arquivo: null });
      carregarDados();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar documento.');
    }
  };

  const handleExcluirDocumento = async (docId) => {
    if (window.confirm('Apagar este documento permanentemente?')) {
      try { await api.delete(`/documentos/${docId}`); carregarDados(); } catch (e) { alert('Erro ao apagar.'); }
    }
  };

  if (loading) return <div className="container mt-4">Carregando...</div>;
  if (!funcionario) return <div className="container mt-4">Funcionário não encontrado.</div>;

  return (
    <div className="container mt-4 mb-5">
      {/* Cabeçalho */}
      <div className="card shadow-sm mb-4 border-start border-5 border-primary">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-1">{funcionario.nome}</h1>
            <span className="badge bg-primary me-2">Matrícula: {funcionario.matricula || 'N/A'}</span>
            <span className={`badge ${funcionario.ativo ? 'bg-success' : 'bg-secondary'}`}>{funcionario.ativo ? 'ATIVO' : 'INATIVO'}</span>
          </div>
          <Link to="/funcionarios" className="btn btn-outline-secondary">Voltar</Link>
        </div>
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${abaAtiva === 'dados' ? 'active' : ''}`} onClick={() => setAbaAtiva('dados')}>Dados Pessoais</button></li>
        <li className="nav-item"><button className={`nav-link ${abaAtiva === 'atribuicoes' ? 'active' : ''}`} onClick={() => setAbaAtiva('atribuicoes')}>Atribuições ({funcionario.atribuicoes.length})</button></li>
        <li className="nav-item"><button className={`nav-link ${abaAtiva === 'documentos' ? 'active' : ''}`} onClick={() => setAbaAtiva('documentos')}>Documentos ({funcionario.documentos.length})</button></li>
      </ul>

      <div className="card shadow-sm">
        <div className="card-body">
          
          {/* ABA DADOS */}
          {abaAtiva === 'dados' && (
            <div className="row">
              <div className="col-md-6 mb-3"><strong>CPF:</strong> {funcionario.cpf}</div>
              <div className="col-md-6 mb-3"><strong>Nascimento:</strong> {new Date(funcionario.data_nascimento).toLocaleDateString('pt-BR')}</div>
              <div className="col-12 bg-light p-3 rounded"><strong>Observações:</strong> <p className="mb-0">{funcionario.observacoes || 'Nenhuma.'}</p></div>
            </div>
          )}

          {/* ABA ATRIBUIÇÕES */}
          {abaAtiva === 'atribuicoes' && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="card-title">Cargos e Vínculos</h5>
                {!exibirFormAtribuicao && <button className="btn btn-sm btn-primary" onClick={() => setExibirFormAtribuicao(true)}>+ Nova Atribuição</button>}
              </div>

              {exibirFormAtribuicao && (
                <form onSubmit={handleSalvarAtribuicao} className="card p-3 mb-3 bg-light border-primary">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <select className="form-select form-select-sm" required onChange={e => setNovaAtribuicao({...novaAtribuicao, cargo_id: e.target.value})}>
                        <option value="">Selecione o Cargo...</option>
                        {cargos.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select className="form-select form-select-sm" onChange={e => setNovaAtribuicao({...novaAtribuicao, tipo_vinculo: e.target.value})}>
                        <option value="CONTRATADO">Contratado</option>
                        <option value="EFETIVO">Efetivo</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input type="date" className="form-control form-control-sm" required onChange={e => setNovaAtribuicao({...novaAtribuicao, data_inicio_atribuicao: e.target.value})} />
                    </div>
                    <div className="col-md-2 d-grid"><button className="btn btn-sm btn-success">Salvar</button></div>
                  </div>
                </form>
              )}

              <table className="table table-bordered">
                <thead className="table-light"><tr><th>Cargo</th><th>Vínculo</th><th>Início</th><th>Ações</th></tr></thead>
                <tbody>
                  {funcionario.atribuicoes.map(atr => (
                    <tr key={atr.id}>
                      <td>{atr.cargo?.descricao} {atr.principal && '⭐'}</td>
                      <td>{atr.tipo_vinculo}</td>
                      <td>{new Date(atr.data_inicio_atribuicao).toLocaleDateString('pt-BR')}</td>
                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluirAtribuicao(atr.id)}>Excluir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ABA DOCUMENTOS */}
          {abaAtiva === 'documentos' && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="card-title">Arquivo Digital</h5>
                {!exibirFormDocumento && <button className="btn btn-sm btn-primary" onClick={() => setExibirFormDocumento(true)}>⬆️ Enviar Documento</button>}
              </div>

              {exibirFormDocumento && (
                <form onSubmit={handleSalvarDocumento} className="card p-3 mb-3 bg-light border-info">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" placeholder="Título (ex: Contrato 2024)" required 
                        onChange={e => setNovoDocumento({...novoDocumento, titulo: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <select className="form-select form-select-sm" onChange={e => setNovoDocumento({...novoDocumento, categoria: e.target.value})}>
                        <option>Contrato</option>
                        <option>Atestado Médico</option>
                        <option>Documento Pessoal</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input type="file" className="form-control form-control-sm" required 
                        onChange={e => setNovoDocumento({...novoDocumento, arquivo: e.target.files[0]})} />
                    </div>
                    <div className="col-md-2 d-grid"><button className="btn btn-sm btn-success">Enviar</button></div>
                  </div>
                </form>
              )}

              {funcionario.documentos.length === 0 ? <p className="text-muted text-center">Nenhum documento arquivado.</p> : (
                <ul className="list-group">
                  {funcionario.documentos.map(doc => (
                    <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-earmark-text fs-4 me-3 text-secondary"></i>
                        <div>
                          <strong>{doc.titulo}</strong> <span className="badge bg-light text-dark border">{doc.categoria}</span>
                          <br/><small className="text-muted">
                            <a href={`http://127.0.0.1:8000/storage/${doc.caminho_arquivo.replace('public/', '')}`} target="_blank" rel="noreferrer">
                              Ver Arquivo
                            </a> • {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluirDocumento(doc.id)}>Apagar</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default FuncionarioDetalhes;