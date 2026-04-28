import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { HeaderProvider } from "@/context/HeaderContext";

export default function DashboardLayout({ children }) {
  return (
    <HeaderProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">

        {/* ── Sidebar (Fixed via parent flex flow) ── */}
        <Sidebar />

        {/* ── Main content area ── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Fixed header at the top of the main area */}
          <Header />

          {/* Scrollable page content - This is the ONLY scrollable area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>

        </div>
      </div>
    </HeaderProvider>
  );
}
