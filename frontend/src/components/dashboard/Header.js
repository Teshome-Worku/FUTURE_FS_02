"use client";

import { useHeader } from "@/context/HeaderContext";
import { FiSearch } from "react-icons/fi";

export default function Header() {
  const { title, showSearch, actionButton } = useHeader();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

      {/* ── Left: Page Title ── */}
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>

      {/* ── Right: Search + Action ── */}
      <div className="flex items-center gap-3">

        {/* Search input — rendered only when showSearch is true */}
        {showSearch && (
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        )}

        {/* Action button — rendered only when provided */}
        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
          >
            {actionButton.label}
          </button>
        )}
      </div>

    </header>
  );
}
