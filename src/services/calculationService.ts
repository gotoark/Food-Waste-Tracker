/**
 * Calculation service for food waste analytics
 * Handles serving calculations, statistics aggregation, and number formatting
 */

import type { WasteEntry, WasteStatistics } from '../types';

/**
 * Standard serving size in grams (one meal portion)
 */
const SERVING_SIZE_GRAMS = 400;

/**
 * Calculates the number of servings that could be provided from edible waste
 * 
 * @param quantityGrams - Total quantity of edible waste in grams
 * @returns Number of servings (rounded down to whole servings)
 * 
 * Requirements: 2.1 - Divide total edible waste quantity by 400 grams per serving
 */
export function calculateServings(quantityGrams: number): number {
  return Math.floor(quantityGrams / SERVING_SIZE_GRAMS);
}

/**
 * Calculates total edible waste quantity from a collection of entries
 * 
 * @param entries - Array of waste entries
 * @returns Total edible waste in grams
 * 
 * Requirements: 2.2 - Show only edible waste in the calculation
 */
export function calculateEdibleWaste(entries: WasteEntry[]): number {
  return entries
    .filter(entry => entry.isEdible)
    .reduce((sum, entry) => sum + entry.quantityGrams, 0);
}

/**
 * Calculates total waste quantity from all entries
 * 
 * @param entries - Array of waste entries
 * @returns Total waste in grams
 * 
 * Requirements: 4.1 - Display total waste quantity
 */
export function calculateTotalWaste(entries: WasteEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.quantityGrams, 0);
}

/**
 * Calculates the percentage of waste that is edible
 * 
 * @param entries - Array of waste entries
 * @returns Percentage of edible waste (0-100), or 0 if no entries
 * 
 * Requirements: 4.2 - Display the percentage of waste that is edible
 */
export function calculateEdiblePercentage(entries: WasteEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }
  
  const totalWaste = calculateTotalWaste(entries);
  if (totalWaste === 0) {
    return 0;
  }
  
  const edibleWaste = calculateEdibleWaste(entries);
  return (edibleWaste / totalWaste) * 100;
}

/**
 * Aggregates all statistics from waste entries
 * 
 * @param entries - Array of waste entries
 * @returns Complete statistics object
 * 
 * Requirements: 4.1, 4.2, 4.3 - Display total waste, edible percentage, and entry count
 */
export function calculateStatistics(entries: WasteEntry[]): WasteStatistics {
  const totalWasteGrams = calculateTotalWaste(entries);
  const edibleWasteGrams = calculateEdibleWaste(entries);
  
  return {
    totalWasteKg: totalWasteGrams / 1000,
    totalEntries: entries.length,
    edibleWasteKg: edibleWasteGrams / 1000,
    ediblePercentage: calculateEdiblePercentage(entries),
    servingsEquivalent: calculateServings(edibleWasteGrams)
  };
}

/**
 * Formats a number as kilograms with 2 decimal places
 * 
 * @param kg - Value in kilograms
 * @returns Formatted string with unit (e.g., "12.50 kg")
 * 
 * Requirements: 4.4 - Format numbers with appropriate decimal places and units
 */
export function formatKilograms(kg: number): string {
  return `${kg.toFixed(2)} kg`;
}

/**
 * Formats a percentage with 1 decimal place
 * 
 * @param percentage - Percentage value (0-100)
 * @returns Formatted string with unit (e.g., "45.5%")
 * 
 * Requirements: 4.4 - Format numbers with appropriate decimal places and units
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

/**
 * Formats a count as a whole number
 * 
 * @param count - Integer count value
 * @returns Formatted string (e.g., "42")
 * 
 * Requirements: 4.4 - Format numbers with appropriate decimal places and units
 */
export function formatCount(count: number): string {
  return count.toString();
}

/**
 * Formats servings as a whole number with unit
 * 
 * @param servings - Number of servings
 * @returns Formatted string with unit (e.g., "12 servings")
 * 
 * Requirements: 4.4 - Format numbers with appropriate decimal places and units
 */
export function formatServings(servings: number): string {
  return `${servings} ${servings === 1 ? 'serving' : 'servings'}`;
}
