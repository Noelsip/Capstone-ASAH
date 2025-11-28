// src/components/common/StatCard.jsx (VERSI BARU UNTUK DESAIN DETAIL)
import React from 'react';

function StatCard({ 
    title, 
    value, 
    unit, 
    description, 
    icon, 
    color = 'text-gray-700', // Warna teks utama
    bgColor = 'bg-white',    // Warna latar belakang kartu
    iconBg = 'bg-gray-100',  // Warna latar belakang ikon
    badge,                   // Untuk badge seperti "Warning"
    onClick,                 // Event klik untuk kartu
    className = ''           // Untuk kelas CSS tambahan
}) {
    return (
        <div 
            className={`${bgColor} ${className} p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                        ${onClick ? 'cursor-pointer' : ''} 
                        flex flex-col justify-between border border-gray-100`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                {/* Ikon dengan latar belakang berbentuk lingkaran */}
                <div className={`p-2 rounded-full ${iconBg} ${color}`}
                     dangerouslySetInnerHTML={{ __html: icon }} 
                />
                
                {/* Badge di kanan atas (opsional) */}
                {badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        badge.toLowerCase() === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        badge.toLowerCase() === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {badge}
                    </span>
                )}
            </div>

            <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
            
            {/* Nilai utama */}
            <p className={`text-3xl font-bold ${color}`}>
                {value}
                {unit && <span className="text-xl font-medium ml-1">{unit}</span>}
            </p>
            
            {/* Deskripsi/sub-teks */}
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    );
}

export default StatCard;