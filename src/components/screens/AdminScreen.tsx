import React from 'react';
import { motion } from 'framer-motion';
import { usePrayerContext } from '../../context/PrayerContext';
import { Trash2, TrendingUp, Users, ArrowLeft } from 'lucide-react';

interface AdminScreenProps {
  onClose: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { prayers, deletePrayer, getStats } = usePrayerContext();
  const stats = getStats();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 pb-12 bg-gray-50 min-h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">관리자 모드</h2>
          <p className="text-gray-500 text-sm">기도 현황 및 관리</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 border border-gray-200 rounded-full bg-white text-gray-500 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPrayers}</p>
          <p className="text-xs text-gray-400 font-medium">전체 기도 제목</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAmens}</p>
          <p className="text-xs text-gray-400 font-medium">총 '아멘' 동참 수</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">등록된 기도문 관리</h3>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{prayers.length}건</span>
      </div>

      <div className="space-y-4">
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
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
                  {prayer.content}
                </p>
                <div className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md inline-block">
                  아멘 {prayer.amenCount}명
                </div>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm('정말 이 기도문을 삭제하시겠습니까?')) {
                    deletePrayer(prayer.id);
                  }
                }}
                className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AdminScreen;
