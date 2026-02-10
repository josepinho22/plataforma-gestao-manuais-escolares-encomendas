import { Link } from "@inertiajs/react";

export default function FeatureCard({ title, desc, icon, color, href = "#" }) {
  return (
    <Link
      href={href}
      className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-start"
    >
      <div
        className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
