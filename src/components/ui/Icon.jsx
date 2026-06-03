function renderConteudo(nome) {
  switch (nome) {
    case 'busca':
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      )
    case 'carrinho':
      return (
        <>
          <path d="M3 4h2l2.4 11.3a2 2 0 0 0 2 1.7H18a2 2 0 0 0 2-1.6L21.5 8H7" />
          <circle cx="10" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
        </>
      )
    case 'sino':
      return (
        <>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </>
      )
    case 'coracao':
      return (
        <path d="M20.8 6.6a5.5 5.5 0 0 0-9-1.8l-.3.3-.4-.3a5.5 5.5 0 0 0-9 1.8c-2.2 5.7 5.4 11.3 9 13.2 0 0 .2.1.4.1s.3-.1.4-.1c3.6-1.9 11.2-7.5 9-13.2Z" />
      )
    case 'biblioteca':
      return (
        <>
          <rect x="3" y="3" width="6" height="18" rx="1.5" />
          <rect x="11" y="3" width="6" height="18" rx="1.5" />
          <path d="M19 7l3 1-3 12-3-1z" />
        </>
      )
    case 'configuracoes':
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.5 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.3 2.6a7 7 0 0 0-2.1 1.2l-2.5-1-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.5-1a7 7 0 0 0 2.1 1.2L10 21h4l.3-2.6a7 7 0 0 0 2.1-1.2l2.5 1 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z" />
        </>
      )
    case 'sair':
      return (
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </>
      )
    case 'controle':
      return (
        <>
          <path d="M6 11h4M8 9v4" />
          <circle cx="15.5" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
          <path d="M17 5H7a5 5 0 0 0-5 5v.5a6.5 6.5 0 0 0 1.6 4.3c1 1.1 2.6 1 3.4-.2L8 13h8l.9 1.6c.8 1.2 2.4 1.3 3.4.2A6.5 6.5 0 0 0 22 10.5V10a5 5 0 0 0-5-5Z" />
        </>
      )
    default:
      return null
  }
}

function Icon({ nome, className = 'w-4 h-4', preenchido = false }) {
  const conteudo = renderConteudo(nome)
  if (!conteudo) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={preenchido ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {conteudo}
    </svg>
  )
}

export default Icon