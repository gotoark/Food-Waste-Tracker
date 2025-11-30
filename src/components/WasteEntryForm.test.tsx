/**
 * Tests for WasteEntryForm component
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WasteEntryForm } from './WasteEntryForm';
import { WasteProvider } from '../context/WasteContext';

describe('WasteEntryForm', () => {
  it('renders form with all required fields', () => {
    render(
      <WasteProvider>
        <WasteEntryForm />
      </WasteProvider>
    );

    expect(screen.getByLabelText(/food type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/edible/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add entry/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', () => {
    render(
      <WasteProvider>
        <WasteEntryForm />
      </WasteProvider>
    );

    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Food type is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a category')).toBeInTheDocument();
    expect(screen.getByText('Quantity is required')).toBeInTheDocument();
  });

  it('accepts valid form submission with all fields filled', () => {
    render(
      <WasteProvider>
        <WasteEntryForm />
      </WasteProvider>
    );

    // Fill in all required fields with valid data
    const foodTypeInput = screen.getByLabelText(/food type/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const quantityInput = screen.getByLabelText(/quantity/i);
    const edibleCheckbox = screen.getByLabelText(/edible/i);

    fireEvent.change(foodTypeInput, { target: { value: 'Test food' } });
    fireEvent.change(categorySelect, { target: { value: 'Grains' } });
    fireEvent.change(quantityInput, { target: { value: '500' } });
    fireEvent.click(edibleCheckbox);

    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    // Form should be reset after successful submission
    expect((foodTypeInput as HTMLInputElement).value).toBe('');
    expect((edibleCheckbox as HTMLInputElement).checked).toBe(false);
  });

  it('resets form after successful submission', () => {
    render(
      <WasteProvider>
        <WasteEntryForm />
      </WasteProvider>
    );

    // Fill in the form
    const foodTypeInput = screen.getByLabelText(/food type/i) as HTMLInputElement;
    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;

    fireEvent.change(foodTypeInput, { target: { value: 'Leftover rice' } });
    fireEvent.change(categorySelect, { target: { value: 'Grains' } });
    fireEvent.change(quantityInput, { target: { value: '500' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    // Check that form is reset
    expect(foodTypeInput.value).toBe('');
    expect(categorySelect.value).toBe('');
    expect(quantityInput.value).toBe('');
  });

  it('clears error when user starts typing in a field', () => {
    render(
      <WasteProvider>
        <WasteEntryForm />
      </WasteProvider>
    );

    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Food type is required')).toBeInTheDocument();

    // Start typing in food type field
    const foodTypeInput = screen.getByLabelText(/food type/i);
    fireEvent.change(foodTypeInput, { target: { value: 'A' } });

    // Error should be cleared
    expect(screen.queryByText('Food type is required')).not.toBeInTheDocument();
  });
});
