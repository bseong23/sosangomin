import React from "react";
import AnalysisDashboard from "@/features/analysis/components/dashboard/AnalysisDashboard";

const ResearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 mt-10 py-6">
        <AnalysisDashboard />
      </div>
    </div>
  );
};

export default ResearchPage;
