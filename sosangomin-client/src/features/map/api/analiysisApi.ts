import axiosInstance from "@/api/axios";

/**
 * 지역 분석 요약 API 요청
 * @param {string} regionName - 지역 이름
 * @param {string} industryName - 업종 이름
 * @returns {Promise<object>} 지역 분석 요약 데이터
 */
export const getAreaAnalysisSummary = async (
  regionName: string,
  industryName: string
) => {
  try {
    const response = await axiosInstance.get(
      "/api/proxy/area-analysis/summary",
      {
        params: {
          regionName,
          industryName
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("지역 분석 요약 조회 실패:", error);
    throw error;
  }
};

export const getPopulation = async (regionName: string) => {
  try {
    const response = await axiosInstance.get(
      "/api/proxy/area-analysis/population",
      {
        params: {
          regionName
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("인구 상세 조회 실패:", error);
    throw error;
  }
};

export const getBuiness = async (regionName: string, industryName: string) => {
  try {
    const response = await axiosInstance.get(
      "/api/proxy/area-analysis/category",
      {
        params: {
          regionName,
          industryName
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("업종 상세 조회 실패:", error);
    throw error;
  }
};

export const getSales = async (regionName: string, industryName: string) => {
  try {
    const response = await axiosInstance.get("/api/proxy/area-analysis/sales", {
      params: {
        regionName,
        industryName
      }
    });
    return response.data;
  } catch (error) {
    console.error("매출 상세 조회 실패:", error);
    throw error;
  }
};
