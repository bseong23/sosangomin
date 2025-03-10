import React from "react";
import banner from "@/assets/banner.svg";
const Banner: React.FC = () => {
  return (
    <div>
      <img src={banner} className="pb-[24px]" />
    </div>
  );
};

export default Banner;
