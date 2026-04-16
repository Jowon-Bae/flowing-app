import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Clock, HeartHandshake, PenLine, X } from 'lucide-react';
import { usePrayerContext, type Prayer } from '../../context/PrayerContext';

const PrayerCard: React.FC<{ prayer: Prayer }> = ({ prayer }) => {
  const { incrementAmen } = usePrayerContext();
  const [prayed, setPrayed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handlePray = () => {
    if (prayed) return;
    setPrayed(true);
    incrementAmen(prayer.id);
    setShowAnimation(true);
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-4 border border-gray-50 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <span className="font-bold text-xs">{prayer.author.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
              {prayer.author}
              <BadgeCheck size={14} className="text-primary-500" />
            </p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock size={10} />
              {prayer.time}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
        {prayer.content}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs font-semibold text-gray-500">
          <span className="text-primary-600 font-bold">{prayer.amenCount.toLocaleString()}</span>명이 함께 기도했습니다
        </span>
        
        <button 
          onClick={handlePray}
          disabled={prayed}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            prayed 
              ? 'bg-primary-50 text-primary-600' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95'
          }`}
        >
          <HeartHandshake size={14} className={prayed ? 'fill-primary-100 text-primary-600' : ''} />
          {prayed ? '기도했습니다' : '함께 기도합니다'}
        </button>
      </div>

      {/* Amen Floating Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute bottom-6 right-8 text-primary-500 pointer-events-none z-10"
          >
            <HeartHandshake size={32} className="fill-primary-100 opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PrayerScreen: React.FC = () => {
  const { prayers, addPrayer } = usePrayerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAuthor.trim() && newContent.trim()) {
      addPrayer(newAuthor, newContent);
      setNewAuthor('');
      setNewContent('');
      setIsModalOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-24 bg-gray-50/50 min-h-full relative"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">중보기도</h2>
        <p className="text-gray-500 text-sm">기도 제목을 함께 나누고 응원해 주세요.</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {prayers.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </AnimatePresence>
      </div>
      
      {prayers.length > 0 && (
        <div className="text-center py-6">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-gray-400">모든 기도 제목을 확인했습니다.</p>
        </div>
      )}

      {/* Draggable Floating Action Button */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.15, boxShadow: '0 8px 24px rgba(22,163,74,0.5)' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-[0_4px_12px_rgba(22,163,74,0.4)] flex items-center justify-center z-40 cursor-grab active:cursor-grabbing touch-none"
        style={{ touchAction: 'none' }}
      >
        <PenLine size={24} />
      </motion.button>

      {/* Write Prayer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
          >
            <div className="absolute inset-0 bg-transparent" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-[32px] p-6 shadow-xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">기도 제목 작성하기</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">작성자 명 (닉네임)</label>
                  <input 
                    type="text" 
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">내용</label>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="기도 제목이나 응원의 메시지를 자유롭게 남겨주세요."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition min-h-[120px] resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!newAuthor.trim() || !newContent.trim()}
                  className="w-full bg-primary-600 text-white rounded-xl py-4 font-bold text-lg disabled:opacity-50 disabled:bg-gray-400 transition"
                >
                  등록하기
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrayerScreen;
