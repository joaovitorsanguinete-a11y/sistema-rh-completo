import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function FuncionarioForm() {
  const [cargos, setCargos] = useState([]); 
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const navigate = useNavigate(); 

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await api.get('/cargos');
        setCargos(response.data);
      } catch (error) {
        setMensagem({ tipo: 'danger', texto: 'Erro ao buscar cargos para o formulário.' });
      }
    };
    fetchCargos();
  }, []); 

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/funcionarios', data);
      console.log('Funcionário salvo:', response.data);
      navigate('/funcionarios', { state: { sucesso: 'Funcionário salvo com sucesso!' } });
    } catch (error) {
      let erroMsg = 'Erro ao salvar funcionário.';
      if (error.response?.data?.message) {
        erroMsg = error.response.data.message;
      }
      setMensagem({ tipo: 'danger', texto: erroMsg });
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">Adicionar Novo Funcionário</h1>
            </div>
            
            <form className="card-body" onSubmit={handleSubmit(onSubmit)} noValidate>
              
              <h2 className="h5">Dados Pessoais</h2>
              <div className="row g-3">
                <div className="col-md-8">
                  <label htmlFor="nome" className="form-label">Nome Completo</label>
                  <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome"
                    {...register("nome", { required: "O nome é obrigatório" })}
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="cpf" className="form-label">CPF</label>
                  <input type="text" className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} id="cpf"
                    {...register("cpf", { 
                      required: "O CPF é obrigatório",
                      pattern: { value: /^\d{11}$/, message: "CPF deve ter 11 números" }
                    })}
                    placeholder="Apenas 11 números"
                  />
                  {errors.cpf && <div className="invalid-feedback">{errors.cpf.message}</div>}
                </div>
                
                <div className="col-md-4">
                  <label htmlFor="data_nascimento" className="form-label">Data de Nascimento</label>
                  <input type="date" className={`form-control ${errors.data_nascimento ? 'is-invalid' : ''}`} id="data_nascimento"
                    {...register("data_nascimento", { required: "Data é obrigatória" })}
                  />
                  {errors.data_nascimento && <div className="invalid-feedback">{errors.data_nascimento.message}</div>}
                </div>
                
                <div className="col-md-4">
                  <label htmlFor="data_admissao" className="form-label">Data de Admissão</label>
                  <input type="date" className={`form-control ${errors.data_admissao ? 'is-invalid' : ''}`} id="data_admissao"
                    {...register("data_admissao", { required: "Data é obrigatória" })}
                  />
                  {errors.data_admissao && <div className="invalid-feedback">{errors.data_admissao.message}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="matricula" className="form-label">Matrícula (Opcional)</label>
                  <input type="text" className="form-control" id="matricula"
                    {...register("matricula")}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h2 className="h5">Atribuição Inicial</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="cargo_id" className="form-label">Cargo</label>
                  <select className={`form-select ${errors.cargo_id ? 'is-invalid' : ''}`} id="cargo_id"
                    {...register("cargo_id", { required: "O cargo é obrigatório" })}
                  >
                    <option value="">Selecione...</option>
                    {cargos.map(cargo => (
                      <option key={cargo.id} value={cargo.id}>{cargo.descricao}</option>
                    ))}
                  </select>
                  {errors.cargo_id && <div className="invalid-feedback">{errors.cargo_id.message}</div>}
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="data_inicio_atribuicao" className="form-label">Início da Atribuição</label>
                  <input type="date" className={`form-control ${errors.data_inicio_atribuicao ? 'is-invalid' : ''}`} id="data_inicio_atribuicao"
                    {...register("data_inicio_atribuicao", { required: "Data é obrigatória" })}
                  />
                  {errors.data_inicio_atribuicao && <div className="invalid-feedback">{errors.data_inicio_atribuicao.message}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="tipo_vinculo" className="form-label">Vínculo</label>
                  <select className={`form-select ${errors.tipo_vinculo ? 'is-invalid' : ''}`} id="tipo_vinculo"
                    {...register("tipo_vinculo", { required: "O vínculo é obrigatório" })}
                  >
                    <option value="">Selecione...</option>
                    <option value="EFETIVO">Efetivo</option>
                    <option value="CONTRATADO">Contratado</option>
                  </select>
                  {errors.tipo_vinculo && <div className="invalid-feedback">{errors.tipo_vinculo.message}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="turno" className="form-label">Turno</label>
                  <select className={`form-select ${errors.turno ? 'is-invalid' : ''}`} id="turno"
                    {...register("turno", { required: "O turno é obrigatório" })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                    <option value="Horário Administrativo">Horário Administrativo</option>
                  </select>
                  {errors.turno && <div className="invalid-feedback">{errors.turno.message}</div>}
                </div>
              </div>

              <hr className="my-4" />
              
              <div className="mb-3">
                <label htmlFor="observacoes" className="form-label">Observações (Opcional)</label>
                <textarea className="form-control" id="observacoes" rows="2"
                  {...register("observacoes")}
                ></textarea>
              </div>

              {mensagem.texto && (
                <div className={`alert alert-${mensagem.tipo} py-2`}>
                  {mensagem.texto}
                </div>
              )}
              
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Salvar Funcionário
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuncionarioForm;