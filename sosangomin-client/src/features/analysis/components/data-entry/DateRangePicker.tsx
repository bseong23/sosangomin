import React, { useMemo } from "react";

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
  // 시작 연도와 월 분리
  const [startYear, startMonthNum] = startMonth.split("-");

  // 종료 연도와 월 분리
  const [endYear, endMonthNum] = endMonth.split("-");

  // 연도 옵션 생성 (현재 연도부터 4년 전까지)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push({ value: year.toString(), label: `${year}년` });
    }

    return years;
  }, []);

  // 월 옵션 생성 (1월부터 12월까지)
  const monthOptions = useMemo(() => {
    const months = [];

    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, "0");
      months.push({ value: month, label: `${i}월` });
    }

    return months;
  }, []);

  // 시작 연도 변경 핸들러
  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartYear = e.target.value;
    const newStartMonth = `${newStartYear}-${startMonthNum}`;
    onDateRangeChange(newStartMonth, endMonth);
  };

  // 시작 월 변경 핸들러
  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartMonthNum = e.target.value;
    const newStartMonth = `${startYear}-${newStartMonthNum}`;
    onDateRangeChange(newStartMonth, endMonth);
  };

  // 종료 연도 변경 핸들러
  const handleEndYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndYear = e.target.value;
    const newEndMonth = `${newEndYear}-${endMonthNum}`;
    onDateRangeChange(startMonth, newEndMonth);
  };

  // 종료 월 변경 핸들러
  const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndMonthNum = e.target.value;
    const newEndMonth = `${endYear}-${newEndMonthNum}`;
    onDateRangeChange(startMonth, newEndMonth);
  };

  // 옵션 비활성화 여부 검사
  const isEndOptionDisabled = (type: "year" | "month", value: string) => {
    if (type === "year") {
      return parseInt(value) < parseInt(startYear);
    } else {
      return parseInt(value) < parseInt(startMonthNum) && endYear === startYear;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-x-4">
      {/* 시작 날짜 선택 */}
      <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-comment-text">
        <div className="bg-bit-main py-2 px-3 border-r border-comment-text">
          <span className="text-sm font-medium text-white">영수증 시작달</span>
        </div>

        <select
          value={startYear}
          onChange={handleStartYearChange}
          className="py-2 px-2 border-none focus:ring-0 text-sm"
        >
          {yearOptions.map((option) => (
            <option key={`start-year-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={startMonthNum}
          onChange={handleStartMonthChange}
          className="py-2 px-2 border-none focus:ring-0 text-sm mr-2"
        >
          {monthOptions.map((option) => (
            <option key={`start-month-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-shrink-0 text-gray-400">~</div>

      {/* 종료 날짜 선택 */}
      <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-comment-text">
        <div className="bg-bit-main py-2 px-3 border-r border-comment-text">
          <span className="text-sm font-medium text-white">영수증 종료달</span>
        </div>

        <select
          value={endYear}
          onChange={handleEndYearChange}
          className="py-2 px-2 border-none focus:ring-0 text-sm"
        >
          {yearOptions.map((option) => (
            <option
              key={`end-year-${option.value}`}
              value={option.value}
              disabled={isEndOptionDisabled("year", option.value)}
            >
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={endMonthNum}
          onChange={handleEndMonthChange}
          className="py-2 px-2 border-none focus:ring-0 text-sm mr-2"
        >
          {monthOptions.map((option) => (
            <option
              key={`end-month-${option.value}`}
              value={option.value}
              disabled={isEndOptionDisabled("month", option.value)}
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
