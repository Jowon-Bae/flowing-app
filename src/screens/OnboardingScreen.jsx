import React, { useState } from 'react';
import { Smartphone, Music, Headphones, Image as ImageIcon, Pointer, ZoomIn, Users, Share2, ChevronRight } from 'lucide-react';
import '../index.css';
import atTheCrossImage from '../assets/at_the_cross_image.png';
import crossImage from '../assets/cross.png';
import onboardingBg from '../assets/black_background_image2.jpeg';

const LineArtCross = ({ size = 90, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="44" y="16" width="12" height="68" fill={color} />
    <rect x="28" y="32" width="44" height="12" fill={color} />
  </svg>
);

// 2단계: 이어폰 아이콘 추가로 시각적 직관성 강화
const LineArtSmartphoneMusic = ({ size = 120, color = "#CFA131" }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <Smartphone size={size * 0.8} color="rgba(255,255,255,0.7)" strokeWidth={1} style={{ position: 'absolute', bottom: 0, left: '10%' }} />
    <Headphones size={size * 0.5} color={color} strokeWidth={1.5} style={{ position: 'absolute', top: '10%', right: '10%', animation: 'float 3s ease-in-out infinite' }} />
  </div>
);

// 3단계: 명화(이미지) 아이콘 배경에 추가
const LineArtTouchZoom = ({ size = 120, color = "#CFA131" }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <ImageIcon size={size * 0.6} color="rgba(255,255,255,0.15)" strokeWidth={1} style={{ position: 'absolute', top: '10%', left: '20%' }} />
    <div style={{ position: 'absolute', top: '20%', left: '15%', opacity: 0.2 }}>
      <div style={{ width: size * 0.5, height: size * 0.5, border: `2px solid ${color}`, borderRadius: '50%', animation: 'ripple 2s linear infinite' }} />
    </div>
    <div style={{ position: 'absolute', top: '25%', left: '20%', opacity: 0.5 }}>
      <div style={{ width: size * 0.4, height: size * 0.4, border: `2px solid ${color}`, borderRadius: '50%', animation: 'ripple 2s linear infinite 0.5s' }} />
    </div>
    <Pointer size={size * 0.4} color="rgba(255,255,255,0.8)" strokeWidth={1.5} style={{ position: 'absolute', bottom: '15%', right: '25%' }} />
    <ZoomIn size={size * 0.5} color={color} strokeWidth={1.5} style={{ position: 'absolute', top: '10%', left: '10%' }} />
  </div>
);

const LineArtShareDetail = ({ size = 120, color = "#CFA131" }) => (
  <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ 
      width: size * 0.45, 
      height: size * 0.45, 
      borderRadius: '50%', 
      border: `1.5px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(207, 161, 49, 0.1)',
      animation: 'float 3s ease-in-out infinite',
      boxShadow: `0 0 20px ${color}33`,
      paddingRight: '1px' // 보정: 시각적으로 더 정중앙에 보이도록 미세 조정
    }}>
      <Share2 size={size * 0.22} color={color} strokeWidth={2.5} style={{ transform: 'translateX(-1px)' }} />
    </div>
    <div style={{ position: 'absolute', width: size * 0.7, height: size * 0.7, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', animation: 'ripple 3s ease-out infinite' }} />
    <div style={{ position: 'absolute', width: size * 0.9, height: size * 0.9, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', animation: 'ripple 3s ease-out infinite 1s' }} />
  </div>
);

const LineArtShare = ({ size = 120, color = "#CFA131" }) => (
  <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Users size={size * 0.6} color="rgba(255,255,255,0.7)" strokeWidth={1.2} style={{ position: 'absolute', bottom: '10%', transform: 'translateX(-10px)' }} />
    <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: '10%', animation: 'float 4s ease-in-out infinite' }}>
      <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="20" y1="35" x2="80" y2="35" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
    <Share2 size={size * 0.3} color={color} strokeWidth={2} style={{ position: 'absolute', right: '10%', top: '20%', transform: 'translateX(-10px)' }} />
  </div>
);

export default function OnboardingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const onTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;

    if (distance < -50) {
      handleNext();
    } else if (distance > 50) {
      if (currentStep > 0) setCurrentStep(prev => prev - 1);
    }
    setTouchStartX(null);
  };

  // 요청하신 메시지 업데이트 반영
  const steps = [
    {
      title: <img src={atTheCrossImage} alt="가장 깊은 사랑, 고난주간 묵상" style={{ height: '77px', objectFit: 'contain', marginTop: '57px' }} />,
      illustration: null,
      buttonText: "다음"
    },
    {
      title: "이어폰을 끼고 찬양과 함께\n깊은 묵상에 잠겨보세요",
      illustration: <LineArtSmartphoneMusic size={160} />,
      buttonText: "다음"
    },
    {
      title: "사진 속에 담긴 은혜를\n꾹 눌러 더 크게 감상하세요",
      illustration: <LineArtTouchZoom size={160} />,
      buttonText: "다음"
    },
    {
      title: "은혜로운 묵상 내용을\n소중한 사람에게 공유해보세요",
      illustration: <LineArtShareDetail size={180} />,
      buttonText: "다음"
    },
    {
      title: "오늘의 묵상과 각자의 기도를\n공동체와 함께 나누어보세요",
      illustration: <LineArtShare size={180} />,
      buttonText: "시작하기"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="app-container"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${onboardingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--text-primary)'
      }}
    >
      <div style={{ minHeight: '40px' }} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 24px', textAlign: 'center',
        marginBottom: '32px',
        marginTop: '32px',
        transition: 'margin-top 0.4s ease'
      }}>
        <div style={{ display: 'contents' }}>
          <div style={{ height: '80px', marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateY(78px)' }}>
            {typeof steps[currentStep].title === 'string' ? (
            <h1 style={{
              fontFamily: "'Pretendard', -apple-system, sans-serif",
              fontSize: '27px',
              fontWeight: 700,
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              opacity: 0,
              animation: 'fadeInUp 0.6s ease forwards',
              letterSpacing: '-0.02em'
            }} key={`title-${currentStep}`}>
              {steps[currentStep].title}
            </h1>
          ) : (
            <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease forwards' }} key={`img-title-${currentStep}`}>
              {steps[currentStep].title}
            </div>
          )}
        </div>
        <div style={{ height: '200px', marginBottom: '40px', marginTop: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.8s ease forwards', opacity: 0 }} key={`ill-${currentStep}`}>
          {steps[currentStep].illustration}
        </div>
        </div>
      </div>
      <div style={{ padding: '0 24px 0px', paddingBottom: 'env(safe-area-inset-bottom, 20px)', transform: 'translateY(56px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: currentStep === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentStep === idx ? 'var(--secondary-color)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="btn-mosaic"
          style={{ width: '100%', borderRadius: '0', fontSize: '18px', fontWeight: 700, padding: '8px 0', cursor: 'pointer' }}
        >
          {steps[currentStep].buttonText}
        </button>
        <div style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          opacity: currentStep === steps.length - 1 ? 0 : 1,
          pointerEvents: currentStep === steps.length - 1 ? 'none' : 'auto'
        }}>
          <button
            onClick={onComplete}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', padding: '12px 24px', borderRadius: '0' }}>
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
