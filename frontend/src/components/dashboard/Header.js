"use client";

import { useHeader } from "@/context/HeaderContext";

export default function Header() {
  const { title, subTitle, actionButton } = useHeader();

  return (
    <header className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between z-10">

      {/* ── Left: Page Title ── */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
          {title}
        </h1>
        {subTitle && (
          <p className="text-xs text-gray-500 mt-1">{subTitle}</p>
        )}
      </div>

      {/* ── Right: Search + Action ── */}
      <div className="flex items-center gap-3">

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
