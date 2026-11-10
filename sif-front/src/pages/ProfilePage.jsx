import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import FriendsList from '../components/profile/FriendsList';

export default function ProfilePage() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#1c7db1',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <ProfileHeader />
      <FriendsList />
    </div>
  );
}