import { Outlet } from "react-router-dom";
import { Navbar } from "../dashboard/navbar";
import { SideBar } from "../dashboard/sidebar";
import { ContainerWrapper } from "../container";

export function DashboardLayout() {
  return (
    <ContainerWrapper>
      <Navbar />
      <div className="grid grid-cols-4 h-screen">
        <SideBar />
        <div className="col-span-3 p-6">
          <Outlet />
        </div>
      </div>
    </ContainerWrapper>
  );
}
