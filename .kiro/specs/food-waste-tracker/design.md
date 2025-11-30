# Design Document

## Overview

The Food Waste Tracker is a single-page application (SPA) built with modern web technologies. The application uses React for the UI framework, Chart.js for data visualization, and browser local storage for data persistence. The architecture follows a component-based design with clear separation between presentation, business logic, and data management layers.

The application calculates serving equivalents based on a standard serving size of 400 grams, allowing users to understand the social impact of food waste. All data processing happens client-side, making the application fast and privacy-friendly.

## Architecture

### Technology Stack

- **Frontend Framework**: React with TypeScript for type safety and component reusability
- **Charting Library**: Chart.js with react-chartjs-2 wrapper for interactive visualizations
- **Styling**: CSS Modules or Tailwind CSS for scoped, maintainable styles
- **State Management**: React Context API for global state management
- **Data Persistence**: Browser localStorage API
- **Build Tool**: Vite for fast development and optimized production builds

### Application Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main container component
│   ├── WasteEntryForm.tsx     # Form for adding waste entries
│   ├── StatisticsPanel.tsx    # Summary statistics display
│   ├── ChartSection.tsx       # Container for all charts
│   ├── PieChart.tsx           # Category distribution chart
│   ├── BarChart.tsx           # Edible vs non-edible comparison
│   ├── LineChart.tsx          # Time-based trend chart
│   └── WasteEntryList.tsx     # List of waste entries with delete
├── services/
│   ├── storageService.ts      # Local storage operations
│   └── calculationService.ts  # Waste calculations and analytics
├── types/
│   └── index.ts               # TypeScript type definitions
├── context/
│   └── WasteContext.tsx       # Global state management
└── App.tsx                    # Root component
```

## Components and Interfaces

### Core Data Types

```typescript
interface WasteEntry {
  id: string;
  foodType: string;
  category: WasteCategory;
  quantityGrams: number;
  isEdible: boolean;
  timestamp: Date;
}

enum WasteCategory {
  FRUITS = 'Fruits',
  VEGETABLES = 'Vegetables',
  GRAINS = 'Grains',
  PROTEINS = 'Proteins',
  DAIRY = 'Dairy',
  OTHER = 'Other'
}

interface WasteStatistics {
  totalWasteKg: number;
  totalEntries: number;
  edibleWasteKg: number;
  ediblePercentage: number;
  servingsEquivalent: number;
}
```

### Component Interfaces

**WasteEntryForm Component**
- Props: `onAddEntry: (entry: Omit<WasteEntry, 'id' | 'timestamp'>) => void`
- Manages form state for food type, category, quantity, and edibility
- Validates input before submission
- Resets form after successful submission

**StatisticsPanel Component**
- Props: `statistics: WasteStatistics`
- Displays key metrics in card format
- Formats numbers with appropriate units and precision

**ChartSection Component**
- Props: `entries: WasteEntry[]`
- Orchestrates rendering of all chart components
- Transforms raw data into chart-ready formats

**WasteEntryList Component**
- Props: `entries: WasteEntry[]`, `onDelete: (id: string) => void`
- Displays entries in a table or list format
- Provides delete functionality with confirmation

## Data Models

### WasteEntry Model

The WasteEntry represents a single record of food waste:

- **id**: Unique identifier (UUID v4)
- **foodType**: User-provided description of the food item
- **category**: Predefined category for grouping and analysis
- **quantityGrams**: Weight of wasted food in grams (1-99999)
- **isEdible**: Boolean indicating if food could serve people in need
- **timestamp**: ISO 8601 datetime of entry creation

### Storage Schema

Data is stored in localStorage under the key `foodWasteEntries` as a JSON array:

```json
[
  {
    "id": "uuid-string",
    "foodType": "Leftover rice",
    "category": "GRAINS",
    "quantityGrams": 500,
    "isEdible": true,
    "timestamp": "2025-12-01T10:30:00.000Z"
  }
]
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Valid entry creation
*For any* valid waste entry data (food type, category, quantity, edibility), creating an entry should produce a WasteEntry object with all required fields including a unique ID and timestamp.
**Validates: Requirements 1.1**

### Property 2: Invalid entry rejection
*For any* waste entry data with missing required fields (empty food type, missing category, invalid quantity), the validation function should reject the entry and return appropriate error messages.
**Validates: Requirements 1.2**

### Property 3: Storage round-trip consistency
*For any* valid waste entry, storing it to local storage and then retrieving all entries should include an entry with matching data (food type, category, quantity, edibility).
**Validates: Requirements 1.3, 6.1**

### Property 4: Category association
*For any* waste category and valid entry data, creating an entry with that category should result in the entry containing exactly that category value.
**Validates: Requirements 1.4**

### Property 5: Serving calculation correctness
*For any* quantity of edible waste in grams, the serving equivalent calculation should equal the quantity divided by 400, rounded appropriately.
**Validates: Requirements 2.1**

