import { Outlet } from "react-router-dom";
import { Navbar } from "../dashboard/navbar";
import { SideBar } from "../dashboard/sidebar";
import { ContainerWrapper } from "../container";

export function DashboardLayout() {
  return (
    <ContainerWrapper className="flex flex-col">
      <Navbar />

      <div className="grid grid-cols-6 flex-1">
        <SideBar />

        <div className="col-span-5 p-5">
          <Outlet />
        </div>
      </div>
    </ContainerWrapper>
  );
}
