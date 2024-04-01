"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="h-screen top-0 left-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      <Image src="/logo.png" alt="logo" title="logo" width={150} height={70} />
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-blue-1" : ""
            } `}
            href={link.url}
            key={link.url}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 text-body-medium items-center">
        <UserButton />
        <p>Edit profile</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
