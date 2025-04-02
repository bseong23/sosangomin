import React from "react";

interface DateRangePickerProps {
  startMonth: string; // YYYY-MM 형식
  endMonth: string; // YYYY-MM 형식
  onDateRangeChange: (startMonth: string, endMonth: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startMonth,
  endMonth,
  onDateRangeChange
}) => {
  // 현재 달부터 몇 개월 전까지 선택 가능하도록 설정
  const monthsToShow = 12; // 최대 12개월 전까지 선택 가능

  const generateMonthOptions = (): { value: string; label: string }[] => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const value = `${year}-${month.toString().padStart(2, "0")}`;
      const label = `${year}년 ${month}월`;

      options.push({ value, label });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  const handleStartMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newStartMonth = e.target.value;
    onDateRangeChange(newStartMonth, endMonth);
  };

  const handleEndMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newEndMonth = e.target.value;
    onDateRangeChange(startMonth, newEndMonth);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center">
        <label
          htmlFor="startMonth"
          className="text-sm font-medium text-gray-700 mr-2"
        >
          시작 월:
        </label>
        <select
          id="startMonth"
          value={startMonth}
          onChange={handleStartMonthChange}
          className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-bit-main focus:border-bit-main text-sm"
        >
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <label
          htmlFor="endMonth"
          className="text-sm font-medium text-gray-700 mr-2"
        >
          종료 월:
        </label>
        <select
          id="endMonth"
          value={endMonth}
          onChange={handleEndMonthChange}
          className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-bit-main focus:border-bit-main text-sm"
        >
          {monthOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.value < startMonth} // 시작 월보다 이전 월은 선택 불가
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateRangePicker;
