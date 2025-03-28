// src/components/feature/CtaSection.tsx
import React from "react";

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="bg-bit-main rounded-md shadow-[0_0_15px_rgba(0,0,0,0.1)]  p-8 text-center text-basic-white">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-6 max-w-2xl mx-auto">{description}</p>
      <button
        className="bg-basic-white text-bit-main font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CtaSection;
