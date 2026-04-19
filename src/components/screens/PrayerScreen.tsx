import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Clock, HeartHandshake, Send } from 'lucide-react';
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
    setTimeout(() => setShowAnimation(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-4 border border-gray-50 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
          <span className="font-bold text-xs">{prayer.author.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
            {prayer.author}
            <BadgeCheck size={14} className="text-primary-500" />
          </p>
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <Clock size={10} /> {prayer.time}
          </p>
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

      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
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
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setIsSubmitting(true);
    addPrayer(author, content);
    setAuthor('');
    setContent('');
    setTimeout(() => setIsSubmitting(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-12 bg-gray-50/50 min-h-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">중보기도</h2>
        <p className="text-gray-500 text-sm">기도 제목을 함께 나누고 응원해 주세요.</p>
      </div>

      {/* ── Inline Write Box ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-6"
      >
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">🙏</span>
          기도 제목 남기기
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름 (닉네임)"
            onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition"
          />
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="기도 제목이나 응원의 메시지를 자유롭게 남겨주세요."
              rows={2}
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition resize-none"
            />
            <motion.button
              type="submit"
              disabled={!author.trim() || !content.trim()}
              whileTap={{ scale: 0.9 }}
              animate={isSubmitting ? { scale: [1, 1.2, 1] } : {}}
              className="absolute right-3 bottom-3 w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 disabled:bg-gray-300 transition"
            >
              <Send size={15} />
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* ── Prayer List ── */}
      <div>
        <AnimatePresence>
          {prayers.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </AnimatePresence>
        {prayers.length > 0 && (
          <div className="text-center py-6">
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
            <p className="text-xs text-gray-400">모든 기도 제목을 확인했습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrayerScreen;
