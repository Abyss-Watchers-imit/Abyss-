import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Newspaper, MessageCircle, LogOut } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function Sidebar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar-area">
      <div className="sidebar-user">
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#fff',
          color: '#0088cc', display: 'flex', alignItems: 'center',
          justifyContent: 'center', overflow: 'hidden'
        }}>
          {user?.avatar
            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <User size={20} />}
        </div>
        <span>{user?.name || 'Гость'}</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><User size={18} /> Профиль</NavLink>
        <NavLink to="/feed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Newspaper size={18} /> Лента</NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><MessageCircle size={18} /> Чат</NavLink>
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ background: 'none', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
        >
          <LogOut size={18} /> Выйти
        </button>
      </nav>
    </aside>
  );
}