import React, { useState } from "react";

interface PosTypeSelectorProps {
  onSelect: (posType: string) => void;
  defaultValue?: string;
}

const PosTypeSelector: React.FC<PosTypeSelectorProps> = ({
  onSelect,
  defaultValue = "토스"
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(defaultValue);

  const posTypes = ["토스", "키움페이"];

  const handleSelect = (type: string): void => {
    setSelectedType(type);
    onSelect(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-bit-main"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedType}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
          <ul className="py-1 max-h-60 overflow-auto">
            {posTypes.map((type) => (
              <li
                key={type}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm hover:text-bit-main ${
                  selectedType === type
                    ? "text-bit-main font-semibold"
                    : "text-comment"
                }`}
                onClick={() => handleSelect(type)}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PosTypeSelector;
