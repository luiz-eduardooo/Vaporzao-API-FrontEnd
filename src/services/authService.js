const CHAVE_TOKEN = 'vaporzao_token'
const CHAVE_USUARIO = 'vaporzao_usuario'

function gerarIniciais(nome) {
  const partes = String(nome).trim().split(/\s+/)
  const ini = (partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')
  return ini.toUpperCase() || 'U'
}

/**
 * Login FAKE (sem validação real).
 * Aceita qualquer matrícula + senha, gera um token simulado e salva tudo
 * no localStorage. Não chama a API.
 * ⚠️ O token gerado aqui NÃO é válido na API real — serve só para o
 *    frontend considerar o usuário "logado". Requisições autenticadas
 *    de verdade (ex.: publicar jogo) ainda dependem de um token real.
 */
export async function login({ matricula, senha }) {
  // ignora a senha de propósito — qualquer coisa loga
  void senha

  const matriculaLimpa = String(matricula || '').trim() || 'convidado'

  const token = `fake-${matriculaLimpa}-${Date.now()}`
  localStorage.setItem(CHAVE_TOKEN, token)

  const usuario = {
    nome: `Matrícula ${matriculaLimpa}`,
    matricula: matriculaLimpa,
    iniciais: gerarIniciais(matriculaLimpa),
    saldo: 0,
    id: null,
  }
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))

  return usuario
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
