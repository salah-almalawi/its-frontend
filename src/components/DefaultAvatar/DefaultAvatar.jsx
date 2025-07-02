// src/components/DefaultAvatar/DefaultAvatar.jsx
import React from 'react';
import styles from './DefaultAvatar.module.css';

const DefaultAvatar = ({ name, size = 128 }) => {
  // استخراج الأحرف الأولى من الاسم
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // توليد لون عشوائي بناءً على الاسم
  const getBackgroundColor = (name) => {
    if (!name) return '#0b80ee';
    
    const colors = [
      '#0b80ee', '#764ba2', '#f093fb', '#4facfe', 
      '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  return (
    <div 
      className={styles.avatar}
      style={{ 
        width: size, 
        height: size,
        backgroundColor 
      }}
    >
      <span 
        className={styles.initials}
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </span>
    </div>
  );
};

export default DefaultAvatar;