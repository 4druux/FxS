"use client";
import "../components/Scrollbar/scroll.css";
import { useEffect } from "react";
// Components
import Hero from "@/components/Hero";
import Explore from "@/components/Explore";
import About from "@/components/About";
// import Menu from "@/components/Menu";
import Testimonials from "@/components/Testimonials";
import OpeningHours from "@/components/OpeningHours";
import TextMarquee from "@/components/TextMarquee";
import CountUp from "@/components/CountUp";
import CardProduct from "@/components/CardProduct";

const Home = () => {
  // add locomotive scroll
  useEffect(() => {
    const loadLocomotiveScroll = async () => {
      const locomotiveScroll = (await import("locomotive-scroll")).default;
      new locomotiveScroll();
    };

    loadLocomotiveScroll();
  }, []);
  return (
    <div className="h-full overflow-x-hidden">
      <Hero />
      <Explore />
      <About />
      <CardProduct />
      <TextMarquee />
      <Testimonials />
      <CountUp />
      {/* <OpeningHours /> */}
    </div>
  );
};

export default Home;
