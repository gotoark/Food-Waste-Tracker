/**
 * StatisticsPanel Component
 * Displays summary statistics about food waste in a card grid layout
 * 
 * Requirements: 2.4, 4.1, 4.2, 4.3, 4.4
 */

import type { WasteStatistics } from '../types';
import {
  formatKilograms,
  formatPercentage,
  formatCount,
  formatServings
} from '../services/calculationService';
import './StatisticsPanel.css';

interface StatisticsPanelProps {
  statistics: WasteStatistics;
}

export default function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  return (
    <div className="statistics-panel">
      <div className="stat-card">
        <div className="stat-label">Total Waste</div>
        <div className="stat-value">{formatKilograms(statistics.totalWasteKg)}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Edible Waste</div>
        <div className="stat-value">{formatPercentage(statistics.ediblePercentage)}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Total Entries</div>
        <div className="stat-value">{formatCount(statistics.totalEntries)}</div>
      </div>

      <div className="stat-card stat-card-highlight">
        <div className="stat-label">People Could Be Served</div>
        <div className="stat-value">{formatServings(statistics.servingsEquivalent)}</div>
      </div>
    </div>
  );
}
