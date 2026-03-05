export default function StatCard({ label, value, icon, iconClass }) {
  return (
    <div className="card-3d rounded-2xl p-5 flex items-center justify-between animate-card-in">
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-4xl font-black text-gray-900 mt-2">{value}</div>
      </div>
      <div className={`text-2xl ${iconClass}`}>{icon}</div>
    </div>
  );
}
