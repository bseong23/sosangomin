import React from "react";
import { ReportData } from "../types";

interface SwotDetailComponentProps {
  data: ReportData;
}

const SwotDetailComponent: React.FC<SwotDetailComponentProps> = ({ data }) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">SWOT 분석</h2>

      {/* Summary section with slight visual enhancement */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-gray-700 text-base leading-relaxed">
          {data.swot_analysis.summary}
        </p>
      </div>

      {/* Visual SWOT diagram */}
      <div className="relative bg-white rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Strengths - top left */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="bg-green-500 p-2 rounded-full mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-800">
                강점 (Strengths)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.strengths.map((item, index) => (
                <li key={index} className="flex items-start text-green-800">
                  <span className="inline-block w-5 h-5 bg-green-200 rounded-full text-center text-green-800 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses - top right */}
          <div className="bg-gradient-to-bl from-red-50 to-red-100 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="bg-red-500 p-2 rounded-full mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-800">
                약점 (Weaknesses)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.weaknesses.map((item, index) => (
                <li key={index} className="flex items-start text-red-800">
                  <span className="inline-block w-5 h-5 bg-red-200 rounded-full text-center text-red-800 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities - bottom left */}
          <div className="bg-gradient-to-tr from-blue-50 to-blue-100 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-800">
                기회 (Opportunities)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.opportunities.map((item, index) => (
                <li key={index} className="flex items-start text-blue-800">
                  <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-center text-blue-800 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats - bottom right */}
          <div className="bg-gradient-to-tl from-yellow-50 to-yellow-100 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="bg-yellow-500 p-2 rounded-full mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-yellow-800">
                위협 (Threats)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.threats.map((item, index) => (
                <li key={index} className="flex items-start text-yellow-800">
                  <span className="inline-block w-5 h-5 bg-yellow-200 rounded-full text-center text-yellow-800 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative center element to enhance visual appeal - now larger */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full bg-bit-main flex items-center justify-center">
            <span className="text-white text-base text-center font-bold">
              SWOT
              <br />
              분석
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwotDetailComponent;
