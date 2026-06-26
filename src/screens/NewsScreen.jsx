import React from 'react';
import goodFridayImg from '../assets/good_friday.jpeg';
import easterImg from '../assets/Easter.png';
import baptismImg from '../assets/baptism.png';
import '../index.css';

const NEWS_DATA = [
  {
    id: 'good-friday',
    title: '성금요예배',
    date: '2026년 4월 3일 오후 8시',
    location: '상문고 체육관',
    image: goodFridayImg
  },
  {
    id: 'easter',
    title: '부활절',
    date: '2026년 4월 5일',
    location: '상문고 체육관, 성수비전센터',
    image: easterImg
  },
  {
    id: 'baptism',
    title: '세례 및 입교식',
    date: '2026년 4월 5일 주일 2,3부',
    location: '상문고 체육관',
    image: baptismImg
  }
];

export default function NewsScreen() {
  return (
    <div className="news-screen animate-fade-in-up" style={{ padding: '24px', paddingTop: 'calc(env(safe-area-inset-top, 54px) + 120px)', paddingBottom: '110px' }}>
      <header style={{ marginTop: '0', marginBottom: '48px' }}>
        <h1 className="heading-jumbo" style={{ fontSize: '32px', fontFamily: "'Pretendard', -apple-system, sans-serif", fontWeight: 900, letterSpacing: '-0.5px', WebkitTextStroke: '0.8px white' }}>
          교회 소식
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px' }}>고난주간 및 부활절 주요 일정을 안내해 드립니다.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {NEWS_DATA.map((news, index) => (
          <div 
            key={news.id} 
            className="mosaic-card"
            style={{ 
              padding: 0, 
              overflow: 'hidden',
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`
            }}
          >
            {/* Banner Image Area */}
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <img 
                src={news.image} 
                alt={news.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="hero-gradient-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(2,11,20,1) 100%)' }}></div>
            </div>
            
            {/* Text Content Area */}
            <div style={{ padding: '24px', paddingTop: '8px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '14px', color: '#FFF' }}>{news.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700, minWidth: '32px' }}>일시</span>
                  {news.date}
                </p>
                {news.location && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700, minWidth: '32px' }}>장소</span>
                    {news.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
