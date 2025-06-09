import React from 'react';
import { Header } from './Header';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
    </div>
  );
}

export { Layout };
