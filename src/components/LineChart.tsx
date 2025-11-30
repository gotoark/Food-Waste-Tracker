/**
 * LineChart component for displaying waste trends over time
 * Requirements: 3.3 - Display a line chart showing waste trends over time
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { WasteEntry } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  entries: WasteEntry[];
}

/**
 * Groups entries by date and calculates daily totals
 * 
 * @param entries - Array of waste entries
 * @returns Object mapping date strings to total waste in kg
 */
function groupEntriesByDate(entries: WasteEntry[]): Record<string, number> {
  const dailyTotals: Record<string, number> = {};

  entries.forEach(entry => {
    // Format date as YYYY-MM-DD
    const date = new Date(entry.timestamp);
    const dateKey = date.toISOString().split('T')[0];

    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = 0;
    }
    dailyTotals[dateKey] += entry.quantityGrams / 1000; // Convert to kg
  });

  return dailyTotals;
}

/**
 * Transforms waste entries into line chart data format
 * Groups entries by date and shows daily waste trends
 * 
 * @param entries - Array of waste entries
 * @returns Chart.js data object for line chart
 */
export function transformToLineChartData(entries: WasteEntry[]) {
  const dailyTotals = groupEntriesByDate(entries);

  // Sort dates chronologically
  const sortedDates = Object.keys(dailyTotals).sort();
  const data = sortedDates.map(date => dailyTotals[date]);

  // Format dates for display (e.g., "Dec 1")
  const labels = sortedDates.map(dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    labels,
    datasets: [
      {
        label: 'Daily Waste (kg)',
        data,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };
}

/**
 * LineChart component displaying waste trends over time
 */
export function LineChart({ entries }: LineChartProps) {
  const chartData = transformToLineChartData(entries);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Waste Trends Over Time',
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
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12
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

  return <Line data={chartData} options={options} />;
}
