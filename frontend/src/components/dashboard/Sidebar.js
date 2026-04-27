"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Leads", href: "/dashboard" },
  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white">
      <div className="border-b border-gray-800 px-6 py-5">
        <h1 className="text-xl font-semibold tracking-tight">LeadFlow CRM</h1>
      </div>

      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-gray-800 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
