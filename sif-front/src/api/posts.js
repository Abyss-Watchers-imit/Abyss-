const POSTS_KEY = 'mock_posts';

const DEFAULT_POSTS = [
  {
    _id: 'p1',
    author: { name: 'Иванов И. И.', avatar: null },
    text: 'Как же круто жить на кубани!',
    imageUrl: 'https://via.placeholder.com/600x400',
    likes: 2,
    comments: [],
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    _id: 'p2',
    author: { name: 'Петрова А. С.', avatar: null },
    text: 'Всем привет! Это мой первый пост 👋',
    imageUrl: null,
    likes: 5,
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
  return JSON.parse(raw);
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function getPosts() {
  await delay();
  return loadPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createPost(text, imageFile) {
  await delay(500);

  let imageUrl = null;
  if (imageFile) {
    imageUrl = await fileToBase64(imageFile);
  }

  
  const token = localStorage.getItem('token');
  let authorName = 'Гость';
  if (token) {
    try {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const payload = JSON.parse(atob(token));
      const me = users.find(u => u.id === payload.id);
      if (me) authorName = me.name;
    } catch { /* ignore */ }
  }

  const newPost = {
    _id: 'p' + Date.now(),
    author: { name: authorName, avatar: null },
    text,
    imageUrl,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const posts = loadPosts();
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}