import axios from 'axios'

function getToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('vaporzao_token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('access_token')
  )
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://alunos-ads-api-production.up.railway.app',
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.token = token
  }

  return config
})

export default api