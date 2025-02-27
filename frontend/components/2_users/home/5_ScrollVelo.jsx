// pages/Scroll.js (atau file halaman Anda)
import ScrollVelocity from "@/components/ui/ScrollVelocity";

const ScrollVelo = () => {
  return (
    <div className="bg-[#121212]  relative">
      <div
        className="relative overflow-hidden border-t-2 border-b-2 border-neutral-800 py-12
        [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_5%,rgba(0,0,0,1)_30%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_95%)]"
      >
        {/* Background */}
        <ScrollVelocity
          texts={["Secure Token", "Smart Bot", "Account Discord"]}
          velocity={100}
          className="text-white"
        />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default ScrollVelo;
