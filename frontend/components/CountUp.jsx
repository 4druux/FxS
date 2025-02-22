import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import TextCountUp from "./Ui/TextCountUp.jsx";
import ShinyText from "./Button/ShinyText.jsx";

const CountUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212]">

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <ShinyText
              text="Product Quality"
              className="tracking-widest text-xl font-bold text-white/50 mb-6"
              disabled={false}
              speed={3}
            />
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-500 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="flex items-baseline space-x-1">
                  <TextCountUp
                    from={0}
                    to={5}
                    duration={3}
                    decimals={1}
                    separator="."
                    className="text-yellow-500"
                    startWhen={isVisible}
                  />
                  <span className="text-neutral-300 text-2xl font-bold">/</span>
                  <span className="text-neutral-300 text-2xl font-bold">5</span>
                </div>
              </div>

              <p className="mt-8 text-sm text-neutral-500 font-medium">
                Based on 25k+ reviews
              </p>
            </div>
          </div>

          <div className="text-center p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <ShinyText
              text="Product Sold"
              className="tracking-widest text-xl font-bold text-white/50 mb-6"
              disabled={false}
              speed={3}
            />
            <div className="relative">
              <div className="text-2xl font-bold text-neutral-500 flex justify-center items-center">
                <TextCountUp
                  from={0}
                  to={50000}
                  duration={3}
                  separator=","
                  className="mr-2 bg-gradient-to-r from-neutral-200 to-neutral-400 text-transparent bg-clip-text"
                  startWhen={isVisible}
                />
                <Plus className="w-6 h-6 text-neutral-400" strokeWidth={4} />
              </div>
            </div>
            <p className="mt-8 text-sm text-neutral-500 font-medium">
              Worldwide Deliveries
            </p>
          </div>

          {/* Total Reviews Section - Updated */}
          <div className="text-center p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <ShinyText
              text="Total Reviews"
              className="tracking-widest text-xl font-bold text-white/50 mb-6"
              disabled={false}
              speed={3}
            />
            <div className="relative">
              <div className="text-2xl font-bold text-neutral-500 flex justify-center items-center">
                <TextCountUp
                  from={0}
                  to={25000}
                  duration={3}
                  separator=","
                  className="mr-2 bg-gradient-to-r from-neutral-200 to-neutral-400 text-transparent bg-clip-text"
                  startWhen={isVisible}
                />
                <Plus className="w-6 h-6 text-neutral-400" strokeWidth={4} />
              </div>
            </div>
            <p className="mt-8 text-sm text-neutral-500 font-medium">
              Verified Feedback
            </p>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-900/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default CountUp;
