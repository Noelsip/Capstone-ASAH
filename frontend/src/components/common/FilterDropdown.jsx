// src/components/common/FilterDropdown.jsx
import React, { useState } from 'react';

const FilterDropdown = ({ title, options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left z-20">
            <button
                type="button"
                className="inline-flex justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected || title}
                {/* Ikon Panah */}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                    option === selected ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;