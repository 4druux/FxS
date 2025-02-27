"use client";
// Curve
import PageTransition from "@/components/Curve";
// Components
import { Hero } from "@/components/2_users/home/1_Hero";
import Explore from "@/components/2_users/home/2_Explore";
import About from "@/components/2_users/home/3_About";
import CardProduct from "@/components/2_users/home/4_CardProduct";
import Testimonials from "@/components/2_users/home/6_Testimonials";
import ScrollVelo from "@/components/2_users/home/5_ScrollVelo";
import CountUp from "@/components/2_users/home/7_CountUp";

const Home = () => {
  return (
    <PageTransition backgroundColor={"#083344"}>
      {/* rgb(15, 62, 60) opsional */}
      <div className="h-full overflow-x-hidden">
        <Hero />
        <Explore />
        <About />
        <CardProduct />
        <ScrollVelo />
        <Testimonials />
        <CountUp />
      </div>
    </PageTransition>
  );
};

export default Home;
