import React from "react";
import { FinalReportDetail } from "../types/finalReport";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface HeaderComponentProps {
  data: FinalReportDetail;
  onCreateReport?: () => void;
  isCreating?: boolean; // 로딩 상태를 전달받는 prop 추가
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  data,
  onCreateReport,
  isCreating = false // 기본값은 false
}) => {
  const handleExportPDF = async () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    reportElement.classList.add("pdf-export");

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // 여러 페이지일 경우 분할
    if (imgHeight <= pageHeight) {
      // 한 페이지에 들어가는 경우
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // 여러 페이지에 걸쳐서 이미지 넣기
      const canvasHeight = canvas.height;
      const canvasWidth = canvas.width;
      const pageCanvas = document.createElement("canvas");
      const pageContext = pageCanvas.getContext("2d")!;
      const pageHeightPx = (pageHeight * canvasWidth) / pageWidth;

      let renderedHeight = 0;

      while (renderedHeight < canvasHeight) {
        pageCanvas.width = canvasWidth;
        pageCanvas.height = Math.min(
          pageHeightPx,
          canvasHeight - renderedHeight
        );

        pageContext.clearRect(0, 0, canvasWidth, pageCanvas.height);
        pageContext.drawImage(
          canvas,
          0,
          renderedHeight,
          canvasWidth,
          pageCanvas.height,
          0,
          0,
          canvasWidth,
          pageCanvas.height
        );

        const pageData = pageCanvas.toDataURL("image/png");
        if (renderedHeight > 0) pdf.addPage();
        pdf.addImage(
          pageData,
          "PNG",
          0,
          0,
          imgWidth,
          (pageCanvas.height * imgWidth) / canvasWidth
        );

        renderedHeight += pageHeightPx;
      }
    }

    pdf.save(`${data.store_name}_보고서.pdf`);
    reportElement.classList.remove("pdf-export");
  };

  return (
    <div className="bg-basic-white rounded-lg mb-6 p-4 md:p-5 lg:p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center flex-wrap">
        {/* 1. 가게이름 및 타이틀 (왼쪽) */}
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-bit-main">
          {data.store_name} 종합 분석 보고서
        </h1>

        <div className="flex items-center mt-3 sm:mt-0 space-x-3 md:space-x-4 lg:space-x-5">
          {/* 분석하기 버튼 - 항상 표시됨 */}
          {/* PDF 저장 버튼 */}
          <button
            onClick={handleExportPDF}
            className="ml-5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-bit-main rounded-lg text-sm transition"
          >
            PDF 저장
          </button>
          <button
            onClick={onCreateReport}
            className={`flex items-center px-3 py-2 rounded-lg hover:bg-blue-900 ${
              isCreating || !onCreateReport
                ? "bg-comment-text cursor-not-allowed"
                : "bg-bit-main hover:bg-opacity-90"
            } text-basic-white rounded-md transition duration-200`}
            disabled={isCreating || !onCreateReport}
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-basic-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm md:text-base lg:text-lg">
                  분석 중...
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm md:text-base lg:text-lg">
                  새 분석하기
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
