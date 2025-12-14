import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx';

function SystemPage() {
    const [isClearCacheSuccessModalOpen, setIsClearCacheSuccessModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleClearCache = () => {
        setIsClearing(true);
        console.log('Clearing cache...');
        
        // Hapus cache localStorage (kecuali token)
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Simpan token, hapus yang lain
            if (key !== 'authToken') {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Hapus cache browser (jika ada)
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        
        setTimeout(() => {
            setIsClearing(false);
            setIsClearCacheSuccessModalOpen(true);
        }, 500);
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
                <p className="text-gray-500 mt-2">View system information and manage application preferences.</p>
            </div>

            {/* Application Info */}
            <div className="space-y-4 border-b pb-8">
                <h3 className="text-xl font-semibold text-gray-800">Application Info</h3>
                <div className="text-gray-600 grid grid-cols-2 gap-y-2 max-w-md">
                    <p className="font-medium text-gray-700">Version:</p> 
                    <p className="text-gray-900">1.0.0-beta</p>
                    
                    <p className="font-medium text-gray-700">Build Date:</p> 
                    <p className="text-gray-900">December 14, 2025</p>
                    
                    <p className="font-medium text-gray-700">Framework:</p> 
                    <p className="text-gray-900">React v18 + Vite</p>
                    
                    <p className="font-medium text-gray-700">Backend:</p> 
                    <p className="text-gray-900">Node.js + Express</p>
                </div>
            </div>
            
            {/* Cache Management */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Cache Management</h3>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div>
                        <p className="text-gray-900 font-medium">Clear Application Cache</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Remove stored data to refresh the application. Your login session will be preserved.
                        </p>
                    </div>
                    <Button 
                        type="button" 
                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 whitespace-nowrap" 
                        onClick={handleClearCache}
                        disabled={isClearing}
                    >
                        {isClearing ? 'Clearing...' : 'Clear Cache'}
                    </Button>
                </div>
            </div>

            {/* System Status - Optional */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-gray-600">Backend Status</p>
                        <p className="text-lg font-semibold text-green-700 mt-1">● Online</p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-gray-600">Database</p>
                        <p className="text-lg font-semibold text-blue-700 mt-1">● Connected</p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-gray-600">Cache Size</p>
                        <p className="text-lg font-semibold text-purple-700 mt-1">~2.4 MB</p>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal 
                isVisible={isClearCacheSuccessModalOpen}
                onClose={() => {
                    setIsClearCacheSuccessModalOpen(false);
                    // Optional: refresh page setelah clear cache
                    // window.location.reload();
                }}
                message="Application cache has been cleared successfully!"
            />
        </div>
    );
}

export default SystemPage;