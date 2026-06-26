import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface OutreachPrayerAppScreenProps {
  teamType: 'outreach' | 'intercessory';
  name: string;
  onBack: () => void;
}

const PRAYER_TOPICS = [
  { category: "DAY 1", title: "하나님 아버지, 오늘 하루도 주님의 은혜 안에서 살게 하소서.", verse: "시편 23:1 - 여호와는 나의 목자시니 내게 부족함이 없으리로다", prayer: "사랑의 주님, 이 사역 기간 동안 온전히 주님만을 의지하며 나아가길 원합니다." },
  { category: "DAY 2", title: "우리 아웃리치 팀이 성령으로 하나되어 맡겨진 사역을 감당하게 하소서.", verse: "에베소서 4:3 - 평안의 매는 줄로 성령이 하나 되게 하신 것을 힘써 지키라", prayer: "우리의 생각과 마음이 그리스도 안에서 하나가 되게 하시고, 십자가의 사랑으로 품게 하소서." },
  { category: "DAY 3", title: "만나는 영혼들에게 그리스도의 사랑을 진실하게 전할 용기를 주소서.", verse: "사도행전 1:8 - 오직 성령이 너희에게 임하시면 너희가 권능을 받고", prayer: "두려움을 내어쫓고 담대히 복음을 전하는 입술이 되게 하옵소서." },
  { category: "DAY 4", title: "현지 사역자들과 교회가 든든히 세워지며, 부흥이 있게 하소서.", verse: "마태복음 16:18 - 내가 이 반석 위에 내 교회를 세우리니", prayer: "우리가 다녀간 이후에도 현지 교회를 통해 영혼 구원의 역사가 계속되게 하소서." },
  { category: "DAY 5", title: "모든 팀원들의 건강과 안전을 지켜주시고 기쁨으로 섬기게 하소서.", verse: "빌립보서 4:4 - 주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라", prayer: "지치지 않는 새 힘을 허락하시고, 모든 발걸음마다 기쁨이 넘치게 하소서." }
];

const OutreachPrayerAppScreen: React.FC<OutreachPrayerAppScreenProps> = ({ teamType, name, onBack }) => {
  const today = new Date();
  const dayIndex = (today.getDate() - 1) % PRAYER_TOPICS.length;
  const currentTopic = PRAYER_TOPICS[dayIndex];
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const [timer, setTimer] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [note, setNote] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleComplete = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const duration = 600 - timer; // time spent praying
      const dateKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      
      await addDoc(collection(db, 'flowing_prayers'), {
        name,
        teamType,
        date: dateKey,
        duration,
        note: note.trim(),
        createdAt: serverTimestamp()
      });
      setCompleted(true);
    } catch (e) {
      console.error('Error saving prayer:', e);
      // Even if it fails, let them see the completion screen
      setCompleted(true);
    } finally {
      setIsSaving(false);
    }
  };

  const progress = ((600 - timer) / 600) * 100;

  if (completed) {
    return (
      <div 
        className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 min-h-[100dvh] bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}team_selection_bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-white rounded-3xl p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-sm"
        >
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold text-primary-700 mb-3">오늘 기도를 완료했어요!</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            수고하셨습니다.<br/>남겨주신 기도가 큰 힘이 됩니다.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors border border-gray-200"
          >
            ← 다른 팀 화면으로
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 z-40 overflow-y-auto no-scrollbar pb-10 min-h-[100dvh] bg-cover bg-center"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}team_selection_bg.jpg)` }}
    >
      <div className="fixed inset-0 bg-black/20 z-0"></div>
      
      {/* Header Content (No separate hero image) */}
      <div className="relative z-10 w-full pt-6 px-6 pb-12 flex flex-col">
        <div className="mb-10">
          <button 
            onClick={onBack} 
            className="bg-white/90 backdrop-blur-sm rounded-full py-2 px-4 text-gray-800 text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105"
          >
            ← 팀 변경
          </button>
        </div>
        
        <div className="mt-auto">
          <div className="text-white/80 text-xs font-bold mb-2 tracking-wide">{dateStr}</div>
          <div className="text-white text-2xl font-semibold leading-snug drop-shadow-md">
            오늘 <span className="font-extrabold text-white text-3xl">{name}</span> 님이<br/>기도하실 {teamType === 'outreach' ? '아웃리치' : '중보기도'} 제목
          </div>
        </div>
      </div>

      <div className="px-5 relative z-20 flex flex-col gap-5">
        
        {/* Topic Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100"
        >
          <div className="bg-primary-50 text-primary-700 text-xs font-extrabold py-3 px-5 text-center tracking-wider">
            {currentTopic.category}
          </div>
          <div className="p-6">
            <h3 className="text-gray-900 text-xl font-extrabold leading-snug mb-5 text-center break-keep">
              {currentTopic.title}
            </h3>
            <div className="bg-gray-50 border-l-4 border-primary-500 py-3 px-4 rounded-r-xl mb-5">
              <p className="text-primary-800 text-[13px] leading-relaxed font-semibold">
                {currentTopic.verse}
              </p>
            </div>
            <p className="text-gray-600 text-[15px] leading-relaxed break-keep">
              {currentTopic.prayer}
            </p>
          </div>
        </motion.div>

        {/* Timer Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[24px] p-7 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100"
        >
          <div className="text-gray-900 text-[17px] font-extrabold mb-5 flex items-center justify-center gap-2">
            <span>⏱</span> 기도 타이머
          </div>
          
          <div className="relative w-[160px] h-[160px] mx-auto mb-5">
            <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary-500 transition-all duration-1000 ease-linear"
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray="339.292" 
                strokeDashoffset={339.292 * (1 - progress/100)} 
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-gray-900 tracking-tighter">
              {formatTime(timer)}
            </div>
          </div>
          
          <div className="text-gray-500 text-[13px] mb-6 font-medium">기도 시작 버튼을 눌러주세요</div>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => { setTimer(600); setIsRunning(false); }}
              className="py-3 px-5 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              ↺ 초기화
            </button>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`py-3 px-6 rounded-full font-extrabold text-sm text-white shadow-md transition-all ${
                isRunning ? 'bg-primary-800' : 'bg-primary-600 shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:bg-primary-700'
              }`}
            >
              {isRunning ? '⏸ 일시정지' : '▶ 기도 시작'}
            </button>
          </div>
        </motion.div>

        {/* Prayer Note & Complete */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 mb-4"
        >
          <div>
            <div className="text-white text-[15px] font-bold mb-3 flex items-center gap-1 drop-shadow-sm">
              <span>✏️</span> 오늘의 기도 한 문장 <span className="text-white/60 font-medium text-sm ml-1">(선택)</span>
            </div>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="오늘 기도하며 느낀 것, 하나님께 드리는 말씀을 남겨보세요..." 
              className="w-full bg-white border-[1.5px] border-gray-200 rounded-2xl p-4 text-[15px] text-gray-800 resize-none outline-none h-[110px] focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm"
            />
          </div>
          
          <button 
            onClick={handleComplete}
            disabled={isSaving}
            className={`w-full py-4 rounded-none text-white text-[17px] font-extrabold shadow-[0_4px_16px_rgba(22,163,74,0.35)] transition-all flex items-center justify-center gap-2 ${isSaving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            <span>🙏</span> {isSaving ? '저장 중...' : '기도 완료'}
          </button>
          <p className="text-center text-white/60 text-xs mt-1">타이머 진행과 무관하게 언제든 기도를 완료할 수 있습니다.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OutreachPrayerAppScreen;
