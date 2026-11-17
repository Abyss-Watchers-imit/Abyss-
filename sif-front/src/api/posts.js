const API_URL = 'http://localhost:5173/api'; 

export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error('Ошибка загрузки постов');
  return response.json();
};

export const createPost = async (text, imageFile) => {
  const formData = new FormData();
  formData.append('text', text);
  if (imageFile) {
    formData.append('image', imageFile); 
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    body: formData, 
  });
  
  if (!response.ok) throw new Error('Ошибка создания поста');
  return response.json();
};