import React from 'react';
import { User } from 'lucide-react';

export default function FriendsList() {
  const friends = [
    { id: 1, name: 'friend 01', online: true },
    { id: 2, name: 'friend 02', online: false }
  ];

  return (
    <div style={{
      backgroundColor: '#0077c2',
      borderRadius: '6px',
      padding: '16px',
      width: '240px',
      marginLeft: 'auto'
    }}>
      <h3 style={{ margin: '0 0 12px 0', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>
        Ваши друзья
      </h3>
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, auto)', gap: '12px' }}>
        {friends.map(friend => (
          <div key={friend.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', color: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: friend.online ? '#4caf50' : '#888'
              }} />
            </div>
            <span style={{ fontSize: '14px' }}>{friend.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}