function Logo({ size = 'default' }) {
  const ehPequeno = size === 'small'

  
  const selo = ehPequeno
    ? 'w-6 h-6 text-xs rounded-md'
    : 'w-[30px] h-[30px] text-base rounded-[7px]'

  const texto = ehPequeno ? 'text-base' : 'text-xl'

  return (
    <div className="flex items-center gap-2.5 select-none">
      <span
        className={`grid place-items-center font-display font-bold text-white
                    bg-gradient-to-br from-roxo-neon to-[#6F18A3]
                    shadow-[0_0_0_1px_rgba(176,38,255,0.45),0_8px_24px_-8px_rgba(176,38,255,0.55)]
                    ${selo}`}
      >
        V
      </span>

      <span className={`font-display font-bold tracking-tight leading-none ${texto}`}>
        VAPOR
        <span className="text-verde-acido [text-shadow:0_0_14px_rgba(159,255,61,0.5)]">
          Z
        </span>
        <span className="text-roxo-neon ml-px">Ã</span>
        O
      </span>
    </div>
  )
}

export default Logo