import React, { useState } from "react";

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <>
      <div
        className={`fixed z-5 top-0 left-0 max-lg:h-full bg-white border-r transition-all duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:relative lg:translate-x-0 ${
              sidebarCollapsed ? "lg:w-16" : "lg:w-40"
            }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <a href="/">
            <span className="font-bold text-lg truncate">
              {sidebarCollapsed ? "H" : "Home"}
            </span>
          </a>
          <div className="flex gap-2">
            {/* Collapse button (desktop only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:inline text-gray-500 hover:text-black"
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="mt-4 space-y-2 px-2">
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-gray-200 text-sm"
          >
            {sidebarCollapsed ? "📋" : "Dashboard"}
          </a>
        </nav>
      </div>
      <div className="m-4 lg:hidden">
        <div
          className={`fixed inset-0 z-1 bg-black/50 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        {/* Mobile navbar */}
        <div className=" flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-gray-600"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Task Manager</h1>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
