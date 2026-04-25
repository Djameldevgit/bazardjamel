// components/Avatar.js (crear este componente)
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Avatar = ({ src, alt, className, size = 96 }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={className} style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        background: '#fe2c55',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: size * 0.8, color: 'white' }} />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default Avatar;