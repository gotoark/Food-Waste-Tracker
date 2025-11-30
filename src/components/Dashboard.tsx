/**
 * Dashboard - Main container component for the Food Waste Tracker
 * Composes all components and manages the overall layout
 * 
 * Requirements: 7.1, 7.2, 7.5
 */

import { useWaste } from '../context/WasteContext';
import { calculateStatistics } from '../services/calculationService';
import { WasteEntryForm } from './WasteEntryForm';
import StatisticsPanel from './StatisticsPanel';
import { ChartSection } from './ChartSection';
import { WasteEntryList } from './WasteEntryList';
import './Dashboard.css';

/**
 * Dashboard component that orchestrates all main application components
 * Displays the form, statistics, charts, and entry list in a responsive layout
 */
export function Dashboard() {
  const { entries, deleteEntry, storageError, isStorageAvailable } = useWaste();

  // Calculate statistics from current entries
  const statistics = calculateStatistics(entries);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Food Waste Tracker</h1>
        <p className="dashboard-subtitle">
          Monitor and analyze food waste to understand its impact
        </p>
      </header>

      {/* Storage error notification */}
      {storageError && (
        <div className="error-banner" role="alert">
          <strong>Storage Error:</strong> {storageError}
        </div>
      )}

      {/* Warning if storage is unavailable */}
      {!isStorageAvailable && (
        <div className="warning-banner" role="alert">
          <strong>Warning:</strong> Data persistence unavailable - entries will be lost on refresh
        </div>
      )}

      <div className="dashboard-content">
        {/* Entry Form Section */}
        <section className="dashboard-section form-section">
          <WasteEntryForm />
        </section>

        {/* Statistics Section */}
        <section className="dashboard-section statistics-section">
          <h2>Summary Statistics</h2>
          <StatisticsPanel statistics={statistics} />
        </section>

        {/* Charts Section */}
        <section className="dashboard-section charts-section">
          <ChartSection entries={entries} />
        </section>

        {/* Entry List Section */}
        <section className="dashboard-section list-section">
          <WasteEntryList entries={entries} onDelete={deleteEntry} />
        </section>
      </div>
    </div>
  );
}
