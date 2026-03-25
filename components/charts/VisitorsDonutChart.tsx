'use client'

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface VisitorsDonutChartProps {
  daily: number;   // Unique visitors today
  weekly: number;  // Unique visitors this week
}

export default function VisitorsDonutChart({ daily, weekly }: VisitorsDonutChartProps) {
  // Returning = weekly - daily (approximation)
  const returning = Math.max(weekly - daily, 0);

  const data = {
    labels: ['Today\'s Visitors', 'Other Weekly Visitors'],
    datasets: [
      {
        data: [daily, returning],
        backgroundColor: ['#3b82f6', '#a3a3a3'],
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="bg-white h-56 flex flex-col"> 
      <Doughnut data={data} options={options} />         
    </div>
  );
}