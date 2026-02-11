export default function StatCard({ label, value, icon, iconClass }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-gray-600">{label}</div>
        <div className="text-4xl font-black text-gray-900 mt-2">{value}</div>
      </div>
      <div className={`text-2xl ${iconClass}`}>{icon}</div>
    </div>
  );
}
