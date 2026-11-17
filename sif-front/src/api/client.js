const API_URL = 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(options.headers || {}) };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Не авторизован');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `Ошибка ${response.status}`);
  return data;
}