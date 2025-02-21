const ShinyBorder = ({ text, disabled = false, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <button
      className={`
        relative px-6 py-2
        border border-[#ffffff1a]
        rounded-full
        overflow-hidden
        transition-all
        duration-300
        hover:border-[#ffffff33]
        bg-[#00000033]
        backdrop-blur-sm
        ${className}
      `}
    >
      <div
        className={`text-[#b5b5b5a4] bg-clip-text inline-block ${
          disabled ? "" : "animate-shine"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(120deg, transparent 40%, white 50%,transparent 60%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          animationDuration: animationDuration,
        }}
      >
        {text}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff0d] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ShinyBorder;
