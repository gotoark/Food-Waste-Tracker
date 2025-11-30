/**
 * BarChart component for comparing edible vs non-edible waste
 * Requirements: 3.2 - Display a bar chart comparing edible versus non-edible waste quantities
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { WasteEntry } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  entries: WasteEntry[];
}

/**
 * Transforms waste entries into bar chart data format
 * Separates entries into edible and non-edible categories
 * 
 * @param entries - Array of waste entries
 * @returns Chart.js data object for bar chart
 */
export function transformToBarChartData(entries: WasteEntry[]) {
  // Calculate totals for edible and non-edible waste
  const edibleTotal = entries
    .filter(entry => entry.isEdible)
    .reduce((sum, entry) => sum + entry.quantityGrams, 0) / 1000; // Convert to kg

  const nonEdibleTotal = entries
    .filter(entry => !entry.isEdible)
    .reduce((sum, entry) => sum + entry.quantityGrams, 0) / 1000; // Convert to kg

  return {
    labels: ['Edible', 'Non-Edible'],
    datasets: [
      {
        label: 'Waste Quantity (kg)',
        data: [edibleTotal, nonEdibleTotal],
        backgroundColor: ['#4BC0C0', '#FF6384'],
        borderColor: ['#3A9999', '#CC4F6A'],
        borderWidth: 2
      }
    ]
  };
}

/**
 * BarChart component displaying edible vs non-edible waste comparison
 */
export function BarChart({ entries }: BarChartProps) {
  const chartData = transformToBarChartData(entries);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Edible vs Non-Edible Waste',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y || 0;
            return `${value.toFixed(2)} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity (kg)',
          font: {
            size: 12
          }
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + ' kg';
          }
        }
      }
    }
  };

  // Show empty state if no data
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        No waste data to display
      </div>
    );
  }

  return <Bar data={chartData} options={options} />;
}
