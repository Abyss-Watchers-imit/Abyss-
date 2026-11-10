import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-grid">
      <Header />
      <Sidebar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}