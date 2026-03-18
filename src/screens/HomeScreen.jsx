import React from 'react';
import '../index.css';
import { Passion_Week_Content } from '../data/db.js';

export default function HomeScreen({ onSelectDay, completedDays }) {
  const today = new Date().getDay(); 
  const currentDayNumber = today >= 1 && today <= 6 ? today : 1; 

  return (
    <div className="home-screen animate-fade-in-up" style={{ padding: '24px' }}>
      <header style={{ marginTop: '32px', marginBottom: '40px' }}>
        <p className="text-accent">서울드림교회 고난주간</p>
        <h1 className="heading-jumbo" style={{ marginTop: '12px' }}>
          내 안의<br />돌성전 무너뜨리기
        </h1>
        <div style={{ 
          marginTop: '24px', 
          width: '60px', 
          height: '4px', 
          background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
          borderRadius: '2px'
        }} />
      </header>

      <div className="card-list">
        {Passion_Week_Content.map((item, index) => {
          const isToday = item.day === currentDayNumber;
          const isCompleted = completedDays.includes(item.day);

          return (
            <div 
              key={item.day} 
              className="mosaic-card"
              style={{
                border: isToday ? '2px solid var(--primary-color)' : '1px solid rgba(0,0,0,0.03)',
                animationDelay: `${index * 0.08}s`,
                opacity: 0,
                animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s forwards`
              }}
              onClick={() => onSelectDay(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ 
                  backgroundColor: isToday ? 'rgba(231, 76, 60, 0.1)' : '#F3F4F6',
                  color: isToday ? 'var(--primary-color)' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  DAY {item.day}
                </span>
                {isCompleted && (
                  <span style={{ color: 'var(--secondary-color)', fontSize: '13px', fontWeight: 800 }}>✓ 완료됨</span>
                )}
              </div>
              
              <h2 className="heading-card">
                {item.title}
              </h2>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', opacity: 0.9 }}>
                {item.object}
              </p>
              
              <p style={{ 
                fontSize: '15px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.lucado_insight}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
