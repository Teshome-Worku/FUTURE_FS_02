"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

// ─── Navigation config ────────────────────────────────────────────────────────

const mainNav = [
  { label: "Dashboard", href: "/dashboard",          icon: FiHome },
  { label: "Leads",     href: "/dashboard/leads",    icon: FiUsers },
  { label: "Add Lead",  href: "/dashboard/new-lead", icon: FiUserPlus },
];

const bottomNav = [
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

//logout
const handleLogout=()=>{
  localStorage.removeItem("token");
  window.location.replace("/login");
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({ item, isActive }) {
  const Icon = item.icon;
  const base    = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150";
  const active  = "bg-gray-800 text-white";
  const inactive = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <li>
      <Link href={item.href} className={`${base} ${isActive ? active : inactive}`}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  // Exact match for /dashboard, prefix match for everything else
  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 h-full flex-shrink-0 flex flex-col bg-gray-900 text-white">

      {/* ── Branding ── */}
      <div className="flex flex-col gap-0.5 border-b border-gray-800 px-6 py-5">
        <span className="text-lg font-bold tracking-tight text-white">
          LeadFlow CRM
        </span>
        <span className="text-[11px] uppercase tracking-widest text-gray-500">
          Admin Panel
        </span>
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </ul>
      </nav>

      {/* ── Bottom: Settings + Logout + Profile ── */}
      <div className="border-t border-gray-800 px-4 py-3 space-y-1">

        {/* Settings */}
        {bottomNav.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isActive={isActive(item.href)}
          />
        ))}

        {/* Logout — UI only */}
        <button
          type="button"
          onClick={handleLogout}
          className="cursor-pointer flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
        >
          <FiLogOut className="h-4 w-4 flex-shrink-0" />
          <span>Logout</span>
        </button>

        {/* Profile card */}
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-[11px] text-gray-400">john@leadflow.io</p>
          </div>
        </div>

      </div>

    </aside>
  );
}
