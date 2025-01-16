import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const SideBarLink = [
  { id: 1, title: "All Posts", path: "/allPosts" },
  { id: 1, title: "Dashboard", path: "/allPosts/dashboard" },
  { id: 2, title: "Settings", path: "/allPosts/settings" },
];

export function SideBar() {
  const location = useLocation();
  return (
    <div className="col-span-1 border p-5 h-screen rounded-2xl flex-1">
      <div className="flex flex-col gap-y-5">
        {SideBarLink.map((item) => (
          <Link to={item.path} key={item.id}>
            <button
              key={item.id}
              className={cn(
                "w-full bg-gray-200 rounded-md text-center text-sm font-semibold hover:bg-gray-500 hover:text-white transition-colors py-2 cur",
                location.pathname === item.path &&
                  "bg-gray-500 text-white transition-colors"
              )}
            >
              {item.title}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
