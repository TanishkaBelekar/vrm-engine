import { useNavigate } from "react-router-dom";
import { clearSession } from "../../shared/lib/auth";
import { useNotifications } from "../../entities/notification/useNotifications";

type Props = {
  userRole: string;
};

const TopNav = ({ userRole }: Props) => {
  const navigate = useNavigate();

  const { data, isLoading } = useNotifications();

  const unreadCount = data?.unread ?? 0;

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="h-20 bg-white border-b flex items-center justify-between px-6">
      
      <div>
        <h1 className="font-semibold text-lg">Vendor Risk Management</h1>
        <p className="text-gray-500">
          Executive Dashboard Overview
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notifications")}
        >
          <span className="text-xl">🔔</span>

          {!isLoading && unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <span className="text-sm text-gray-600">
          Role: {userRole}
        </span>

        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default TopNav;