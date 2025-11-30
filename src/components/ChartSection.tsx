/**
 * ChartSection component that orchestrates all chart components
 * Requirements: 3.1, 3.2, 3.3, 3.5 - Display all charts with proper labels and legends
 */

import type { WasteEntry } from '../types';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import './ChartSection.css';

interface ChartSectionProps {
  entries: WasteEntry[];
}

/**
 * ChartSection component that displays all waste visualization charts
 * Orchestrates rendering of pie, bar, and line charts
 */
export function ChartSection({ entries }: ChartSectionProps) {
  return (
    <div className="chart-section">
      <h2 className="chart-section-title">Waste Analytics</h2>
      
      <div className="chart-grid">
        <div className="chart-container">
          <h3 className="chart-title">Waste Distribution by Category</h3>
          <PieChart entries={entries} />
        </div>

        <div className="chart-container">
          <BarChart entries={entries} />
        </div>

        <div className="chart-container chart-container-wide">
          <LineChart entries={entries} />
        </div>
      </div>
    </div>
  );
}
