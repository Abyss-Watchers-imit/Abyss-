import React from 'react';
import { Plus, Heart, MessageCircle, User } from 'lucide-react';

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      author: 'Иванов И. И.',
      text: 'Как же круто жить на кубани!',
      imageUrl: 'https://via.placeholder.com/600x400',
      likes: 2,
      comments: 0,
      time: '2 ч назад'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#0077c2',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        <Plus size={20} /> Создать пост
      </button>

      {posts.map(post => (
        <div key={post.id} style={{
          backgroundColor: '#1c7db1',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={22} />
            </div>
            <strong style={{ fontSize: '18px' }}>{post.author}</strong>
          </div>

          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="Post media" 
              style={{ width: '100%', borderRadius: '6px', marginBottom: '12px', objectFit: 'cover' }} 
            />
          )}

          <p style={{ fontSize: '16px', margin: '0 0 12px 0' }}>{post.text}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9 }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Heart size={18} /> {post.likes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <MessageCircle size={18} /> {post.comments}
              </span>
            </div>
            <span style={{ fontSize: '12px' }}>{post.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}