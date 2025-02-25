"use client";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Badge from "./Badge";
import Separator from "./Separator";
import LinkButton from "./button/LinkButton";
import { Rocket } from "lucide-react";
import ShinyText from "./button/ShinyText";
import MagneticButton from "./button/MagneticButton";

const data = [
  {
    imgSrc: "/assets/about/dis.jpg",
    title: "Secure Token",
    description:
      "Founded in 2000, Zenbrew started as a small café with a vision for exceptional coffee. Now a beloved brand, we're known for quality and sustainability. Driven by passion, we create memorable coffee experiences. Join us in exploring coffee, one cup at a time.",
    buttonProps: {
      href: "/secure-token",
      text: "Learn about Security",
      showIcon: false,
    },
  },
  {
    imgSrc: "/assets/about/dis.jpg",
    title: "Account Discord",
    description:
      "At Zenbrew, we promise the finest coffee with a positive impact. We source beans from sustainable farms, respecting people and the planet. Our meticulous roasting ensures a rich, satisfying experience. We are committed to quality, sustainability, and community.",
    buttonProps: {
      href: "https://discord.com/invite/yourserver",
      text: "Join Discord",
      external: true,
      showIcon: false,
    },
  },
  {
    imgSrc: "/assets/about/dis.jpg",
    title: "Smart Bot",
    description:
      "At Zenbrew, our dedicated team is behind every great cup. Our skilled baristas and expert roasters work with passion and precision, making each coffee experience special. Meet the people who bring creativity and care to every cup and learn their unique stories.",
    buttonProps: {
      href: "/smart-bot",
      text: "Explore Bot Features",
      showIcon: false,
    },
  },
];

const About = () => {
  const scrollableSectionRef = useRef(null);
  const scrollableTriggerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const animation = gsap.fromTo(
      scrollableSectionRef.current,
      { translateX: 0 },
      {
        translateX: "-200vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: scrollableTriggerRef.current,
          start: "top top",
          end: "1800vw top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      animation.kill();
    };
  }, []);

  const IMAGE_DIMENSIONS = {
    width: 800,
    height: 600,
  };

  return (
    <section className="overflow-hidden bg-[#121212]" id="about">
      <div ref={scrollableTriggerRef}>
        <div
          ref={scrollableSectionRef}
          className="h-screen w-[300vw] flex relative"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="w-screen h-screen flex flex-col justify-center items-center relative"
            >
              <div className="container mx-auto">
                <div className="flex gap-[30px] relative">
                  {/* text */}
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="max-w-[560px] text-center space-y-6">
                      {/* title */}
                      <ShinyText
                        text={item.title}
                        speed={2}
                        className="tracking-widest text-4xl font-bold text-white/50"
                      />
                      {/* separator */}
                      <Separator />
                      {/* description */}
                      <p className="text-neutral-400 text-md font-medium  px-8 xl:px-0">
                        {item.description}
                      </p>
                      {/* LinkButton menggantikan button biasa */}

                      <MagneticButton href={item.buttonProps.href}>
                        {item.buttonProps.text}
                      </MagneticButton>
                    </div>
                  </div>

                  {/* image */}
                  <div className="hidden xl:flex flex-1 relative">
                    <div className="relative w-full h-[70vh]">
                      <Image
                        src={item.imgSrc}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-3xl"
                        quality={100}
                        priority
                        alt={`${item.title} illustration`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
