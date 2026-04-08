import React, { useState } from 'react';
import './index.css';

const Banner = ({ theme }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="banner-container" style={{ backgroundColor: 'var(--theme-color)' }}>
      {!imageError && (
        <img 
          key={theme.banner}
          src={theme.banner} 
          alt={theme.name} 
          className="banner-image" 
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}
      <div className="banner-overlay">
        <div className="banner-content-container">
          <h2 className="banner-theme-name">{theme.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default Banner;
