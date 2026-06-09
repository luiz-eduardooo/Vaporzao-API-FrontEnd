import api from './api'

const CHAVE_TOKEN = 'vaporzao_token'
const CHAVE_USUARIO = 'vaporzao_usuario'

function gerarIniciais(nome) {
  const partes = String(nome).trim().split(/\s+/)
  const ini = (partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')
  return ini.toUpperCase() || 'U'
}

/**
 * Normaliza a resposta da API num objeto de usuário que o frontend entende.
 * Aceita as variações de nome de campo mais comuns para não quebrar caso a
 * API use 'name' em vez de 'nome', etc.
 */
function normalizarUsuario(dados, matriculaFallback) {
  const u = dados?.usuario ?? dados?.user ?? dados ?? {}
  const nome = u.nome ?? u.name ?? `Matrícula ${matriculaFallback}`
  const matricula = u.matricula ?? u.registration ?? matriculaFallback
  return {
    id: u.id ?? u._id ?? null,
    nome,
    matricula,
    iniciais: gerarIniciais(nome),
    saldo: Number(u.saldo ?? u.balance ?? 0),
  }
}

/** Extrai o token da resposta, aceitando os nomes de campo mais comuns. */
function extrairToken(dados) {
  return dados?.token ?? dados?.accessToken ?? dados?.jwt ?? dados?.access_token ?? null
}

function salvarSessao(token, usuario) {
  if (token) localStorage.setItem(CHAVE_TOKEN, token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
}

/**
 * Login real contra a Vaporzão API.
 *   POST /auth/login  { matricula, senha }  ->  { token, usuario }
 * O token é salvo no localStorage e enviado no header `token` pelo interceptor
 * (ver services/api.js).
 */
export async function login({ matricula, senha }) {
  const { data } = await api.post('/auth/login', { matricula, senha })
  const token = extrairToken(data)
  const usuario = normalizarUsuario(data, matricula)
  salvarSessao(token, usuario)
  return usuario
}

/**
 * Primeiro acesso do aluno — define a senha inicial.
 *   POST /auth/primeiro-acesso  { matricula, senha }
 * Em geral já retorna o token (loga direto); se não retornar, faz o login
 * em seguida com as mesmas credenciais.
 */
export async function primeiroAcesso({ matricula, senha }) {
  const { data } = await api.post('/auth/primeiro-acesso', { matricula, senha })
  const token = extrairToken(data)
  if (token) {
    const usuario = normalizarUsuario(data, matricula)
    salvarSessao(token, usuario)
    return usuario
  }
  // a API não devolveu token no primeiro acesso: loga na sequência
  return login({ matricula, senha })
}

export function logout() {
  localStorage.removeItem(CHAVE_TOKEN)
  localStorage.removeItem(CHAVE_USUARIO)
}

export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function estaLogado() {
  return !!getToken()
}

export function getUsuarioSalvo() {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}
