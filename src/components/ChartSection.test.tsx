/**
 * Tests for chart data transformation functions
 */

import { describe, it, expect } from 'vitest';
import { transformToPieChartData } from './PieChart';
import { transformToBarChartData } from './BarChart';
import { transformToLineChartData } from './LineChart';
import type { WasteEntry } from '../types';
import { WasteCategory } from '../types';

describe('Chart Data Transformations', () => {
  const mockEntries: WasteEntry[] = [
    {
      id: '1',
      foodType: 'Apple',
      category: WasteCategory.FRUITS,
      quantityGrams: 500,
      isEdible: true,
      timestamp: new Date('2025-12-01T10:00:00Z')
    },
    {
      id: '2',
      foodType: 'Bread',
      category: WasteCategory.GRAINS,
      quantityGrams: 300,
      isEdible: false,
      timestamp: new Date('2025-12-01T11:00:00Z')
    },
    {
      id: '3',
      foodType: 'Banana',
      category: WasteCategory.FRUITS,
      quantityGrams: 200,
      isEdible: true,
      timestamp: new Date('2025-12-02T10:00:00Z')
    }
  ];

  describe('transformToPieChartData', () => {
    it('should group entries by category and sum quantities', () => {
      const result = transformToPieChartData(mockEntries);
      
      expect(result.labels).toContain('Fruits');
      expect(result.labels).toContain('Grains');
      expect(result.datasets[0].data).toHaveLength(2);
      
      // Fruits: 500 + 200 = 700g = 0.7kg
      const fruitsIndex = result.labels.indexOf('Fruits');
      expect(result.datasets[0].data[fruitsIndex]).toBe(0.7);
      
      // Grains: 300g = 0.3kg
      const grainsIndex = result.labels.indexOf('Grains');
      expect(result.datasets[0].data[grainsIndex]).toBe(0.3);
    });

    it('should return empty data for empty entries', () => {
      const result = transformToPieChartData([]);
      
      expect(result.labels).toHaveLength(0);
      expect(result.datasets[0].data).toHaveLength(0);
    });
  });

  describe('transformToBarChartData', () => {
    it('should separate edible and non-edible waste', () => {
      const result = transformToBarChartData(mockEntries);
      
      expect(result.labels).toEqual(['Edible', 'Non-Edible']);
      
      // Edible: 500 + 200 = 700g = 0.7kg
      expect(result.datasets[0].data[0]).toBe(0.7);
      
      // Non-edible: 300g = 0.3kg
      expect(result.datasets[0].data[1]).toBe(0.3);
    });

    it('should handle all edible entries', () => {
      const allEdible = mockEntries.map(e => ({ ...e, isEdible: true }));
      const result = transformToBarChartData(allEdible);
      
      expect(result.datasets[0].data[0]).toBe(1.0); // 1000g = 1kg
      expect(result.datasets[0].data[1]).toBe(0);
    });
  });

  describe('transformToLineChartData', () => {
    it('should group entries by date', () => {
      const result = transformToLineChartData(mockEntries);
      
      expect(result.labels).toHaveLength(2); // Two different dates
      expect(result.datasets[0].data).toHaveLength(2);
      
      // Dec 1: 500 + 300 = 800g = 0.8kg
      expect(result.datasets[0].data[0]).toBe(0.8);
      
      // Dec 2: 200g = 0.2kg
      expect(result.datasets[0].data[1]).toBe(0.2);
    });

    it('should sort dates chronologically', () => {
      const unsortedEntries: WasteEntry[] = [
        {
          id: '1',
          foodType: 'Apple',
          category: WasteCategory.FRUITS,
          quantityGrams: 100,
          isEdible: true,
          timestamp: new Date('2025-12-03T10:00:00Z')
        },
        {
          id: '2',
          foodType: 'Bread',
          category: WasteCategory.GRAINS,
          quantityGrams: 200,
          isEdible: false,
          timestamp: new Date('2025-12-01T10:00:00Z')
        }
      ];
      
      const result = transformToLineChartData(unsortedEntries);
      
      // Should be sorted: Dec 1, then Dec 3
      expect(result.datasets[0].data[0]).toBe(0.2); // Dec 1
      expect(result.datasets[0].data[1]).toBe(0.1); // Dec 3
    });
  });
});
