import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Home, BookOpen, Heart, Bell, Headphones } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import MeditationScreen from './screens/MeditationScreen';
import PrayerScreen from './screens/PrayerScreen';
import NewsScreen from './screens/NewsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AdminScreen from './screens/AdminScreen';
import PodcastScreen from './screens/PodcastScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import OutreachNameInputScreen from './screens/OutreachNameInputScreen';
import OutreachHomeScreen from './screens/OutreachHomeScreen';
import './index.css';
import loadBg from './assets/load.jpg';
import loadLogo from './assets/load_logo.png';
import headerLogo from './assets/header_logo_center.png';
import bgmFile from './assets/passion_week_app_main_BGM.m4a';
import { Passion_Week_Content } from './data/db.js';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOutSplash, setFadeOutSplash] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDayItem, setSelectedDayItem] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(() => localStorage.getItem('passion_week_team') || null);
  const [outreachName, setOutreachName] = useState(() => localStorage.getItem('passion_week_outreach_name') || null);
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#/admin');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('admin_unlocked') === 'true');
  const [kakaoReady, setKakaoReady] = useState(false);
  const [publishedDays, setPublishedDays] = useState({}); // { 'day_6': true/false } from Firestore
  const [showPodcast, setShowPodcast] = useState(false);
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('passion_week_visitor_id');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('passion_week_visitor_id', id);
    }
    return id;
  });

  // 이용자 추적 (방문 기록 및 기존 데이터 동기화)
  useEffect(() => {
    if (selectedTeam) localStorage.setItem('passion_week_team', selectedTeam);
    else localStorage.removeItem('passion_week_team');
  }, [selectedTeam]);

  useEffect(() => {
    if (outreachName) localStorage.setItem('passion_week_outreach_name', outreachName);
    else localStorage.removeItem('passion_week_outreach_name');
  }, [outreachName]);

  useEffect(() => {
    if (isAdminRoute) return; // 관리자는 통계에서 제외
    
    const trackVisit = async () => {
      try {
        // 기존에 로컬에 저장된 완료 기록 확인
        const savedDays = localStorage.getItem('passion_week_completed_days');
        const completedDaysList = savedDays ? JSON.parse(savedDays) : [];

        const visitorRef = doc(db, 'visitors', visitorId);
        await setDoc(visitorRef, {
          lastVisit: serverTimestamp(),
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          completedDays: completedDaysList // 기존 기록 동기화
        }, { merge: true });

        // 3. 순수 방문 로그 추가 (요일별 통계용)
        await addDoc(collection(db, 'analytics'), {
          type: 'visit',
          visitorId: visitorId,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Tracking failed:", err);
      }
    };
    trackVisit();
  }, [visitorId, isAdminRoute]);

  // banner_published Firestore 구독 (일반 사용자 실시간 반영)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banner_published'), (snapshot) => {
      const flags = {};
      snapshot.docs.forEach(d => { flags[d.id] = d.data().isPublished === true; });
      setPublishedDays(flags);
    });
    return () => unsubscribe();
  }, []);

  // 관리자 URL 감지 (#/admin)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#/admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  // BGM State & Ref
  const bgmAudioRef = React.useRef(null);
  const [playFailed, setPlayFailed] = useState(false);

  // Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // iOS Safari 전체 화면 높이 보정 (--real-vh CSS 변수 설정)
  useEffect(() => {
    const setRealVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    };
    setRealVh();
    window.addEventListener('resize', setRealVh);
    return () => window.removeEventListener('resize', setRealVh);
  }, []);

  // BGM 초기화 (앱 로딩 시 단 한 번)
  useEffect(() => {
    if (!bgmAudioRef.current) {
      bgmAudioRef.current = new Audio(bgmFile);
      bgmAudioRef.current.loop = true;
    }
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
    };
  }, []);

  // 스플래시 끝나거나 탭 변경 시 자동재생 시도
  useEffect(() => {
    if (!bgmAudioRef.current) return;
    const shouldPlay = !showSplash;
    
    if (shouldPlay) {
      const playPromise = bgmAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // 브라우저 정책(Autoplay policy)으로 막힌 경우
          console.warn("오디오 자동재생이 브라우저 정책에 의해 차단되었습니다. 터치 기회를 기다립니다.");
          setPlayFailed(true);
        });
      }
    } else {
      bgmAudioRef.current.pause();
    }
  }, [showSplash]);

  // 브라우저에 의해 자동재생이 막혔을 경우, 화면 어디든 첫 터치 시 재생되도록 재시도
  useEffect(() => {
    if (!playFailed) return;
    
    const retryPlay = () => {
      if (!showSplash && !selectedDayItem && bgmAudioRef.current) {
        bgmAudioRef.current.play()
          .then(() => setPlayFailed(false))
          .catch(() => {});
      }
    };
    
    document.addEventListener('click', retryPlay);
    document.addEventListener('touchstart', retryPlay);
    return () => {
      document.removeEventListener('click', retryPlay);
      document.removeEventListener('touchstart', retryPlay);
    };
  }, [playFailed, showSplash, selectedDayItem]);

  // Kakao SDK 초기화 및 버튼 바인딩
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // 여기에 본인의 카카오 JavaScript 키를 입력하세요.
      window.Kakao.init('ca8f88bf82006c3d16ae86e73f183a03');
    }

    // 로고가 보일 때(selectedDayItem이 없을 때) 카카오 공유 버튼 기능 바인딩
    if (window.Kakao && window.Kakao.isInitialized() && !selectedDayItem) {
      const shareUrl = window.location.href.split('#')[0];
      try {
        window.Kakao.Share.createDefaultButton({
          container: '#kakao-link-btn',
          objectType: 'feed',
          content: {
            title: '2026 고난주간 묵상',
            description: '2026 고난주간 묵상 앱으로 초대합니다.',
            imageUrl: 'https://raw.githubusercontent.com/Jowon-Bae/passion-week-app/main/src/assets/app_logo.jpeg',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '구경하기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        setKakaoReady(true);
      } catch (err) {
        console.error('Kakao binding failed:', err);
        setKakaoReady(false);
      }
    } else {
      setKakaoReady(false);
    }
  }, [selectedDayItem]);

  // 요일별 딥링크 처리 (?day=1 등)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dayParam = params.get('day');
    if (dayParam) {
      const dayNum = parseInt(dayParam, 10);
      const targetDay = Passion_Week_Content.find(item => item.day === dayNum);
      if (targetDay) {
        setSelectedDayItem(targetDay);
        // 딥링크로 접속 시 온보딩은 건너뜀 (사용자 편의성)
        setShowOnboarding(false);

        // 공유 유입 로그 기록 (일차별로 기록)
        const logShareEntry = async () => {
          try {
            if (!isAdminRoute) {
              await addDoc(collection(db, 'analytics'), {
                type: 'share_entry',
                day: dayNum,
                visitorId: visitorId,
                timestamp: serverTimestamp()
              });
            }
          } catch (err) {
            console.error("Failed to log share entry:", err);
          }
        };
        logShareEntry();
      }
    }
  }, [visitorId, isAdminRoute]);

  // Scroll to top on tab or view change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 배너 진입 로그 기록
    if (selectedDayItem) {
      const logBannerView = async () => {
        try {
          await addDoc(collection(db, 'analytics'), {
            type: 'banner_view',
            day: selectedDayItem.day,
            visitorId: visitorId,
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to log banner view:", err);
        }
      };
      logBannerView();
    }
  }, [currentTab, selectedDayItem, visitorId]);

  // Load completed days from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('passion_week_completed_days');
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing stats");
      }
    }
  }, []);

  // Splash Screen Timer
  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOutSplash(true), 4200);
    const timer2 = setTimeout(() => setShowSplash(false), 4700);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);


  const handleCompleteChallenge = async (dayNum) => {
    if (!completedDays.includes(dayNum)) {
      const updated = [...completedDays, dayNum];
      setCompletedDays(updated);
      localStorage.setItem('passion_week_completed_days', JSON.stringify(updated));

      // Firebase 활동 로그 기록
      try {
        // 1. 분석 로그 추가
        await addDoc(collection(db, 'analytics'), {
          type: 'meditation_complete',
          day: dayNum,
          visitorId: visitorId,
          timestamp: serverTimestamp()
        });

        // 2. 방문자 정보에 완료 목록 업데이트
        const visitorRef = doc(db, 'visitors', visitorId);
        await setDoc(visitorRef, {
          completedDays: updated,
          lastActivity: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to log activity:", err);
      }
    }
  };

  // 찬양 재생 로그 기록
  const handleMusicPlay = async (dayNum) => {
    try {
      await addDoc(collection(db, 'analytics'), {
        type: 'music_play',
        day: dayNum,
        visitorId: visitorId,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to log music play:", err);
    }
  };

  const handleShare = async () => {
    // 카카오 SDK가 이미 버튼에 바인딩되어 있다면 중복 실행 방지
    if (kakaoReady) return;
    
    // 404 오류 방지 주소
    const shareUrl = window.location.href.split('#')[0];
    
    // 카카오 SDK가 성공적으로 바인딩되지 않았거나 다른 앱 공유가 필요한 경우를 대비한 폴백
    if (navigator.share) {
      try {
        await navigator.share({
          title: '2026 고난주간 묵상',
          text: '2026 고난주간 묵상 앱으로 초대합니다.',
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // 3. 폴백: 클립보드 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다. 다른 사람에게 공유해보세요!');
      } catch (copyErr) {
        alert('공유하기 버튼을 터치하여 링크를 전달해주세요: ' + shareUrl);
      }
    }
  };

  // 요일별 맞춤 공유 핸들러
  const handleShareDay = async (dayItem) => {
    // 0. 공유 이벤트 기록
    try {
      if (!isAdminRoute) { // 관리자는 통계에서 제외
        await addDoc(collection(db, 'analytics'), {
          type: 'share',
          day: dayItem.day,
          visitorId: visitorId,
          timestamp: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Failed to log share event:", err);
    }

    // 요약된 공유 URL 생성
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const shareUrl = `${baseUrl}?day=${dayItem.day}`;

    // 1. 카카오톡 SDK 공유 (SDK가 준비된 경우)
    if (window.Kakao && window.Kakao.isInitialized()) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `[고난주간 묵상] ${dayItem.dayName}`,
            description: dayItem.theme.replace(/<[^>]*>?/gm, ''), // HTML 태그 제거
            imageUrl: 'https://raw.githubusercontent.com/Jowon-Bae/passion-week-app/main/src/assets/app_logo.jpeg',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '묵상하러 가기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.error('Kakao share day failed:', err);
      }
    }

    // 2. 브라우저 기본 공유 (폴백)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `2026 고난주간 묵상 - ${dayItem.dayName}`,
          text: dayItem.theme.replace(/<[^>]*>?/gm, ''),
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share day failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(`${dayItem.dayName} 묵상 링크가 클립보드에 복사되었습니다!`);
      } catch (copyErr) {
        alert('공유 링크: ' + shareUrl);
      }
    }
  };

  const renderContent = () => {
    if (selectedDayItem) {
      return (
        <DetailScreen 
          item={selectedDayItem} 
          onBack={() => setSelectedDayItem(null)} 
          onComplete={handleCompleteChallenge}
          onMusicPlay={handleMusicPlay}
          onShareDay={handleShareDay} // 프롭 추가
          isCompleted={completedDays.includes(selectedDayItem.day)}
          pauseBgm={() => {
            if (bgmAudioRef.current) bgmAudioRef.current.pause();
          }}
          resumeBgm={() => {
            if (bgmAudioRef.current && !showSplash) {
              bgmAudioRef.current.play().catch(() => {});
            }
          }}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentTab} />;
      case 'meditation':
        return <MeditationScreen onSelectDay={setSelectedDayItem} onPodcast={() => setShowPodcast(true)} completedDays={completedDays} isAdmin={isAdmin} publishedDays={publishedDays} />;
      case 'prayer':
        return <PrayerScreen />;
      case 'news':
        return <NewsScreen />;
      default:
        return <HomeScreen onNavigate={setCurrentTab} />;
    }
  };

  // Swipe Handlers — threshold = 2/3 of screen width (iPhone 15 Pro ≈ 393pt → ~262pt)
  const minSwipeDistance = Math.max(200, window.innerWidth * (2 / 3));
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance; // right-to-left
    const isRightSwipe = distance < -minSwipeDistance; // left-to-right
    
    if (isRightSwipe) {
      // 왼쪽에서 오른쪽으로 밀기 (뒤로가기 또는 이전 탭)
      if (selectedDayItem) {
        setSelectedDayItem(null);
      } else {
        const tabs = ['home', 'meditation', 'prayer', 'news'];
        const idx = tabs.indexOf(currentTab);
        if (idx > 0) setCurrentTab(tabs[idx - 1]);
      }
    }
    
    if (isLeftSwipe) {
      // 오른쪽에서 왼쪽으로 밀기 (앞으로 가기 또는 다음 탭)
      if (!selectedDayItem) {
        const tabs = ['home', 'meditation', 'prayer', 'news'];
        const idx = tabs.indexOf(currentTab);
        if (idx < tabs.length - 1) setCurrentTab(tabs[idx + 1]);
      }
    }
  };

  // 관리자 페이지 (스플래시/온보딩 건너뜀)
  if (isAdminRoute) {
    return (
      <AdminScreen
        onExit={() => {
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
        onEnterApp={() => {
          window.location.hash = '';
          setIsAdminRoute(false);
          setIsAdmin(true);
        }}
      />
    );
  }

  // Splash Screen Timer
  if (showSplash) {
    return (
      <div 
        className={`splash-screen ${fadeOutSplash ? 'fade-out' : ''}`}
        style={{
          backgroundImage: `url(${loadBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <img 
          src={loadLogo} 
          alt="Logo" 
          className="splash-logo" 
          style={{ position: 'relative', zIndex: 2 }}
        />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (!selectedTeam) {
    return <TeamSelectionScreen onSelectTeam={setSelectedTeam} />;
  }

  if (selectedTeam === 'outreach') {
    if (!outreachName) {
      return (
        <OutreachNameInputScreen 
          onSubmitName={setOutreachName} 
          onBack={() => setSelectedTeam(null)} 
        />
      );
    }
    return (
      <OutreachHomeScreen 
        name={outreachName} 
        onBackToTeamSelection={() => {
          setSelectedTeam(null);
          // 이름을 유지할지 지울지는 선택이지만, 사용자가 다른 팀으로 갔다가 돌아올 때를 위해 유지
        }} 
      />
    );
  }

  return (
    <div 
      className="app-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Fixed Bar (Status Area) */}
      {!selectedDayItem && (
        <div className="top-fixed-bar" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '14px', paddingLeft: '16px', paddingRight: '16px' }}>
          <button 
            onClick={() => setSelectedTeam(null)}
            style={{
              background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', backdropFilter: 'blur(5px)', cursor: 'pointer'
            }}
          >
            팀 변경
          </button>
          <div 
            onClick={handleShare}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer' 
            }}
          >
            <img 
              id="kakao-link-btn"
              src={headerLogo} 
              alt="Logo" 
              className="logo-clickable"
              style={{ height: '12px' }} 
            />
          </div>
          <div style={{ width: '60px' }}></div> {/* 좌우 균형을 위한 빈 공간 */}
        </div>
      )}
      
      {/* Dynamic Content Area */}
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>

      {/* Podcast Modal */}
      {showPodcast && (
        <PodcastScreen
          onClose={() => setShowPodcast(false)}
          pauseBgm={() => { if (bgmAudioRef.current) bgmAudioRef.current.pause(); }}
          resumeBgm={() => { if (bgmAudioRef.current && !showSplash) bgmAudioRef.current.play().catch(() => {}); }}
          visitorId={visitorId}
        />
      )}

      {/* Bottom Tab Navigation */}
      {!selectedDayItem && (
        <nav className="bottom-tab-nav">
          <div className={`tab-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>
            <Home size={24} />
            <span>홈</span>
          </div>
          <div className={`tab-item ${currentTab === 'meditation' ? 'active' : ''}`} onClick={() => setCurrentTab('meditation')}>
            <BookOpen size={24} />
            <span>묵상</span>
          </div>
          <div className={`tab-item ${currentTab === 'prayer' ? 'active' : ''}`} onClick={() => setCurrentTab('prayer')}>
            <Heart size={24} />
            <span>기도</span>
          </div>
          <div className={`tab-item ${currentTab === 'news' ? 'active' : ''}`} onClick={() => setCurrentTab('news')}>
            <Bell size={24} />
            <span>소식</span>
          </div>
          <div className="tab-item" onClick={() => {
            const openDate = new Date('2026-04-04T00:00:00+09:00');
            if (new Date() < openDate && !isAdmin) {
              alert('4월 4일 00시에 오픈됩니다.');
            } else {
              setShowPodcast(true);
            }
          }}>
            <Headphones size={24} />
            <span>팟캐스트</span>
          </div>
        </nav>
      )}
    </div>
  );
}
