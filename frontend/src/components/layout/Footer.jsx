// src/components/layout/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Padding vertikal (py-4) dan horizontal (px-6) agar tidak terlalu mepet
    <footer className="w-full bg-bg-main border-t border-gray-200 py-4 px-8 mt-auto">
      <div className="flex justify-between items-center text-sm text-gray-500">
        {/* Kiri: Copyright */}
        <p>
          &copy; {currentYear} Accenture Indonesia. All rights reserved.
        </p>
        {/* Kanan: Link Tambahan (Opsional) */}
        <div className="space-x-4">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;