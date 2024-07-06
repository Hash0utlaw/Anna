



// components/MetricsChart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MetricsChart({ data, platform }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: `${platform} Metrics`,
        data: Object.values(data),
        backgroundColor: platform === 'Instagram' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${platform} Metrics Overview`,
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}