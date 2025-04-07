import axiosInstance from "@/api/axios";

/**
 * 가게 등록 API 요청
 * @param {object} storeData - 등록할 가게 정보
 */
export const registerStore = async (storeData: {
  store_name: string;
  business_number: string;
  pos_type: string;
  category: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "/api/proxy/store/register-with-business",
      storeData
    );
    return response.data;
  } catch (error) {
    console.error("가게 등록 실패:", error);
    throw error;
  }
};

/**
 * 가게 목록 조회 API
 * @returns {Promise<StoreInfo[]>} 가게 목록 데이터
 */
export const getStoreList = async () => {
  try {
    const response = await axiosInstance.get("/api/proxy/store/list");
    return response.data;
  } catch (error) {
    console.error("가게 목록 조회 실패:", error);
    throw error;
  }
};

export const postmainstore = async (store_id: string) => {
  try {
    const response = await axiosInstance.post("/api/proxy/store/set-main", {
      store_id: store_id // store_id를 요청 본문에 포함
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("대표가게 설정 실패:", error);
    throw error;
  }
};

export const deleteStore = async (storeId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/api/proxy/store/${storeId}`);
    return response.data;
  } catch (error) {
    console.error("가게 삭제 실패:", error);
    throw error;
  }
};
