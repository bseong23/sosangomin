// src/features/analysis/hooks/useAnalysisData.ts
import { useState, useEffect } from "react";
import { AnalysisResultData, AnalysisDataResponse } from "../types/analysis";

/**
 * 분석 데이터를 가져오는 Hook.
 * 특정 분석 ID가 제공되면 해당 분석의 데이터를 가져오고,
 * 그렇지 않으면 가장 최근 분석 데이터를 가져옵니다.
 *
 * @param analysisId 분석 ID (옵션)
 * @returns 분석 데이터, 로딩 상태, 오류 정보
 */
export const useAnalysisData = (analysisId?: string): AnalysisDataResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<AnalysisResultData | null>(null);

  useEffect(() => {
    // API 연동 시 호출할 함수
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 실제 API 호출 코드로 대체
        // const response = analysisId
        //   ? await getAnalysisById(analysisId)
        //   : await getLatestAnalysis();

        // API 호출 지연 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock 데이터 - 실제로는 API 응답으로 대체
        const mockData: AnalysisResultData = {
          result_data: {
            basic_stats: {
              data: {
                total_sales: 14089000,
                avg_transaction: 46042.48366013072,
                total_transactions: 306,
                unique_products: 27,
                customer_avg: 47278.523489932886
              },
              summary:
                "이번 달 총 매출은 14,089,000원으로, 평균 거래 금액은 약 46,042원입니다. 총 306건의 거래가 있었으며, 27개의 고유 제품이 판매되었습니다."
            },
            weekday_sales: {
              data: {
                Saturday: 3264000,
                Sunday: 3703000,
                Thursday: 2649000,
                Tuesday: 1836000,
                Wednesday: 2637000
              },
              summary:
                "주말(토, 일)에 가장 높은 매출을 기록했으며, 특히 일요일은 3,703,000원으로 가장 높은 매출을 보였습니다. 화요일의 매출이 가장 낮았으며, 주말과 평일의 매출 차이가 눈에 띕니다."
            },
            hourly_sales: {
              data: {
                "11": 420000,
                "12": 1714000,
                "13": 1999000,
                "14": 1274000,
                "15": 103000,
                "16": 26000,
                "17": 1019000,
                "18": 1776000,
                "19": 3603000,
                "20": 2155000
              },
              summary:
                "19시에 3,603,000원으로 가장 높은 매출이 발생했으며, 점심 시간대(12-14시)와 저녁 시간대(17-20시)에 매출이 집중되어 있습니다. 특히 15-16시는 매출이 현저히 낮으므로 이 시간대에 특별 프로모션을 고려해볼 수 있습니다."
            },
            top_products: {
              data: {
                공기밥: 3025000,
                소주: 1601000,
                "조림점심특선(소)": 1538000,
                "조림점심특선(중)": 1321000,
                "매콤명태조림(소)": 975000
              },
              summary:
                "공기밥이 3,025,000원으로 가장 높은 매출을 기록했으며, 그 다음으로 소주(1,601,000원)와 조림점심특선(소)(1,538,000원)이 높은 매출을 보였습니다. 조림류 메뉴가 전반적으로 인기가 높습니다."
            },
            time_period_sales: {
              data: {
                기타: 26000,
                저녁: 8553000,
                점심: 5510000
              },
              summary:
                "저녁 시간대 매출이 8,553,000원으로 가장 높았으며, 점심 시간대는 5,510,000원으로 그 뒤를 이었습니다. 저녁 시간대 매출이 점심 시간대 대비 약 55% 높습니다."
            },
            holiday_sales: {
              data: {
                평일: 7122000,
                휴일: 6967000
              },
              summary:
                "평일과 휴일의 매출이 비슷한 수준이지만, 평일이 7,122,000원으로 휴일(6,967,000원)보다 약간 높습니다. 휴일이 평일보다 영업일수가 적음에도 불구하고 비슷한 매출을 보이는 것은 휴일당 매출이 더 높다는 것을 의미합니다."
            },
            season_sales: {
              data: {
                봄: 14089000
              },
              summary:
                "현재 데이터는 봄 시즌만 있으며, 봄 시즌 총 매출은 14,089,000원입니다. 다른 시즌과의 비교는 아직 불가능합니다."
            }
          },
          summary:
            "우리 가게는 주말과 저녁 시간대에 매출이 집중되어 있으며, 특히 일요일 저녁(19시)에 매출이 가장 높습니다. 주요 수익원은 공기밥, 소주, 조림류 메뉴입니다. 매출 증대를 위해 화요일 특별 프로모션, 오후 시간대(15-16시) 특가 메뉴 개발, 인기 메뉴인 조림류의 다양화를 고려해볼 수 있습니다. 현재 봄 시즌 매출이 양호하며, 다음 달에는 12.1%의 성장이 예상됩니다.",
          analysis_id: analysisId || "default",
          created_at: new Date().toISOString(),
          status: "success"
        };

        // ID에 따라 데이터 약간 변경 (Mock 데이터 테스트용)
        if (analysisId === "a2") {
          mockData.result_data.basic_stats.data.total_sales = 13250000;
          mockData.result_data.basic_stats.data.total_transactions = 290;
        } else if (analysisId === "a3") {
          mockData.result_data.basic_stats.data.total_sales = 12780000;
          mockData.result_data.basic_stats.data.total_transactions = 275;
        } else if (analysisId === "a4") {
          mockData.result_data.basic_stats.data.total_sales = 13980000;
          mockData.result_data.basic_stats.data.total_transactions = 310;
        }

        setData(mockData);
      } catch (err) {
        console.error("분석 데이터 조회 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analysisId]); // analysisId가 변경될 때마다 데이터를 다시 불러옴

  return { data, loading, error };
};
