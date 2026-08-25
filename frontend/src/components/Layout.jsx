import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div>
      <Navbar
        isSidebarCollapsed={isSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() =>
          setIsSidebarCollapsed((isCollapsed) => !isCollapsed)
        }
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen((isOpen) => !isOpen)
        }
      />
      <main className={`flex h-[calc(100vh-4rem)]`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        <div className={`min-w-0 flex-1 overflow-y-auto`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
