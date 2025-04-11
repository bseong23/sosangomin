import React, { useState } from "react";

// 토글 스위치 컴포넌트 타입 정의
interface ToggleSwitchProps {
  options: string[];
  defaultSelected?: string;
  onChange?: (selected: string) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  defaultSelected,
  onChange
}) => {
  const [selected, setSelected] = useState(defaultSelected || options[0]);

  const handleSelect = (option: string) => {
    setSelected(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="flex rounded-md bg-white border border-gray-300 overflow-hidden">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 text-xs font-base flex-1 ${
            selected === option
              ? "bg-bit-main text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleSwitch;
