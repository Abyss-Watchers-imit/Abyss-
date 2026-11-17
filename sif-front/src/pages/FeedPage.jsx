import React, { useState, useEffect, useRef } from 'react';
import { Plus, Heart, MessageCircle, User, X, Image as ImageIcon } from 'lucide-react';
import { getPosts, createPost } from '../api/posts';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить ленту');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPost = async () => {
    if (!newText.trim() && !newImageFile) return;

    try {
      const newPost = await createPost(newText, newImageFile);
      setPosts([newPost, ...posts]);
      setNewText('');
      handleRemoveImage();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      alert('Ошибка при публикации');
    }
  };

  if (isLoading) {
    return <div style={{ color: 'white', padding: '20px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        style={{
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
        }}
      >
        {isFormOpen ? <><X size={20} /> Отменить</> : <><Plus size={20} /> Создать пост</>}
      </button>

      {isFormOpen && (
        <div style={{
          backgroundColor: '#1c7db1',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <textarea
            placeholder="О чем вы думаете?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              marginBottom: '10px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />

          <div style={{ marginBottom: '10px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            {!previewUrl ? (
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px dashed rgba(255,255,255,0.5)',
                  borderRadius: '4px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <ImageIcon size={20} /> Прикрепить картинку
              </button>
            ) : (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '150px', borderRadius: '4px', display: 'block' }}
                />
                <button
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAddPost}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Опубликовать
          </button>
        </div>
      )}

      {posts.map(post => (
        <div
          key={post.id || post._id}
          style={{
            backgroundColor: '#1c7db1',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              color: '#0088cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={22} />
            </div>
            <strong style={{ fontSize: '18px' }}>{post.author}</strong>
          </div>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post media"
              style={{ width: '100%', borderRadius: '6px', marginBottom: '12px', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {post.text && (
            <p style={{ fontSize: '16px', margin: '0 0 12px 0' }}>{post.text}</p>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: 0.9
          }}>
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