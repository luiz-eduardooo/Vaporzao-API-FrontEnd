import { useState } from 'react'
import { criarJogo } from '../services/jogosService'

const ESTADO_INICIAL = {
  titulo: '',
  descricao: '',
  desenvolvedora: '',
  preco: '',
  capaUrl: '',
  lancamento: '',
  generosIds: [],
}

/**
 * useFormularioJogo — concentra estado, validação e envio do formulário.
 * Retorna o necessário para a página apenas montar a UI.
 */
export function useFormularioJogo(onCriado) {
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function alternarGenero(id) {
    setForm((f) => ({
      ...f,
      generosIds: f.generosIds.includes(id)
        ? f.generosIds.filter((g) => g !== id)
        : [...f.generosIds, id],
    }))
  }

  function validar() {
    if (!form.titulo.trim()) return 'Informe o título do jogo.'
    if (!form.desenvolvedora.trim()) return 'Informe a desenvolvedora.'
    if (form.preco === '' || Number(form.preco) < 0)
      return 'Informe um preço válido (use 0 para grátis).'
    if (!form.lancamento) return 'Informe a data de lançamento.'
    return null
  }

  function montarPayload() {
    const lancamentoISO = new Date(form.lancamento + 'T00:00:00Z').toISOString()
    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      desenvolvedora: form.desenvolvedora.trim(),
      preco: Number(form.preco),
      capaUrl: form.capaUrl.trim() || null,
      lancamento: lancamentoISO,
    }
    if (form.generosIds.length > 0) {
      payload.generos = form.generosIds
    }
    return payload
  }

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setSucesso(false)

    const erroValidacao = validar()
    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    const payload = montarPayload()

    try {
      setEnviando(true)
      const criado = await criarJogo(payload)
      setSucesso(true)
      setForm(ESTADO_INICIAL)
      if (onCriado) onCriado(criado)
    } catch (err) {
      const status = err?.response?.status
      const dados = err?.response?.data
      const msgApi =
        dados?.erro ?? dados?.message ?? dados?.error ?? dados?.mensagem ??
        (typeof dados === 'string' ? dados : null)

      // logs de diagnóstico (úteis enquanto a API rejeita o payload)
      console.error('[CriarJogo] status:', status, '| resposta:', JSON.stringify(dados, null, 2))
      if (dados?.problemas) {
        console.error('[CriarJogo] PROBLEMAS:', JSON.stringify(dados.problemas, null, 2))
      }
      console.error('[CriarJogo] payload enviado:', JSON.stringify(payload, null, 2))

      if (status === 401 || status === 403) {
        setErro(msgApi ?? 'Você precisa estar logado para criar um jogo.')
      } else {
        setErro(
          msgApi
            ? `Erro da API: ${msgApi}`
            : `Não foi possível criar (status ${status ?? '?'}). Veja o Console (F12).`
        )
      }
    } finally {
      setEnviando(false)
    }
  }

  return { form, enviando, erro, sucesso, atualizar, alternarGenero, enviar }
}
