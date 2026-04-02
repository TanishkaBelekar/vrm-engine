// src/widgets/side-nav/Side-Nav.tsx
import { NavLink } from "react-router-dom";

type Props = {
  userRole?: string;
};

const SideNav = ({ userRole = "admin" }: Props) => {
  return (
    <div className="w-60 bg-gray-800 text-white min-h-screen p-4">
      <div className="flex flex-col gap-3">
        
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 p-2 rounded" : "hover:bg-gray-700 p-2 rounded"
          }
        >
          Dashboard
        </NavLink>

        {userRole === "admin" && (
          <NavLink
            to="/vendors"
            className={({ isActive }) =>
              isActive ? "bg-gray-700 p-2 rounded" : "hover:bg-gray-700 p-2 rounded"
            }
          >
            Vendors
          </NavLink>
        )}

        <NavLink
          to="/assessments"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 p-2 rounded" : "hover:bg-gray-700 p-2 rounded"
          }
        >
          Assessments
        </NavLink>

        {/*  ADD THIS */}
        <NavLink
          to="/evidence"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 p-2 rounded" : "hover:bg-gray-700 p-2 rounded"
          }
        >
          Evidence
        </NavLink>

        {userRole === "admin" && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "bg-gray-700 p-2 rounded" : "hover:bg-gray-700 p-2 rounded"
            }
          >
            Settings
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default SideNav;