/**
 * App - Root component for the Food Waste Tracker application
 * Wraps the application with WasteContext provider and error boundary
 * 
 * Requirements: 6.1, 6.4
 */

import { WasteProvider } from './context/WasteContext';
import { Dashboard, ErrorBoundary } from './components';
import './App.css';

/**
 * Root App component
 * - Wraps application with WasteContext provider for global state
 * - Wraps with ErrorBoundary for graceful error handling
 * - Loads initial data from storage on mount (handled by WasteProvider)
 * - Renders Dashboard component
 */
function App() {
  return (
    <ErrorBoundary>
      <WasteProvider>
        <Dashboard />
      </WasteProvider>
    </ErrorBoundary>
  );
}

export default App;
