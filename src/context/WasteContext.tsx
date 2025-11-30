/**
 * WasteContext - Global state management for waste entries
 * Provides state and actions for managing waste entries throughout the application
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { WasteEntry } from '../types';
import { saveEntries, loadEntries, deleteEntry as deleteEntryFromStorage } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Shape of the context value
 */
interface WasteContextValue {
  /** Array of all waste entries */
  entries: WasteEntry[];
  /** Add a new waste entry */
  addEntry: (entry: Omit<WasteEntry, 'id' | 'timestamp'>) => void;
  /** Delete a waste entry by ID */
  deleteEntry: (id: string) => void;
  /** Load entries from storage */
  loadEntries: () => void;
  /** Storage error message, if any */
  storageError: string | null;
  /** Whether storage is available */
  isStorageAvailable: boolean;
}

/**
 * Context for waste entry state
 */
const WasteContext = createContext<WasteContextValue | undefined>(undefined);

/**
 * Props for WasteProvider component
 */
interface WasteProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application and provides waste entry state
 */
export function WasteProvider({ children }: WasteProviderProps) {
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);

  /**
   * Load entries from localStorage
   */
  const loadEntriesFromStorage = useCallback(() => {
    try {
      const loadedEntries = loadEntries();
      setEntries(loadedEntries);
      setStorageError(null);
      setIsStorageAvailable(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load entries';
      setStorageError(errorMessage);
      setIsStorageAvailable(false);
      // Initialize with empty array on error
      setEntries([]);
    }
  }, []);

  /**
   * Add a new waste entry
   */
  const addEntry = useCallback((entryData: Omit<WasteEntry, 'id' | 'timestamp'>) => {
    const newEntry: WasteEntry = {
      ...entryData,
      id: uuidv4(),
      timestamp: new Date()
    };

    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries, newEntry];
      
      // Persist to storage
      try {
        saveEntries(updatedEntries);
        setStorageError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save entry';
        setStorageError(errorMessage);
      }
      
      return updatedEntries;
    });
  }, []);

  /**
   * Delete a waste entry by ID
   */
  const deleteEntry = useCallback((id: string) => {
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.filter(entry => entry.id !== id);
      
      // Persist to storage
      try {
        deleteEntryFromStorage(id);
        setStorageError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete entry';
        setStorageError(errorMessage);
      }
      
      return updatedEntries;
    });
  }, []);

  // Load entries on mount
  useEffect(() => {
    loadEntriesFromStorage();
  }, [loadEntriesFromStorage]);

  const value: WasteContextValue = {
    entries,
    addEntry,
    deleteEntry,
    loadEntries: loadEntriesFromStorage,
    storageError,
    isStorageAvailable
  };

  return (
    <WasteContext.Provider value={value}>
      {children}
    </WasteContext.Provider>
  );
}

/**
 * Custom hook for consuming the WasteContext
 * @throws Error if used outside of WasteProvider
 */
export function useWaste(): WasteContextValue {
  const context = useContext(WasteContext);
  
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  
  return context;
}
