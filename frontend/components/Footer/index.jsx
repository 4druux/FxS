import Image from "next/image";
import Link from "next/link";
// icons
import { FaInstagram, FaGithub, FaDiscord, FaFacebook } from "react-icons/fa";
import { FloatingDock } from "../ui/FloatingDock";

const links = [
  { href: "/", name: "Home" },
  { href: "#about", name: "About" },
  { href: "#menu", name: "Menu" },
  { href: "/admin", name: "Contact" },
];

const linksSocialMedia = [
  {
    title: "Instagram",
    icon: (
      <FaInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Github",
    icon: (
      <FaGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Discord",
    icon: (
      <FaDiscord className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Facebook",
    icon: (
      <FaFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#",
  },
];

const Footer = () => {
  return (
    <div
      className="relative h-[300px] bg-[#212121]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* Overlay */}
      <div className="relative h-[calc(100vh+300px)] -top-[100vh]">
        <div className="h-[300px] sticky top-[calc(100vh-300px)]">
          <div className="flex pt-10 flex-col items-center justify-center gap-14">
            {/* links */}
            <nav className="flex flex-col xl:flex-row gap-8 xl:gap-12 justify-center items-center">
              {links.map((link, index) => {
                return (
                  <Link
                    href={link.href}
                    key={index}
                    className=" text-white tracking-widest"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            {/* social */}
            <div className="">
              <FloatingDock items={linksSocialMedia} />
            </div>

            {/* copyright */}
            <div className="border-t border-white/10 text-[15px] text-white/70 font-light w-full flex items-center justify-center py-6">
              <p>&copy; Copyright 2025 - FxS BOT . All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
