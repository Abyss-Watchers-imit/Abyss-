const POSTS_KEY = 'mock_posts';

const DEFAULT_POSTS = [
  {
    _id: 'p1',
    author: { id: 'u1', name: 'Иванов И. И.', avatar: null },
    text: 'Как же круто жить на кубани!',
    imageUrl: 'https://via.placeholder.com/600x400',
    likes: 2,
    likedBy: ['u2'],                        
    comments: [
      {
        _id: 'c1',
        author: { id: 'u2', name: 'Петрова А. С.', avatar: null },
        text: 'Согласна! 🔥',
        createdAt: new Date(Date.now() - 3600_000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    _id: 'p2',
    author: { id: 'u2', name: 'Петрова А. С.', avatar: null },
    text: 'Всем привет! Это мой первый пост 👋',
    imageUrl: null,
    likes: 5,
    likedBy: [],
    comments: [],
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
];

function loadPosts() {
  const raw = localStorage.getItem(POSTS_KEY);
  if (!raw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    return [...DEFAULT_POSTS];
  }
  const posts = JSON.parse(raw).map(p => ({
    likedBy: [],
    comments: [],
    ...p,
  }));
  return posts;
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    return users.find(u => u.id === payload.id) || null;
  } catch {
    return null;
  }
}

export async function getPosts() {
  await delay();
  return loadPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createPost(text, imageFile) {
  await delay(500);

  let imageUrl = null;
  if (imageFile) imageUrl = await fileToBase64(imageFile);

  const me = getCurrentUser();
  const newPost = {
    _id: 'p' + Date.now(),
    author: {
      id: me?.id || 'guest',
      name: me?.name || 'Гость',
      avatar: me?.avatar || null,
    },
    text,
    imageUrl,
    likes: 0,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const posts = loadPosts();
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export async function toggleLike(postId) {
  await delay(150);
  const me = getCurrentUser();
  if (!me) throw new Error('Войдите, чтобы лайкать');

  const posts = loadPosts();
  const post = posts.find(p => p._id === postId);
  if (!post) throw new Error('Пост не найден');

  if (!post.likedBy) post.likedBy = [];

  const idx = post.likedBy.indexOf(me.id);
  if (idx >= 0) {
   
    post.likedBy.splice(idx, 1);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    
    post.likedBy.push(me.id);
    post.likes += 1;
  }

  savePosts(posts);
  return { likes: post.likes, likedBy: post.likedBy };
}

export async function addComment(postId, text) {
  await delay(250);
  const me = getCurrentUser();
  if (!me) throw new Error('Войдите, чтобы комментировать');
  if (!text.trim()) throw new Error('Комментарий пустой');

  const posts = loadPosts();
  const post = posts.find(p => p._id === postId);
  if (!post) throw new Error('Пост не найден');

  const comment = {
    _id: 'c' + Date.now(),
    author: { id: me.id, name: me.name, avatar: me.avatar || null },
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!post.comments) post.comments = [];
  post.comments.push(comment);
  savePosts(posts);
  return comment;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}