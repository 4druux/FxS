import LinkButton from "@/components/button/LinkButton";
import BlurText from "@/components/text/BlurText";
import SplitText from "@/components/text/SplitText";
import TrueFocus from "@/components/text/TrueFocus";
import Separator from "@/components/ui/Separator";
import { Spotlight } from "@/components/ui/Spotlight";
import React from "react";
import { IoMdQuote } from "react-icons/io";

export function Hero() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center antialiased bg-cover bg-center bg-no-repeat overflow-hidden px-4 py-8 md:px-8 md:py-16"
      style={{ backgroundImage: "url('/assets/bg-dark.jpg')" }}
    >
      {/* Overlay redup */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Konten di atasnya */}
      <Spotlight
        className="top-14 left-0 md:left-72 md:-top-40 z-10"
        fill="white"
      />

      <div
        data-scroll
        data-scroll-speed="0.4"
        className="relative z-10 w-full max-w-7xl"
      >
        <div className="text-center mb-8 md:mb-6">
          <BlurText
            text="FxS Store"
            className="mb-2 text-4xl md:text-6xl font-bold tracking-widest text-neutral-50"
            delay={200}
            animateBy="words"
            direction="bot"
          />
          <Separator />
          <BlurText
            text="The Future of Discord Automation Starts Here."
            delay={200}
            animateBy="words"
            direction="bot"
            className="text-md md:text-3xl mt-6 text-neutral-400"
          />
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 text-base md:text-lg lg:text-xl">
            <TrueFocus
              sentence="The highest quality tools"
              manualMode={false}
              blurAmount={5}
              borderColor="teal"
              animationDuration={1.5}
              pauseBetweenAnimations={0}
            />
          </div>

          <LinkButton href="/" text="Get Started" className="z-10 text-white" />
        </div>
      </div>
    </div>
  );
}
