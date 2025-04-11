import React from "react";

interface LegendProps {
  categories: Record<string, string>;
}

const Legend: React.FC<LegendProps> = ({ categories }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {Object.entries(categories).map(([category, color]) => (
        <div key={category} className="flex items-center">
          <div
            className="w-4 h-4 mr-1 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs">{category}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
