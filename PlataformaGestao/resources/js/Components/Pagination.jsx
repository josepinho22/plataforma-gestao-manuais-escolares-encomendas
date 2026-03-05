import React from "react";
import { router } from "@inertiajs/react";

export default function Pagination({ items, params = {} }) {
  if (!items?.links || items.links.length <= 3) return null;

  return (
    <div className="flex justify-center">
      <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
        {items.links.map((link, index) => (
          <button
            key={index}
            onClick={() => {
              if (link.url) {
                router.get(link.url, params, {
                  preserveState: true,
                  preserveScroll: true,
                });
              }
            }}
            disabled={!link.url}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              link.active
                ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : link.url
                  ? "text-gray-500 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
  );
}
