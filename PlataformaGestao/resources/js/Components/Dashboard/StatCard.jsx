import { Link } from "@inertiajs/react";
import { FaArrowRight } from "react-icons/fa";

export default function StatCard({ stat }) {
  return (
    <div
      className={`p-5 rounded-xl border ${stat.color} transition-all duration-200 hover:shadow-md flex flex-col justify-between h-36 relative overflow-hidden`}
    >
      <div className="absolute -right-4 -top-4 opacity-10 text-6xl">
        {stat.icon}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1 opacity-90">
          {stat.icon}
          <span className="text-xs font-bold uppercase tracking-wide">
            {stat.label}
          </span>
        </div>
        <span className="text-4xl font-black tracking-tight">{stat.value}</span>
      </div>

      <Link
        href={stat.href}
        className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-center flex items-center justify-center gap-2 transition-colors ${stat.btnColor}`}
      >
        Ver Detalhes <FaArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
