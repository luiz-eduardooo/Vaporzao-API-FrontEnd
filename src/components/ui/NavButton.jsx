function NavButton({ children, ativo = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-md
                  font-display font-medium text-[13px] cursor-pointer
                  transition-all duration-150
                  ${
                    ativo
                      ? 'text-white'
                      : 'text-texto-secundario hover:text-texto-primario hover:bg-fundo-terciario'
                  }`}
    >
      {children}
    
      {ativo && (
        <span
          className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-sm
                     bg-roxo-neon shadow-[0_0_10px_rgba(176,38,255,0.7)]"
        />
      )}
    </button>
  )
}

export default NavButton