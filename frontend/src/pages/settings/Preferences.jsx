// src/pages/settings/Preferences.jsx
import React, { useState } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

function PreferencesPage() {
    const [language, setLanguage] = useState('Bahasa Indonesia');
    const [timezone, setTimezone] = useState('WIB (UTC+7)');

    const handleSave = () => {
        console.log('Preferences saved:', { language, timezone });
        alert('Preferences updated successfully!');
    };

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900">Display Preferences</h2>
            <p className="text-gray-500">Customize regional and interface settings.</p>

            <div className="space-y-6 border-b pb-8">
                <h3 className="text-xl font-semibold text-gray-800">Regional Settings</h3>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-xl">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Language</label>
                        <Input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Timezone</label>
                        <Input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                    </div>
                </div>
                
                <div className="flex justify-start pt-4">
                    <Button type="button" className="w-auto px-6 py-2" onClick={handleSave}>
                        Save Regional Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PreferencesPage;