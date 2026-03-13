'use client'

import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type TopItem = { item_name: string; count: number };

interface TopItemsChartProps {
  items: TopItem[];
}

// Capitalize the first letter
function formatLabel(str: string) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export default function TopItemsChart({ items }: TopItemsChartProps) {
  const data = {
    labels: items.map(i => formatLabel(i.item_name)),
    datasets: [
      {
        label: 'Top Items (Last 7 Days)',
        data: items.map(i => i.count),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', 
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded-md w-full">
      <h3 className="font-semibold font-heading mb-1 text-gray-800 text-md ">Popular Items</h3>
      <Bar data={data} options={options} height={160} />
    </div>
  );
}