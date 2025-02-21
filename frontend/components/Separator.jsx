import { Rocket } from "lucide-react";
import React from "react";

const Separator = () => {
  return (
    <div className="relative flex items-center justify-center w-[168px] mx-auto">
      <div className="h-[1px] w-full bg-neutral-400" />

      <div className="mx-4">
        <Rocket size={24} className="text-neutral-400" />
      </div>

      <div className="h-[1px] w-full bg-neutral-400" />
    </div>
  );
};

export default Separator;
