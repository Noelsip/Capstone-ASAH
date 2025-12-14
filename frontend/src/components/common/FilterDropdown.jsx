import React, { useState, useRef, useEffect } from 'react';

function FilterDropdown({ options, selectedOption, onSelect }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

  // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpen(false);
        }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            className="flex items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 min-w-[120px]"
            onClick={() => setOpen((v) => !v)}
        >
            {/* Selalu tampilkan label yang dipilih */}
            <span>{selectedOption}</span>
            <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {open && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
            {options.map(option => (
                <div
                key={option}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${option === selectedOption ? 'font-bold' : ''}`}
                onClick={() => {
                    onSelect(option);
                    setOpen(false);
                }}
                >
                {option}
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default FilterDropdown;