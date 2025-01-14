import { Link } from "react-router-dom";
import { ContainerWrapper } from "../container";

export function Navbar() {
  return (
    <div className="col-span-3 border shadow-md h-fit">
      <ContainerWrapper>
        <div className="py-6 px-4  flex items-center w-full justify-between rounded-2xl">
          <Link to="/" className="font-semibold text-4xl ">
            Logo
          </Link>

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
        </div>
      </ContainerWrapper>
    </div>
  );
}
