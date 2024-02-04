import Editor from "@/components/editor/Editor";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <div>
        <SidebarMenu />
      </div>
      <div className="fixed bottom-0 left-52 top-0">
        <div className="h-full w-80 space-y-4 overflow-scroll border border-l-accent">
          <Outlet />
        </div>
      </div>
      <div>
        <Editor onChange={() => {}} content={"<p>New Note</p>"} />
      </div>
    </div>
  );
}
