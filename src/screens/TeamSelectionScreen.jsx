import React from 'react';
import loadBg from '../assets/load.jpg';

export default function TeamSelectionScreen({ onSelectTeam }) {
  return (
    <div 
      className="team-selection-screen"
      style={{
        backgroundImage: `url(${loadBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        height: 'calc(var(--real-vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        color: '#fff',
        position: 'relative'
      }}
    >
      <div 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '40px 24px',
          borderRadius: '24px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '12px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          환영합니다
        </h1>
        <p style={{ 
          fontSize: '15px', 
          lineHeight: '1.5',
          marginBottom: '32px',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          함께할 팀을 선택해주세요.<br/>
          (나중에 변경할 수 있습니다)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => onSelectTeam('intercessory')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            중보기도 팀
          </button>
          
          <button 
            onClick={() => onSelectTeam('outreach')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              backgroundColor: 'transparent',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            아웃리치 팀
          </button>
        </div>
      </div>
    </div>
  );
}
