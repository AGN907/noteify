import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  PiFolderNotch,
  PiHash,
  PiList,
  PiNote,
  PiStar,
  PiTrashSimple,
} from "react-icons/pi";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
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
  const { pathname } = useLocation();
  const isDesktopScreen = useMediaQuery("(min-width: 1280px)");

  const hideMenuToggler = [
    /^\/tags\/[a-zA-Z0-9]+/,
    /^\/folders\/[a-zA-Z0-9]+/,
  ].some((r) => r.test(pathname));

  const [menuActive, setMenuActive] = useState(isDesktopScreen);

  useEffect(() => {
    setMenuActive(isDesktopScreen);
  }, [isDesktopScreen]);

  const handleMenuToggle = () => {
    console.log("clicked");
    setMenuActive(!menuActive);
  };

  return (
    <div data-active={menuActive} className="h-full w-full">
      <Button
        data-hidden={hideMenuToggler}
        className="absolute left-2 top-2 z-20 data-[hidden=true]:hidden xl:hidden"
        onClick={handleMenuToggle}
        variant="link"
        size="icon"
      >
        <PiList size={28} />
      </Button>
      <div
        data-active={menuActive}
        onClick={() => setMenuActive(false)}
        className="absolute bottom-0 left-0 right-0 top-0 z-10 hidden bg-black/20 dark:bg-neutral-800/50 max-xl:data-[active=true]:block"
      ></div>
      <div
        data-active={menuActive}
        className="z-20 h-full w-full max-w-52 border-r bg-background transition-all duration-300 ease-in-out data-[active=true]:translate-x-0 max-xl:fixed max-xl:data-[active=false]:translate-x-[-250px] xl:bottom-0 xl:top-0"
      >
        <nav className="flex h-full flex-col">
          {sidebarItems.map((item) => (
            <SidebarItem
              onClick={menuActive ? handleMenuToggle : undefined}
              key={item.name}
              name={item.name}
              icon={item.Icon}
              to={item.path}
            />
          ))}
          <div className="mt-auto w-full pb-2">
            <ThemeToggle />
          </div>
        </nav>
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
          flex items-center gap-x-4 p-2 py-3 hover:bg-accent/50 max-xl:w-full
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
