"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiList,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

// ─── Nav Section Definitions ────────────────────────────────────────────────

const sections = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: FiHome },
      { label: "Leads",     href: "/dashboard/leads", icon: FiUsers },
    ],
  },
  {
    label: "Leads",
    items: [
      { label: "All Leads", href: "/dashboard/leads", icon: FiList },
      { label: "New Leads", href: "/dashboard/leads", icon: FiUserPlus },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "#", icon: FiSettings },
    ],
  },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({ item, isActive }) {
  const Icon = item.icon;
  const base =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150";
  const active = "bg-gray-800 text-white";
  const idle   = "text-gray-400 hover:bg-gray-800/60 hover:text-white";

  return (
    <li>
      <Link href={item.href} className={`${base} ${isActive ? active : idle}`}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gray-900 text-white">

      {/* ── Branding ── */}
      <div className="flex flex-col gap-0.5 border-b border-gray-800 px-6 py-5">
        <span className="text-lg font-bold tracking-tight text-white">
          LeadFlow CRM
        </span>
        <span className="text-[11px] uppercase tracking-widest text-gray-500">
          Admin Panel
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, sIdx) => (
          <div key={section.label} className={sIdx > 0 ? "mt-6" : ""}>
            {/* Section label */}
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              {section.label}
            </p>

            {/* Items */}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={`${section.label}-${item.label}`}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </ul>

            {/* Subtle divider after each section except last */}
            {sIdx < sections.length - 1 && (
              <div className="mt-6 border-t border-gray-800" />
            )}
          </div>
        ))}

        {/* ── Logout (UI only) ── */}
        <div className="mt-6 border-t border-gray-800 pt-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <FiLogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* ── User Profile Card ── */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-3">
          {/* Avatar placeholder */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-[11px] text-gray-400">
              john@leadflow.io
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
