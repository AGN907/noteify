import {
  PiFolderNotch,
  PiHash,
  PiNote,
  PiStar,
  PiTrashSimple,
} from "react-icons/pi";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  {
    name: "Notes",
    path: "/",
    Icon: <PiNote size={22} />,
  },
  {
    name: "Favorites",
    path: "/favorites",
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
      <div className="h-full w-full border border-r-accent">
        <nav>
          {sidebarItems.map(({ name, path, Icon }) => (
            <SidebarItem key={name} name={name} path={path} icon={Icon} />
          ))}
        </nav>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  name: string;
  path: string;
  icon: JSX.Element;
}
export function SidebarItem(props: SidebarItemProps) {
  const { name, path, icon } = props;

  return (
    <NavLink
      to={path}
      className={({ isActive }) => {
        return `${
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        }
          flex items-center gap-x-4 p-2 py-3 hover:bg-accent/50
          `;
      }}
    >
      {icon}
      {name}
    </NavLink>
  );
}
