// src/components/common/AlertItem.jsx
import React from 'react';

function AlertItem({ title, equipment, time, type }) {
  
  const colorMap = {
    Critical: 'border-red-500 bg-red-50',
    Warning: 'border-yellow-500 bg-yellow-50',
    Normal: 'border-green-500 bg-green-50',
  };

  const dotColorMap = {
    Critical: 'bg-red-500',
    Warning: 'bg-yellow-500',
    Normal: 'bg-green-500',
  };

  const statusColor = colorMap[type] || 'border-gray-200 bg-white';
  const dotColor = dotColorMap[type] || 'bg-gray-400';

  return (
    <div className={`p-3 border-l-4 rounded-lg shadow-sm mb-2 cursor-pointer transition-all hover:shadow-md ${statusColor}`}>
      <div className="flex justify-between items-center">
        
        {/* Kiri: Status Dot + Judul + Detail Equipment */}
        <div className="flex items-start space-x-3">
          {/* Status Dot */}
          <span className={`w-2.5 h-2.5 rounded-full mt-1 ${dotColor}`}></span> 
          
          {/* Judul dan Detail */}
          <div>
            <p className="text-sm font-medium text-gray-800">{title}</p>
            <p className="text-xs text-gray-500">{equipment}</p>
          </div>
        </div>
        
        {/* Kanan: Waktu dan Tombol > */}
        <div className="text-right flex items-center space-x-3">
          <p className="text-xs text-gray-500 whitespace-nowrap">{time}</p>
          <button className="text-sm text-gray-400 hover:text-primary transition-colors">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertItem;