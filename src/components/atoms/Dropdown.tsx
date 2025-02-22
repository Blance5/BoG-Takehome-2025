import React, { useState, useEffect } from 'react';

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
}

export default function Dropdown({ value, options, onChange }: DropdownProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    // Sync local value with prop value if it changes externally
    setLocalValue(value);
  }, [value]);

  // Capitalize the first letter of the value for display
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleChange = (newValue: string) => {
    setLocalValue(newValue); // Update locally
    onChange(newValue); // Call parent's onChange
  };

  const statusClasses: Record<string, string> = {
    Pending: 'bg-orange-100 text-orange-600',
    Approved: 'bg-yellow-100 text-yellow-600',
    Completed: 'bg-green-100 text-green-600',
    Rejected: 'bg-red-100 text-red-600',
  };

  const dotClasses: Record<string, string> = {
    Pending: 'bg-orange-600',
    Approved: 'bg-yellow-600',
    Completed: 'bg-green-600',
    Rejected: 'bg-red-600',
  };

  // Standardize value to match keys in statusClasses and dotClasses
  const formattedValue = capitalize(value);
  const currentStatusClass =
    statusClasses[formattedValue] || 'bg-gray-100 text-gray-600';
  const currentDotClass = dotClasses[formattedValue] || 'bg-gray-600';

  return (
    <div className="relative">
      <div
        className={`flex cursor-pointer items-center rounded-full border border-gray-300 px-3 py-1 ${currentStatusClass}`}
      >
        <span className={`mr-2 h-2 w-2 rounded-full ${currentDotClass}`}></span>
        <span className="capitalize">{formattedValue || 'Unknown'}</span>
        <svg
          className="ml-auto h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown Options */}
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {capitalize(option)}
          </option>
        ))}
      </select>
    </div>
  );
}
