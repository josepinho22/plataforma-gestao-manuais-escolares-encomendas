export default function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      {icon}
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
  );
}