### Property 6: Edible waste filtering
*For any* collection of waste entries containing both edible and non-edible items, the serving calculation should only include the sum of quantities where isEdible is true.
**Validates: Requirements 2.2**

### Property 7: UI-state consistency
*For any* data change operation (add, delete, modify), all displayed statistics and charts should reflect the current state of the waste entries collection.
**Validates: Requirements 3.4, 4.5, 5.2**

### Property 8: Total waste aggregation
*For any* set of waste entries, the displayed total waste in kilograms should equal the sum of all entry quantities divided by 1000.
**Validates: Requirements 4.1**

### Property 9: Edible percentage calculation
*For any* non-empty set of waste entries, the edible percentage should equal (sum of edible quantities / sum of all quantities) × 100.
**Validates: Requirements 4.2**

### Property 10: Entry count accuracy
*For any* set of waste entries, the displayed count should equal the number of entries in the collection.
**Validates: Requirements 4.3**

### Property 11: Number formatting consistency
*For any* numeric statistic value, the formatted output should contain the correct number of decimal places (2 for kg, 0 for counts and servings, 1 for percentages) and appropriate units.
**Validates: Requirements 4.4**

### Property 12: Deletion removes entry
*For any* waste entry in the system, deleting it by ID should result in that entry no longer being present in storage or the entries collection.
**Validates: Requirements 5.1**

### Property 13: Deletion confirmation required
*For any* deletion attempt, the confirmation dialog should be displayed before the entry is removed.
**Validates: Requirements 5.3**

### Property 14: Storage error handling
*For any* local storage operation that fails, the application should catch the error, remain functional, and notify the user without crashing.
**Validates: Requirements 6.4**

## Error Handling

### Input Validation Errors

- **Empty food type**: Display "Food type is required"
- **Invalid quantity**: Display "Quantity must be between 1 and 99999 grams"
- **Missing category**: Display "Please select a category"
- Form should prevent submission and highlight invalid fields

### Storage Errors

- **localStorage unavailable**: Display warning banner "Data persistence unavailable - entries will be lost on refresh"
- **Storage quota exceeded**: Display error "Storage limit reached - please delete old entries"
- **Parse errors**: Log error and initialize with empty dataset
- All storage operations wrapped in try-catch blocks

### Data Integrity Errors

- **Invalid entry format**: Skip malformed entries during load and log warning
- **Missing required fields**: Treat as invalid and exclude from calculations
- **Invalid dates**: Use current timestamp as fallback

### User Experience

- Display error messages inline near relevant form fields
- Use toast notifications for system-level errors
- Provide clear recovery actions (e.g., "Try again" buttons)
- Never crash the application - always degrade gracefully

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework for unit tests, chosen for its speed, native ESM support, and excellent TypeScript integration.

Unit tests will cover:

- **Calculation functions**: Test serving calculations, percentage calculations, and aggregations with specific examples
- **Validation logic**: Test form validation with valid and invalid inputs
- **Storage service**: Test localStorage operations with mocked storage
- **Data transformations**: Test conversion of entries to chart data formats
- **Edge cases**: Empty datasets, single entries, boundary values (0, 99999 grams)

### Property-Based Testing

The application will use **fast-check** as the property-based testing library, which is the standard PBT library for JavaScript/TypeScript with excellent generator support.

Property-based tests will:

- Run a minimum of 100 iterations per property to ensure thorough coverage
- Use custom generators for WasteEntry objects with valid constraints
- Test universal properties that should hold across all valid inputs
- Each property test will be tagged with a comment referencing the design document property

Example property test structure:
```typescript
// Feature: food-waste-tracker, Property 5: Serving calculation correctness
test('serving calculation is always quantity / 400', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 99999 }),
      (quantity) => {
        const servings = calculateServings(quantity);
        expect(servings).toBe(Math.floor(quantity / 400));
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

- Test complete user flows: add entry → view charts → delete entry
- Test data persistence across simulated page reloads
- Test chart rendering with various dataset sizes
- Verify all components work together correctly

### Test Organization

- Co-locate unit tests with source files using `.test.ts` suffix
- Create separate `*.property.test.ts` files for property-based tests
- Use descriptive test names that explain the behavior being tested
- Group related tests using `describe` blocks

## Implementation Notes

### Performance Considerations

- Debounce chart updates if entry list becomes large (>1000 entries)
- Use React.memo for chart components to prevent unnecessary re-renders
- Implement virtual scrolling if entry list exceeds 100 items
- Cache calculated statistics to avoid redundant computations

### Accessibility

- Ensure all form inputs have proper labels
- Provide ARIA labels for charts
- Support keyboard navigation throughout the application
- Use semantic HTML elements
- Ensure sufficient color contrast (WCAG AA compliance)

### Browser Compatibility

- Target modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Provide fallback message if localStorage is unavailable
- Use CSS Grid and Flexbox for layouts (widely supported)
- Test on both desktop and mobile viewports

### Future Enhancements

- Export data to CSV/JSON
- Date range filtering for charts
- Comparison with previous periods
- Goal setting and progress tracking
- Multi-user support with cloud sync
