import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:underline">
        Dashboard
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <span key={to}>
            {" / "}
            <Link to={to} className="hover:underline capitalize">
              {value}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;