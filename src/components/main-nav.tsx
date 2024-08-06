import React from "react";
import Link from "next/link";
import { LucideMenu, LucideUsersRound } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MENUS = [
  {
    label: "Person App",
    href: "/",
    icon: <LucideUsersRound className="mr-2 text-blue-400" size={30} />,
  },
  {
    label: "People",
    href: "/people",
  },
];

const Navbar: React.FC = () => {
  return (
    <div className="h-[4rem] border-b border-b-slate-200 border-solid">
      <div className="max-w-screen-2xl m-auto">
        <div className="flex sm:hidden w-full px-5 py-5 gap-5 items-center h-[4rem]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <LucideMenu />
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader className="text-left">
                <SheetTitle>
                  <SheetClose asChild>
                    <Link
                      href={MENUS[0].href}
                      className={navigationMenuTriggerStyle()}
                    >
                      <Button
                        type="submit"
                        variant={"ghost"}
                        className="hover:bg-accent w-full justify-start text-xl font-semibold p-0"
                      >
                        {MENUS[0].icon}
                        {MENUS[0].label}
                      </Button>
                    </Link>
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 items-start mt-4">
                {MENUS.map((menu, idx) => {
                  if (idx > 0) {
                    return (
                      <SheetClose asChild key={menu.href}>
                        <Link href={menu.href} className="flex w-full">
                          <Button
                            type="submit"
                            variant={"ghost"}
                            className="hover:bg-accent w-full justify-start"
                          >
                            {menu.icon}
                            {menu.label}
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  }
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden sm:flex w-full px-10 py-5 gap-5 items-center h-[4rem]">
          <NavigationMenu>
            <NavigationMenuList>
              {MENUS.map((menu, idx) => {
                return (
                  <NavigationMenuItem key={menu.href}>
                    <Link href={menu.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} ${
                          idx === 0 ? "font-semibold text-xl" : ""
                        }`}
                      >
                        {menu.icon}
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
