import { Outlet } from "react-router-dom";
import SideNav from "../side-nav/Side-Nav";
import TopNav from "../top-nav/TopNav";
import { getRole } from "../../shared/lib/auth";

const AppShell = () => {

  const userRole = getRole() || "analyst";

  return (
    <div className="flex min-h-screen">

      <SideNav userRole={userRole} />

      <div className="flex-1 flex flex-col">

        <TopNav userRole={userRole} />

        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AppShell;