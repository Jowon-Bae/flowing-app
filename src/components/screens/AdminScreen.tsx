import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrayerContext } from '../../context/PrayerContext';
import { useNewsContext } from '../../context/NewsContext';
import { Trash2, TrendingUp, Users, ArrowLeft, Newspaper, MessageSquare } from 'lucide-react';

interface AdminScreenProps {
  onClose: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { prayers, deletePrayer, getStats } = usePrayerContext();
  const { posts, deletePost } = useNewsContext();
  const stats = getStats();
  const [activeSection, setActiveSection] = useState<'prayer' | 'news'>('news');

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

      {/* Stats */}
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

      {/* Section Toggle */}
      <div className="bg-gray-100 rounded-xl p-1 flex mb-6">
        <button
          onClick={() => setActiveSection('news')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition ${activeSection === 'news' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <Newspaper size={15} /> 현장 소식
        </button>
        <button
          onClick={() => setActiveSection('prayer')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition ${activeSection === 'prayer' ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}
        >
          <MessageSquare size={15} /> 기도 제목
        </button>
      </div>

      {/* News List */}
      {activeSection === 'news' && (
        <div>
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
        </div>
      )}

      {/* Prayer List */}
      {activeSection === 'prayer' && (
        <div>
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
        </div>
      )}
    </motion.div>
  );
};

export default AdminScreen;
