// src/components/common/ProgressBar.jsx
import React from 'react';

function ProgressBar({ percentage }) {
  // Menghilangkan tanda '%' dan mengubahnya menjadi angka bulat
  const numericPercentage = parseInt(percentage); 
  
  // Menentukan warna progress bar berdasarkan persentase
  let barColor;
  
  // LOGIKA BARU SESUAI ATURAN YANG ANDA TETAPKAN
  if (numericPercentage >= 80) {
    barColor = 'bg-status-success'; // Hijau: 80% - 100%
  } else if (numericPercentage >= 40) {
    barColor = 'bg-status-warning'; // Kuning/Orange: 40% - 79%
  } else {
    barColor = 'bg-status-critical'; // Merah: 0% - 39%
  }

  // Menggunakan angka persentase untuk mengatur lebar style CSS
  const widthStyle = `${numericPercentage}%`;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${barColor} transition-all duration-500`} 
        style={{ width: widthStyle }}
        title={`${percentage} Health`}
      ></div>
    </div>
  );
}

export default ProgressBar;