
function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <span
        className="grid place-items-center w-[30px] h-[30px] rounded-[7px]
                   bg-gradient-to-br from-roxo-neon to-[#6F18A3]
                   font-display font-bold text-base text-white
                   shadow-[0_0_0_1px_rgba(176,38,255,0.45),0_8px_24px_-8px_rgba(176,38,255,0.55)]"
      >
        V
      </span>

      <span className="font-display font-bold text-xl tracking-tight leading-none">
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