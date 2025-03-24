// src/features/analysis/hooks/useAnalysisData.ts

import { useState, useEffect } from "react";
import { fetchAnalysisData } from "../api/analysisApi.tsx";

export interface AnalysisData {
  store_id?: number;
  source_id?: string;
  analysis_type?: string;
  created_at?: string;
  status?: string;
  result_data: {
    basic_stats?: {
      data: {
        total_sales: number;
        avg_transaction: number;
        total_transactions: number;
        unique_products: number;
        customer_avg: number;
      };
      summary: string;
    };
    weekday_sales?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
    time_period_sales?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
    hourly_sales?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
    top_products?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
    holiday_sales?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
    season_sales?: {
      data: {
        [key: string]: number;
      };
      summary: string;
    };
  };
  summary?: string;
}

export const useAnalysisData = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const analysisData = await fetchAnalysisData();
        setData(analysisData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        console.error("Error fetching analysis data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
