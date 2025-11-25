import axios from 'axios';

// Define a URL base da nossa API
const API_URL = 'http://127.0.0.1:8000/api';

// Cria uma "instância" do axios já configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// TODO: Adicionar interceptors para lidar com token de login, etc.

export default api;