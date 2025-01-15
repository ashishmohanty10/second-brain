import { Link } from "react-router-dom";
import { ContainerWrapper } from "../container";
import { useAuthStore } from "../../hooks/authStore";
import { useEffect } from "react";
import axios from "axios";

export function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);
  return (
    <div className="border shadow-sm h-navigation-height rounded-2xl py-2 mt-4">
      <ContainerWrapper className="flex items-center justify-between px-4">
        <Link to="/" className="font-semibold text-4xl">
          Logo
        </Link>
        <div className="">
          {isAuthenticated ? (
            <button
              onClick={async () => {
                console.time("start");
                await axios.post(
                  `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
                  {},
                  { withCredentials: true }
                );
                console.timeEnd("start");
                console.log("loggedOut");
                setTimeout(() => {
                  window.location.reload();
                }, 5 * 1000);
              }}
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <button className="bg-black px-4 py-2 text-white rounded-md text-sm font-semibold">
                  SignIn
                </button>
              </Link>

              <Link to="/signup">
                <button className="bg-black px-4 py-2 text-white rounded-md text-sm font-semibold">
                  SignUp
                </button>
              </Link>
            </div>
          )}
        </div>
      </ContainerWrapper>
    </div>
  );
}
