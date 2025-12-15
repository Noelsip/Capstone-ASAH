// src/components/common/SuccessModal.jsx
import React, { useEffect } from 'react';

const SuccessModal = ({ message, isVisible, onClose }) => {
    // Effekt untuk menyembunyikan modal secara otomatis setelah 3 detik
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Muncul selama 3 detik
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 border border-gray-200 max-w-sm w-full text-center">
            
            {/* Ikon Centang Hijau */}
            <svg className="mx-auto h-12 w-12 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Success!</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
    );
};

export default SuccessModal;