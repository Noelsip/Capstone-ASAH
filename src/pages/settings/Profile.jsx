// src/pages/settings/Profile.jsx
import React, { useState, useRef } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx'; // <-- 1. IMPORT MODAL
import defaultAvatar from '../../assets/avatar-pekerja.png'; 

// Data tiruan
const initialProfileData = {
  firstName: 'Lorem',
  lastName: 'Ipsum',
  email: 'loremipsum@accenture.com',
  jobTitle: 'Maintenance Engineer',
  phoneNumber: '+1 (555) 123-4567',
  department: 'Production',
  profileImage: defaultAvatar, 
};

function ProfilePage() {
  const [profile, setProfile] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(true); 
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false); // <-- 2. STATE MODAL BARU
  const fileInputRef = useRef(null); 

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          // PENTING: Untuk menghindari memory leak saat menggunakan URL.createObjectURL, 
          // disarankan menggunakan useEffect untuk cleanup, tetapi untuk saat ini 
          // kita fokus pada fungsionalitas modal.
          const imageUrl = URL.createObjectURL(file);
          setProfile(prev => ({ ...prev, profileImage: imageUrl }));
      }
  };

  const handleRemoveImage = () => {
    setProfile(prev => ({ ...prev, profileImage: defaultAvatar }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Profile saved:', profile);
    setIsEditing(false);
    setIsSaveSuccessModalOpen(true); // <-- 3. GANTI ALERT DENGAN MODAL
  };
  
  const handleCancel = () => {
    setProfile(initialProfileData); 
    setIsEditing(false);
  };
  
  const handleCopyUserId = () => {
    navigator.clipboard.writeText('USR-2024-001');
    alert('User ID copied to Clipboard!');
  };

  return (
    <div className="space-y-10">
      
      {/* 1. HEADER PROFILE VISUAL (BARU) */}
      <div className="flex items-start space-x-6 border-b pb-8">
        
        {/* Foto Profil dan Input File */}
        <div className="relative">
            <img 
                src={profile.profileImage} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full object-cover shadow-md cursor-pointer"
                onClick={() => isEditing && fileInputRef.current.click()} // Edit hanya jika isEditing=true
            />
            {/* Badge Status 'Active' kecil di bawah foto, seperti di desain */}
            <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white shadow-lg">
                •
            </span>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={!isEditing}
                className="hidden"
            />
        </div>

        {/* Nama dan Jabatan */}
        <div className="mt-2">
            <h2 className="text-2xl font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-600 mb-1">{profile.jobTitle}</p>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-4">
                Active
            </span>

            {/* Tombol Ganti/Hapus Foto (Hanya muncul saat mode edit) */}
            {isEditing && (
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Change Picture
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-sm font-medium text-red-600 hover:underline"
                    >
                        Remove Picture
                    </button>
                </div>
            )}
        </div>
      </div>

      <form className="space-y-8">
        
        {/* BAGIAN FORMULIR DAN TOMBOL AKSI */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Field Input (2 Kolom) */}
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
              <Input id="firstName" type="text" value={profile.firstName} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
              <Input id="lastName" type="text" value={profile.lastName} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <Input id="email" type="email" value={profile.email} onChange={handleChange} disabled={true} className="bg-gray-100" />
            </div>
            <div className="space-y-1">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input id="phoneNumber" type="text" value={profile.phoneNumber} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="space-y-1">
              <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</label>
              <Input id="jobTitle" type="text" value={profile.jobTitle} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="space-y-1">
              <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
              <Input id="department" type="text" value={profile.department} onChange={handleChange} disabled={!isEditing} />
            </div>

            {/* ⬅️ 2. PENEMPATAN TOMBOL INLINE (MENGISI GRID TERAKHIR) ➡️ */}
            <div className="col-span-1"> 
                <button 
                    type="button" 
                    onClick={handleCancel}
                    className="w-full text-red-600 border border-red-300 py-3 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
            <div className="col-span-1">
                <Button type="submit" className="w-full py-3" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
            {/* ⬅️ AKHIR PENEMPATAN TOMBOL INLINE ➡️ */}

          </div>
        </div>
        
        {/* BAGIAN ACCOUNT DETAILS */}
        <div className="space-y-6 pt-6 border-t">
          <h3 className="text-xl font-semibold text-gray-800">Account Details</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-gray-600">
            
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-lg font-mono text-gray-900">USR-2024-001</p>
                <button type="button" onClick={handleCopyUserId} className="text-primary hover:underline text-sm">
                    Copy
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg text-gray-900 mt-1">January 15, 2024</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Last Login</p>
              <p className="text-lg text-gray-900 mt-1">Today at 9:42 AM</p>
            </div>
            
          </div>
        </div>
      </form>
      
      {/* Tombol Edit/Foto Profil untuk toggling editing mode di luar form (opsional) */}
      {!isEditing && (
          <div className="flex justify-end">
              <Button type="button" className="w-auto px-6 py-2" onClick={() => setIsEditing(true)}>
                  Edit Profile
              </Button>
          </div>
      )}
      
      {/* 💥 4. KOMPONEN POPUP SUKSES 💥 */}
      <SuccessModal 
          isVisible={isSaveSuccessModalOpen}
          onClose={() => setIsSaveSuccessModalOpen(false)}
          message="Perubahan profil berhasil disimpan!" // Pesan sukses yang sesuai
      />
    </div>
  );
}

export default ProfilePage;