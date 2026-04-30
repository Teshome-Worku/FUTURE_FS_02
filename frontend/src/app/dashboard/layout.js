"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { HeaderProvider } from "@/context/HeaderContext";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <HeaderProvider>
      <div className="flex h-screen overflow-hidden bg-gray-950 text-white relative">
        
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={closeSidebar}
          />
        )}

        {/* ── Sidebar ── */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* ── Main content area ── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Fixed header at the top of the main area */}
          <Header onMenuClick={toggleSidebar} />

          {/* Scrollable page content - This is the ONLY scrollable area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>

        </div>
      </div>
    </HeaderProvider>
  );
}
