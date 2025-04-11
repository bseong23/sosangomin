import React from "react";

interface SwotCardProps {
  title: string;
  items: string[];
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

const SwotCard: React.FC<SwotCardProps> = ({
  title,
  items,
  bgColor,
  textColor,
  icon
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-5 h-full`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className={`flex items-start ${textColor}`}>
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SwotCard;
