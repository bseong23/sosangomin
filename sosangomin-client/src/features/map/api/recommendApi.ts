import axiosInstance from "@/api/axios";

/**
 * 추천 지역 TOP N API 요청
 * @param {string} industryName - 업종 이름
 * @param {string} targetAge - 타겟 연령
 * @param {string[]} priority - 우선 순위 배열
 * @param {number} topN - TOP N 값
 * @returns {Promise<object>} 추천 지역 TOP N 데이터
 */
export const getTopRecommendedLocations = async (
  industryName: string,
  targetAge: string,
  priority: string[],
  topN: number
) => {
  try {
    const response = await axiosInstance.post(
      "/api/proxy/location/recommend/top", // URL
      {
        // Body에 포함될 데이터
        industry_name: industryName,
        target_age: targetAge,
        priority: priority, // 배열 그대로 전송
        top_n: topN
      }
    );
    return response.data;
  } catch (error) {
    console.error("추천 지역 TOP N 조회 실패:", error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

/**
 * 추천 지역 지도 API 요청
 * @param {string} industryName - 업종 이름
 * @param {string} targetAge - 타겟 연령
 * @param {string[]} priority - 우선 순위 배열
 * @param {number} topN - TOP N 값
 * @returns {Promise<object>} 추천 지역 지도 데이터
 */
export const getRecommendedLocationsOnMap = async (
  industryName: string,
  targetAge: string,
  priority: string[],
  topN: number
) => {
  try {
    const response = await axiosInstance.get(
      "/api/proxy/location/recommend/map",
      {
        params: {
          industry_name: industryName,
          target_age: targetAge,
          priority: priority.join(","), // 배열을 콤마로 연결된 문자열로 변환
          top_n: topN
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("추천 지역 지도 조회 실패:", error);
    throw error;
  }
};
