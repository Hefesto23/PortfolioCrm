// src/components/layout/DefaultLayout.tsx
import { useAuthContext } from "@/contexts/AuthContext";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function DefaultLayout() {
  const { user } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar com animação suave */}
      <Transition
        show={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
          {/* ... conteúdo do navbar ... */}
        </nav>
      </Transition>

      {/* Layout principal com sidebar retrátil */}
      <div className="flex pt-16">
        <Transition
          show={isSidebarOpen}
          enter="transition-all duration-300"
          enterFrom="-ml-64"
          enterTo="ml-0"
          leave="transition-all duration-300"
          leaveFrom="ml-0"
          leaveTo="-ml-64"
        >
          <aside className="fixed left-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
            {/* ... conteúdo da sidebar ... */}
          </aside>
        </Transition>

        <main className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
