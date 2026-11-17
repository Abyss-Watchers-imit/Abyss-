import React, { useState, useEffect, useRef } from 'react';
import { Plus, Heart, MessageCircle, User, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPosts, createPost } from '../api/posts';
import { compressImage } from '../utils/compressImage';
import { timeAgo } from '../utils/time';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);   
  const fileInputRef = useRef(null);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      toast.error(err.message || 'Не удалось загрузить ленту');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsCompressing(true);                 
      const compressed = await compressImage(file);
      setNewImageFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      toast.error('Не удалось обработать картинку');
      console.error(err);
    } finally {
      setIsCompressing(false);               
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setNewImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPost = async () => {
    if (!newText.trim() && !newImageFile) return;
    if (isCompressing) return;                

    try {
      setSubmitting(true);
      const newPost = await createPost(newText, newImageFile);
      setPosts([newPost, ...posts]);
      setNewText('');
      handleRemoveImage();
      setIsFormOpen(false);
      toast.success('Пост опубликован!');
    } catch (err) {
      toast.error(err.message || 'Ошибка публикации');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.createBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
        {isFormOpen ? <><X size={20} /> Отменить</> : <><Plus size={20} /> Создать пост</>}
      </button>

      {isFormOpen && (
        <div className={styles.form}>
          <textarea
            className={styles.textarea}
            placeholder="О чем вы думаете?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={isCompressing}
          />

          {isCompressing ? (
          
            <button className={styles.attachBtn} disabled>
              <Loader2 size={20} className={styles.spinner} />
              Загружается...
            </button>
          ) : !previewUrl ? (
            <button
              className={styles.attachBtn}
              onClick={() => fileInputRef.current.click()}
            >
              <ImageIcon size={20} /> Прикрепить картинку
            </button>
          ) : (
            <div className={styles.previewWrap}>
              <img src={previewUrl} alt="Preview" className={styles.preview} />
              <button className={styles.removeImg} onClick={handleRemoveImage}>
                <X size={14} />
              </button>
            </div>
          )}

          <button
            className={styles.submitBtn}
            onClick={handleAddPost}
            disabled={submitting || isCompressing}
          >
            {submitting ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      )}

      {posts.map(post => (
        <article key={post._id || post.id} className={styles.post}>
          <header className={styles.postHeader}>
            <div className={styles.avatar}>
              {post.author?.avatar
                ? <img src={post.author.avatar} alt="" />
                : <User size={22} />}
            </div>
            <strong className={styles.authorName}>{post.author?.name || 'Аноним'}</strong>
          </header>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt=""
              className={styles.postImage}
              loading="lazy"
              onError={e => e.target.style.display = 'none'}
            />
          )}
          {post.text && <p className={styles.postText}>{post.text}</p>}

          <footer className={styles.postFooter}>
            <div className={styles.actions}>
              <span className={styles.action}><Heart size={18} /> {post.likes}</span>
              <span className={styles.action}><MessageCircle size={18} /> {post.comments?.length || 0}</span>
            </div>
            <span className={styles.time}>{timeAgo(post.createdAt)}</span>
          </footer>
        </article>
      ))}
    </div>
  );
}