"use client";

import { useHeader } from "@/context/HeaderContext";
import { FiMenu } from "react-icons/fi";

export default function Header({ onMenuClick }) {
  const { title, subTitle, actionButton } = useHeader();

  return (
    <header className="flex-shrink-0 border-b border-gray-800 bg-gray-950 px-4 md:px-6 py-4 flex items-center justify-between gap-2 md:gap-4 z-10">

      {/* ── Left: Menu Toggle + Page Title ── */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-semibold text-white tracking-tight leading-none truncate">
            {title}
          </h1>
          {subTitle && (
            <p className="text-sm text-gray-400 mt-1 truncate">{subTitle}</p>
          )}
        </div>
      </div>

      {/* ── Right: Action ── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Action button — rendered only when provided */}
        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            {actionButton.label}
          </button>
        )}
      </div>

    </header>
  );
}
