"use client";
import MagneticButton from "@/components/button/MagneticButton";
import PageTransition from "@/components/Curve";

const ProjectsPage = () => {
  return (
    <PageTransition backgroundColor="#083344">
      <div className="min-h-screen flex flex-col gap-8 items-center justify-center bg-[#121212]">
        <div className="text-center space-y-4 p-8 rounded-xl backdrop-blur-sm bg-white/10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            Projects Page
          </h1>
          <p className="text-gray-300">Discover my latest works</p>
        </div>
        <MagneticButton href="#">OUR WORK</MagneticButton>
      </div>
    </PageTransition>
  );
};
export default ProjectsPage;
