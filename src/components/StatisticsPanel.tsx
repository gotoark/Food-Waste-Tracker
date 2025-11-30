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
    <div className="statistics-panel" role="region" aria-label="Food waste statistics">
      <div className="stat-card" role="article" aria-labelledby="total-waste-label">
        <div className="stat-label" id="total-waste-label">Total Waste</div>
        <div className="stat-value" aria-label={`Total waste: ${formatKilograms(statistics.totalWasteKg)}`}>
          {formatKilograms(statistics.totalWasteKg)}
        </div>
      </div>

      <div className="stat-card" role="article" aria-labelledby="edible-waste-label">
        <div className="stat-label" id="edible-waste-label">Edible Waste</div>
        <div className="stat-value" aria-label={`Edible waste percentage: ${formatPercentage(statistics.ediblePercentage)}`}>
          {formatPercentage(statistics.ediblePercentage)}
        </div>
      </div>

      <div className="stat-card" role="article" aria-labelledby="total-entries-label">
        <div className="stat-label" id="total-entries-label">Total Entries</div>
        <div className="stat-value" aria-label={`Total entries: ${formatCount(statistics.totalEntries)}`}>
          {formatCount(statistics.totalEntries)}
        </div>
      </div>

      <div className="stat-card stat-card-highlight" role="article" aria-labelledby="servings-label">
        <div className="stat-label" id="servings-label">People Could Be Served</div>
        <div className="stat-value" aria-label={`People that could be served: ${formatServings(statistics.servingsEquivalent)}`}>
          {formatServings(statistics.servingsEquivalent)}
        </div>
      </div>
    </div>
  );
}
