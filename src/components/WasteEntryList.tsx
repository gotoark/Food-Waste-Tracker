/**
 * WasteEntryList - Component for displaying and managing waste entries
 * Shows all waste entries in a table format with delete functionality
 */

import { useState } from 'react';
import type { WasteEntry } from '../types';
import './WasteEntryList.css';

/**
 * Props for WasteEntryList component
 */
interface WasteEntryListProps {
  /** Array of waste entries to display */
  entries: WasteEntry[];
  /** Callback function to delete an entry by ID */
  onDelete: (id: string) => void;
}

/**
 * Component that displays a list of waste entries with delete functionality
 */
export function WasteEntryList({ entries, onDelete }: WasteEntryListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /**
   * Handle delete button click - show confirmation dialog
   */
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  /**
   * Confirm deletion and execute delete callback
   */
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  /**
   * Cancel deletion
   */
  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Display empty state when no entries exist
  if (entries.length === 0) {
    return (
      <div className="waste-entry-list">
        <h2>Waste Entries</h2>
        <div className="empty-state">
          <p>No waste entries yet. Add your first entry above to start tracking!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waste-entry-list">
      <h2>Waste Entries ({entries.length})</h2>
      <div className="table-container">
        <table className="entries-table">
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Edible</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.foodType}</td>
                <td>{entry.category}</td>
                <td>{entry.quantityGrams}g</td>
                <td>
                  <span className={`edible-badge ${entry.isEdible ? 'edible' : 'non-edible'}`}>
                    {entry.isEdible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{formatDate(entry.timestamp)}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(entry.id)}
                    aria-label={`Delete ${entry.foodType} entry`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="confirmation-dialog-overlay" onClick={handleCancelDelete}>
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this waste entry? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
