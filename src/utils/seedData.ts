/**
 * Utility to seed the application with random sample data
 */

import { WasteCategory } from '../types';
import type { WasteEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const foodItems = {
  [WasteCategory.FRUITS]: ['Apples', 'Bananas', 'Oranges', 'Strawberries', 'Grapes', 'Watermelon', 'Pineapple'],
  [WasteCategory.VEGETABLES]: ['Lettuce', 'Tomatoes', 'Carrots', 'Broccoli', 'Spinach', 'Peppers', 'Cucumbers'],
  [WasteCategory.GRAINS]: ['Bread', 'Rice', 'Pasta', 'Cereal', 'Tortillas', 'Crackers'],
  [WasteCategory.PROTEINS]: ['Chicken', 'Beef', 'Fish', 'Eggs', 'Tofu', 'Beans'],
  [WasteCategory.DAIRY]: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
  [WasteCategory.OTHER]: ['Leftovers', 'Mixed meal', 'Soup', 'Sauce', 'Snacks']
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysBack: number): Date {
  const now = new Date();
  const daysAgo = getRandomInt(0, daysBack);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(getRandomInt(8, 20), getRandomInt(0, 59), 0, 0);
  return date;
}

export function generateRandomEntries(count: number = 20): WasteEntry[] {
  const entries: WasteEntry[] = [];
  const categories = Object.values(WasteCategory);

  for (let i = 0; i < count; i++) {
    const category = getRandomItem(categories);
    const foodType = getRandomItem(foodItems[category]);
    const quantityGrams = getRandomInt(50, 2000);
    const isEdible = Math.random() > 0.4; // 60% chance of being edible
    const timestamp = getRandomDate(30); // Within last 30 days

    entries.push({
      id: uuidv4(),
      foodType,
      category,
      quantityGrams,
      isEdible,
      timestamp
    });
  }

  // Sort by timestamp (oldest first)
  return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function seedLocalStorage(count: number = 20): void {
  const entries = generateRandomEntries(count);
  localStorage.setItem('foodWasteEntries', JSON.stringify(entries));
  console.log(`✅ Seeded ${count} random waste entries to localStorage`);
}
