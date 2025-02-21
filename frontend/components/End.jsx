import Image from "next/image";
import Link from "next/link";
// icons
import { FaDiscord, FaGithub, FaLock, FaRobot } from "react-icons/fa";

const links = [
  { href: "/", name: "Home" },
  { href: "#features", name: "Features" },
  { href: "#security", name: "Security" },
  { href: "#automation", name: "Automation" },
  { href: "/contact", name: "Contact" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 relative">
      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/[0.85] z-10 top-0"></div>
      <div className="container mx-auto z-20 relative">
        <div className="flex flex-col items-center justify-center gap-14">
          {/* links */}
          <nav className="flex flex-col xl:flex-row gap-8 xl:gap-12 justify-center items-center">
            {links.map((link, index) => {
              return (
                <Link
                  href={link.href}
                  key={index}
                  className="uppercase text-white tracking-widest transition-all hover:text-blue-500"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          {/* social */}
          <ul className="flex text-white text-xl gap-4">
            <Link
              href="https://github.com/your-github"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-blue-500 transition-all"
            >
              <FaGithub />
            </Link>
            <Link
              href="https://discord.com/invite/your-discord"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-blue-500 transition-all"
            >
              <FaDiscord />
            </Link>
            <Link
              href="https://your-security-link.com"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-blue-500 transition-all"
            >
              <FaLock />
            </Link>
            <Link
              href="https://your-ai-automation-link.com"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-blue-500 transition-all"
            >
              <FaRobot />
            </Link>
          </ul>
          {/* copyright */}
          <div className="border-t border-white/10 text-[15px] text-white/70 font-light w-full flex items-center justify-center py-6">
            <p>&copy; Copyright 2024 - FxS BOT. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
