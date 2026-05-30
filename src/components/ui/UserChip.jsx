import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'

// Avatar definido FORA do componente (regra react-hooks/static-components).
function Avatar({ iniciais, size = 30 }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="relative grid place-items-center rounded-full bg-gradient-to-br from-fundo-terciario to-roxo-neon text-white text-[11px] font-display font-bold shrink-0"
    >
      {iniciais}
    </span>
  )
}

function UserChip({
  usuario = { nome: 'Usuário', iniciais: 'U', saldo: 0, matricula: '—' },
  wishlistCount = 0,
  onAcessarBiblioteca = () => {},
  onAcessarWishlist = () => {},
  onAcessarConfiguracoes = () => {},
  onSair = () => {},
}) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fechar = (e) => !ref.current?.contains(e.target) && setAberto(false)
    document.addEventListener('mousedown', fechar)
    return () => document.removeEventListener('mousedown', fechar)
  }, [])

  const saldo = (typeof usuario.saldo === 'number' ? usuario.saldo : 0)
    .toFixed(2).replace('.', ',')

  const fechar = (fn) => () => { setAberto(false); fn() }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAberto((a) => !a)}
        className="inline-flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 bg-fundo-secundario border border-borda rounded-full cursor-pointer transition-all duration-150 hover:bg-fundo-terciario hover:border-roxo-neon/40 whitespace-nowrap"
      >
        <div className="relative">
          <Avatar iniciais={usuario.iniciais} />
          <span className="absolute -right-px -bottom-px w-2.5 h-2.5 rounded-full bg-verde-acido ring-2 ring-fundo-secundario" />
        </div>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[13px] font-display font-semibold text-texto-primario">{usuario.nome}</span>
          <span className="text-[10px] font-mono text-verde-acido mt-1 tracking-wider">R$ {saldo}</span>
        </span>
      </button>

      {aberto && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[240px] bg-fundo-secundario border border-borda rounded-lg p-2 shadow-[0_20px_48px_-16px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2.5 px-2.5 pt-2.5 pb-3 border-b border-borda mb-1.5">
            <Avatar iniciais={usuario.iniciais} />
            <div>
              <div className="text-sm font-display font-semibold text-texto-primario leading-none">{usuario.nome}</div>
              <div className="text-[10px] font-mono text-texto-secundario mt-1 uppercase tracking-widest">matrícula {usuario.matricula}</div>
            </div>
          </div>

          <MenuItem icone="biblioteca" onClick={fechar(onAcessarBiblioteca)}>Biblioteca</MenuItem>
          <MenuItem icone="coracao" onClick={fechar(onAcessarWishlist)} contador={wishlistCount}>Wishlist</MenuItem>
          <Divider />
          <MenuItem icone="configuracoes" onClick={fechar(onAcessarConfiguracoes)}>Configurações</MenuItem>
          <Divider />
          <MenuItem icone="sair" perigo onClick={fechar(onSair)}>Sair</MenuItem>
        </div>
      )}
    </div>
  )
}

const Divider = () => <div className="h-px bg-borda -mx-2 my-1" />
function MenuItem({ icone, children, onClick, perigo = false, contador }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[13px] font-body text-left cursor-pointer transition-colors duration-150 ${perigo ? 'text-erro hover:bg-erro/10' : 'text-texto-primario hover:bg-fundo-terciario'}`}
    >
      <Icon nome={icone} className="w-3.5 h-3.5 opacity-80" />
      <span className="flex-1">{children}</span>
      {contador > 0 && <span className="font-mono text-[11px] text-texto-secundario">{contador}</span>}
    </button>
  )
}

export default UserChip
