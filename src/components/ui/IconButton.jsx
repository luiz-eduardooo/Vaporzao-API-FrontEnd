import Icon from './Icon'

const CORES_BADGE = {
  'roxo-neon': 'bg-roxo-neon text-white',
  'verde-acido': 'bg-verde-acido text-fundo-primario',
}

export function IconButton({ icone, rotulo, onClick, badge, corBadge = 'roxo-neon' }) {
  return (
    <button
      onClick={onClick}
      aria-label={rotulo}
      className="relative w-[38px] h-[38px] grid place-items-center rounded-md text-texto-secundario border border-transparent cursor-pointer transition-all duration-150 hover:text-texto-primario hover:bg-fundo-terciario hover:border-borda"
    >
      <Icon nome={icone} className="w-[18px] h-[18px]" />
      {badge > 0 && (
        <span className={`absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 grid place-items-center rounded-full ring-2 ring-fundo-primario text-[9px] font-display font-bold leading-none ${CORES_BADGE[corBadge]}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

export default IconButton
