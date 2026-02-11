export default function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
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
