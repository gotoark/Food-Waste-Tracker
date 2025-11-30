/**
 * Storage service for managing waste entries in localStorage
 * Handles serialization, deserialization, and error handling
 */

import type { WasteEntry, WasteCategory } from '../types';

const STORAGE_KEY = 'foodWasteEntries';

/**
 * Interface for serialized waste entry (dates as strings)
 */
interface SerializedWasteEntry {
  id: string;
  foodType: string;
  category: WasteCategory;
  quantityGrams: number;
  isEdible: boolean;
  timestamp: string;
}

/**
 * Save waste entries to localStorage
 * @param entries - Array of waste entries to save
 * @throws Error if localStorage is unavailable or quota exceeded
 */
export function saveEntries(entries: WasteEntry[]): void {
  try {
    // Serialize entries with dates converted to ISO strings
    const serialized: SerializedWasteEntry[] = entries.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }));
    
    const json = JSON.stringify(serialized);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage limit reached - please delete old entries');
      }
      throw new Error(`Failed to save entries: ${error.message}`);
    }
    throw new Error('Failed to save entries: Unknown error');
  }
}

/**
 * Load waste entries from localStorage
 * @returns Array of waste entries, or empty array if none exist
 * @throws Error if localStorage is unavailable or data is corrupted
 */
export function loadEntries(): WasteEntry[] {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    
    // Return empty array if no data exists
    if (!json) {
      return [];
    }
    
    const serialized: SerializedWasteEntry[] = JSON.parse(json);
    
    // Deserialize entries with dates parsed from ISO strings
    const entries: WasteEntry[] = serialized.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
    
    return entries;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load entries: ${error.message}`);
    }
    throw new Error('Failed to load entries: Unknown error');
  }
}

/**
 * Delete a specific waste entry by ID
 * @param id - The ID of the entry to delete
 * @throws Error if localStorage operations fail
 */
export function deleteEntry(id: string): void {
  try {
    const entries = loadEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    saveEntries(filtered);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete entry: ${error.message}`);
    }
    throw new Error('Failed to delete entry: Unknown error');
  }
}

/**
 * Clear all waste entries from localStorage
 * @throws Error if localStorage operations fail
 */
export function clearAllEntries(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to clear entries: ${error.message}`);
    }
    throw new Error('Failed to clear entries: Unknown error');
  }
}

/**
 * Check if localStorage is available
 * @returns true if localStorage is available, false otherwise
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
