import { FaFilePdf } from "react-icons/fa";

export default function OrderCard({ order }) {
  const statusStyles = {
    pendente: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "pendente",
      icon: "🕒",
    },
    processamento: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "processamento",
      icon: "⚙️",
    },
    concluida: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "concluída",
      icon: "✓",
    },
  };

  const status = statusStyles[order.status] || statusStyles.pendente;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-gray-900">
                #{order.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${status.bg} ${status.text}`}
              >
                {status.icon} {status.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              <span className="font-medium text-gray-900">
                {order.student_name}
              </span>{" "}
              • {order.school} • {order.year}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">€{order.total}</p>
            <p className="text-xs text-gray-400">{order.date}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
            Manuais:
          </h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0"
              >
                <span>
                  {item.title}{" "}
                  <span className="text-gray-400 text-xs">
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-medium">€{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
        <select
          defaultValue={order.status}
          className="bg-white border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option value="pendente">Pendente</option>
          <option value="processamento">Em Processamento</option>
          <option value="concluida">Concluída</option>
        </select>

        <button className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg text-sm px-4 py-2 transition">
          <FaFilePdf className="text-red-500" />
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
