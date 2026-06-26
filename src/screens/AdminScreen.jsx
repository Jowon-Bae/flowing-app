import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, orderBy, query, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { Trash2, LogOut, Heart, Clock, Shield, Eye, Copy, Users, BarChart2, LayoutDashboard, CheckCircle2, Music, Download, Share2, ExternalLink, Flag, Globe, Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'sdc1234';

export default function AdminScreen({ onExit, onEnterApp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [prayers, setPrayers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDedupRunning, setIsDedupRunning] = useState(false);
  const [dedupResult, setDedupResult] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'stats'
  const [visitors, setVisitors] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  // 관리자가 하트를 클릭한 기도문 ID 목록 (localStorage 기반 중복 방지)
  const [heartedIds, setHeartedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_hearted_prayers');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [heartingId, setHeartingId] = useState(null); // 애니메이션용
  const [dateFilter, setDateFilter] = useState('auto'); // 'auto' | 'all' | '1' | '2' | '3' | '4' | '5'
  const [bannerPublished, setBannerPublished] = useState({}); // { 'day_6': true/false }
  const [bannerToggling, setBannerToggling] = useState(null);

  // 고난주간 날짜 정의 (2026년 기준)
  const PASSION_WEEK_DATES = {
    1: '2026-03-30', // 월
    2: '2026-03-31', // 화
    3: '2026-04-01', // 수
    4: '2026-04-02', // 목
    5: '2026-04-03', // 금
  };

  // KST(UTC+9) 기준 날짜 문자열 변환 헬퍼 (새벽 시간대 필터링 오류 방지)
  const toKSTDateString = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(date.getTime() + kstOffset);
    return kstDate.toISOString().split('T')[0];
  };

  // 현재 요일에 해당하는 일차 계산 (00:00 기준)
  const getCurrentDay = () => {
    const dateStr = toKSTDateString(new Date());
    
    for (const [day, date] of Object.entries(PASSION_WEEK_DATES)) {
      if (date === dateStr) return day;
    }
    // 고난주간 이전이면 1일차, 이후면 '전체' 또는 마지막날
    if (dateStr < PASSION_WEEK_DATES[1]) return '1';
    return 'all';
  };

  const activeDay = dateFilter === 'auto' ? getCurrentDay() : dateFilter;

  // 비밀번호 확인
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      localStorage.setItem('admin_unlocked', 'true'); // 관리자 잠금 해제 플래그 저장
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  // Firestore 실시간 구독
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // 기도문 구독
    const qPrayers = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'));
    const unsubscribePrayers = onSnapshot(qPrayers, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPrayers(loaded);
    });

    // 방문자 구독
    const unsubscribeVisitors = onSnapshot(collection(db, 'visitors'), (snapshot) => {
      setVisitors(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 활동 로그 구독 (최신순)
    const qAnalytics = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'));
    const unsubscribeAnalytics = onSnapshot(qAnalytics, (snapshot) => {
      setAnalytics(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 배너 공개 상태 구독
    const unsubscribeBanners = onSnapshot(collection(db, 'banner_published'), (snapshot) => {
      const flags = {};
      snapshot.docs.forEach(d => { flags[d.id] = d.data().isPublished === true; });
      setBannerPublished(flags);
    });

    return () => {
      unsubscribePrayers();
      unsubscribeVisitors();
      unsubscribeAnalytics();
      unsubscribeBanners();
    };
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'prayers', id));
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  // 배너 공개/비공개 토글
  const handleBannerToggle = async (dayNum) => {
    if (bannerToggling === dayNum) return;
    setBannerToggling(dayNum);
    const docId = `day_${dayNum}`;
    const currentState = bannerPublished[docId] || false;
    try {
      await setDoc(doc(db, 'banner_published', docId), {
        isPublished: !currentState,
        day: dayNum,
        updatedAt: new Date(),
      });
    } catch (err) {
      alert('배너 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setBannerToggling(null);
    }
  };

  // 관리자 하트 클릭 핸들러
  const handleHeart = async (prayer) => {
    if (heartedIds.includes(prayer.id) || heartingId === prayer.id) return;
    setHeartingId(prayer.id);
    try {
      await updateDoc(doc(db, 'prayers', prayer.id), {
        hearts: increment(1),
      });
      const updated = [...heartedIds, prayer.id];
      setHeartedIds(updated);
      localStorage.setItem('admin_hearted_prayers', JSON.stringify(updated));
    } catch (err) {
      alert('하트 등록 중 오류가 발생했습니다.');
    } finally {
      setTimeout(() => setHeartingId(null), 400);
    }
  };

  // 중복 기도문 자동 삭제
  const handleDedup = async () => {
    if (isDedupRunning) return;
    setIsDedupRunning(true);
    setDedupResult(null);
    try {
      // 텍스트 기준으로 그룹화
      const groups = {};
      prayers.forEach(p => {
        const key = (p.text || '').trim();
        if (!key) return;
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
      });

      // 중복 그룹에서 하나만 남기고 나머지 삭제 (하트 많은 것 유지, 같으면 먼저 생성된 것 유지)
      const toDelete = [];
      Object.values(groups).forEach(group => {
        if (group.length <= 1) return;
        // 하트 많은 순 → createdAt 오래된 순 정렬 후 첫 번째 유지
        const sorted = [...group].sort((a, b) => {
          if ((b.hearts || 0) !== (a.hearts || 0)) return (b.hearts || 0) - (a.hearts || 0);
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return aTime - bTime;
        });
        // 첫 번째 제외하고 삭제 목록에 추가
        toDelete.push(...sorted.slice(1));
      });

      if (toDelete.length === 0) {
        setDedupResult({ count: 0 });
        return;
      }

      // 순차 삭제
      for (const p of toDelete) {
        await deleteDoc(doc(db, 'prayers', p.id));
      }
      setDedupResult({ count: toDelete.length });
    } catch (err) {
      alert('중복 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDedupRunning(false);
    }
  };

  // 중복 개수 계산
  const duplicateCount = (() => {
    const groups = {};
    prayers.forEach(p => {
      const key = (p.text || '').trim();
      if (key) groups[key] = (groups[key] || 0) + 1;
    });
    return Object.values(groups).reduce((sum, cnt) => sum + (cnt > 1 ? cnt - 1 : 0), 0);
  })();

  const formatDate = (timestamp) => {
    if (!timestamp) return '날짜 없음';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // 데이터 필터링 로직
  const filteredData = React.useMemo(() => {
    let fVisitors = [...visitors];
    let fAnalytics = [...analytics];
    let fPrayers = [...prayers];

    if (activeDay !== 'all') {
      const targetDate = PASSION_WEEK_DATES[activeDay];
      
      // 1. 방문자 필터링 (해당 날짜에 'visit' 로그가 있는 기기 기준)
      const dailyVisitorIds = new Set(
        analytics
          .filter(a => a.type === 'visit' || a.type === 'banner_view' || a.type === 'music_play' || a.type === 'meditation_complete')
          .filter(a => toKSTDateString(a.timestamp) === targetDate)
          .map(a => a.visitorId)
      );
      fVisitors = visitors.filter(v => dailyVisitorIds.has(v.id));

      // 2. 분석 로그 필터링
      fAnalytics = analytics.filter(a => toKSTDateString(a.timestamp) === targetDate);

      // 3. 기도문 필터링
      fPrayers = prayers.filter(p => toKSTDateString(p.createdAt) === targetDate);
    }

    return { visitors: fVisitors, analytics: fAnalytics, prayers: fPrayers };
  }, [visitors, analytics, prayers, activeDay]);

  const stats = filteredData;

  // 기도문 CSV 다운로드 (BOM 추가로 엑셀 한글 깨짐 방지)
  const handleDownloadCSV = () => {
    if (prayers.length === 0) {
      alert('다운로드할 기도문이 없습니다.');
      return;
    }

    const headers = ['작성일시', '기도내용', '하트수'];
    const rows = prayers.map(p => [
      formatDate(p.createdAt),
      `"${(p.text || '').replace(/"/g, '""')}"`, // CSV 이스케이프 (큰따옴표)
      p.hearts || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // BOM 추가 (\uFEFF)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `고난주간_기도문_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPrayers = prayers.filter(p =>
    p.text && p.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── 비밀번호 입력 화면 ──
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Pretendard', -apple-system, sans-serif",
      }}>
        <div style={{
          width: '100%', maxWidth: '360px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* 아이콘 */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #CFA131, #E8B84B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(207,161,49,0.4)',
          }}>
            <Shield size={32} color="#fff" />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
            관리자 페이지
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '32px' }}>
            비밀번호를 입력하세요
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="비밀번호"
              autoFocus
              style={{
                width: '100%', padding: '16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: passwordError ? '1.5px solid #ff6b6b' : '1.5px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: '16px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border 0.2s ease',
              }}
            />
            {passwordError && (
              <p style={{ color: '#ff8080', fontSize: '13px', textAlign: 'center', marginTop: '-8px' }}>
                ❌ 비밀번호가 틀렸습니다.
              </p>
            )}
            <button
              type="submit"
              style={{
                padding: '16px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #CFA131 0%, #E8B84B 60%, #A07820 100%)',
                color: '#fff', fontSize: '16px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(207,161,49,0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              로그인
            </button>
          </form>

          <button
            onClick={onExit}
            style={{
              width: '100%', marginTop: '16px', padding: '12px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.35)', fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ← 앱으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // ── 관리자 대시보드 ──
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
      paddingBottom: '40px',
    }}>
      {/* 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="#CFA131" />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '16px' }}>관리자 대시보드</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* 앱으로 이동 버튼 (관리자 모드로 묵상 페이지 접근) */}
          <button
            onClick={onEnterApp}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, rgba(207,161,49,0.3), rgba(207,161,49,0.15))',
              border: '1px solid rgba(207,161,49,0.5)',
              color: '#E8B84B', borderRadius: '10px',
              padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 700,
            }}
          >
            📖 앱으로 이동
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('admin_unlocked');
              onExit();
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', borderRadius: '10px',
              padding: '8px 14px', fontSize: '13px', cursor: 'pointer',
            }}
          >
            <LogOut size={14} /> 나가기
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{
        margin: '20px 20px 0',
        display: 'flex',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '4px',
      }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: viewMode === 'list' ? '#fff' : 'rgba(255,255,255,0.4)',
          }}
        >
          <LayoutDashboard size={16} /> 기도문 관리
        </button>
        <button
          onClick={() => setViewMode('stats')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: viewMode === 'stats' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: viewMode === 'stats' ? '#fff' : 'rgba(255,255,255,0.4)',
          }}
        >
          <BarChart2 size={16} /> 데이터 통계
        </button>
        <button
          onClick={() => setViewMode('banners')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: viewMode === 'banners' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: viewMode === 'banners' ? '#fff' : 'rgba(255,255,255,0.4)',
          }}
        >
          <Flag size={16} /> 배너 관리
        </button>
      </div>

      {/* 데이터 필터 (통계 모드일 때만 표시) */}
      {viewMode === 'stats' && (
        <div style={{ padding: '20px 20px 0', overflowX: 'auto', display: 'flex', gap: '8px', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setDateFilter('auto')}
            style={{
              flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', background: dateFilter === 'auto' ? '#CFA131' : 'rgba(255,255,255,0.08)',
              color: dateFilter === 'auto' ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <Clock size={14} /> 자동 (리셋)
          </button>
          <button
            onClick={() => setDateFilter('all')}
            style={{
              flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', background: dateFilter === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              color: dateFilter === 'all' ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            전체 누적
          </button>
          {[1,2,3,4,5].map(d => (
            <button
              key={d}
              onClick={() => setDateFilter(String(d))}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', background: dateFilter === String(d) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                color: dateFilter === String(d) ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {['월','화','수','목','금'][d-1]}요일
            </button>
          ))}
        </div>
      )}

      {viewMode === 'stats' && dateFilter === 'auto' && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', borderRadius: '12px', background: 'rgba(207,161,49,0.1)', border: '1px solid rgba(207,161,49,0.2)', fontSize: '12px', color: '#E8B84B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} />
          <span>현재 <b>{['월','화','수','목','금'][activeDay-1]}요일</b> 통계가 표시 중입니다. (자정 자동 리셋)</span>
        </div>
      )}

      <div style={{ padding: '24px 20px' }}>
        {viewMode === 'banners' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 안내 배너 */}
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(180,40,220,0.12)', border: '1px solid rgba(180,40,220,0.3)', fontSize: '13px', color: '#CC80FF', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Flag size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                <b>미공개 배너</b>는 관리자만 볼 수 있습니다.<br />
                공개 전환 시 모든 사용자에게 즉시 표시됩니다.
              </span>
            </div>

            {/* 기본 배너 목록 (1~5일차 — 항상 공개) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} /> 기본 공개 배너 (날짜별 자동 오픈)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { day: 1, name: '월요일 — 가시 면류관', date: '3/30' },
                  { day: 2, name: '화요일 — 대못', date: '3/31' },
                  { day: 3, name: '수요일 — 죄패', date: '4/1' },
                  { day: 4, name: '목요일 — 솔기 없는 옷', date: '4/2' },
                  { day: 5, name: '금요일 — 십자가라는 거친 선물', date: '4/3' },
                ].map(b => (
                  <div key={b.day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'rgba(100,200,100,0.07)', border: '1px solid rgba(100,200,100,0.15)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{b.day}일차 {b.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{b.date} 자동 오픈</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#64FF96' }}>
                      <Globe size={14} /> 공개중
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        ) : viewMode === 'stats' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 통계 요약 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(100,200,255,0.1)', border: '1px solid rgba(100,200,255,0.2)', borderRadius: '20px', padding: '20px' }}>
                <Users size={20} color="#64C8FF" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#64C8FF' }}>{stats.visitors.length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>유니크 방문자</div>
              </div>
              <div style={{ background: 'rgba(150,100,255,0.1)', border: '1px solid rgba(150,100,255,0.2)', borderRadius: '20px', padding: '20px' }}>
                <CheckCircle2 size={20} color="#9664FF" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#9664FF' }}>
                  {stats.analytics.filter(a => a.type === 'meditation_complete').length}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>묵상 완료수</div>
              </div>
              <div style={{ background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.2)', borderRadius: '20px', padding: '20px' }}>
                <Eye size={20} color="#FFB432" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFB432' }}>{stats.prayers.length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>작성된 기도문</div>
              </div>
              <div style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '20px', padding: '20px' }}>
                <Heart size={20} color="#FF6464" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#FF6464' }}>
                  {stats.prayers.reduce((sum, p) => sum + (p.hearts || 0), 0)}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>누적 하트수</div>
              </div>
              <div style={{ background: 'rgba(100,255,150,0.1)', border: '1px solid rgba(100,255,150,0.2)', borderRadius: '20px', padding: '20px' }}>
                <Share2 size={20} color="#64FF96" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#64FF96' }}>
                  {stats.analytics.filter(a => a.type === 'share').length}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>누적 공유수</div>
              </div>
              <div style={{ background: 'rgba(200,100,255,0.1)', border: '1px solid rgba(200,100,255,0.2)', borderRadius: '20px', padding: '20px' }}>
                <ExternalLink size={20} color="#C864FF" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#C864FF' }}>
                  {stats.analytics.filter(a => a.type === 'share_entry').length}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>공유 유입(클릭)</div>
              </div>
              <div style={{ background: 'rgba(142,68,173,0.15)', border: '1px solid rgba(142,68,173,0.35)', borderRadius: '20px', padding: '20px' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>🎙️</span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#CC80FF' }}>
                  {stats.analytics.filter(a => a.type === 'podcast_play').length}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>팟캐스트 재생</div>
              </div>
            </div>

            {/* 배너별 상세 통계 (View / Play / Complete) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={18} color="#CFA131" /> 요일별/배너별 참여 통계 {activeDay === 'all' ? '(누적)' : `(${['월','화','수','목','금'][activeDay-1]}요일 당일)`}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[1, 2, 3, 4, 5].map(day => {
                  const dayViews = stats.analytics.filter(a => Number(a.day) === day && a.type === 'banner_view').length;
                  const dayPlays = stats.analytics.filter(a => Number(a.day) === day && a.type === 'music_play').length;
                  const dayShares = stats.analytics.filter(a => Number(a.day) === day && a.type === 'share').length;
                  const dayEntries = stats.analytics.filter(a => Number(a.day) === day && a.type === 'share_entry').length;
                  const dayCompletes = stats.analytics.filter(a => Number(a.day) === day && a.type === 'meditation_complete').length;
                  
                  // 최대값 기준 비율 계산 (바 차트용)
                  const maxVal = Math.max(dayViews, dayPlays, dayShares, dayEntries, dayCompletes, 1);
                  
                  return (
                    <div key={day} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8B84B', marginBottom: '12px' }}>
                        {day}일차 배너 ({['월', '화', '수', '목', '금'][day-1]}요일 내용)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* 조회 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '30px' }}>조회</span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${(dayViews / maxVal) * 100}%`, height: '100%', background: '#64C8FF', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64C8FF', width: '35px', textAlign: 'right' }}>{dayViews}</span>
                        </div>
                        {/* 재생 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '30px' }}>재생</span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${(dayPlays / maxVal) * 100}%`, height: '100%', background: '#FFB432', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFB432', width: '35px', textAlign: 'right' }}>{dayPlays}</span>
                        </div>
                        {/* 공유 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '30px' }}>공유</span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${(dayShares / maxVal) * 100}%`, height: '100%', background: '#64FF96', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64FF96', width: '35px', textAlign: 'right' }}>{dayShares}</span>
                        </div>
                        {/* 유입 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '30px' }}>유입</span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${(dayEntries / maxVal) * 100}%`, height: '100%', background: '#C864FF', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#C864FF', width: '35px', textAlign: 'right' }}>{dayEntries}</span>
                        </div>
                        {/* 완료 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', width: '30px' }}>완료</span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${(dayCompletes / maxVal) * 100}%`, height: '100%', background: '#9664FF', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#9664FF', width: '35px', textAlign: 'right' }}>{dayCompletes}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 찬양 재생 현황 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music size={18} color="#CFA131" /> 일차별 찬양 순수 재생 현황 {activeDay === 'all' ? '(누적)' : `(${['월','화','수','목','금'][activeDay-1]}요일 당일)`}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', marginTop: '-12px' }}>
                * 묵상 완료 여부와 관계없는 {activeDay === 'all' ? '전체' : '해당 요일'} 음악 재생 버튼 클릭 기록입니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3, 4, 5].map(day => {
                  // 해당 일차의 순수 음악 재생 로그만 필터링
                  const dayLogs = stats.analytics.filter(a => Number(a.day) === day && a.type === 'music_play');
                  
                  // 총 재생 횟수
                  const totalPlays = dayLogs.length;
                  
                  // 고유 기기 대수 (중복 제거된 visitorId 수)
                  const uniqueListeners = new Set(dayLogs.filter(l => l.visitorId).map(l => l.visitorId)).size;
                  
                  const percentage = visitors.length > 0 ? (uniqueListeners / visitors.length) * 100 : 0;
                  
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{day}일차 찬양</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: '#CFA131', fontWeight: 700 }}>{totalPlays}회 재생</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>|</span>
                          <span style={{ color: '#64C8FF', fontWeight: 700 }}>{uniqueListeners}대 기기</span>
                        </div>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: 'linear-gradient(90deg, #64C8FF, #9664FF)', 
                          borderRadius: '4px',
                          transition: 'width 1s ease-out'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
                              {/* 묵상 진행률 차트 (기존) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#CFA131" /> 일차별 묵상 완료 현황
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3, 4, 5].map(day => {
                  const dayCompletions = visitors.filter(v => v.completedDays && v.completedDays.includes(day)).length;
                  const percentage = visitors.length > 0 ? (dayCompletions / visitors.length) * 100 : 0;
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{day}일차 묵상</span>
                        <span style={{ color: '#CFA131', fontWeight: 700 }}>{dayCompletions}명 ({Math.round(percentage)}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: 'linear-gradient(90deg, #CFA131, #E8B84B)', 
                          borderRadius: '4px',
                          transition: 'width 1s ease-out'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 팟캐스트 이용 현황 */}
            <div style={{ background: 'rgba(142,68,173,0.08)', border: '1px solid rgba(142,68,173,0.25)', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#CC80FF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎙️ 팟캐스트 이용 현황
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', marginTop: '-4px' }}>
                * 팟캐스트 화면에서 재생 버튼을 누른 횟수 (기기당 첫 번만 카운트)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(() => {
                  const podcastLogs = analytics.filter(a => a.type === 'podcast_play');
                  const totalPlays = podcastLogs.length;
                  const uniqueListeners = new Set(podcastLogs.filter(l => l.visitorId).map(l => l.visitorId)).size;
                  const podcastShares = analytics.filter(a => a.type === 'podcast_share').length;
                  const percentage = visitors.length > 0 ? (uniqueListeners / visitors.length) * 100 : 0;
                  return (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                        <div style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '14px', background: 'rgba(142,68,173,0.15)', border: '1px solid rgba(142,68,173,0.3)' }}>
                          <div style={{ fontSize: '24px', fontWeight: 900, color: '#CC80FF' }}>{totalPlays}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>재생횟수</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '14px', background: 'rgba(100,200,255,0.1)', border: '1px solid rgba(100,200,255,0.2)' }}>
                          <div style={{ fontSize: '24px', fontWeight: 900, color: '#64C8FF' }}>{uniqueListeners}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>청취자</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '14px', background: 'rgba(100,255,150,0.1)', border: '1px solid rgba(100,255,150,0.2)' }}>
                          <div style={{ fontSize: '24px', fontWeight: 900, color: '#64FF96' }}>{Math.round(percentage)}%</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>방문자대비</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '14px', background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.2)' }}>
                          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFB432' }}>{podcastShares}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>공유횟수</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                          <span>청취자 비율</span>
                          <span style={{ color: '#CC80FF', fontWeight: 700 }}>{uniqueListeners} / {visitors.length}명</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #8E44AD, #CC80FF)', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 최근 활동 로그 (필터링된 기준) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{activeDay === 'all' ? '최근 활동 기록' : `${['월','화','수','목','금'][activeDay-1]}요일 활동 기록`}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.analytics.slice(0, 15).map((log, idx) => (
                  <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.type === 'meditation_complete' ? '#9664FF' : log.type === 'music_play' ? '#FFB432' : log.type === 'banner_view' ? '#64C8FF' : '#fff' }} />
                      <span style={{ color: '#fff' }}>
                        {log.type === 'meditation_complete' ? `${log.day}일차 묵상 완료` : 
                         log.type === 'music_play' ? `${log.day}일차 찬양 재생` : 
                         log.type === 'banner_view' ? `${log.day}일차 배너 조회` :
                         log.type === 'share' ? `${log.day}일차 공유` :
                         log.type === 'share_entry' ? `${log.day}일차 공유 링크 접속` :
                         log.type === 'visit' ? '앱 접속' :
                         log.type === 'podcast_play' ? '🎙️ 팟캐스트 재생' :
                         log.type === 'podcast_share' ? '🔗 팟캐스트 공유' : '활동'}
                      </span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{formatDate(log.timestamp)}</span>
                  </div>
                ))}
                {stats.analytics.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '20px' }}>데이터가 아직 없습니다.</div>}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 통계 카드 (요약형) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(207,161,49,0.12)',
                border: '1px solid rgba(207,161,49,0.3)',
                borderRadius: '16px', padding: '20px',
              }}>
                <Eye size={20} color="#CFA131" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#E8B84B' }}>{prayers.length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>전체 기도문</div>
              </div>
              <div style={{
                background: 'rgba(255,100,100,0.08)',
                border: '1px solid rgba(255,100,100,0.2)',
                borderRadius: '16px', padding: '20px',
              }}>
                <Heart size={20} color="#ff8080" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#ff9090' }}>
                  {prayers.reduce((sum, p) => sum + (p.hearts || 0), 0)}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>전체 하트 수</div>
              </div>
            </div>
          </>
        )}

        {viewMode === 'list' && (
          <>
            {/* 중복 삭제 버튼 (기존 코드) */}

        {/* 전체 기도문 다운로드 */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={handleDownloadCSV}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Download size={16} />
            전체 기도문 다운로드 (CSV)
          </button>
        </div>

        {/* 중복 삭제 버튼 */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleDedup}
            disabled={isDedupRunning || duplicateCount === 0}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '14px',
              background: duplicateCount > 0
                ? 'linear-gradient(135deg, rgba(255,120,50,0.2), rgba(255,70,70,0.15))'
                : 'rgba(255,255,255,0.04)',
              border: duplicateCount > 0
                ? '1px solid rgba(255,120,50,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              color: duplicateCount > 0 ? '#ffaa80' : 'rgba(255,255,255,0.25)',
              fontSize: '14px', fontWeight: 700, cursor: duplicateCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <Copy size={16} />
            {isDedupRunning
              ? '중복 삭제 중...'
              : duplicateCount > 0
                ? `중복 기도문 ${duplicateCount}개 자동 삭제`
                : '중복 기도문 없음 ✓'}
          </button>
          {dedupResult !== null && (
            <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '10px',
              color: dedupResult.count > 0 ? '#80ffaa' : 'rgba(255,255,255,0.4)' }}>
              {dedupResult.count > 0
                ? `✅ 중복 ${dedupResult.count}개가 삭제되었습니다.`
                : '이미 중복 기도문이 없습니다.'}
            </p>
          )}
        </div>

        {/* 검색 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 기도문 내용 검색..."
          style={{
            width: '100%', padding: '14px 16px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', fontSize: '14px', outline: 'none',
            marginBottom: '20px', boxSizing: 'border-box',
          }}
        />

        {/* 기도문 목록 */}
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          기도문 목록 ({filteredPrayers.length}개)
        </h2>

        {filteredPrayers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            기도문이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPrayers.map((prayer) => (
              <div key={prayer.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '18px',
                transition: 'background 0.2s ease',
              }}>
                <p style={{
                  color: '#e8e8e8', fontSize: '15px', lineHeight: '1.7',
                  marginBottom: '12px', wordBreak: 'keep-all',
                  fontFamily: "'Nanum Myeongjo Eco', 'Nanum Myeongjo', serif",
                }}>
                  {prayer.text}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* 하트 버튼 - 관리자가 기도문 당 1회 클릭 가능 */}
                    <button
                      onClick={() => handleHeart(prayer)}
                      disabled={heartedIds.includes(prayer.id) || heartingId === prayer.id}
                      title={heartedIds.includes(prayer.id) ? '이미 하트를 눌렀습니다' : '하트 +1'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: heartedIds.includes(prayer.id)
                          ? 'rgba(255,100,100,0.18)'
                          : 'rgba(255,100,100,0.08)',
                        border: heartedIds.includes(prayer.id)
                          ? '1px solid rgba(255,100,100,0.5)'
                          : '1px solid rgba(255,100,100,0.2)',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        cursor: heartedIds.includes(prayer.id) ? 'default' : 'pointer',
                        fontSize: '12px', fontWeight: 700,
                        color: heartedIds.includes(prayer.id) ? '#ff6060' : '#ff9090',
                        transition: 'all 0.2s ease',
                        transform: heartingId === prayer.id ? 'scale(1.25)' : 'scale(1)',
                      }}
                    >
                      <Heart
                        size={13}
                        fill={heartedIds.includes(prayer.id) ? '#ff6060' : 'none'}
                        color={heartedIds.includes(prayer.id) ? '#ff6060' : '#ff9090'}
                        style={{ transition: 'transform 0.15s ease' }}
                      />
                      {prayer.hearts || 0}
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                      <Clock size={12} /> {formatDate(prayer.createdAt)}
                    </span>
                  </div>

                  {/* 삭제 버튼 */}
                  {confirmDelete === prayer.id ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#ff8080' }}>삭제할까요?</span>
                      <button
                        onClick={() => handleDelete(prayer.id)}
                        disabled={deletingId === prayer.id}
                        style={{
                          background: '#ff4444', border: 'none', borderRadius: '8px',
                          color: '#fff', padding: '6px 12px', fontSize: '12px', fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {deletingId === prayer.id ? '...' : '확인'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        style={{
                          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
                          color: '#fff', padding: '6px 12px', fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(prayer.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(255,70,70,0.1)',
                        border: '1px solid rgba(255,70,70,0.25)',
                        color: '#ff8080', borderRadius: '8px',
                        padding: '6px 12px', fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} /> 삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
