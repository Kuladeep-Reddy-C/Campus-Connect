// frontend/src/components/EventsModule/EventFilter.jsx
import React, { useState, useEffect } from 'react';

const EventFilter = ({ onFilterChange, currentFilters }) => {
  const [category, setCategory] = useState(currentFilters.category);
  const [date, setDate] = useState(currentFilters.date);

  const categories = ['All', 'Academic', 'Technical', 'Sports', 'Cultural', 'Other'];

  // Sync internal state with props if parent changes filters
  useEffect(() => {
    setCategory(currentFilters.category);
    setDate(currentFilters.date);
  }, [currentFilters]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onFilterChange({ category: newCategory });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    onFilterChange({ date: newDate });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      {/* Category Filter */}
      <div className="flex-grow w-full sm:w-auto">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 sr-only">
          Filter by Category
        </label>
        <select
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex-grow w-full sm:w-auto">
        <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 sr-only">
          Filter by Date
        </label>
        <input
          type="date"
          id="date-input"
          value={date}
          onChange={handleDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        />
      </div>

      {/* Clear Filters Button (Optional) */}
      {(category !== 'All' || date !== '') && (
        <button
          onClick={() => {
            setCategory('All');
            setDate('');
            onFilterChange({ category: 'All', date: '' });
          }}
          className="w-full sm:w-auto mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EventFilter;