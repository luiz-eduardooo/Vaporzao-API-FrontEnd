import { useAuth } from '../context/authShared'

function Avatar({ iniciais }) {
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fundo-terciario to-roxo-neon grid place-items-center text-white text-3xl font-display font-bold shadow-[0_0_30px_rgba(176,38,255,0.4)]">
      {iniciais}
    </div>
  )
}

function InfoCard({ label, valor }) {
  return (
    <div className="bg-fundo-secundario border border-borda rounded-lg p-4">
      <p className="text-texto-secundario text-xs mb-1">{label}</p>
      <p className="text-texto-primario font-semibold">{valor}</p>
    </div>
  )
}

export default function Perfil() {
  const { usuario, logado } = useAuth()

  if (!logado || !usuario) {
    return (
      <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
        <div className="max-w-2xl mx-auto px-8 py-20 text-center">
          <p className="text-texto-secundario text-lg">Você não está logado.</p>
          <p className="text-texto-secundario text-sm mt-1">Entre com sua matrícula para ver seu perfil.</p>
        </div>
      </main>
    )
  }

  const saldo = Number(usuario.saldo ?? 0).toFixed(2).replace('.', ',')

  return (
    <main className="min-h-screen bg-[#0B0014] text-[#F2EAFF]">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <span className="block text-xs font-bold tracking-[0.3em] text-roxo-neon mb-1">// MINHA CONTA</span>
        <h1 className="font-display text-3xl font-bold text-texto-primario mb-8">Perfil</h1>

        <div className="flex items-center gap-6 mb-10">
          <Avatar iniciais={usuario.iniciais} />
          <div>
            <h2 className="font-display text-2xl font-bold text-texto-primario">{usuario.nome}</h2>
            <p className="text-texto-secundario text-sm mt-1">Matrícula {usuario.matricula}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard label="Nome" valor={usuario.nome} />
          <InfoCard label="Matrícula" valor={usuario.matricula} />
          <InfoCard label="Saldo" valor={`R$ ${saldo}`} />
        </div>
      </div>
    </main>
  )
}
