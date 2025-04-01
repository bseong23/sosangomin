// features/competitor/api/competitorApi.ts
import axiosInstance from "@/api/axios";
import {
  CompetitorAnalysisRequest,
  CompetitorAnalysisResponse
} from "../types/competitor";

export const requestCompetitorAnalysis = async (
  params: CompetitorAnalysisRequest
) => {
  const response = await axiosInstance.post<CompetitorAnalysisResponse>(
    "/api/proxy/competitor/analysis",
    params
  );
  return response.data;
};

export const getCompetitorComparisons = async (storeId: number) => {
  const response = await axiosInstance.get(`/api/proxy/competitor/${storeId}`);
  return response.data;
};

export const getCompetitorComparisonResult = async (comparisonId: string) => {
  const response = await axiosInstance.get(
    `/api/proxy/competitor/comparison/${comparisonId}`
  );
  return response.data;
};
