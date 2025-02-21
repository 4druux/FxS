// components/LinkButton.jsx
import { Rocket } from "lucide-react";
import Link from "next/link";

const LinkButton = ({
  href,
  text = "Get Started",
  icon: Icon = Rocket, // Default icon adalah Rocket
  showIcon = true, // Prop baru untuk mengontrol visibility icon
  className = "",
  external = false,
  onClick,
}) => {
  const ButtonContent = (
    <button
      onClick={onClick}
      className={`relative px-8 py-4 backdrop-blur-2xl bg-teal-900/20 rounded-full border border-neutral-800 
        border-b[0.1px] border-b-teal-600 border-r-[0.1px] border-r-teal-600 hover:border-teal-600 
        transition-all duration-300 flex items-center gap-3 overflow-hidden group hover:scale-[1.02] ${className}`}
    >
      <span className="text-white/80 hover:text-white font-medium relative z-10">
        {text}
      </span>
      {/* Render icon hanya jika showIcon true */}
      {showIcon && (
        <div className="relative z-10 transition-transform duration-300 group-hover:rotate-45">
          <Icon className="w-5 h-5 text-white/80 hover:text-white" />
        </div>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-900 opacity-0 
        group-hover:opacity-40 transition-opacity duration-300"
      />
    </button>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {ButtonContent}
      </a>
    );
  }

  return (
    <Link href={href} className="inline-block">
      {ButtonContent}
    </Link>
  );
};

export default LinkButton;
