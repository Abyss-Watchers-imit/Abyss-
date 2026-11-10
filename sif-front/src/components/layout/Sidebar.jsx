import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Newspaper, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar-area">
      <div className="sidebar-user">
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', color: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </div>
        <span>Иванов И. И.</span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} /> Профиль
        </NavLink>
        <NavLink to="/feed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Newspaper size={18} /> Лента
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <MessageCircle size={18} /> Чат
        </NavLink>
      </nav>
    </aside>
  );
}