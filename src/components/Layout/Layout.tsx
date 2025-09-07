import React from 'react';
import Header from './Header';
import Chatbot from '../Chatbot/Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;