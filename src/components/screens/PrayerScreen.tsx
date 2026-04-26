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
  const formRef = React.useRef<HTMLDivElement>(null);
  const authorRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const scrollToInput = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  const handleSubmit = () => {
    if (!author.trim() || !content.trim()) return;
    setIsSubmitting(true);
    addPrayer(author, content);
    setAuthor('');
    setContent('');
    if (authorRef.current) authorRef.current.textContent = '';
    if (contentRef.current) contentRef.current.textContent = '';
    // Blur to dismiss keyboard
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => setIsSubmitting(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-[300px] bg-gray-50/50 min-h-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">중보기도</h2>
        <p className="text-gray-500 text-sm">기도 제목을 함께 나누고 응원해 주세요.</p>
      </div>

      {/* ── Overall Prayer Topics ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f3d3c] rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10" />
        <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-teal-50">
          기도편지 "기도해 주세요!"
        </h3>
        <div className="space-y-5 text-[14px] leading-relaxed relative z-10">
          <div>
            <p className="font-bold text-teal-200 mb-1">1. 주님의 영광이 드러나는 통로 되게 하소서</p>
            <p className="text-teal-50/80">우리의 사역이 인간의 열심이 아닌, 오직 하나님의 살아계심과 영광만을 드러내는 복된 시간이 되게 하옵소서!</p>
          </div>
          <div>
            <p className="font-bold text-teal-200 mb-1">2. 기도로 세워지는 준비 과정 되게 하소서</p>
            <p className="text-teal-50/80">사역의 현장에 가기 전, 먼저 기도로 무장하게 하시고 모든 팀원이 영적으로 하나 되어 기쁨으로 준비하게 하옵소서!</p>
          </div>
          <div>
            <p className="font-bold text-teal-200 mb-1">3. 환경을 뛰어넘는 담대한 믿음을 주소서</p>
            <p className="text-teal-50/80">불안정한 국제 정세와 가파르게 오르는 재정적 부담 앞에 위축되지 않게 하시고, 모든 필요를 채우시는 하나님을 신뢰하며 믿음으로 전진할 담대함을 주옵소서!</p>
          </div>
          <div>
            <p className="font-bold text-teal-200 mb-1">4. 사랑으로 하나 되는 공동체 되게 하소서</p>
            <p className="text-teal-50/80">서로의 부족함을 채워주며, 사랑과 헌신으로 섬기는 아름다운 팀워크를 허락하옵소서. 우리 안에 먼저 천국이 임하는 아웃리치 팀이 되게 하소서!</p>
          </div>
        </div>
      </motion.div>

      {/* ── Inline Write Box ── */}
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-6"
      >
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">🙏</span>
          기도 제목 남기기
        </p>
        <div className="space-y-3">
          <div
            ref={authorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setAuthor((e.target as HTMLDivElement).textContent || '')}
            onFocus={scrollToInput}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); contentRef.current?.focus(); } }}
            data-placeholder="이름 (닉네임)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
          />
          <div className="relative">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setContent((e.target as HTMLDivElement).textContent || '')}
              onFocus={scrollToInput}
              data-placeholder="기도 제목이나 응원의 메시지를 자유롭게 남겨주세요."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition min-h-[56px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
            />
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!author.trim() || !content.trim()}
              whileTap={{ scale: 0.9 }}
              animate={isSubmitting ? { scale: [1, 1.2, 1] } : {}}
              className="absolute right-3 bottom-3 w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 disabled:bg-gray-300 transition"
            >
              <Send size={15} />
            </motion.button>
          </div>
        </div>
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
