// components/AvatarWithFallback.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const AvatarWithFallback = ({ src, alt, className, username, size = 'medium' }) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeStyles = {
    small: { width: '40px', height: '40px', fontSize: '18px' },
    medium: { width: '80px', height: '80px', fontSize: '32px' },
    large: { width: '110px', height: '110px', fontSize: '48px' }
  };

  if (imgError || !src) {
    // Colores para el fallback
    const colors = ['#fe2c55', '#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#e91e63', '#00bcd4'];
    const colorIndex = username ? username.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return (
      <div 
        className={className} 
        style={{ 
          ...sizeStyles[size],
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: 'white'
        }}
      >
        {username ? username[0].toUpperCase() : <FontAwesomeIcon icon={faUserCircle} size="2x" />}
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={sizeStyles[size]}
      onError={() => setImgError(true)}
    />
  );
};

export default AvatarWithFallback;