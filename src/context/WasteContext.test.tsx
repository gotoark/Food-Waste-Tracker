/**
 * Tests for WasteContext
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WasteProvider, useWaste } from './WasteContext';
import { WasteCategory } from '../types';
import * as storageService from '../services/storageService';

// Mock the storage service
vi.mock('../services/storageService');

describe('WasteContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock loadEntries to return empty array by default
    vi.mocked(storageService.loadEntries).mockReturnValue([]);
  });

  it('should throw error when useWaste is used outside provider', () => {
    expect(() => {
      renderHook(() => useWaste());
    }).toThrow('useWaste must be used within a WasteProvider');
  });

  it('should provide initial empty entries', () => {
    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    expect(result.current.entries).toEqual([]);
  });

  it('should add a new entry with id and timestamp', () => {
    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    act(() => {
      result.current.addEntry({
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true
      });
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0]).toMatchObject({
      foodType: 'Apple',
      category: WasteCategory.FRUITS,
      quantityGrams: 200,
      isEdible: true
    });
    expect(result.current.entries[0].id).toBeDefined();
    expect(result.current.entries[0].timestamp).toBeInstanceOf(Date);
  });

  it('should delete an entry by id', () => {
    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    // Add an entry
    act(() => {
      result.current.addEntry({
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true
      });
    });

    const entryId = result.current.entries[0].id;

    // Delete the entry
    act(() => {
      result.current.deleteEntry(entryId);
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('should call saveEntries when adding an entry', () => {
    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    act(() => {
      result.current.addEntry({
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true
      });
    });

    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
  });

  it('should call deleteEntry from storage service when deleting', () => {
    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    // Add an entry
    act(() => {
      result.current.addEntry({
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true
      });
    });

    const entryId = result.current.entries[0].id;

    // Delete the entry
    act(() => {
      result.current.deleteEntry(entryId);
    });

    expect(storageService.deleteEntry).toHaveBeenCalledWith(entryId);
  });

  it('should handle storage errors gracefully when adding', () => {
    vi.mocked(storageService.saveEntries).mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    act(() => {
      result.current.addEntry({
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true
      });
    });

    // Entry should still be added to state
    expect(result.current.entries).toHaveLength(1);
    // Error should be captured
    expect(result.current.storageError).toBe('Storage quota exceeded');
  });

  it('should load entries from storage on mount', () => {
    const mockEntries = [
      {
        id: '1',
        foodType: 'Apple',
        category: WasteCategory.FRUITS,
        quantityGrams: 200,
        isEdible: true,
        timestamp: new Date('2025-01-01')
      }
    ];

    vi.mocked(storageService.loadEntries).mockReturnValue(mockEntries);

    const { result } = renderHook(() => useWaste(), {
      wrapper: WasteProvider
    });

    expect(result.current.entries).toEqual(mockEntries);
  });
});
