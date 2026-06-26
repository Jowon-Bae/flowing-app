import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Check, Heart, Music, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import '../index.css';

import song1 from '../assets/Day1-1_song.mp3';
import song2 from '../assets/Day2-1_song.mp3';
import song3 from '../assets/Day3-1_song.mp3';
import song4 from '../assets/Day4-1_song.mp3';
import song5 from '../assets/Day5-1_song.mp3';
import song6 from '../assets/Day6_song.mp3';

import mainEmptyImg from '../assets/main_empty_image.jpeg';
import goodFridayWordBg from '../assets/Good_Friday_word_Background.jpg';
import saintImage1 from '../assets/saint_image_1.png';
import saintImage1_1 from '../assets/saint_image_1-1.jpeg';
import saintImage2_1 from '../assets/saint_image_2-1.png';
import saintImage3_1 from '../assets/saint_image_3-1.png';
import saintImage4_1 from '../assets/saint_image_4-1.png';
import saintImage5_1 from '../assets/saint_image_5-1.png';

const extraMaterials = {
  1: {
    image: saintImage1_1,
    title: "가시 면류관",
    desc: "가시 면류관의 주재료는 팔레스타인 지역에서 흔히 볼 수 있는 '가시대추나무' 혹은 이와 유사한 가시 덤불로 추정됩니다. 이 나무의 가시는 길이가 2cm에서 5cm에 달하며, 매우 단단하고 날카로운 것이 특징입니다.\n\n유대 관습에 따라 머리 전체를 덮는 모자 형태로 엮였을 가능성이 큽니다. 두피는 인체에서 혈관과 신경망이 가장 촘촘하게 뻗어 있는 민감한 부위입니다. 면류관을 쓴 상태에서 머리를 매로 맞았을 때(마 27:30), 얼굴 전체로 퍼지는 강렬한 신경통은 눈을 뜨기조차 힘든 고통을 유발했습니다. 이는 우리가 지은 생각의 죄와 교만을 대신 짊어지신 사랑의 흔적입니다."
  },
  2: {
    image: saintImage2_1,
    title: "대못",
    desc: "당시 로마군이 사용한 대못은 거칠게 단조된 철 소재였습니다. 길이는 대략 12cm에서 18cm 사이였으며, 두께는 약 7mm에서 9mm 정도의 육중한 크기였습니다. 단면은 주로 사각형 모양으로, 신체를 관통할 때 조직을 찢어내는 파괴력이 강력했습니다. 손목뼈 사이의 좁은 통로에는 손가락 끝까지 감각을 전달하는 굵은 정중신경이 지나갑니다.\n\n이 크고 거친 철못이 신경을 관통하거나 으깨버릴 때 팔 전체가 전기에 감전되거나 불에 데이는 듯한 극심한 통증이 발생합니다. 예수님은 이 손과 발로 우리의 죄를 씻기 위해 십자가에 온전히 고정되셨습니다."
  },
  3: {
    image: saintImage3_1,
    title: "죄패",
    desc: "성경에 따르면 이 죄패는 '유대인의 왕 나사렛 예수'라고 세 가지 언어(히브리어, 그리스어, 라틴어)로 기록되었습니다. 유물 고증에 따르면 당시 죄패는 가벼운 나무판 위에 석고를 칠하고 붉은색이나 검은색 잉크로 글씨를 썼습니다.\n죄패는 육체적인 통증을 주는 도구는 아니었으나, 예수님의 존엄성을 짓밟는 가장 강력한 심리적 무기였습니다.\n\n군중들이 가장 잘 볼 수 있는 곳에 붙여져, 예수님의 평생의 사역을 '거짓'과 '반역'으로 못 박았습니다. 군병들이 가시 면류관을 씌우고 죄패를 걸어 '유대인의 왕'이라 부르며  \"너는 스스로 왕이라 했으나 결국 이렇게 수치스럽게 죽는다\"비웃었습니다.\n\n세상은 조롱으로 이 글을 썼으나, 하나님은 이 죄패를 통해 예수님이 진정한 유대인의 왕이시며, 세상의 구원자이심을 만방에 선포하셨습니다."
  },
  4: {
    image: saintImage4_1,
    title: "솔기 없는 옷",
    desc: "당시 유대 지역에서 주로 사용되던 아마포 혹은 양모로 추정됩니다. 일반적인 옷은 두 장의 천을 어깨나 옆구리에서 꿰매어 만들지만, 이 옷은 위에서부터 아래까지 통으로 짠 형태입니다. 채찍질로 온몸의 피부가 찢긴 상태에서 입혀진 옷은 혈청과 피로 인해 상처 부위와 하나가 되어 굳어버립니다.\n\n군인들이 제비 뽑아 이 옷을 강제로 벗겨낼 때, 아물기 시작하던 상처는 다시 크게 벌어지며 멈췄던 출혈이 다시 시작되었습니다. 이는 화상 환자의 드레싱을 마취 없이 뜯어내는 것과 같은 극한의 통증을 동반했습니다."
  },
  5: {
    image: saintImage5_1,
    title: "십자가 나무",
    desc: "팔레스타인 지역에서 가장 흔하고 단단한 사이프러스, 소나무, 참나무 등으로 만들어졌습니다. 그래서 가로축 나무의 무게만도 약 34kg~56kg에 달했습니다. 가공되지 않은 거친 표면은 사형수의 상처를 더욱 자극했습니다. 채찍질로 인해 등 피부가 너덜너덜해진 상태에서 거친 나무 십자가를 지고 가는 것은 상처에 직접적인 마찰과 압박을 가했습니다. 또한 나무 십자가는 사형수의 발이 지면에서 약 30cm~1m 정도만 떨어질 정도로 제작되었습니다.\n\n이는 구경꾼들이 사형수의 얼굴을 가까이서 보며 조롱할 수 있게 설계된 심리적 고문의 높이였습니다. 십자가 위에서의 시간은 숨 한 모금을 쉬기 위해 온몸의 근육을 쥐어짜야 하는 사투의 장소였습니다. 극심한 탈수와 통증은 심장에 엄청난 무리를 주어 결국 심장이 터질 듯한 압박을 견뎌내야 했습니다. 예수님은 우리에게 영원한 생명을 주시기 위해 마지막 숨까지 온전히 내어놓으셨습니다."
  }
};

