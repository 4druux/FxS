"use client";
import Separator from "./Separator";
import Badge from "./Badge";
// import { WorldMap } from "./WorldMap";
// import TextPressure from "./button/TextPressure";
import TrueFocus from "./button/TrueFocus";
import LinkButton from "./button/LinkButton";

const Hero = () => {
  return (
    <section className="h-[100vh] xl:h-screen relative bg-gradient-to-br from-gray-900 to-black">
      {}
      <div className="bg-hero_overlay absolute w-full h-full z-10">
        {/* world-map */}
      </div>
      {/* <div className="absolute top-0 left-0 w-full h-full z-0">
        <WorldMap />
      </div> */}
      <div className="container mx-auto h-full flex flex-col xl:flex-row items-center z-30 relative">
        {/* text */}
        <div
          data-scroll
          data-scroll-speed="0.4"
          className="flex-1 flex flex-col text-center justify-center items-center xl:pb-12 gap-10 h-full"
        >
          {/* Badge & H1 */}
          {/*Text Pressure*/}
          {/* <div className="flex flex-col items-center w-full md:w-3/4 lg:w-2/3">
            <TextPressure
              text="Welcome to FxS Store"
              strokeColor="#ff0000"
              minFontSize={48}
              maxFontSize={120}
              strokeWidth={1}
              textColor="#b5b5b5a4"
            />
          </div> */}
          <div className="lead font-light max-w-[300px] md:max-w-[430px] xl:max-w-[560px]">
            <TrueFocus
              sentence="The highes quality tools"
              manualMode={false}
              blurAmount={5}
              borderColor="teal"
              animationDuration={1.5}
              pauseBetweenAnimations={0}
            />
          </div>

          <LinkButton href="/" text="Get Started" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
