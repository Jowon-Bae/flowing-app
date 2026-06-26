import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import '../index.css';
import { db } from '../firebase';
import prayBg from '../assets/Pray_together-Background.jpeg';
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const DUMMY_PRAYERS = [
  "주님, 오늘 하루도 감사합니다. 모든 성도들이 평안한 밤을 보내게 하소서.",
  "새로운 한 주를 시작하며 다짐합니다. 나보다 남을 낫게 여기는 마음을 주소서.",
  "고난주간을 보내며 주님의 십자가 사랑을 다시 한 번 묵상합니다.",
  "우리 가족 모두가 주님 안에서 하나 되게 하옵소서.",
  "아파하는 이웃들을 위로해주시고 회복의 은혜를 더하소서."
];

export default function PrayerScreen() {
  const [prayers, setPrayers] = useState([]);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [newPrayer, setNewPrayer] = useState("");
  const [isPressing, setIsPressing] = useState(false);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [particles, setParticles] = useState([]);
  let particleIdCounter = React.useRef(0);
  
  const pressTimer = React.useRef(null);
  const vibrateInterval = React.useRef(null);
  const isPressingRef = React.useRef(false);
  const touchPosRef = React.useRef({ x: 50, y: 50 });

  const getLikedPrayers = () => {
    try {
      return JSON.parse(localStorage.getItem('liked_prayers') || '[]');
    } catch {
      return [];
    }
  };

  const addLikedPrayer = (id) => {
    const liked = getLikedPrayers();
    if (!liked.includes(id)) {
      liked.push(id);
      localStorage.setItem('liked_prayers', JSON.stringify(liked));
    }
  };

  useEffect(() => {
    const prayersRef = collection(db, 'prayers');
    const unsubscribe = onSnapshot(prayersRef, (snapshot) => {
      if (snapshot.empty) {
        DUMMY_PRAYERS.forEach(text => {
          addDoc(prayersRef, { text, hearts: 0, createdAt: serverTimestamp() });
        });
      } else {
        const loadedPrayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrayers(loadedPrayers);
        setCurrentPrayer(prev => {
          if (!prev) {
            // 하트가 0개인 기도문 우선 추출 로직
            const zeroHeartPrayers = loadedPrayers.filter(p => !p.hearts || p.hearts === 0);
            const pool = zeroHeartPrayers.length > 0 ? zeroHeartPrayers : loadedPrayers;
            
            const randomIdx = Math.floor(Math.random() * pool.length);
            return pool[randomIdx];
          } else {
            const updatedCurrent = loadedPrayers.find(p => p.id === prev.id);
            return updatedCurrent || prev;
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    // 1. "하느님" 단어 사용 시 조용히 제한 (안내창 없이 제출 차단 및 입력창 초기화)
    if (newPrayer.includes("하느님")) {
      setNewPrayer("");
      return;
    }

    // 2. 기타 금지 콘텐츠 필터링 (계좌번호, 욕설 등 - 안내창 표시)
    const bannedPatterns = [
      /\d{3,4}-?\d{2,4}-?\d{4,6}/,  // 계좌번호 패턴
      /\d{10,14}/,                     // 긴 숫자열 (계좌/전화번호)
    ];
    const bannedWords = [
      '시발', '씨발', '개새끼', '병신', 'ㅅㅂ', 'ㅂㅅ', '지랄', '니미', '꺼져', '죽어',
      '씹', '좆', 'fuck', 'shit', 'damn', 'bitch',
      '입금', '계좌', '송금', '이체', '카카오뱅크', '토스', '페이', '국민은행', '신한은행', '우리은행', '하나은행', '농협', '수협', '기업은행',
      '빌려', '돈', '만원', '현금', '빌려주면', '후원', '입금부탁',
      '광고', '홍보', '클릭', '링크', 'http', 'www', '.com', '.kr',
    ];

    const hasBannedPattern = bannedPatterns.some(p => p.test(newPrayer));
    const hasBannedWord = bannedWords.some(w => newPrayer.toLowerCase().includes(w.toLowerCase()));

    if (hasBannedPattern || hasBannedWord) {
      alert("기도와 관계없는 내용(계좌번호, 욕설 등)은 등록할 수 없습니다.");
      return;
    }

    // 기독교 키워드 필터링 (기독교적/성경적 내용 확인)
    const holyKeywords = [
      '하나님', '주님', '예수님', '예수', '아멘', '그리스도', '십자가', '성령', '성도', '교회', '말씀', '기도', '은혜', '감사', '사랑', '축복', '찬양', '묵상', '회개', '용서', '평안', '소망', '믿음',
      '성경', '복음', '구원', '치유', '인도', '영광', '보혈', '임재', '동행', '하소서', '도우소서', '믿습니다', '지켜주소서'
    ];
    const hasHolyKeyword = holyKeywords.some(keyword => newPrayer.includes(keyword));
    
    if (!hasHolyKeyword) {
      alert("기도문에는 하나님, 주님, 기도 등 기독교적인 내용이 포함되어야 합니다.");
      return;
    }

    addDoc(collection(db, 'prayers'), { text: newPrayer, hearts: 0, createdAt: serverTimestamp() });
    setNewPrayer("");
    alert("소중한 기도문이 공유되었습니다. 🙏");
  };

  const incrementHeartInDB = async () => {
    if (currentPrayer && currentPrayer.id) {
      const liked = getLikedPrayers();
      if (!liked.includes(currentPrayer.id)) {
        addLikedPrayer(currentPrayer.id);
        const prayerDoc = doc(db, 'prayers', currentPrayer.id);
        await updateDoc(prayerDoc, { hearts: increment(1) });
      }
    }
  };

  const startHeartbeat = () => {
    setIsPressing(true);
    isPressingRef.current = true;
    if (!hasPrayed) {
      incrementHeartInDB();
      setHasPrayed(true);
    }
    if (navigator.vibrate) navigator.vibrate([100, 100, 100, 800]);
    const createParticle = () => {
      const baseX = touchPosRef.current.x;
      const baseY = touchPosRef.current.y;
      const x = baseX + (Math.random() - 0.5) * 5;
      const y = baseY + (Math.random() - 0.5) * 5;
      const newParticle = {
        id: particleIdCounter.current++,
        x, y,
        travelX: (Math.random() - 0.5) * (window.innerWidth || 400) * 1.5,
        travelY: -(Math.random() * (window.innerHeight || 800) * 0.8) - 50,
        scale: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 1.5 + 1.5,
      };
      setParticles(prev => [...prev, newParticle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    };
    const burstParticles = () => { for(let i=0; i<15; i++) createParticle(); };
    burstParticles();
    vibrateInterval.current = setInterval(() => {
      if (navigator.vibrate) navigator.vibrate([100, 100, 100, 800]);
      burstParticles();
    }, 1200);
  };

  const stopHeartbeat = () => {
    setIsPressing(false);
    isPressingRef.current = false;
    if (vibrateInterval.current) clearInterval(vibrateInterval.current);
    if (navigator.vibrate) navigator.vibrate(0);
  };

  const handleTouchStart = (e) => {
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    if (clientX !== undefined && clientY !== undefined) {
      touchPosRef.current = {
        x: (clientX / window.innerWidth) * 100,
        y: (clientY / window.innerHeight) * 100,
      };
    }
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      startHeartbeat();
    }, 200);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      if (!isPressingRef.current && !hasPrayed) {
        incrementHeartInDB();
        setHasPrayed(true);
      }
    }
    stopHeartbeat();
  };

  return (
    <div 
      className="prayer-screen animate-fade-in-up" 
      style={{ 
        padding: '24px', 
        paddingTop: 'calc(env(safe-area-inset-top, 54px) + 120px)', 
        paddingBottom: '110px',
        backgroundImage: `url(${prayBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <header style={{ marginTop: '0', marginBottom: '48px' }}>
        <h1 className="heading-jumbo" style={{ fontSize: '32px', fontFamily: "'Pretendard', -apple-system, sans-serif", fontWeight: 900, letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
          Pray Together
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>나의 기도를 올리고, 누군가의 기도를 함께 품어주세요.</p>
      </header>


      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--secondary-color)', textShadow: '0 1px 6px rgba(0,0,0,0.7)', marginBottom: '16px' }}>오늘 누군가의 기도</h3>
      <div 
        className={`mosaic-card ${isPressing ? 'heartbeat-active' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{ 
          marginBottom: '40px', 
          minHeight: '180px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          borderRadius: '16px',
        }}
      >
        <p style={{ 
          fontSize: '18px', lineHeight: '1.7', color: 'var(--text-primary)', 
          wordBreak: 'keep-all', letterSpacing: '-0.03em',
          fontFamily: "'Nanum Myeongjo Eco', 'Nanum Myeongjo', serif", fontWeight: 400,
        }}>
          "{currentPrayer ? currentPrayer.text : ""}"
        </p>
        {currentPrayer && currentPrayer.hearts > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <div style={{
              backgroundColor: 'rgba(207, 161, 49, 0.15)', border: '1px solid rgba(207, 161, 49, 0.4)',
              color: 'var(--secondary-color)', padding: '6px 12px', borderRadius: '20px',
              fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 12px rgba(207, 161, 49, 0.2)',
              transform: isPressing ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>
              <Heart size={14} fill="var(--secondary-color)" color="var(--secondary-color)" className={isPressing ? 'heartbeat-active' : ''} style={{ border: 'none' }} />
              +{currentPrayer.hearts}
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--secondary-color)', marginTop: '-32px', marginBottom: '32px', textShadow: '0 1px 4px rgba(0,0,0,0.6)', textAlign: 'center', letterSpacing: '-0.03em' }}>
        기도문을 길게 누르면 함께 기도하는 마음이 하트로 전달됩니다.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--secondary-color)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>나의 기도 올리기</h3>
        <textarea
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
          placeholder={"하나님께 올려드릴 기도문을 작성해 주세요!\n(기도와 관계없는 글은 등록이 거부됩니다.)"}
          style={{
            width: '100%', height: '140px', padding: '16px', borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.14)', border: '1.5px solid rgba(255, 255, 255, 0.35)',
            color: '#FFF', fontSize: '15px', lineHeight: '1.6', outline: 'none', resize: 'none',
            letterSpacing: '-0.03em', textAlign: 'center',
          }}
        />
        <button 
          type="submit" 
          disabled={!newPrayer.trim()}
          style={{
            background: newPrayer.trim() ? 'linear-gradient(135deg, #CFA131 0%, #E8B84B 60%, #A07820 100%)' : 'rgba(255,255,255,0.18)',
            color: newPrayer.trim() ? '#FFF' : 'rgba(255,255,255,0.65)',
            border: newPrayer.trim() ? '1px solid rgba(207,161,49,0.5)' : '1px solid rgba(255,255,255,0.3)',
            padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: newPrayer.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease',
            boxShadow: newPrayer.trim() ? '0 4px 16px rgba(207, 161, 49, 0.35)' : 'none',
          }}
        >
          기도문 올리기
        </button>
      </form>

      {particles.map(p => (
        <div
          key={p.id}
          className="floating-heart-particle"
          style={{
            position: 'fixed', top: `${p.y}%`, left: `${p.x}%`,
            '--travel-x': `${p.travelX}px`, '--travel-y': `${p.travelY}px`,
            '--scale': p.scale, animationDuration: `${p.duration}s`,
            pointerEvents: 'none', zIndex: 9999
          }}
        >
          <Heart size={24} fill="var(--secondary-color)" color="var(--secondary-color)" opacity={0.85} strokeWidth={1} />
        </div>
      ))}
    </div>
  );
}
