import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  여기에서 음원 URL과 커버 이미지 URL을 쉽게 수정할 수 있습니다.
// ─────────────────────────────────────────────────────────────────────────────
import coverImage from '../assets/SD_podcasts2.jpeg';
import podcastAudio from '../assets/podcasts_contents.m4a';

const PODCAST_CONFIG = {
  audioUrl: podcastAudio, // 🎵 podcasts_contents.m4a
  coverImageUrl: null,   // 🖼️ 외부 커버 이미지 URL (null이면 로컬 SD_podcasts.png 사용)
  title: '새벽 3시: 불안을 잠재울\n십자가의 도구들',
  artist: '서울드림교회 고난주간 묵상 팟캐스트',
  modalTitle: '특별 묵상',
};
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#8E44AD';
const ACCENT_LIGHT = 'rgba(142, 68, 173, 0.15)';

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PodcastScreen({ onClose, pauseBgm, resumeBgm, visitorId }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [slideIn, setSlideIn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Drag-to-close state
  const dragStartY = useRef(null);
  const [dragY, setDragY] = useState(0);

  const coverSrc = PODCAST_CONFIG.coverImageUrl || coverImage;
  const speedOptions = [1, 1.2, 1.5, 2];
  const [shareToast, setShareToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href.split('?')[0].split('#')[0];
    const shareTitle = PODCAST_CONFIG.title.replace('\n', ' ');
    const shareText = `서울드림교회 고난주간 묵상 팟캐스트\n${shareTitle}`;

    // 공유 이벤트 로깅
    addDoc(collection(db, 'analytics'), {
      type: 'podcast_share',
      visitorId: visitorId || null,
      timestamp: serverTimestamp(),
    }).catch(() => {});

    // 1. 카카오톡 SDK
    if (window.Kakao && window.Kakao.isInitialized()) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: shareTitle,
            description: '서울드림교회 고난주간 묵상 팟캐스트',
            imageUrl: 'https://raw.githubusercontent.com/Jowon-Bae/passion-week-app/main/src/assets/app_logo.jpeg',
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
          buttons: [{ title: '듣으러 가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
        });
        return;
      } catch (err) { /* 폴백 */ }
    }
    // 2. 네이티브 공유
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }
    // 3. 클립보드 복사
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch { /* ignore */ }
  };

  // ── Modal slide-in animation ──
  useEffect(() => {
    requestAnimationFrame(() => setSlideIn(true));
  }, []);

  // ── BGM 일시정지 / 재개 ──
  useEffect(() => {
    if (pauseBgm) pauseBgm();
    return () => {
      if (resumeBgm) resumeBgm();
    };
  }, []);

  // ── Audio 초기화 ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    // 미디어 세션 API (백그라운드 재생 / 잠금화면 컨트롤)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: PODCAST_CONFIG.title.replace('\n', ' '),
        artist: PODCAST_CONFIG.artist,
        artwork: [{ src: coverSrc, sizes: '512x512', type: 'image/png' }],
      });
      navigator.mediaSession.setActionHandler('play', () => handlePlay());
      navigator.mediaSession.setActionHandler('pause', () => handlePause());
      navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15));
      navigator.mediaSession.setActionHandler('seekforward', () => skip(30));
    }

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const hasLoggedPlay = useRef(false);

  const handlePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (!PODCAST_CONFIG.audioUrl) {
      alert('음원 URL이 아직 설정되지 않았습니다.\nPODCAST_CONFIG.audioUrl에 음원 주소를 입력해주세요.');
      return;
    }
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      // 첫 재생 시 한 번만 로깅
      if (!hasLoggedPlay.current) {
        hasLoggedPlay.current = true;
        addDoc(collection(db, 'analytics'), {
          type: 'podcast_play',
          visitorId: visitorId || null,
          timestamp: serverTimestamp(),
        }).catch(() => {});
      }
    }).catch(console.warn);
  }, [visitorId]);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = () => isPlaying ? handlePause() : handlePlay();

  const skip = (secs) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + secs));
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.volume = val;
    setVolume(val);
  };

  const handleSpeed = (rate) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // ── Drag-to-close ──
  const onDragStart = (e) => {
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
  };
  const onDragMove = (e) => {
    if (dragStartY.current === null) return;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - dragStartY.current;
    if (y > 0) setDragY(y);
  };
  const onDragEnd = () => {
    if (dragY > 120) {
      handleClose();
    } else {
      setDragY(0);
    }
    dragStartY.current = null;
  };

  const handleClose = () => {
    setIsClosing(true);
    if (audioRef.current) audioRef.current.pause();
    setTimeout(() => onClose(), 380);
  };

  // progress % for background track
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={PODCAST_CONFIG.audioUrl || undefined}
        preload="metadata"
      />

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999,
          opacity: slideIn && !isClosing ? 1 : 0,
          transition: 'opacity 0.38s ease',
        }}
      />

      {/* Modal Sheet */}
      <div
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: '#FFFFFF',
          borderRadius: '20px 20px 0 0',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transform: slideIn && !isClosing
            ? `translateY(${dragY}px)`
            : 'translateY(100%)',
          transition: dragY > 0
            ? 'none'
            : `transform ${isClosing ? '0.38s' : '0.42s'} cubic-bezier(0.32, 0.72, 0, 1)`,
          overflow: 'hidden',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Album art blur background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${coverSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px) saturate(1.4)',
            opacity: 0.18,
            transform: 'scale(1.1)',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '0 28px',
            paddingTop: '57px',
            paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14px', paddingBottom: '4px' }}>
            <div style={{
              width: '36px', height: '4px',
              borderRadius: '2px',
              background: 'rgba(0,0,0,0.15)',
            }} />
          </div>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', paddingBottom: '8px' }}>
            <button
              onClick={handleClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', color: ACCENT, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Down chevron icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* 공유 버튼 */}
            <button
              onClick={handleShare}
              style={{
                background: ACCENT_LIGHT,
                border: `1.5px solid ${ACCENT}`,
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
              }}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke={ACCENT} strokeWidth="2.2"/>
                <circle cx="6" cy="12" r="3" stroke={ACCENT} strokeWidth="2.2"/>
                <circle cx="18" cy="19" r="3" stroke={ACCENT} strokeWidth="2.2"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Album Art */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', flex: '0 0 auto' }}>
            <div style={{
              width: '62vw', maxWidth: '240px',
              aspectRatio: '1 / 1',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 20px 50px rgba(142, 68, 173, 0.28), 0 8px 20px rgba(0,0,0,0.18)`,
              transform: isPlaying ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <img
                src={coverSrc}
                alt="Album Art"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Title & Artist */}
          <div style={{ marginTop: '18px', textAlign: 'left' }}>
            <h2 style={{
              fontSize: '22px', fontWeight: 800,
              color: '#1c1c1e',
              fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
              lineHeight: 1.35,
              whiteSpace: 'pre-line',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              {PODCAST_CONFIG.title}
            </h2>
            <p style={{
              marginTop: '8px',
              fontSize: '16px', fontWeight: 500,
              color: 'rgba(142, 68, 173, 0.7)',
              fontFamily: "'Pretendard', -apple-system, sans-serif",
            }}>
              {PODCAST_CONFIG.artist}
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.1)', marginBottom: '6px' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${ACCENT}, #a855f7)`,
                borderRadius: '2px',
                transition: 'width 0.25s linear',
              }} />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              style={{
                position: 'absolute',
                width: 'calc(100% - 56px)',
                marginTop: '-22px',
                opacity: 0,
                cursor: 'pointer',
                height: '26px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontFamily: "'Pretendard', sans-serif" }}>
                {formatTime(currentTime)}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontFamily: "'Pretendard', sans-serif" }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '0 8px' }}>
            {/* ← 15초 뒤로 */}
            <button
              onClick={() => skip(-15)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                padding: '8px',
                color: '#1c1c1e',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M22 8C14.268 8 8 14.268 8 22C8 29.732 14.268 36 22 36C29.732 36 36 29.732 36 22" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 8L17 13M22 8L27 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="22" y="26.5" textAnchor="middle" fontSize="9" fill="#1c1c1e" fontFamily="'Pretendard', sans-serif" fontWeight="700">15</text>
              </svg>
            </button>

            {/* ▶/⏸ Play/Pause */}
            <button
              onClick={togglePlay}
              style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${ACCENT}, #a855f7)`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 28px rgba(142, 68, 173, 0.45)`,
                transform: 'scale(1)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                flexShrink: 0,
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.94)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="6" y="5" width="6" height="18" rx="2" fill="white"/>
                  <rect x="16" y="5" width="6" height="18" rx="2" fill="white"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M8 5.5L23 14L8 22.5V5.5Z" fill="white"/>
                </svg>
              )}
            </button>

            {/* → 30초 앞으로 */}
            <button
              onClick={() => skip(30)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                padding: '8px',
                color: '#1c1c1e',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M22 8C29.732 8 36 14.268 36 22C36 29.732 29.732 36 22 36C14.268 36 8 29.732 8 22" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 8L27 13M22 8L17 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="22" y="26.5" textAnchor="middle" fontSize="9" fill="#1c1c1e" fontFamily="'Pretendard', sans-serif" fontWeight="700">30</text>
              </svg>
            </button>
          </div>

          {/* Volume + Speed */}
          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Volume slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Volume low icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,0,0,0.15)"/>
              </svg>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ width: `${volume * 100}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #a855f7)`, borderRadius: '2px' }} />
                </div>
                <input
                  type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={handleVolume}
                  style={{
                    position: 'absolute', inset: '-10px 0',
                    width: '100%', opacity: 0, cursor: 'pointer',
                  }}
                />
              </div>
              {/* Volume high icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,0,0,0.15)"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Playback speed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {speedOptions.map(rate => (
                <button
                  key={rate}
                  onClick={() => handleSpeed(rate)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `1.5px solid ${playbackRate === rate ? ACCENT : 'rgba(0,0,0,0.14)'}`,
                    background: playbackRate === rate ? ACCENT_LIGHT : 'transparent',
                    color: playbackRate === rate ? ACCENT : 'rgba(0,0,0,0.5)',
                    fontSize: '13px',
                    fontWeight: playbackRate === rate ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: "'Pretendard', -apple-system, sans-serif",
                    transition: 'all 0.2s ease',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 공유 토스트 알림 */}
      {shareToast && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(142,68,173,0.95)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: "'Pretendard', -apple-system, sans-serif",
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(142,68,173,0.4)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease',
        }}>
          🔗 링크가 복사되었습니다
        </div>
      )}
    </>
  );
}
