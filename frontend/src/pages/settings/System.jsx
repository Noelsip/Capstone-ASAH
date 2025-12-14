// src/pages/settings/System.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx'; // <-- Import Modal

function SystemPage() {
    const [isClearCacheSuccessModalOpen, setIsClearCacheSuccessModalOpen] = useState(false); // <-- State Modal

    const handleClearCache = () => {
        console.log('Clearing cache...');
        // Simulasi proses async
        setTimeout(() => {
            setIsClearCacheSuccessModalOpen(true); // <-- PICU POPUP SUKSES
        }, 300);
    };

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
            <p className="text-gray-500">View system information and manage application preferences.</p>

            {/* Application Info */}
            <div className="space-y-4 border-b pb-8">
                <h3 className="text-xl font-semibold text-gray-800">Application Info</h3>
                <div className="text-gray-600 grid grid-cols-2 max-w-sm">
                    <p className="font-medium">Version:</p> <p className="text-gray-900">1.0.0-beta</p>
                    <p className="font-medium">Build Date:</p> <p className="text-gray-900">2025-11-28</p>
                    <p className="font-medium">Framework:</p> <p className="text-gray-900">React v18 + Vite</p>
                </div>
            </div>
            
            {/* Cache Management */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Cache Management</h3>
                <div className="flex justify-between items-center p-4 rounded-lg border bg-yellow-50">
                    <p className="text-gray-700">Clear local cache to refresh application data.</p>
                    <Button type="button" className="w-auto bg-red-600 hover:bg-red-700" onClick={handleClearCache}>
                        Clear Cache
                    </Button>
                </div>
            </div>

            {/* 💥 POPUP SUKSES 💥 */}
            <SuccessModal 
                isVisible={isClearCacheSuccessModalOpen}
                onClose={() => setIsClearCacheSuccessModalOpen(false)}
                message="Application cache has been cleared successfully!"
            />
        </div>
    );
}

export default SystemPage;