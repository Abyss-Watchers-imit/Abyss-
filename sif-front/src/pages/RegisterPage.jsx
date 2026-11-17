import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../api/auth';
import { useUser } from '../context/UserContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await register(name, email, password);
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Аккаунт создан!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Регистрация</h2>
      <input placeholder="Имя" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <button type="submit" style={{ padding: '10px 20px' }}>Зарегистрироваться</button>
      <p style={{ marginTop: 12 }}>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </form>
  );
}