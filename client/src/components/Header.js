import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="logo">🎤 Mirah Voice</h1>
          <p className="tagline">AI-Powered Voice Interview Helper</p>
        </div>
        <div>
          <span style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
            ● Free & Open Source
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
