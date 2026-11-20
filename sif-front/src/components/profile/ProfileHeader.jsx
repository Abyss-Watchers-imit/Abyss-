import React from 'react';
import { User } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader() {
  const { user } = useUser();

  return (
    <div className={styles.header}>
      <div className={styles.avatarWrap}>
        {user?.avatar
          ? <img src={user.avatar} alt="Avatar" className={styles.avatarImg} />
          : <User size={48} />}
      </div>
      <div>
        <h1 className={styles.name}>
          {user?.name || 'Гость'}
        </h1>
      </div>
    </div>
  );
}