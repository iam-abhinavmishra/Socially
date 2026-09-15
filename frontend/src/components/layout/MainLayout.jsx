import { useState } from "react";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      {/* Desktop fixed sidebar + mobile drawer */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>

        <button
          type="button"
          onClick={() => window.location.href = "/home"}
          className="text-2xl font-bold text-blue-600"
        >
          Socially
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          {(() => {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
              return "U";
            }

            try {
              const user = JSON.parse(storedUser);

              return (
                user?.username?.charAt(0)?.toUpperCase() ||
                "U"
              );
            } catch {
              return "U";
            }
          })()}
        </div>
      </header>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen w-full bg-slate-100 pt-16 lg:pt-0">
          <div className="mx-auto min-h-screen max-w-4xl lg:border-x lg:border-slate-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;