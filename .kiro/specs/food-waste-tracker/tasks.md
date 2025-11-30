# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize React + TypeScript project using Vite
  - Install dependencies: react-chartjs-2, chart.js, fast-check, vitest
  - Configure TypeScript with strict mode
  - Set up Vitest configuration for testing
  - Create folder structure: components, services, types, context
  - _Requirements: 7.1_

- [x] 2. Define core types and data models
  - Create TypeScript interfaces for WasteEntry, WasteStatistics
  - Define WasteCategory enum with all food categories
  - Create type definitions for form inputs and validation errors
  - _Requirements: 1.1, 1.4_

- [x] 3. Implement storage service
  - Create storageService.ts with functions for save, load, and delete operations
  - Implement localStorage wrapper with error handling
  - Add JSON serialization/deserialization with date parsing
  - _Requirements: 1.3, 6.1, 6.4_

- [ ]* 3.1 Write property test for storage round-trip
  - **Property 3: Storage round-trip consistency**
  - **Validates: Requirements 1.3, 6.1**

- [ ]* 3.2 Write property test for storage error handling
  - **Property 14: Storage error handling**
  - **Validates: Requirements 6.4**

- [x] 4. Implement calculation service
  - Create calculationService.ts with serving calculation function
  - Implement statistics aggregation functions (total waste, edible percentage, entry count)
  - Add number formatting utilities with proper decimal places and units
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4_

- [ ]* 4.1 Write property test for serving calculation
  - **Property 5: Serving calculation correctness**
  - **Validates: Requirements 2.1**

- [ ]* 4.2 Write property test for edible waste filtering
  - **Property 6: Edible waste filtering**
  - **Validates: Requirements 2.2**

- [ ]* 4.3 Write property test for total waste aggregation
  - **Property 8: Total waste aggregation**
  - **Validates: Requirements 4.1**

- [ ]* 4.4 Write property test for edible percentage calculation
  - **Property 9: Edible percentage calculation**
  - **Validates: Requirements 4.2**

- [ ]* 4.5 Write property test for entry count accuracy
  - **Property 10: Entry count accuracy**
  - **Validates: Requirements 4.3**

- [ ]* 4.6 Write property test for number formatting
  - **Property 11: Number formatting consistency**
  - **Validates: Requirements 4.4**

- [ ] 5. Create global state management with Context API
  - Create WasteContext with state for entries array
  - Implement addEntry, deleteEntry, and loadEntries actions
  - Add useWaste custom hook for consuming context
  - Integrate storage service with context actions
  - _Requirements: 1.1, 5.1, 6.1_

- [ ]* 5.1 Write property test for valid entry creation
  - **Property 1: Valid entry creation**
  - **Validates: Requirements 1.1**

- [ ]* 5.2 Write property test for category association
  - **Property 4: Category association**
  - **Validates: Requirements 1.4**

- [ ]* 5.3 Write property test for deletion removes entry
  - **Property 12: Deletion removes entry**
  - **Validates: Requirements 5.1**

- [ ] 6. Build WasteEntryForm component
  - Create form with inputs for food type, category dropdown, quantity, and edibility checkbox
  - Implement form validation for required fields and quantity range
  - Add form submission handler that calls context addEntry
  - Reset form after successful submission
  - Display validation error messages inline
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ]* 6.1 Write property test for invalid entry rejection
  - **Property 2: Invalid entry rejection**
  - **Validates: Requirements 1.2**

- [ ]* 6.2 Write unit tests for form validation edge cases
  - Test boundary values (0, 1, 99999, 100000 grams)
  - Test empty and whitespace-only food type inputs
  - _Requirements: 1.2, 1.5_

- [ ] 7. Build StatisticsPanel component
  - Create component that receives WasteStatistics as props
  - Display total waste in kg, edible percentage, entry count, and servings equivalent
  - Format numbers using calculation service utilities
  - Style as card grid with clear labels and large numbers
  - _Requirements: 2.4, 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Implement chart components
  - Create PieChart component for waste distribution by category
  - Create BarChart component for edible vs non-edible comparison
  - Create LineChart component for waste trends over time
  - Configure Chart.js with labels, legends, and color schemes
  - Add data transformation functions to convert entries to chart data formats
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ]* 8.1 Write property test for UI-state consistency
  - **Property 7: UI-state consistency**
  - **Validates: Requirements 3.4, 4.5, 5.2**

- [ ]* 8.2 Write unit tests for chart data transformations
  - Test conversion of entries to pie chart data
  - Test conversion of entries to bar chart data
  - Test conversion of entries to line chart data with time grouping
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 9. Build WasteEntryList component
  - Create table or list displaying all waste entries
  - Show food type, category, quantity, edibility, and timestamp for each entry
  - Add delete button for each entry with confirmation dialog
  - Display empty state message when no entries exist
  - _Requirements: 5.1, 5.3, 5.4_

- [ ]* 9.1 Write property test for deletion confirmation
  - **Property 13: Deletion confirmation required**
  - **Validates: Requirements 5.3**

- [ ]* 9.2 Write unit tests for empty state handling
  - Test empty state message display when entries array is empty
  - _Requirements: 5.4, 6.3_

- [ ] 10. Create main Dashboard component
  - Compose all components: WasteEntryForm, StatisticsPanel, ChartSection, WasteEntryList
  - Calculate statistics from entries using calculation service
  - Implement responsive layout with CSS Grid or Flexbox
  - Add section headings and organize content hierarchy
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 11. Build App root component
  - Wrap application with WasteContext provider
  - Load initial data from storage on mount
  - Render Dashboard component
  - Add error boundary for graceful error handling
  - _Requirements: 6.1, 6.4_

- [ ] 12. Add styling and polish
  - Create consistent color scheme and typography
  - Add hover states and visual feedback for interactive elements
  - Ensure responsive design works on mobile and desktop
  - Add loading states if needed
  - Implement accessibility features (ARIA labels, keyboard navigation)
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
