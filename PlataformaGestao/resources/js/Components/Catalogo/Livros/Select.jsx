export default function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 appearance-none"
    >
      <option value="">{placeholder}</option>
      {(options || []).map((o) => (
        <option key={o.id ?? o.value} value={o.id ?? o.value}>
          {o.nome ?? o.label ?? o.ano}
        </option>
      ))}
    </select>
  );
}
