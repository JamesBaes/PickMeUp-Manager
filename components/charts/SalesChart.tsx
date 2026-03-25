"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { SalesChartProps } from "./types/chart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesChart({
  labels = [],
  data = [],
  title = "Weekly Sales",
}: SalesChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue ($)",
        data,
        backgroundColor: "rgba(99, 179, 237, 0.7)",
        borderColor: "rgba(99, 179, 237, 1)",
        borderWidth: 0,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(99, 179, 237, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#001219",
        titleColor: "#F2F0EF",
        bodyColor: "#F2F0EF",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#9ca3af", font: { size: 12 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false, dash: [4, 4] },
        ticks: { color: "#9ca3af", font: { size: 12 }, stepSize: 50 },
      },
    },
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <p className="text-lg font-heading font-semibold text-gray-800 mb-6 text-left">
        {title}
      </p>
      <div className="w-full flex justify-center items-center h-96">
        <Bar data={chartData} options={options} width={700} height={400} />
      </div>
    </div>
  );
}
