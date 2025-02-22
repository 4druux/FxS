import { Sparkle } from "lucide-react";

const TextMarquee = () => {
  return (
    <div className="bg-[#121212] pt-12 relative">
      <div
        className="relative overflow-hidden border-t-2 border-b-2 border-neutral-800 py-12
        [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_5%,rgba(0,0,0,1)_30%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_95%)]"
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none"></div>

        {/* Marquee Wrapper */}
        <div className="flex w-max animate-marquee items-center space-x-8">
          <div className="flex items-center space-x-4">
            {Array(10)
              .fill(["AI Automation", "Secure Token", "Smart Bot"])
              .flat()
              .map((text, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="px-4 text-7xl -tracking-wider font-bold text-neutral-700">
                    {text}
                  </span>
                  <Sparkle className="text-neutral-700 mx-2 w-12 h-12" />
                </div>
              ))}
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default TextMarquee;
