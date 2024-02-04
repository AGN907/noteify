import SidebarMenu from "@/components/shared/SidebarMenu";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <div>
        <SidebarMenu />
      </div>
      <Outlet />
      <div></div>
    </div>
  );
}
