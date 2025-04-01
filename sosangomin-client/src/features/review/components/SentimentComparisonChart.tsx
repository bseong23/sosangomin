// features/competitor/components/SentimentComparisonChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { StoreData } from "../types/competitor";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SentimentComparisonChartProps {
  myStore: StoreData;
  competitor: StoreData;
}

const SentimentComparisonChart: React.FC<SentimentComparisonChartProps> = ({
  myStore,
  competitor
}) => {
  const data = {
    labels: ["긍정", "중립", "부정"],
    datasets: [
      {
        label: "내 매장",
        data: [
          myStore.sentiment_distribution.positive,
          myStore.sentiment_distribution.neutral,
          myStore.sentiment_distribution.negative
        ],
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      },
      {
        label: "경쟁사",
        data: [
          competitor.sentiment_distribution.positive,
          competitor.sentiment_distribution.neutral,
          competitor.sentiment_distribution.negative
        ],
        backgroundColor: "rgba(255, 99, 132, 0.7)"
      }
    ]
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-semibold mb-2 text-sm">감정 분포 비교</h3>
      <Bar data={data} />
    </div>
  );
};

export default SentimentComparisonChart;
