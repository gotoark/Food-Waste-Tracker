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
      <h2 id="entries-heading">Waste Entries ({entries.length})</h2>
      <div className="table-container" role="region" aria-labelledby="entries-heading" tabIndex={0}>
        <table className="entries-table" aria-label="List of waste entries">
          <thead>
            <tr>
              <th scope="col">Food Type</th>
              <th scope="col">Category</th>
              <th scope="col">Quantity</th>
              <th scope="col">Edible</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.foodType}</td>
                <td>{entry.category}</td>
                <td>{entry.quantityGrams}g</td>
                <td>
                  <span 
                    className={`edible-badge ${entry.isEdible ? 'edible' : 'non-edible'}`}
                    role="status"
                    aria-label={entry.isEdible ? 'Edible' : 'Not edible'}
                  >
                    {entry.isEdible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{formatDate(entry.timestamp)}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(entry.id)}
                    aria-label={`Delete ${entry.foodType} entry from ${formatDate(entry.timestamp)}`}
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
        <div 
          className="confirmation-dialog-overlay" 
          onClick={handleCancelDelete}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 id="dialog-title">Confirm Deletion</h3>
            <p id="dialog-description">
              Are you sure you want to delete this waste entry? This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button 
                className="cancel-button" 
                onClick={handleCancelDelete}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleConfirmDelete}
                aria-label="Confirm deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
