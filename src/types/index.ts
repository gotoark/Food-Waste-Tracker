/**
 * Core type definitions for the Food Waste Tracker application
 */

/**
 * Enum representing different categories of food waste
 */
export const WasteCategory = {
  FRUITS: 'Fruits',
  VEGETABLES: 'Vegetables',
  GRAINS: 'Grains',
  PROTEINS: 'Proteins',
  DAIRY: 'Dairy',
  OTHER: 'Other'
} as const;

/**
 * Type representing a waste category value
 */
export type WasteCategory = typeof WasteCategory[keyof typeof WasteCategory];

/**
 * Interface representing a single waste entry record
 */
export interface WasteEntry {
  /** Unique identifier for the entry */
  id: string;
  /** User-provided description of the food item */
  foodType: string;
  /** Category classification for grouping and analysis */
  category: WasteCategory;
  /** Weight of wasted food in grams (1-99999) */
  quantityGrams: number;
  /** Whether the food could serve people in need */
  isEdible: boolean;
  /** ISO 8601 datetime of entry creation */
  timestamp: Date;
}

/**
 * Interface representing aggregated waste statistics
 */
export interface WasteStatistics {
  /** Total waste quantity in kilograms */
  totalWasteKg: number;
  /** Total number of waste entries recorded */
  totalEntries: number;
  /** Total edible waste quantity in kilograms */
  edibleWasteKg: number;
  /** Percentage of waste that is edible */
  ediblePercentage: number;
  /** Number of servings that could be provided (400g per serving) */
  servingsEquivalent: number;
}

/**
 * Interface for form input data (before entry creation)
 */
export interface WasteEntryFormData {
  /** User-provided description of the food item */
  foodType: string;
  /** Category classification */
  category: WasteCategory | '';
  /** Weight of wasted food in grams */
  quantityGrams: number | '';
  /** Whether the food could serve people in need */
  isEdible: boolean;
}

/**
 * Interface for form validation errors
 */
export interface ValidationErrors {
  /** Error message for food type field */
  foodType?: string;
  /** Error message for category field */
  category?: string;
  /** Error message for quantity field */
  quantityGrams?: string;
}
