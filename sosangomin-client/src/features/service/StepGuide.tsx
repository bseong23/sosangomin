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
    <div className="flex flex-col items-center text-center px-4 py-6 bg-white rounded-xl shadow-sm h-full">
      <div className="w-16 h-16 bg-bit-main rounded-full flex items-center justify-center mb-4">
        <span className="text-white font-bold text-xl">{number}</span>
      </div>
      <h3 className="font-medium mb-2 text-base">{title}</h3>
      <p className="text-sm text-comment-text leading-relaxed min-h-[48px]">
        {description}
      </p>
    </div>
  );
};

const StepGuide: React.FC<StepGuideProps> = ({ steps }) => {
  return (
    <section className="bg-basic-white rounded-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-bit-main">이용 방법</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
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
