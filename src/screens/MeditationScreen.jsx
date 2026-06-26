import React, { useState, useEffect } from 'react';
import '../index.css';
import { Passion_Week_Content } from '../data/db.js';
import mainEmptyImg from '../assets/main_empty_image.jpeg';
import imgDay1 from '../assets/Day1.jpg';
import imgDay2 from '../assets/Day2.jpg';
import imgDay3 from '../assets/day3.jpg';
import imgDay4 from '../assets/Day4.jpg';
import imgDay5 from '../assets/Day5.jpg';

import tombClose from '../assets/Tomb of Jesus_close.png';
import tombOpen from '../assets/Tomb of Jesus_open.png';

const dayImages = {
  1: imgDay2,
  2: imgDay1,
  3: imgDay3,
  4: imgDay4,
  5: imgDay5,
};

// 각 요일별 오픈 시간 (2026년 기준)
const OPEN_DATES = {
  2: new Date('2026-03-31T00:00:00+09:00'), // 화요일
  3: new Date('2026-04-01T00:00:00+09:00'), // 수요일
  4: new Date('2026-04-02T00:00:00+09:00'), // 목요일
  5: new Date('2026-04-03T00:00:00+09:00'), // 금요일
};

// 4월 5일 00:00 KST (= 2026-04-04T15:00:00Z) 이후 빈 무덤 이미지로 전환
const EASTER_DATE = new Date('2026-04-05T00:00:00+09:00');


