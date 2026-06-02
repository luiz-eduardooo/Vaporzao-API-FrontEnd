import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Procura o token salvo, aceitando as chaves mais comuns.
// ⚠️ Se o seu login salva com OUTRO nome, adicione-o aqui.
function lerToken() {
  const chaves = ['vaporzao_token', 'token', 'authToken', 'jwt', 'access_token']
  for (const k of chaves) {
    const v = localStorage.getItem(k)
    if (v) return v
  }
  return null
}

api.interceptors.request.use((config) => {
  const token = lerToken()
  if (token) {
    // Manda nos dois formatos — a API usa o que reconhecer e ignora o outro.
    config.headers.token = token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
