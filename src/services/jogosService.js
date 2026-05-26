import api from './api'

export async function getDestaques() {
  const { data } = await api.get('/jogos/destaques')
  return data
}

export async function getJogos(params = {}) {
  const { data } = await api.get('/jogos', { params })
  return data
}

export async function getJogoPorId(id) {
  const { data } = await api.get(`/jogos/${id}`)
  return data
}