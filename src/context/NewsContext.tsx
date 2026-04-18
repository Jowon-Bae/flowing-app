import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface NewsPost {
  id: number;
  title: string;
  content: string;
  time: string;
  emoji: string;
}

interface NewsContextType {
  posts: NewsPost[];
  addPost: (title: string, content: string, emoji: string) => void;
  deletePost: (id: number) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNewsContext must be used within a NewsProvider');
  return context;
};

const defaultPosts: NewsPost[] = [
  {
    id: 1,
    title: '현지 도착 — 은혜로운 첫날!',
    content: '모든 팀원이 안전하게 현지에 도착했습니다. 선교사님 가정과 감사히 첫 저녁을 함께하며 내일 사역을 위해 기도하고 있어요. 하나님이 이 땅을 위해 예비하신 것들이 가득합니다. 함께 기도해 주세요!',
    time: '2025.08.14',
    emoji: '✈️',
  },
  {
    id: 2,
    title: '빠꼬 마을 어린이 사역 — 아이들이 뛰어놀았어요',
    content: '오늘 빠꼬 마을에서 300여 명의 어린이에게 밥을 먹이고 찬양하며 복음을 나눴습니다. 처음에는 쭈뼛했지만 금방 우리 팀원들과 어우러져 같이 뛰어노는 아이들의 웃음이 너무 예뻤어요. 하나님, 감사합니다!',
    time: '2025.08.15',
    emoji: '🙌',
  },
];

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<NewsPost[]>(defaultPosts);

  const addPost = (title: string, content: string, emoji: string) => {
    const now = new Date();
    const time = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const newPost: NewsPost = { id: Date.now(), title, content, time, emoji };
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
