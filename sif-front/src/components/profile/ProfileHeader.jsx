import React from 'react';
import { User } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
      <div style={{
        width: 90, height: 90, borderRadius: '50%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0088cc'
      }}>
        <User size={48} />
      </div>
      <div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Иванов И. И.</h1>
        <input 
          type="text" 
          placeholder="Ваш статус..." 
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: '4px',
            padding: '6px 10px',
            color: 'white',
            outline: 'none',
            width: '200px'
          }}
        />
      </div>
    </div>
  );
}