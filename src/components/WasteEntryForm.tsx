/**
 * WasteEntryForm - Form component for adding new waste entries
 * Handles user input, validation, and submission of waste data
 */

import React, { useState } from 'react';
import { useWaste } from '../context/WasteContext';
import { WasteCategory } from '../types';
import type { WasteEntryFormData, ValidationErrors } from '../types';
import './WasteEntryForm.css';

/**
 * Validates form data and returns validation errors
 */
function validateForm(formData: WasteEntryFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate food type (required, non-empty)
  if (!formData.foodType || formData.foodType.trim() === '') {
    errors.foodType = 'Food type is required';
  }

  // Validate category (required)
  if (!formData.category) {
    errors.category = 'Please select a category';
  }

  // Validate quantity (required, between 1 and 99999)
  if (formData.quantityGrams === '' || formData.quantityGrams === 0) {
    errors.quantityGrams = 'Quantity is required';
  } else if (typeof formData.quantityGrams === 'number') {
    if (formData.quantityGrams < 1 || formData.quantityGrams > 99999) {
      errors.quantityGrams = 'Quantity must be between 1 and 99999 grams';
    }
  }

  return errors;
}

/**
 * WasteEntryForm component
 */
export function WasteEntryForm() {
  const { addEntry } = useWaste();

  // Form state
  const [formData, setFormData] = useState<WasteEntryFormData>({
    foodType: '',
    category: '',
    quantityGrams: '',
    isEdible: false
  });

  // Validation errors state
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Handle input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : name === 'quantityGrams'
        ? value === '' ? '' : Number(value)
        : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit valid entry
    addEntry({
      foodType: formData.foodType.trim(),
      category: formData.category as WasteCategory,
      quantityGrams: formData.quantityGrams as number,
      isEdible: formData.isEdible
    });

    // Reset form after successful submission
    setFormData({
      foodType: '',
      category: '',
      quantityGrams: '',
      isEdible: false
    });
    setErrors({});
  };

  return (
    <form className="waste-entry-form" onSubmit={handleSubmit}>
      <h2>Add Waste Entry</h2>

      <div className="form-group">
        <label htmlFor="foodType">
          Food Type <span className="required">*</span>
        </label>
        <input
          type="text"
          id="foodType"
          name="foodType"
          value={formData.foodType}
          onChange={handleChange}
          className={errors.foodType ? 'error' : ''}
          placeholder="e.g., Leftover rice"
        />
        {errors.foodType && (
          <span className="error-message">{errors.foodType}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? 'error' : ''}
        >
          <option value="">Select a category</option>
          <option value={WasteCategory.FRUITS}>{WasteCategory.FRUITS}</option>
          <option value={WasteCategory.VEGETABLES}>{WasteCategory.VEGETABLES}</option>
          <option value={WasteCategory.GRAINS}>{WasteCategory.GRAINS}</option>
          <option value={WasteCategory.PROTEINS}>{WasteCategory.PROTEINS}</option>
          <option value={WasteCategory.DAIRY}>{WasteCategory.DAIRY}</option>
          <option value={WasteCategory.OTHER}>{WasteCategory.OTHER}</option>
        </select>
        {errors.category && (
          <span className="error-message">{errors.category}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="quantityGrams">
          Quantity (grams) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="quantityGrams"
          name="quantityGrams"
          value={formData.quantityGrams}
          onChange={handleChange}
          className={errors.quantityGrams ? 'error' : ''}
          placeholder="e.g., 500"
          min="1"
          max="99999"
        />
        {errors.quantityGrams && (
          <span className="error-message">{errors.quantityGrams}</span>
        )}
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="isEdible">
          <input
            type="checkbox"
            id="isEdible"
            name="isEdible"
            checked={formData.isEdible}
            onChange={handleChange}
          />
          <span>This food is edible and could serve people in need</span>
        </label>
      </div>

      <button type="submit" className="submit-button">
        Add Entry
      </button>
    </form>
  );
}
