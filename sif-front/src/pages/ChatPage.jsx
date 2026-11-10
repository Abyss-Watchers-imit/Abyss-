import React from 'react';

export default function ChatPage() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#1c7db1',
      borderRadius: '8px',
      padding: '24px',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <h2>Чаты</h2>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', borderRadius: '6px', padding: '15px', marginBottom: '15px' }}>
        Выберите чат для общения
      </div>
      <input 
        type="text" 
        placeholder="Введите сообщение..." 
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '4px',
          padding: '10px',
          color: 'white',
          outline: 'none'
        }}
      />
    </div>
  );
}