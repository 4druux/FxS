"use client";
import "../components/Scrollbar/scroll.css";
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
import PageTransition from "@/components/Curve";

const Home = () => {
  return (
    <PageTransition backgroundColor={"#083344"}>
      {/* rgb(15, 62, 60) opsional */}
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
    </PageTransition>
  );
};

export default Home;
