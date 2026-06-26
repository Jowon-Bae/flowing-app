import React, { useState } from 'react';
import loadBg from '../assets/load.jpg';
import { ArrowLeft } from 'lucide-react';

export default function OutreachNameInputScreen({ onSubmitName, onBack }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmitName(name.trim());
    }
  };

  return (
    <div 
      className="outreach-name-screen"
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
      <button 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          padding: '8px',
          opacity: 0.8
        }}
      >
        <ArrowLeft size={24} />
      </button>

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
          아웃리치 팀
        </h1>
        <p style={{ 
          fontSize: '15px', 
          lineHeight: '1.5',
          marginBottom: '32px',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          기도 어플에 사용할<br/>
          이름을 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 입력"
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              textAlign: 'center',
              outline: 'none',
              color: '#1a1a1a'
            }}
          />
          
          <button 
            type="submit"
            disabled={!name.trim()}
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: name.trim() ? '#4A90E2' : 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: name.trim() ? '0 4px 12px rgba(74, 144, 226, 0.3)' : 'none'
            }}
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