const daySongs = {
  1: song1,
  2: song2,
  3: song3,
  4: song4,
  5: song5,
  6: song6,
};

const dayDates = {
  1: "3월 30일",
  2: "3월 31일",
  3: "4월 1일",
  4: "4월 2일",
  5: "4월 3일",
  6: "4월 4일",
};

import saintImage4 from '../assets/saint_image_4.tif';
import saintImage2 from '../assets/saint_image_2.jpeg';
import saintImage3 from '../assets/saint_image_3.jpeg';
import saintImage5 from '../assets/saint_image_5.jpeg';

const masterpieceData = {
  1: { image: saintImage1, title: "십자가에서 내려지는 돌아가신 예수 그리스도", artist: "지거 쾨더 (Sieger Köder)" },
  2: { image: saintImage2, title: "타우버비숍스하임 제단화: 십자가에 못 박힌 그리스도 (Tauberbischofsheim Altarpiece: Christ on the Cross)", artist: "마티아스 그뤼네발트(Matthias Grünewald)" },
  3: { image: saintImage3, title: "십자가에 달리신 그리스도", artist: "디에고 벨라스케스 (Diego Velázquez)" },
  4: { image: saintImage4, title: "판결", artist: "지거 쾨더 (Sieger Köder)" },
  5: { image: saintImage5, title: "제3처 '모퉁이의 머릿돌'", artist: "지거 쾨더 (Sieger Köder)" },
};

