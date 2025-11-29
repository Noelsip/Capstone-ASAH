// src/pages/settings/Security.jsx
import React, { useState } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx'; // <-- Import Modal

function SecurityPage() {
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false); // <-- State Modal

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordForm.new !== passwordForm.confirm) {
        alert("Error: New passwords do not match!");
        return;
    }
    
    // Logika sukses
    console.log('Password change initiated.');
    setIsSaveSuccessModalOpen(true); // <-- PICU POPUP SUKSES
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
      <p className="text-gray-500">Manage your account security features and and change your password.</p>
      
      {/* Ganti Password Section */}
      <div className="space-y-6 border-b pb-8">
        <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
        <p className="text-gray-500">Update your password to keep your account secure.</p>
        
        <form onSubmit={handlePasswordChange} className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-xl">
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <Input type="password" placeholder="Enter current password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <Input type="password" placeholder="Enter new password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} />
            </div>
            <div className="col-span-2 flex justify-start pt-2">
                <Button type="submit" className="w-auto px-6 py-2">
                    Update Password
                </Button>
            </div>
        </form>
      </div>

      {/* 💥 POPUP SUKSES 💥 */}
      <SuccessModal 
          isVisible={isSaveSuccessModalOpen}
          onClose={() => setIsSaveSuccessModalOpen(false)}
          message="Your password has been updated successfully!"
      />
    </div>
  );
}

export default SecurityPage;