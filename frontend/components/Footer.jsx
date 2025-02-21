import Image from "next/image";
import Link from "next/link";
// icons
import { FaInstagram, FaGithub } from "react-icons/fa";

const links = [
  { href: "/", name: "Home" },
  { href: "#explore", name: "Explore" },
  { href: "#about", name: "About" },
  { href: "#menu", name: "Menu" },
  { href: "/contact", name: "Contact" },
];

const Footer = () => {
  return (
    <footer className="pt-16 relative">
      {/* Overlay */}
      <div className="absolute w-full h-full bg-[#121212] z-10 top-0"></div>
      <div className="container mx-auto z-20 relative">
        <div className="border-t border-white/10 text-[15px] text-white/70 font-light w-full flex items-center justify-center py-6"></div>
        <div className="flex flex-col items-center justify-center gap-14">
          {/* links */}
          <nav className="flex flex-col xl:flex-row gap-8 xl:gap-12 justify-center items-center">
            {links.map((link, index) => {
              return (
                <Link
                  href={link.href}
                  key={index}
                  className="uppercase text-white tracking-widest transition-all hover:text-accent"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          {/* social */}
          <ul className="flex text-white text-xl gap-4">
            <Link
              href="/"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-accent transition-all"
            >
              <FaGithub />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="w-[54px] h-[54px] border border-white/[0.15] rounded-full flex items-center justify-center hover:text-accent transition-all"
            >
              <FaInstagram />
            </Link>
          </ul>
          {/* copyright */}
          <div className="border-t border-white/10 text-[15px] text-white/70 font-light w-full flex items-center justify-center py-6">
            <p>&copy; Copyright 2025 - FxS BOT . All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