export default function DetailScreen({ item, onBack, onComplete, onMusicPlay, onShareDay, isCompleted, pauseBgm, resumeBgm }) {
  const audioRef = useRef(null);
  const [isMeditationExpanded, setIsMeditationExpanded] = useState(false);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const paintingRef = useRef(null);

  const getPointerPercent = (e) => {
    const rect = paintingRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleZoomStart = (e) => {
    setZoomOrigin(getPointerPercent(e));
    setIsZoomed(true);
  };

  const handleZoomMove = (e) => {
    if (!isZoomed) return;
    e.preventDefault();
    setZoomOrigin(getPointerPercent(e));
  };

  const handleZoomEnd = () => setIsZoomed(false);

  const [isMaterialsExpanded, setIsMaterialsExpanded] = useState(false);
  const [isZoomedExtra, setIsZoomedExtra] = useState(false);
  const [zoomOriginExtra, setZoomOriginExtra] = useState({ x: 50, y: 50 });
  const extraPaintingRef = useRef(null);

  const getPointerPercentExtra = (e) => {
    if (!extraPaintingRef.current) return { x: 50, y: 50 };
    const rect = extraPaintingRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleZoomExtraStart = (e) => {
    setZoomOriginExtra(getPointerPercentExtra(e));
    setIsZoomedExtra(true);
  };
  const handleZoomExtraMove = (e) => {
    if (!isZoomedExtra) return;
    e.preventDefault();
    setZoomOriginExtra(getPointerPercentExtra(e));
  };
  const handleZoomExtraEnd = () => setIsZoomedExtra(false);

  // 컴포넌트 언마운트 시 BGM 재개 보장
  useEffect(() => {
    return () => {
      resumeBgm();
    };
  }, []);

  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);

  return (
    <div className="detail-screen animate-fade-in-up" style={{
      minHeight: '100vh',
      paddingBottom: '120px',
      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.95)), url(${mainEmptyImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed',
    }}>
      
      {/* Full Hero Image Section */}
      <div style={{
        position: 'relative',
        height: '320px',
        backgroundColor: '#111',
        backgroundImage: `url(${mainEmptyImg})`,
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
            top: 'calc(env(safe-area-inset-top, 54px) + 12px)',
            left: '24px',
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

        <div style={{ position: 'absolute', bottom: '40px', left: '24px', right: '24px', zIndex: 2, color: 'white', paddingLeft: '32px' }}>
          <span style={{ position: 'absolute', top: '-10px', left: '-4px', fontSize: '40px', opacity: 0.15, color: 'var(--secondary-color)', fontFamily: "'Nanum Myeongjo', serif", lineHeight: 1 }}>"</span>
          <div style={{ textAlign: 'left' }}>
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
              {dayDates[item.day] || `DAY ${item.day}`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: '1.2', letterSpacing: '-1px', margin: 0 }}>
                {item.dayName}
              </h1>
              <button 
                onClick={() => onShareDay(item)}
                style={{
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
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'transform 0.2s ease'
                }}
                className="logo-clickable"
              >
                <Share2 size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <p 
            style={{ 
              fontSize: '17px', 
              fontWeight: 500, 
              opacity: 0.9,
              fontFamily: "'Nanum Myeongjo', serif",
              whiteSpace: 'pre-line',
              lineHeight: '1.4'
            }}
            dangerouslySetInnerHTML={{ __html: item.theme }}
          />
        </div>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-24px', position: 'relative', zIndex: 5 }}>
        
        {/* Merged Memory Verse & Expandable Meditation Content */}
        <div className="mosaic-card" style={{
          padding: '32px 24px',
          backgroundImage: `linear-gradient(rgba(10, 15, 20, 0.8), rgba(10, 15, 20, 0.95)), url(${goodFridayWordBg})`,
          backgroundSize: '480px auto',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
          backgroundBlendMode: 'overlay'
        }}>
          <div style={{ padding: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '3px', height: '24px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px' }} />
              <h3 className="text-accent" style={{ color: 'var(--secondary-color)', marginTop: '4px' }}>
                오늘의 말씀
              </h3>
            </div>
            {/* Verse - hanging quote/bracket indent so text aligns vertically */}
            <div style={{ fontSize: '17px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: '1.8', fontFamily: "'Nanum Myeongjo', serif" }}>
              {item.verse.split('\n').map((line, idx) => {
                const firstChar = line.charCodeAt(0);
                const isEmpty = line === '';
                // All non-empty lines get hanging indent: " ( → hang, text aligns
                const needsHang = !isEmpty;
                return (
                  <p key={idx} style={{
                    margin: isEmpty ? '10px 0 0 0' : '0',
                    paddingLeft: isEmpty ? '0' : '0.5em',
                    textIndent: needsHang ? '-0.5em' : '0',
                    minHeight: isEmpty ? '10px' : undefined,
                  }}>{line}</p>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '32px 0' }} />

          <div 
            onClick={() => setIsMeditationExpanded(!isMeditationExpanded)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '3px', height: '20px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px', alignSelf: 'center' }} />
              <h3 className="text-accent" style={{ color: 'var(--secondary-color)', margin: 0 }}>
                묵상 내용 보기
              </h3>
            </div>
            {isMeditationExpanded ? <ChevronUp size={20} color="var(--secondary-color)" /> : <ChevronDown size={20} color="var(--secondary-color)" />}
          </div>
          
          {isMeditationExpanded && (
            <div style={{ marginTop: '24px', padding: '0 8px', animation: 'fadeInUp 0.3s ease' }}>
              <p 
                style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontWeight: 500 }}
                dangerouslySetInnerHTML={{ __html: item.meditationContent }}
              />
            </div>
          )}
        </div>

        {/* NEW: 묵상을 위한 자료 Card (contains daily extra image + Masterpiece) */}
        {extraMaterials[item.day] && (
          <div className="mosaic-card" style={{
            marginTop: '16px',
            padding: '32px 24px',
            backgroundImage: `linear-gradient(rgba(10, 15, 20, 0.8), rgba(10, 15, 20, 0.95)), url(${goodFridayWordBg})`,
            backgroundSize: '480px auto',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center top',
            backgroundBlendMode: 'overlay'
          }}>
            <div 
              onClick={() => setIsMaterialsExpanded(!isMaterialsExpanded)}
              style={{
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '3px', height: '20px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px', alignSelf: 'center' }} />
                <h3 className="text-accent" style={{ color: 'var(--secondary-color)', margin: 0 }}>
                  묵상을 위한 자료
                </h3>
              </div>
              {isMaterialsExpanded ? <ChevronUp size={20} color="var(--secondary-color)" /> : <ChevronDown size={20} color="var(--secondary-color)" />}
            </div>

            {isMaterialsExpanded && (
              <div style={{ marginTop: '24px', animation: 'fadeInUp 0.3s ease' }}>
                {/* Additional Daily Image */}
                <div style={{
                  marginBottom: '24px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  backgroundColor: '#0a0f14'
                }}>
                  {!isZoomedExtra && (
                    <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                      <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500, padding: '5px 14px', borderRadius: '20px', backdropFilter: 'blur(8px)', letterSpacing: '0.2px' }}>
                        🔍 화면을 길게 누르면 크게 볼 수 있습니다
                      </span>
                    </div>
                  )}
                  <div
                    ref={extraPaintingRef}
                    style={{ overflow: 'hidden', cursor: isZoomedExtra ? 'zoom-in' : 'zoom-in', userSelect: 'none', touchAction: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                    onMouseDown={handleZoomExtraStart}
                    onMouseMove={handleZoomExtraMove}
                    onMouseUp={handleZoomExtraEnd}
                    onMouseLeave={handleZoomExtraEnd}
                    onTouchStart={handleZoomExtraStart}
                    onTouchMove={handleZoomExtraMove}
                    onTouchEnd={handleZoomExtraEnd}
                  >
                    <img 
                      src={extraMaterials[item.day].image}
                      alt={extraMaterials[item.day].title}
                      style={{
                        width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center', height: 'auto',
                        transform: isZoomedExtra ? 'scale(2.8)' : 'scale(1.02)',
                        transformOrigin: `${zoomOriginExtra.x}% ${zoomOriginExtra.y}%`,
                        transition: isZoomedExtra ? 'transform 0.15s ease, transform-origin 0.05s linear' : 'transform 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Nanum Myeongjo', serif", marginBottom: '12px', lineHeight: '1.5' }}>
                      {extraMaterials[item.day].title}
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontWeight: 500 }}>
                      {extraMaterials[item.day].desc}
                    </p>
                  </div>
                </div>

                {/* Painting / Masterwork Image inside materials accordion */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  backgroundColor: '#0a0f14'
                }}>
                  {!isZoomed && (
                    <div style={{
                      position: 'absolute', top: '12px', left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', pointerEvents: 'none',
                    }}>
                      <span style={{
                        backgroundColor: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500, padding: '5px 14px', borderRadius: '20px', backdropFilter: 'blur(8px)', letterSpacing: '0.2px',
                      }}>
                        🔍 화면을 길게 누르면 크게 볼 수 있습니다
                      </span>
                    </div>
                  )}
                  <div
                    ref={paintingRef}
                    style={{ overflow: 'hidden', cursor: isZoomed ? 'zoom-in' : 'zoom-in', userSelect: 'none', touchAction: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                    onMouseDown={handleZoomStart}
                    onMouseMove={handleZoomMove}
                    onMouseUp={handleZoomEnd}
                    onMouseLeave={handleZoomEnd}
                    onTouchStart={handleZoomStart}
                    onTouchMove={handleZoomMove}
                    onTouchEnd={handleZoomEnd}
                  >
                    <img 
                      src={masterpieceData[item.day]?.image || saintImage1}
                      alt={masterpieceData[item.day]?.title || "십자가에서 내려지는 돌아가신 예수 그리스도"}
                      style={{
                        width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center',
                        transform: isZoomed ? 'scale(2.8)' : 'scale(1.02)',
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transition: isZoomed ? 'transform 0.15s ease, transform-origin 0.05s linear' : 'transform 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <p style={{
                      fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Nanum Myeongjo', serif", marginBottom: '4px', lineHeight: '1.5', letterSpacing: '-0.5px'
                    }}>
                      {masterpieceData[item.day]?.title || "십자가에서 내려지는 돌아가신 예수 그리스도"}
                    </p>
                    <p style={{
                      fontSize: '12px', color: 'var(--secondary-color)', fontWeight: 500, letterSpacing: '0.5px', opacity: 0.9,
                    }}>
                      {masterpieceData[item.day]?.artist || "지거 쾨더 (Sieger Köder)"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question / Challenge */}
        <div className="mosaic-card" style={{
          marginTop: '16px', /* 위 카드와의 여백 추가 확보 (기존 24px + 16px = 40px) */
          padding: '32px',
          border: 'none',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
          backgroundImage: `linear-gradient(rgba(10, 15, 20, 0.8), rgba(10, 15, 20, 0.95)), url(${goodFridayWordBg})`,
          backgroundSize: '480px auto',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '3px', height: '24px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px' }} />
            <h3 className="text-accent" style={{ color: 'var(--secondary-color)', marginTop: '4px' }}>
              나를 향한 질문
            </h3>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '36px', position: 'relative', zIndex: 2, lineHeight: '1.8', letterSpacing: '-0.6px' }}>
            {item.question.split('\n').map((line, idx) => {
              const matchNumber = line.match(/^(\d+\.\s)(.*)/);
              if (matchNumber) {
                return (
                  <div key={idx} style={{ display: 'flex', marginTop: idx === 0 ? 0 : '16px' }}>
                    <span style={{ width: '22px', flexShrink: 0, color: 'var(--secondary-color)', fontWeight: 800 }}>{matchNumber[1]}</span>
                    <span>{matchNumber[2]}</span>
                  </div>
                );
              }
              const matchIndent = line.match(/^\s+(.*)/);
              if (matchIndent) {
                return (
                  <div key={idx} style={{ display: 'flex', marginTop: '6px' }}>
                    <span style={{ width: '22px', flexShrink: 0 }}></span>
                    <span style={{ opacity: 0.9 }}>{matchIndent[1]}</span>
                  </div>
                );
              }
              return (
                <div key={idx} style={{ marginTop: idx === 0 ? 0 : '16px' }}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prayer Box */}
        {item.prayer && (
          <div className="mosaic-card" style={{
            marginTop: '16px',
            padding: '32px',
            border: 'none',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
            backgroundImage: `linear-gradient(rgba(10, 15, 20, 0.8), rgba(10, 15, 20, 0.95)), url(${goodFridayWordBg})`,
            backgroundSize: '480px auto',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center top'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '3px', height: '24px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px' }} />
              <h3 className="text-accent" style={{ color: 'var(--secondary-color)', marginTop: '4px' }}>
                오늘의 기도
              </h3>
            </div>
            
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '36px', position: 'relative', zIndex: 2, lineHeight: '1.8' }}>
              <p dangerouslySetInnerHTML={{ __html: item.prayer.replace(/\n/g, '<br />') }} />
            </div>

            <button 
              className={`btn-mosaic ${isCompleted ? 'completed' : ''}`}
              onClick={() => onComplete(item.day)}
              disabled={isCompleted}
              style={{ position: 'relative', zIndex: 2, width: '100%' }}
            >
              {isCompleted ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Check size={22} strokeWidth={3} />
                  <span>참여가 완료되었습니다</span>
                </div>
              ) : "챌린지 완료하기"}
            </button>
          </div>
        )}

        {/* Suno Lyrics & Audio Player */}
        <div className="mosaic-card" style={{
          marginTop: '16px',
          padding: '32px',
          border: 'none',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
          backgroundImage: `linear-gradient(rgba(10, 15, 20, 0.8), rgba(10, 15, 20, 0.95)), url(${goodFridayWordBg})`,
          backgroundSize: '480px auto',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '3px', height: '24px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px' }} />
            <h3 className="text-accent" style={{ color: 'var(--secondary-color)', marginTop: '4px' }}>
              오늘의 찬양 묵상
            </h3>
          </div>

          {/* Audio Player */}
          <div style={{ marginBottom: '28px', backgroundColor: 'rgba(26, 0, 0, 0.5)', padding: '12px', borderRadius: '32px' }}>
            <audio 
              ref={audioRef}
              loop
              controls 
              src={daySongs[item.day]} 
              style={{ width: '100%', height: '44px', borderRadius: '22px', outline: 'none', opacity: 0.9 }}
              controlsList="nodownload"
              onPlay={() => {
                pauseBgm();
                if (!hasTrackedPlay) {
                  onMusicPlay(item.day);
                  setHasTrackedPlay(true);
                }
              }}
              onPause={resumeBgm}
              onEnded={resumeBgm}
            >
              브라우저가 오디오 재생을 지원하지 않습니다.
            </audio>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '24px 0 16px' }} />

          <div 
            onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '3px', height: '20px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px', alignSelf: 'center' }} />
              <h3 className="text-accent" style={{ color: 'var(--secondary-color)', margin: 0 }}>
                찬양 가사 보기
              </h3>
            </div>
            {isLyricsExpanded ? <ChevronUp size={20} color="var(--secondary-color)" /> : <ChevronDown size={20} color="var(--secondary-color)" />}
          </div>
          
          {isLyricsExpanded && (
            <div style={{ marginTop: '24px', padding: '0 8px', animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)', position: 'relative', zIndex: 2, lineHeight: '1.8' }}>
                <p dangerouslySetInnerHTML={{ __html: item.suno_lyrics.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
