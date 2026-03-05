import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ResultPopup({
  open,
  type = "success", 
  title,
  message,
  onClose,
}) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        
        
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <FaCheckCircle className="text-green-600 text-6xl" />
          ) : (
            <FaTimesCircle className="text-red-600 text-6xl" />
          )}
        </div>

        
        <h2 className="text-xl font-black text-gray-900 mb-2">
          {title || (isSuccess ? "Sucesso" : "Erro")}
        </h2>

        
        {message && (
          <p className="text-sm text-gray-600 mb-6">{message}</p>
        )}

        
        <button
          onClick={onClose}
          className={`
            w-full py-2.5 rounded-xl font-bold text-sm text-white
            ${isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"}
          `}
        >
          OK
        </button>
      </div>
    </div>
  );
}