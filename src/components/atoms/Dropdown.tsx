import React from "react";

type DropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function Dropdown({ value, options, onChange }: DropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 px-4 rounded-md border border-gray-300 bg-white text-gray-700 text-sm w-full"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
