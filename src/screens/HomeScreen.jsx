import React from 'react';
import '../index.css';
import mainHomeImg from '../assets/main_home4_image.jpeg';

export default function HomeScreen() {
  return (
    <div 
      className="home-screen animate-fade-in-up" 
      style={{ 
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--bg-color)',
        overflow: 'hidden'
      }}
    >
      <img 
        src={mainHomeImg} 
        alt="Main Home Screen" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', /* 원본 비율 유지하면서 화면에 꽉 차게 줌인(확대) */ 
          objectPosition: 'center' 
        }} 
      />
    </div>
  );
}
