const USERS_KEY = 'mock_users';
const TOKEN_KEY = 'token';

const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'И',
    email: 'ivanov@test.ru',
    password: '1',
    avatar: null,
  },
  {
    id: 'u2',
    name: 'Петрова А. С.',
    email: 'petrova@test.ru',
    password: '123456',
    avatar: null,
  },
];

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }
  return JSON.parse(raw);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function fakeToken(user) {
  
  return btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 7 * 864e5 }));
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

export async function login(email, password) {
  await delay();
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error('Неверный email или пароль');
  }
  return { token: fakeToken(user), user: publicUser(user) };
}

export async function register(name, email, password) {
  await delay();
  const users = loadUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email уже занят');
  }
  if (password.length < 6) {
    throw new Error('Пароль должен быть не короче 6 символов');
  }
  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password,
    avatar: null,
  };
  users.push(newUser);
  saveUsers(users);
  return { token: fakeToken(newUser), user: publicUser(newUser) };
}

export async function getMe() {
  await delay(200);
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('Нет токена');
  let payload;
  try {
    payload = JSON.parse(atob(token));
  } catch {
    throw new Error('Битый токен');
  }
  if (payload.exp < Date.now()) {
    localStorage.removeItem(TOKEN_KEY);
    throw new Error('Токен истёк');
  }
  const users = loadUsers();
  const user = users.find(u => u.id === payload.id);
  if (!user) throw new Error('Пользователь не найден');
  return publicUser(user);
}