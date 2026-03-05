import { Link } from "@inertiajs/react";

export default function QuickLink({ icon, label, href, primary = false }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all
        ${
          primary
            ? "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        }
      `}
    >
      <span className="mr-2 text-lg">{icon}</span>
      {label}
    </Link>
  );
}
