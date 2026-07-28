import React from 'react';

function PageWrapper({ children, maxWidth, noPadding }) {
  return (
    <div
      style={{
        maxWidth: maxWidth || '1280px',
        margin: '0 auto',
        padding: noPadding ? '0' : '1.5rem 1rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
