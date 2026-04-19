import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface NewsPost {
  id: number;
  title: string;
  content: string;
  time: string;
  emoji: string;
  image?: string;
}

interface NewsContextType {
  posts: NewsPost[];
  addPost: (title: string, content: string, emoji: string, image?: string) => void;
  deletePost: (id: number) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNewsContext must be used within a NewsProvider');
  return context;
};

const defaultPosts: NewsPost[] = [];

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<NewsPost[]>(defaultPosts);

  const addPost = (title: string, content: string, emoji: string, image?: string) => {
    const now = new Date();
    const time = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const newPost: NewsPost = { id: Date.now(), title, content, time, emoji, image };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <NewsContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </NewsContext.Provider>
  );
};
