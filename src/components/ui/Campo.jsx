/**
 * Campo — input ou textarea com label, no estilo do projeto.
 *
 * Props:
 *   - label, value, onChange (recebe o valor já extraído)
 *   - type: 'text' | 'number' | 'date' (default 'text')
 *   - textarea: boolean
 *   - obrigatorio: marca o label com *
 *   - ...resto: placeholder, maxLength, step, min, etc.
 */
const baseInput =
  'w-full px-4 py-2.5 rounded-lg bg-fundo-secundario border border-borda ' +
  'text-texto-primario placeholder:text-texto-secundario ' +
  'outline-none transition focus:border-roxo-neon ' +
  'focus:shadow-[0_0_0_3px_rgba(176,38,255,0.2)]'

const baseLabel =
  'block mb-1.5 text-sm font-display font-semibold text-texto-primario'

function Campo({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  obrigatorio = false,
  ...resto
}) {
  const handle = (e) => onChange(e.target.value)

  return (
    <div>
      <label className={baseLabel}>
        {label} {obrigatorio && '*'}
      </label>
      {textarea ? (
        <textarea
          className={`${baseInput} resize-y min-h-[110px]`}
          value={value}
          onChange={handle}
          {...resto}
        />
      ) : (
        <input
          type={type}
          className={baseInput}
          value={value}
          onChange={handle}
          {...resto}
        />
      )}
    </div>
  )
}

export default Campo
