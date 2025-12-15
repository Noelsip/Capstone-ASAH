// src/pages/settings/Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import SuccessModal from '../../components/common/SuccessModal.jsx'; // <-- 1. IMPORT MODAL
import defaultAvatar from '../../assets/avatar-pekerja.png'; 

const BASE_URL = '/api';

function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    phoneNumber: '',
    department: '',
    profileImage: defaultAvatar,
    userId: '',
    createdAt: '',
    lastLogin: '',
    isActive: false,
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); 

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken'); 
          setError('Session expired. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        throw new Error('Failed to fetch profile.');
      }

      const data = await response.json();
      console.log('API Response:', data); 
      const user = data.user;

      // Split nama menjadi firstName dan lastName
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || ''; 
      const lastName = nameParts.slice(1).join(' ') || '';

      // Ambil dari localStorage jika backend tidak mengirim
      const savedPhone = localStorage.getItem('userPhone') || '';
      const savedDept = localStorage.getItem('userDept') || '';

      setProfile({
        firstName: firstName,
        lastName: lastName,
        email: user.user_email,
        jobTitle: user.role?.role_desc || 'N/A',
        phoneNumber: user.phone_number || savedPhone, 
        department: user.department || savedDept, 
        profileImage: user.profile_image || defaultAvatar,
        userId: user.id, 
        createdAt: user.created_at,
        lastLogin: user.last_login,
        isActive: user.is_active,
        role: user.role?.role_name || '',
      });
      
      console.log('Profile State:', {
        phoneNumber: user.phone_number || savedPhone,
        department: user.department || savedDept
      }); 
      
      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error('Error fetching profile:', error);
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          setProfile(prev => ({ ...prev, profileImage: imageUrl }));
      }
  };

  const handleRemoveImage = () => {
    setProfile(prev => ({ ...prev, profileImage: defaultAvatar }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No authentication token found.');
        return;
      }
    
      const fullName = `${profile.firstName.trim()} ${profile.lastName.trim()}`;

      const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          phone_number: profile.phoneNumber,
          department: profile.department,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile.');
      }

      const data = await response.json();
      console.log('Profile saved:', data);

      // Simpan ke localStorage sebagai backup
      localStorage.setItem('userPhone', profile.phoneNumber);
      localStorage.setItem('userDept', profile.department);

      setIsEditing(false);
      setIsSaveSuccessModalOpen(true);

      // Refresh profile data
      await fetchUserProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    }
  };
  
  const handleCancel = () => {
    fetchUserProfile();
    setIsEditing(false);
  };
  
  const handleCopyUserId = () => {
    navigator.clipboard.writeText(profile.userId);
    alert('User ID copied to Clipboard!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const time = date.toLocaleTimeString('en-ID', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return isToday ? `Today at ${time}` : `${formatDate(dateString)} at ${time}`;
  };

  if (loading) {
    return <div className='text-center py-8'>Loading Profile...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>Error: {error}</div>
  }
  return (
    <div className="space-y-10">
      
      {/* 1. HEADER PROFILE VISUAL */}
      <div className="flex items-start space-x-6 border-b pb-8">
        
        {/* Foto Profil dan Input File */}
        <div className="relative">
            <img 
                src={profile.profileImage} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full object-cover shadow-md cursor-pointer"
                onClick={() => isEditing && fileInputRef.current.click()}
            />
            <span className={`absolute bottom-1 right-1 h-4 w-4 ${profile.isActive ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white flex items-center justify-center text-xs text-white shadow-lg`}>
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
            <span className={`text-xs font-medium ${profile.isActive ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'} px-2 py-0.5 rounded-full mb-4`}>
                {profile.isActive ? 'Active' : 'Inactive'}
            </span>

            {/* Tombol Ganti/Hapus Foto */}
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
        
        {/* BAGIAN FORMULIR */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            
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
              <Input id="phoneNumber" type="text" value={profile.phoneNumber} onChange={handleChange} disabled={!isEditing} placeholder="Not set" />
            </div>
            <div className="space-y-1">
              <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title / Role</label>
              <Input id="jobTitle" type="text" value={profile.role} onChange={handleChange} disabled={true} className="bg-gray-100" />
            </div>
            <div className="space-y-1">
              <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
              <Input id="department" type="text" value={profile.department} onChange={handleChange} disabled={!isEditing} placeholder="Not set" />
            </div>

            {/* TOMBOL AKSI */}
            {isEditing && (
              <>
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
              </>
            )}

          </div>
        </div>
        
        {/* BAGIAN ACCOUNT DETAILS */}
        <div className="space-y-6 pt-6 border-t">
          <h3 className="text-xl font-semibold text-gray-800">Account Details</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-gray-600">
            
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-lg font-mono text-gray-900">{profile.userId}</p>
                <button type="button" onClick={handleCopyUserId} className="text-primary hover:underline text-sm">
                    Copy
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg text-gray-900 mt-1">{formatDate(profile.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Last Login</p>
              <p className="text-lg text-gray-900 mt-1">{formatDateTime(profile.lastLogin)}</p>
            </div>
            
          </div>
        </div>
      </form>
      
      {/* Tombol Edit Profile */}
      {!isEditing && (
          <div className="flex justify-end">
              <Button type="button" className="w-auto px-6 py-2" onClick={() => setIsEditing(true)}>
                  Edit Profile
              </Button>
          </div>
      )}
      
      {/* POPUP SUKSES */}
      <SuccessModal 
          isVisible={isSaveSuccessModalOpen}
          onClose={() => setIsSaveSuccessModalOpen(false)}
          message="Perubahan profil berhasil disimpan!"
      />
    </div>
  );
}

export default ProfilePage;