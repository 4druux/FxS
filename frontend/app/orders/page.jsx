"use client";
import PageTransition from "@/components/Curve";

const OrdersPage = () => {
  return (
    <PageTransition backgroundColor="#083344">
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center space-y-4 p-8 rounded-xl backdrop-blur-sm bg-white/10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            Orders Page
          </h1>
          <p className="text-gray-300">Discover my latest works</p>
        </div>
      </div>
    </PageTransition>
  );
};
export default OrdersPage;
