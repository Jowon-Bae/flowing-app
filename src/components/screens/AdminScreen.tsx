import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePrayerContext } from '../../context/PrayerContext';
import { useNewsContext } from '../../context/NewsContext';
import { useMinistryPhotoContext } from '../../context/MinistryPhotoContext';
import { Trash2, TrendingUp, Users, ArrowLeft, Newspaper, MessageSquare, Image, PlusCircle, Loader2, BarChart2, CalendarDays } from 'lucide-react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface AdminScreenProps {
  onClose: () => void;
}

const ministryLabels: { id: string; label: string }[] = [
  { id: 'meals',      label: '마을 전도 및 피딩 사역' },
  { id: 'basketball', label: '농구 경기를 통한 교제 및 전도' },
  { id: 'blessing',   label: '선교사님 블레싱' },
  { id: 'healing',    label: '현지 청년들을 위한 힐링캠프' },
  { id: 'medical',    label: '의료 선교 사역' },
];

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { prayers, deletePrayer, getStats } = usePrayerContext();
  const { posts, deletePost } = useNewsContext();
  const { photos, uploadPhoto, deletePhoto, uploading } = useMinistryPhotoContext();
  const stats = getStats();
  const [activeSection, setActiveSection] = useState<'prayer' | 'news' | 'photos' | 'stats'>('news');
  const [selectedMinistry, setSelectedMinistry] = useState('meals');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    todayVisits: 0,
    recentVisits: [] as { date: string; displayDate: string; count: number }[],
    loading: true
  });

  useEffect(() => {
    if (activeSection !== 'stats') return;

    const fetchAnalytics = async () => {
      setAnalytics(prev => ({ ...prev, loading: true }));
      try {
        const totalUsersSnap = await getCountFromServer(collection(db, 'visitors'));
        const totalUsers = totalUsersSnap.data().count;

        const today = new Date();
        const dates = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          dates.push({ date: `${yyyy}-${mm}-${dd}`, displayDate: `${mm}.${dd}` });
        }

        const recentVisitsData = [];
        let todayVisitsCount = 0;

        for (const dateObj of dates) {
          const q = query(collection(db, 'visits'), where('date', '==', dateObj.date));
          const snap = await getCountFromServer(q);
          const count = snap.data().count;
          recentVisitsData.push({ ...dateObj, count });
          if (dateObj.date === dates[6].date) {
            todayVisitsCount = count;
          }
        }

        setAnalytics({
          totalUsers,
          todayVisits: todayVisitsCount,
          recentVisits: recentVisitsData.reverse(), // Show today first
          loading: false
        });
      } catch (e) {
        console.error('Failed to fetch analytics', e);
        setAnalytics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAnalytics();
  }, [activeSection]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      await uploadPhoto(selectedMinistry, file);
    }
    e.target.value = '';
  };

  const currentPhotos = photos[selectedMinistry] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 pb-12 bg-gray-50 min-h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">관리자 모드</h2>
          <p className="text-gray-500 text-sm">현장 소식 및 기도 현황 관리</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 border border-gray-200 rounded-full bg-white text-gray-500 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Main Stats */}
      {activeSection !== 'stats' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
              <Users size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPrayers}</p>
            <p className="text-xs text-gray-400 font-medium">기도 제목 수</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-2">
              <TrendingUp size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAmens}</p>
            <p className="text-xs text-gray-400 font-medium">총 기도 동참</p>
          </div>
        </div>
      )}

      {/* Section Toggle */}
      <div className="bg-gray-100 rounded-xl p-1 flex mb-6">
        <button
          onClick={() => setActiveSection('news')}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition ${activeSection === 'news' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <Newspaper size={14} /> 현장 소식
        </button>
        <button
          onClick={() => setActiveSection('prayer')}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition ${activeSection === 'prayer' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <MessageSquare size={14} /> 기도 제목
        </button>
        <button
          onClick={() => setActiveSection('photos')}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition ${activeSection === 'photos' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <Image size={14} /> 사역 사진
        </button>
        <button
          onClick={() => setActiveSection('stats')}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition ${activeSection === 'stats' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <BarChart2 size={14} /> 통계
        </button>
      </div>

      {/* Analytics List */}
      {activeSection === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">앱 이용자 통계</h3>
          </div>

          {analytics.loading ? (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-gray-100">
              <Loader2 size={24} className="animate-spin text-primary-500 mb-2" />
              <p className="text-sm text-gray-400">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalUsers}</p>
                  <p className="text-xs text-gray-400 font-medium">총 누적 방문자 (기기 수)</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                  <p className="text-3xl font-bold text-primary-600 mb-1">{analytics.todayVisits}</p>
                  <p className="text-xs text-gray-400 font-medium">오늘 방문자</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-500" />
                  <h4 className="font-bold text-gray-800 text-sm">최근 7일 출석 현황</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {analytics.recentVisits.map((visit, index) => {
                    const maxCount = Math.max(...analytics.recentVisits.map(v => v.count), 1);
                    const widthPercent = (visit.count / maxCount) * 100;
                    
                    return (
                      <div key={visit.date} className="p-4 flex items-center gap-3">
                        <div className="w-12 text-xs font-semibold text-gray-500 shrink-0">
                          {index === 0 ? '오늘' : visit.displayDate}
                        </div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex items-center">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercent}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full rounded-full ${index === 0 ? 'bg-primary-500' : 'bg-gray-400'}`}
                          />
                        </div>
                        <div className="w-8 text-right text-xs font-bold text-gray-700 shrink-0">
                          {visit.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* News List */}
      {activeSection === 'news' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">현장 소식 관리</h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{posts.length}건</span>
          </div>
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">등록된 현장 소식이 없습니다.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 pr-3">
                    <div className="text-xl shrink-0">{post.emoji}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-400 mb-1">{post.time}</p>
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{post.content}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (window.confirm('이 소식을 삭제하시겠습니까?')) deletePost(post.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Prayer List */}
      {activeSection === 'prayer' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">기도 제목 관리</h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{prayers.length}건</span>
          </div>
          <div className="space-y-3">
            {prayers.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">등록된 기도문이 없습니다.</p>
              </div>
            ) : (
              prayers.map((prayer) => (
                <div key={prayer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{prayer.author}</span>
                      <span className="text-[10px] text-gray-400">{prayer.time}</span>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">{prayer.content}</p>
                    <div className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md inline-block">
                      아멘 {prayer.amenCount}명
                    </div>
                  </div>
                  <button
                    onClick={() => { if (window.confirm('정말 이 기도문을 삭제하시겠습니까?')) deletePrayer(prayer.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Ministry Photos */}
      {activeSection === 'photos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-3">사역 사진 관리</h3>
            {/* Ministry Selector */}
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              {ministryLabels.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl bg-primary-600 text-white font-semibold text-sm active:scale-[0.98] transition disabled:opacity-60"
          >
            {uploading ? (
              <><Loader2 size={18} className="animate-spin" /> 업로드 중...</>
            ) : (
              <><PlusCircle size={18} /> 사진 추가하기</>
            )}
          </button>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentPhotos.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">이 사역에 등록된 사진이 없습니다.</p>
              </div>
            ) : (
              currentPhotos.map((photo) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                  <img src={photo.url} alt="사역 사진" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      if (window.confirm('이 사진을 삭제하시겠습니까?'))
                        deletePhoto(selectedMinistry, photo.id, photo.storagePath);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md active:scale-90 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminScreen;
