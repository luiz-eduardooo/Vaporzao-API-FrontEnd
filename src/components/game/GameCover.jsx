import { useState } from 'react'


function GameCover({ url, titulo }) {

  const [erro, setErro] = useState(false)

  const mostrarFallback = !url || erro

  if (mostrarFallback) {
    return (
      <div className="w-full h-full grid place-items-center bg-fundo-terciario">
    
        <svg viewBox="0 0 240 360" className="w-full h-full">
          <rect width="240" height="360" fill="#1F0F38" />
          <g transform="translate(120 150)" opacity="0.6">
            <rect
              x="-44" y="-28" width="88" height="56" rx="10"
              fill="none" stroke="#B026FF" strokeWidth="1.6"
            />
            <circle cx="-22" cy="0" r="9" fill="none" stroke="#B026FF" strokeWidth="1.4" />
            <circle cx="22" cy="0" r="9" fill="none" stroke="#9FFF3D" strokeWidth="1.4" />
          </g>
          <text
            x="120" y="250" textAnchor="middle"
            fill="#6B5F82" fontSize="14" fontFamily="Space Grotesk, sans-serif"
          >
            VAPORZÃO
          </text>
        </svg>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={`Capa do jogo ${titulo}`}
      onError={() => setErro(true)}
      className="w-full h-full object-cover"
    />
  )
}

export default GameCover