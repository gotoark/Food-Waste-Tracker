/**
 * PieChart component for displaying waste distribution by category
 * Requirements: 3.1 - Display a pie chart showing waste distribution by category
 */

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { WasteEntry, WasteCategory } from '../types';
import { WasteCategory as WasteCategoryEnum } from '../types';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  entries: WasteEntry[];
}

/**
 * Color scheme for different waste categories
 */
const CATEGORY_COLORS: Record<WasteCategory, string> = {
  [WasteCategoryEnum.FRUITS]: '#FF6384',
  [WasteCategoryEnum.VEGETABLES]: '#36A2EB',
  [WasteCategoryEnum.GRAINS]: '#FFCE56',
  [WasteCategoryEnum.PROTEINS]: '#4BC0C0',
  [WasteCategoryEnum.DAIRY]: '#9966FF',
  [WasteCategoryEnum.OTHER]: '#FF9F40'
};

/**
 * Transforms waste entries into pie chart data format
 * Groups entries by category and sums quantities
 * 
 * @param entries - Array of waste entries
 * @returns Chart.js data object for pie chart
 */
export function transformToPieChartData(entries: WasteEntry[]) {
  // Aggregate quantities by category
  const categoryTotals: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (!categoryTotals[entry.category]) {
      categoryTotals[entry.category] = 0;
    }
    categoryTotals[entry.category] += entry.quantityGrams;
  });

  // Convert to arrays for Chart.js
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals).map(grams => grams / 1000); // Convert to kg
  const backgroundColor = labels.map(category => CATEGORY_COLORS[category as WasteCategory]);

  return {
    labels,
    datasets: [
      {
        label: 'Waste by Category (kg)',
        data,
        backgroundColor,
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };
}

/**
 * PieChart component displaying waste distribution by category
 */
export function PieChart({ entries }: PieChartProps) {
  const chartData = transformToPieChartData(entries);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)} kg`;
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

  return <Pie data={chartData} options={options} />;
}
