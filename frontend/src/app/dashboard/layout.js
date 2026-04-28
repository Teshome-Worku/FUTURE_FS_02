import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { HeaderProvider } from "@/context/HeaderContext";

export default function DashboardLayout({ children }) {
  return (
    <HeaderProvider>
      <div className="flex min-h-screen bg-gray-100">

        {/* ── Fixed sidebar ── */}
        <Sidebar />

        {/* ── Main content area (offset by sidebar width) ── */}
        <div className="ml-64 flex flex-1 flex-col overflow-x-hidden">

          {/* Sticky header — stays at top while content scrolls */}
          <Header />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>

        </div>
      </div>
    </HeaderProvider>
  );
}
