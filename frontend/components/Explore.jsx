import Image from "next/image";
import ShinyText from "./button/ShinyText";
import { FaDiscord, FaRobot, FaShieldAlt, FaUsersCog } from "react-icons/fa"; // Import icons yang diperlukan

// Data untuk items
const exploreData = {
  leftItems: [
    {
      icon: FaDiscord,
      title: "Lorem, ipsum dolor.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quae dolore earum similique nam soluta omnis saepe dolorem velit magnam.",
    },

    {
      icon: FaShieldAlt,
      title: "Lorem, ipsum dolor.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quae dolore earum similique nam soluta omnis saepe dolorem velit magnam.",
    },
  ],
  rightItems: [
    {
      icon: FaRobot,
      title: "Lorem, ipsum dolor.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quae dolore earum similique nam soluta omnis saepe dolorem velit magnam.",
    },
    {
      icon: FaUsersCog,
      title: "Lorem, ipsum dolor.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quae dolore earum similique nam soluta omnis saepe dolorem velit magnam.",
    },
  ],
};

const Explore = () => {
  return (
    <section
      className="py-12 xl:py-0 xl:h-[100vh] bg-[#121212] xl:w-screen text-white"
      id="explore"
    >
      <div className="container mx-auto xl:w-full xl:h-full flex xl:justify-center xl:items-center">
        <div className="w-full flex flex-col lg:flex-row gap-12 xl:gap-20">
          <div className="flex-1 flex flex-col justify-arround items-end text-center xl:text-left gap-12 xl:gap-0 max-w-[400px] mx-auto xl:max-w-none xl:mx-0">
            {/* Left items */}
            {exploreData.leftItems.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="xl:max-w-[420px] xl:text-right xl:flex xl:flex-col xl:items-end">
                  <div className="my-4 flex justify-center items-center">
                    <item.icon className="w-14 h-14 text-teal-500" />
                    {/* Menggunakan icon component */}
                  </div>
                  <ShinyText
                    text={item.title}
                    speed={2}
                    className="tracking-widest text-2xl font-medium text-white/50 mb-2"
                  />
                  <p className="max-w-[400px] text-neutral-400 text-md font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* image */}
          <div className="hidden xl:flex justify-center">
            <div className="relative w-[322px] h-[580px]">
              <Image
                src="/assets/explore/rocket.png"
                fill
                alt=""
                className="object-cover"
                quality={100}
                priority
                data-scroll
                data-scroll-speed="0.5"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-arround text-center xl:text-left gap-12 xl:gap-0 max-w-[400px] mx-auto xl:max-w-none xl:mx-0">
            {/* Right items */}
            {exploreData.rightItems.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="xl:max-w-[420px] xl:text-left xl:flex xl:flex-col xl:items-start">
                  <div className="my-4 flex justify-center items-center">
                    <item.icon className="w-14 h-14 text-teal-500" />
                  </div>
                  <ShinyText
                    text={item.title}
                    speed={2}
                    className="tracking-widest text-2xl font-medium text-white/50 mb-2"
                  />
                  <p className="max-w-[400px] text-neutral-400 text-md font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;
