import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Heart, MessageCircle, User, X,
  Image as ImageIcon, Loader2, Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPosts, createPost, toggleLike, addComment } from '../api/posts';
import { compressImage } from '../utils/compressImage';
import { timeAgo } from '../utils/time';
import { useUser } from '../context/UserContext';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

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

  const handleLike = async (postId) => {
    let prevSnapshot = null;

    setPosts(current => {
      prevSnapshot = current;
      return current.map(p => {
        if (p._id !== postId) return p;
        const likedBy = p.likedBy || [];
        const isLiked = likedBy.includes(user.id);
        return {
          ...p,
          likedBy: isLiked
            ? likedBy.filter(id => id !== user.id)
            : [...likedBy, user.id],
          likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
        };
      });
    });

    try {
      const result = await toggleLike(postId);
      setPosts(current => current.map(p =>
        p._id === postId ? { ...p, likes: result.likes, likedBy: result.likedBy } : p
      ));
    } catch (err) {
      if (prevSnapshot) setPosts(prevSnapshot);
      toast.error(err.message || 'Не удалось поставить лайк');
    }
  };

  const toggleComments = (postId) => {
    setExpandedPostId(prev => (prev === postId ? null : postId));
    setCommentText('');
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const comment = await addComment(postId, commentText);
      
      setPosts(current => current.map(p =>
        p._id === postId
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      ));
      
      setCommentText('');
    } catch (err) {
      toast.error(err.message || 'Не удалось отправить комментарий');
    } finally {
      setCommentLoading(false);
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
            type="file" accept="image/*" ref={fileInputRef}
            onChange={handleFileChange} className={styles.fileInput}
            disabled={isCompressing}
          />

          {isCompressing ? (
            <button className={styles.attachBtn} disabled>
              <Loader2 size={20} className={styles.spinner} /> Загружается...
            </button>
          ) : !previewUrl ? (
            <button className={styles.attachBtn} onClick={() => fileInputRef.current.click()}>
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

      {posts.map(post => {
        const isLiked = user && (post.likedBy || []).includes(user.id);
        const commentsCount = post.comments?.length || 0;
        const isExpanded = expandedPostId === post._id;

        return (
          <article key={post._id} className={styles.post}>
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
                src={post.imageUrl} alt="" className={styles.postImage}
                loading="lazy" onError={e => e.target.style.display = 'none'}
              />
            )}
            {post.text && <p className={styles.postText}>{post.text}</p>}

            <footer className={styles.postFooter}>
              <div className={styles.actions}>
                <span
                  className={`${styles.action} ${isLiked ? styles.liked : ''}`}
                  onClick={() => handleLike(post._id)}
                  title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                >
                  <Heart size={18} fill={isLiked ? '#ff4d6d' : 'none'} />
                  {post.likes}
                </span>

                <span
                  className={styles.action}
                  onClick={() => toggleComments(post._id)}
                >
                  <MessageCircle size={18} />
                  {commentsCount}
                </span>
              </div>
              <span className={styles.time}>{timeAgo(post.createdAt)}</span>
            </footer>

            {isExpanded && (
              <div className={styles.commentsBlock}>
                <div className={styles.commentsList}>
                  {commentsCount === 0 ? (
                    <div className={styles.noComments}>Пока нет комментариев</div>
                  ) : (
                    post.comments.map(c => (
                      <div key={c._id} className={styles.comment}>
                        <div className={styles.commentAvatar}>
                          {c.author?.avatar
                            ? <img src={c.author.avatar} alt="" />
                            : (c.author?.name?.[0] || '?')}
                        </div>
                        <div className={styles.commentBody}>
                          <div className={styles.commentAuthor}>{c.author?.name || 'Аноним'}</div>
                          <p className={styles.commentText}>{c.text}</p>
                          <div className={styles.commentTime}>{timeAgo(c.createdAt)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.commentForm}>
                  <input
                    className={styles.commentInput}
                    placeholder="Написать комментарий..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post._id);
                      }
                    }}
                  />
                  <button
                    className={styles.commentSubmit}
                    onClick={() => handleAddComment(post._id)}
                    disabled={!commentText.trim() || commentLoading}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}