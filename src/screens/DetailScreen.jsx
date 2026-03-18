import React from 'react';
import { ArrowLeft, Check, Heart } from 'lucide-react';
import '../index.css';

export default function DetailScreen({ item, onBack, onComplete, isCompleted }) {
  return (
    <div className="detail-screen animate-fade-in-up" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* Full Hero Image Section */}
      <div style={{
        position: 'relative',
        height: '320px',
        backgroundColor: '#111',
        backgroundImage: 'url("https://images.unsplash.com/photo-1544427920-c49ccf08c146?w=800&q=80")', // Abstract mosaic/cross like background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="hero-gradient-overlay" />
        
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '40px',
            left: '20px',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>

        <div style={{ position: 'absolute', bottom: '40px', left: '24px', right: '24px', zIndex: 2, color: 'white' }}>
          <span style={{ 
            display: 'inline-block',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '12px'
          }}>
            DAY {item.day}
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: '1.2', marginBottom: '8px', letterSpacing: '-1px' }}>
            {item.title}
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 500, opacity: 0.9 }}>{item.object}</p>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-24px', position: 'relative', zIndex: 5 }}>
        
        {/* Memory Verse Box abstract style */}
        <div className="mosaic-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '3px', height: '24px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px' }} />
            <h3 className="text-accent" style={{ color: 'var(--secondary-color)', marginTop: '4px' }}>
              오늘의 말씀
            </h3>
          </div>
          <p style={{ fontSize: '19px', fontWeight: 600, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            "{item.verse}"
          </p>
        </div>

        {/* Max Lucado Insight */}
        <div className="mosaic-card">
          <h3 className="text-accent" style={{ marginBottom: '16px' }}>
            맥스 루케이도의 통찰
          </h3>
          <p style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            {item.lucado_insight}
          </p>
        </div>

        {/* Mission / Challenge */}
        <div className="mosaic-card" style={{ 
          border: 'none', 
          background: 'linear-gradient(to bottom right, #FFFFFF, #FDF2F1)',
          boxShadow: '0 12px 32px rgba(231, 76, 60, 0.06)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Heart size={24} color="var(--primary-color)" fill="var(--primary-color)" opacity={0.2} style={{ position: 'absolute', right: '20px', top: '20px', width: '64px', height: '64px' }} />
            <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>!</span>
            오늘의 실천 챌린지
          </h3>
          <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
            {item.mission}
          </p>
          
          <button 
            className={`btn-mosaic ${isCompleted ? 'completed' : ''}`}
            onClick={() => onComplete(item.day)}
            disabled={isCompleted}
            style={{ position: 'relative', zIndex: 2 }}
          >
            {isCompleted ? (
              <>
                <Check size={22} strokeWidth={3} />
                참여가 완료되었습니다
              </>
            ) : "챌린지 완료하기"}
          </button>
        </div>

        {/* Suno Lyrics (Bonus) */}
        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '12px' }}>
            AI 찬양 묵상
          </p>
          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-primary)', opacity: 0.7, fontWeight: 500 }}>
            "{item.suno_lyrics}"
          </p>
        </div>

      </div>
    </div>
  );
}
