import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Cargos() {
  const [cargos, setCargos] = useState([]); 
  const [descricao, setDescricao] = useState(""); // Renomeado (era novoCargoDescricao)
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  // Agora vamos USAR estes estados
  const [editId, setEditId] = useState(null); // Guarda o ID do cargo sendo editado

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      const response = await api.get('/cargos');
      setCargos(response.data);
    } catch (error) {
      setMensagem({ tipo: 'danger', texto: 'Erro ao buscar cargos.' });
    }
  };

  const handleInputChange = (event) => {
    setDescricao(event.target.value);
    // Limpa a mensagem de erro/sucesso assim que o usuário começa a digitar
    setMensagem({ tipo: '', texto: '' }); 
  };

  // NOVO: Função para limpar o formulário
  const resetForm = () => {
    setDescricao("");
    setEditId(null);
    setMensagem({ tipo: '', texto: '' });
  };

  // NOVO: Função chamada quando o formulário é enviado (Agora faz Salvar ou Editar)
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (descricao.trim() === "") {
      setMensagem({ tipo: 'warning', texto: 'A descrição não pode estar vazia.' });
      return;
    }

    // Define os dados e a URL da API
    const dados = { descricao: descricao };
    const eEditando = editId !== null;
    const url = eEditando ? `/cargos/${editId}` : '/cargos';
    const metodo = eEditando ? 'put' : 'post'; // PUT para editar, POST para criar

    try {
      // Chama a API (seja POST ou PUT)
      const response = await api[metodo](url, dados);

      if (eEditando) {
        // Se estava editando, atualiza o cargo na lista
        setCargos(cargos.map(cargo => 
          cargo.id === editId ? response.data : cargo
        ));
        setMensagem({ tipo: 'success', texto: 'Cargo atualizado com sucesso!' });
      } else {
        // Se estava criando, adiciona o novo cargo
        setCargos([...cargos, response.data]);
        setMensagem({ tipo: 'success', texto: 'Cargo salvo com sucesso!' });
      }
      
      resetForm(); // Limpa o formulário

    } catch (error) {
      let erroMsg = 'Erro ao salvar cargo.';
      if (error.response?.data?.message) {
        erroMsg = error.response.data.message;
      }
      setMensagem({ tipo: 'danger', texto: erroMsg });
    }
  };

  // NOVO: Função chamada ao clicar em "Editar"
  const handleEdit = (cargo) => {
    setEditId(cargo.id);
    setDescricao(cargo.descricao);
    setMensagem({ tipo: '', texto: '' });
    // Rola a tela de volta para o formulário (útil em telas pequenas)
    window.scrollTo(0, 0); 
  };

  // NOVO: Função chamada ao clicar em "Cancelar" no formulário de edição
  const handleCancelEdit = () => {
    resetForm();
  };

  // Função para Excluir (sem mudanças)
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cargo?')) {
      return;
    }
    try {
      await api.delete(`/cargos/${id}`);
      setCargos(cargos.filter(cargo => cargo.id !== id));
      setMensagem({ tipo: 'success', texto: 'Cargo excluído com sucesso!' });
    } catch (error) {
      let erroMsg = 'Erro ao excluir cargo.';
      if (error.response?.data?.message) {
        erroMsg = error.response.data.message;
      }
      setMensagem({ tipo: 'danger', texto: erroMsg });
    }
  };


  return (
    <div className="container mt-4">
      <div className="row">
        {/* Coluna do Formulário (Esquerda) */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              {/* NOVO: Título dinâmico */}
              <h2 className="h5 mb-0">
                {editId ? 'Editar Cargo' : 'Adicionar Novo Cargo'}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label">
                    Descrição
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="descricao"
                    value={descricao}
                    onChange={handleInputChange}
                    placeholder="Ex: Coordenador(a)"
                  />
                </div>
                
                {mensagem.texto && (
                  <div className={`alert alert-${mensagem.tipo} py-2`}>
                    {mensagem.texto}
                  </div>
                )}

                {/* NOVO: Botões dinâmicos */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editId ? 'Atualizar' : 'Salvar'}
                  </button>
                  {/* Só mostra "Cancelar" se estiver editando */}
                  {editId && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Coluna da Lista (Direita) */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h2 className="h5 mb-0">Cargos Cadastrados ({cargos.length})</h2>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {cargos.length === 0 ? (
                  <li className="list-group-item">Nenhum cargo cadastrado.</li>
                ) : (
                  cargos.map((cargo) => (
                    <li key={cargo.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {cargo.descricao}
                      
                      {/* NOVO: Botão de Editar */}
                      <div>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(cargo)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cargo.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cargos;