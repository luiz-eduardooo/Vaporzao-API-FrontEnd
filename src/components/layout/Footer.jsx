import Logo from './Logo'


function Footer() {
  const links = ['Sobre', 'Suporte', 'Política de privacidade', 'Termos']

  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-4
                 px-8 py-6 border-t border-borda mt-16"
    >
      <div className="flex items-center gap-3">
        <Logo size="small" />
        <span className="text-xs text-texto-secundario">
          © 2026 · feito no Brasil
        </span>
      </div>

      <nav className="flex flex-wrap gap-5">
        {links.map((link) => (
          <button
            key={link}
            className="text-[13px] text-texto-secundario hover:text-texto-primario
                       transition-colors duration-150 cursor-pointer"
          >
            {link}
          </button>
        ))}
      </nav>

      <span className="text-xs text-texto-secundario">
        v0.1.0 · build inicial
      </span>
    </footer>
  )
}

export default Footer