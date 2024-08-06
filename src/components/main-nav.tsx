import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { LucideUsers } from "lucide-react";

const MENUS = [
  {
    label: "Person App",
    href: "/",
  },
  {
    label: "People",
    href: "/people",
  },
];

const Navbar = () => {
  return (
    <div className="h-[4rem] border-b border-b-slate-200 border-solid">
      <div className="max-w-screen-2xl m-auto">
        <div className="flex w-full px-10 py-5 gap-5 items-center h-[4rem]">
          <NavigationMenu>
            <NavigationMenuList>
              {MENUS.map((menu, idx) => {
                return (
                  <NavigationMenuItem>
                    <Link
                      href={menu.href}
                      key={menu.href}
                      className={"text-white"}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {idx === 0 ? <LucideUsers className="mr-2" /> : null}
                        {menu.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
