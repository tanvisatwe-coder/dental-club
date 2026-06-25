import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DentalPieChart = ({ healthy, cavity, filled }) => {
  const data = {
    labels: ['Healthy', 'Cavity', 'Filled'],
    datasets: [
      {
        data: [healthy, cavity, filled],
        backgroundColor: ['#22c55e', '#ec4899', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow h-80">
      <h2 className="text-lg font-bold mb-4">Dental Health Overview</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default DentalPieChart;