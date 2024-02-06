import { cn } from "@/lib/utils";
import {
  PiFolderNotch,
  PiGear,
  PiHash,
  PiNote,
  PiStar,
  PiTrashSimple,
} from "react-icons/pi";
import { NavLink, NavLinkProps } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const sidebarItems = [
  {
    name: "Notes",
    path: "/",
    Icon: <PiNote size={22} />,
  },
  {
    name: "Favourites",
    path: "/favourites",
    Icon: <PiStar size={22} />,
  },
  {
    name: "Folders",
    path: "/folders",
    Icon: <PiFolderNotch size={22} />,
  },
  {
    name: "Tags",
    path: "/tags",
    Icon: <PiHash size={22} />,
  },
  {
    name: "Trash",
    path: "/trash",
    Icon: <PiTrashSimple size={22} />,
  },
];
export default function SidebarMenu() {
  return (
    <div className="fixed bottom-0 left-0 top-0 h-screen w-52">
      <div className="flex h-full w-full flex-col border border-r-accent">
        <nav>
          {sidebarItems.map(({ name, path, Icon }) => (
            <SidebarItem key={name} name={name} to={path} icon={Icon} />
          ))}
        </nav>
        <div className="mt-auto flex items-center transition-colors hover:bg-accent/50">
          <SidebarItem
            className="hover:bg-transparent"
            name="Settings"
            to="/settings"
            icon={<PiGear size={22} />}
          />
          <hr className="h-8 w-0.5 bg-accent" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps extends NavLinkProps {
  name: string;
  icon: JSX.Element;
}
export function SidebarItem(props: SidebarItemProps) {
  const { name, icon, className, ...restProps } = props;

  return (
    <NavLink
      {...restProps}
      className={({ isActive }) => {
        return cn(
          `${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }
          flex w-full items-center gap-x-4 p-2 py-3 hover:bg-accent/50
          `,
          className,
        );
      }}
    >
      {icon}
      {name}
    </NavLink>
  );
}
