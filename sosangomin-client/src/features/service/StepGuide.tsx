// src/components/feature/StepGuide.tsx
import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepGuideProps {
  steps: Step[];
}

const StepItem: React.FC<Step> = ({ number, title, description }) => {
  return (
    <div className="flex-1 text-center">
      <div className="w-16 h-16 bg-bit-main rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-xl">{number}</span>
      </div>
      <h3 className="font-medium mb-2 text-base">{title}</h3>
      <p className="text-comment-text">{description}</p>
    </div>
  );
};

const StepGuide: React.FC<StepGuideProps> = ({ steps }) => {
  return (
    <section className="bg-basic-white rounded-md  p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-bit-main">이용 방법</h2>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-4">
        {steps.map((step) => (
          <StepItem
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
};

export default StepGuide;