export default function MeditationScreen({ onSelectDay, onPodcast, completedDays, isAdmin = false, publishedDays = {} }) {
  const [toast, setToast] = useState({ show: false, message: '', fadeOut: false });

  const today = new Date().getDay(); 
  const currentDayNumber = today >= 1 && today <= 5 ? today : 1; 

  // 현재 시간 기준으로 부활주일 이미지 결정
  const now = new Date();
  const tombImg = now >= EASTER_DATE ? tombOpen : tombClose;

  const handleCardClick = (item) => {
    // 드래프트(팟캐스트) 배너는 팟캐스트 모달로
    if (item.draftOnly) {
      if (onPodcast) onPodcast(item);
      return;
    }
    // 관리자 모드면 날짜 제한 없이 모두 오픈
    if (!isAdmin && item.day > 1) {
      const openDate = OPEN_DATES[item.day];
      if (now < openDate) {
        const month = openDate.getMonth() + 1;
        const date = openDate.getDate();
        showToast(`${month}월 ${date}일부터 오픈 됩니다.`);
        return;
      }
    }
    onSelectDay(item);
  };

  const showToast = (message) => {
    setToast({ show: true, message, fadeOut: false });
  };

  useEffect(() => {
    if (toast.show && !toast.fadeOut) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, fadeOut: true }));
      }, 2000);
      return () => clearTimeout(timer);
    } else if (toast.show && toast.fadeOut) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', fadeOut: false });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [toast.show, toast.fadeOut]);

  return (
    <div 
      className="meditation-screen" 
      style={{ 
        padding: '24px', 
        paddingTop: 'calc(env(safe-area-inset-top, 54px) + 120px)',
        paddingBottom: '100px',
        backgroundImage: `url(${mainEmptyImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div className="animate-fade-in-up">
        <header style={{ marginTop: '0', marginBottom: '48px' }}>
          <h1 className="heading-jumbo" style={{ fontSize: '32px', fontFamily: "'Pretendard', -apple-system, sans-serif", fontWeight: 900, letterSpacing: '-0.5px', WebkitTextStroke: '0.8px white' }}>
            고난주간 묵상 나눔
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px' }}>매일 주어지는 말씀을 묵상하고 실천해보세요.</p>
        </header>

        <div className="card-list">
          {Passion_Week_Content.filter(item => {
            if (!item.draftOnly) return true; // 일반 배너는 항상 표시
            if (isAdmin) return true; // 관리자는 모든 배너 표시
            return publishedDays[`day_${item.day}`] === true; // 공개 전환된 드래프트만 표시
          }).map((item, index) => {
            const isToday = item.day === currentDayNumber;
            const isCompleted = completedDays.includes(item.day);
            // 관리자 모드에서 아직 잠긴 배너 표시
            const isLocked = !isAdmin && item.day > 1 && now < OPEN_DATES[item.day];

            // 날짜별로 배경 이미지의 줌(Zoom) 또는 위치(Position) 미세 조정
            let bgSize = 'cover';
            let bgPosition = 'center';
            
            if (item.day === 1) {
              bgPosition = 'center 20%';
            }
            if (item.day === 2) {
              bgPosition = 'center 30%';
            }
            if (item.day === 3) {
              bgPosition = 'center 15%';
              bgSize = '110%'; // day3 이미지 양옆 선 제거를 위해 약간 확대
            }
            if (item.day === 4) bgPosition = 'center 33%';
            if (item.day === 5) bgPosition = 'center 0%';

            return (
              <div 
                key={item.day} 
                className="mosaic-card"
                style={{
                  opacity: 0,
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s forwards`,
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${dayImages[item.day]})`,
                  backgroundSize: `cover, ${bgSize}`,
                  backgroundPosition: `center, ${bgPosition}`,
                  backgroundRepeat: 'no-repeat, no-repeat',
                }}
                onClick={() => handleCardClick(item)}
              >
                {/* 완료 시 우측 상단 흰색 체크 */}
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    zIndex: 5,
                  }}>✓</div>
                )}
                {/* 관리자 모드에서 잠긴 배너(날짜 잠금)에 표시 */}
                {isAdmin && isLocked && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: 'rgba(207,161,49,0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    color: '#fff',
                    fontWeight: 700,
                    zIndex: 5,
                  }}>🔓 관리자 미리보기</div>
                )}

                {/* 드래프트(미공개) 배너 뱃지 */}
                {item.draftOnly && isAdmin && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: 'rgba(180,40,220,0.88)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    color: '#fff',
                    fontWeight: 800,
                    zIndex: 5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    letterSpacing: '0.3px'
                  }}>🔒 미공개 배너</div>
                )}

                <div>
                  <h2 className="heading-card" style={{ color: '#FFFFFF', textShadow: '0px 2px 4px rgba(0,0,0,0.5)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
                    {item.dayName}
                  </h2>
                  <p 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: 'rgba(255,255,255,0.6)', 
                      marginBottom: '4px', 
                      textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                      fontFamily: "'Nanum Myeongjo', serif",
                      whiteSpace: 'pre-line',
                      lineHeight: '1.4'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.theme }}
                  />
                </div>
              </div>
            );
          })}

          {/* 부활주일 배너 */}
          <div
            className="mosaic-card"
            style={{
              opacity: 0,
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${Passion_Week_Content.length * 0.08}s forwards`,
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.15) 100%), url(${tombImg})`,
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, center 30%',
              backgroundRepeat: 'no-repeat, no-repeat',
              cursor: 'default',
            }}
          >
            <div>
              <h2 className="heading-card" style={{ color: '#FFFFFF', textShadow: '0px 2px 4px rgba(0,0,0,0.5)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
                부활 주일
              </h2>
              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '4px',
                textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                fontFamily: "'Nanum Myeongjo', serif",
                whiteSpace: 'pre-line',
                lineHeight: '1.4',
              }}>
                그가 여기 계시지 않고 그가 말씀 하시던 대로<br/>살아나셨느니라 와서 그가 누우셨던 곳을 보라
                <br/>
                <span style={{
                  fontFamily: "'Pretendard', -apple-system, sans-serif",
                  fontWeight: 400,
                  fontSize: '13px',
                }}>4월 5일 주일 · 부활절</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.fadeOut ? 'toast-fade-out' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
