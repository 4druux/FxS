import { Sparkle } from "lucide-react";

const TextMarquee = () => {
  return (
    <div className="bg-[#121212] pt-12">
      <div
        className="relative overflow-hidden border-t-4 border-b-4 border-neutral-900 py-12
      [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_5%,rgba(0,0,0,1)_30%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_95%)]"
      >
        {/* Background */}
        <div className="absolute inset-0  pointer-events-none"></div>

        {/* Marquee Wrapper */}
        <div className="flex w-max animate-marquee items-center space-x-8">
          <div className="flex items-center space-x-4">
            {Array(10)
              .fill(["AI Automation", "Secure Token", "Smart Bot"])
              .flat()
              .map((text, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="px-4 text-5xl tracking-widest font-bold text-neutral-600">
                    {text}
                  </span>
                  <Sparkle className="text-neutral-600 mx-2 animate-spin" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextMarquee;
