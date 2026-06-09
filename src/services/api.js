import axios from 'axios'

// URL base da API. Usa VITE_API_URL do .env; se não houver, cai no
// servidor local padrão (a Vaporzão API roda em http://localhost:3000).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Lê o token salvo pelo authService.
function lerToken() {
  return localStorage.getItem('vaporzao_token')
}

api.interceptors.request.use((config) => {
  const token = lerToken()
  if (token) {
    // A Vaporzão API espera o token no header `token`.
    config.headers.token = token
  }
  return config
})

export default api
