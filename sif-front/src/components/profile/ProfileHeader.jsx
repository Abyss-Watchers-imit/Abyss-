import React from 'react';
import { User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function ProfileHeader() {
  const { user } = useUser();

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
      <div style={{
        width: 90, height: 90, borderRadius: '50%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0088cc', overflow: 'hidden'
      }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <User size={48} />}
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: '28px' }}>
          {user?.name || 'Гость'}
        </h1>
      </div>
    </div>
  );
}