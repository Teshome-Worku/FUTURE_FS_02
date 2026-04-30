import Link from "next/link";
import { FiTarget, FiClock, FiZap, FiArrowRight } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      
      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <FiTarget className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">LeadFlow</span>
        </div>
        <Link 
          href="/login" 
          className="rounded-lg bg-gray-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95"
        >
          Login
        </Link>
      </nav>

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="text-center max-w-4xl mx-auto py-20 px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Enhanced CRM Dashboard
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Manage Your Leads <br className="hidden md:block" /> 
            <span className="text-blue-500">Like a Pro</span>
          </h1>
          
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Track, follow up, and convert leads into real clients — all in one centralized place. 
            Stop losing potential business in messy spreadsheets.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
            >
              Get Started for Free <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              Learn how it works
            </Link>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-20 bg-gray-950 border-y border-gray-800 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">Built for efficient teams</h2>
              <p className="text-gray-400 mt-2">Everything you need to scale your sales process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm transition hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FiTarget className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Track Leads</h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  Easily capture and organize your business inquiries with a clean, centralized interface.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm transition hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-900/30 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <FiClock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Follow Ups</h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  Never miss an opportunity again. Schedule follow-ups and stay on top of every conversation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm transition hover:shadow-xl hover:shadow-green-900/10 hover:-translate-y-1">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-900/30 text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <FiZap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Convert Clients</h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  Move leads through your pipeline and watch your conversion rates soar with intelligent tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-gray-800 bg-gray-950 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <FiTarget className="text-white h-5 w-5" />
            <span className="text-sm font-bold text-white tracking-tight">LeadFlow</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            © 2026 LeadFlow CRM. Built for high-performance sales teams.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 font-medium">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}