/**
 * Alerta — mensagem de sucesso ou erro.
 * Props: tipo ('sucesso' | 'erro'), children (texto).
 */
function Alerta({ tipo = 'erro', children }) {
  if (!children) return null

  const estilos = {
    sucesso: 'bg-verde-acido/10 border-verde-acido text-verde-acido',
    erro: 'bg-erro/10 border-erro text-erro',
  }

  return (
    <div className={`mb-6 px-4 py-3 rounded-lg border text-sm ${estilos[tipo]}`}>
      {children}
    </div>
  )
}

export default Alerta
