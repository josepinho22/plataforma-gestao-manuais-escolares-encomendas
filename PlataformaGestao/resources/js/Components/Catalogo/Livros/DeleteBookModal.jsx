import React from "react";
import { router } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

export default function DeleteBookModal({ open, onClose, book }) {
  if (!open || !book) return null;

  const remove = () => {
    router.delete(route("catalogo.livros.destroy", book.id), {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  };

  return (
    <ModalShell title="Remover Livro" onClose={onClose} size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Tens a certeza que queres remover o livro:
        </p>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <div className="font-black text-gray-900">{book.titulo}</div>
          <div className="text-sm text-gray-500">{book.isbn}</div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={remove}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black"
          >
            Apagar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}