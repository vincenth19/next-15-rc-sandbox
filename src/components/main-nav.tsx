"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

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
  const pathname = usePathname();
  return (
    <div className="flex w-full px-10 py-5 gap-5 items-center h-[5rem]">
      {MENUS.map((menu, idx) => {
        return (
          <Link
            href={menu.href}
            key={menu.href}
            className={`${
              idx === 0 ? "font-bold bg-blue-800 rounded-md p-2" : ""
            } ${pathname === menu.href ? "underline" : ""} text-white`}
          >
            {menu.label}
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;
