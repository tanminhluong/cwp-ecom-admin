"use client";

import { UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="flex justify-between items-center sticky top-0 z-20 px-8 py-4 bg-blue-2 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" title="logo" width={150} height={70} />

      <div className=" flex gap-8 max-md:hidden ">
        {navLinks.map((link) => (
          <Link
            className="flex gap-4 text-body-medium"
            href={link.url}
            key={link.url}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="relative flex gap-4 items-center">
        <MenuIcon
          className="cursor-pointer w-6 h-6 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open ? (
          <div
            ref={mobileMenuRef}
            className="absolute flex flex-col gap-12 right-6 top-10 bg-white-1 shadow-xl p-6 rounded-md "
          >
            {navLinks.map((link) => (
              <Link
                className={`flex gap-4 text-body-medium ${
                  pathname === link.url ? "text-blue-1" : ""
                }`}
                href={link.url}
                key={link.url}
              >
                {link.icon} <p>{link.label}</p>
              </Link>
            ))}
          </div>
        ) : null}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
