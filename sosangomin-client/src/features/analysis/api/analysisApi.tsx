// src/features/analysis/api/analysisApi.ts

import { AnalysisData } from "../hooks/useAnalysisData";

// 실제 환경에서는 API 호출을 구현하시면 됩니다.
// 현재는 예시 데이터를 반환합니다.
export const fetchAnalysisData = async (): Promise<AnalysisData> => {
  // 실제 구현에서는 아래 주석 해제
  // const response = await fetch('/api/analysis');
  // if (!response.ok) {
  //   throw new Error('Failed to fetch analysis data');
  // }
  // return await response.json();

  // 예시 데이터
  return {
    result_data: {
      basic_stats: {
        data: {
          total_sales: 14089000,
          avg_transaction: 46042.48366013072,
          total_transactions: 306,
          unique_products: 27,
          customer_avg: 47278.523489932886
        },
        summary: "이 통계 데이터는 비즈니스의 핵심 성과를 보여줍니다."
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
          "요일별 매출 차트는 주말(토요일, 일요일)에 매출이 가장 높고, 화요일에 가장 낮은 패턴을 보여줍니다."
      },
      time_period_sales: {
        data: {
          기타: 26000,
          저녁: 8553000,
          점심: 5510000
        },
        summary: "이 원형 차트는 시간대별 매출 분포를 보여줍니다."
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
          "이 시간별 매출 차트는 오전 11시부터 저녁 8시(20시)까지의 매출 흐름을 보여줍니다."
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
          "이 차트는 상위 5개 판매 제품을 보여주며, 공기밥이 302만 5천원으로 가장 높은 매출을 기록했습니다."
      },
      holiday_sales: {
        data: {
          평일: 7122000,
          휴일: 6967000
        },
        summary: "이 데이터는 평일과 휴일의 매출 비교를 보여줍니다."
      },
      season_sales: {
        data: {
          봄: 14089000
        },
        summary:
          "이 차트는 봄 시즌의 매출 데이터를 보여주고 있으며, 봄철 매출액이 14,089,000원으로 기록되었습니다."
      }
    }
  };
};
