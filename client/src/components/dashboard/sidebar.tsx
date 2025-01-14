import { Link, useLocation } from "react-router-dom";

const SideBarLink = [
  { id: 1, title: "Dashboard", path: "/dashboard" },
  { id: 3, title: "Settings", path: "/dashboard/settings" },
];

export function SideBar() {
  const location = useLocation();
  return (
    <div className="col-span-1 h-full border-r shadow-md p-4 space-y-4">
      {SideBarLink.map((item) => (
        <div key={item.id}>
          <Link
            to={item.path}
            className={`text-lg font-medium hover:underline duration-100 transition-transform, ${
              location.pathname === item.path ? "underline" : ""
            }`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
