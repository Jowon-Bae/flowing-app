import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface OutreachPrayerAppScreenProps {
  teamType: 'outreach' | 'intercessory';
  name: string;
  onBack: () => void;
}

const PRAYER_TOPICS: { category: string; title: string; prayer: string; verse?: string }[] = [
  { 
    category: "전체 기도제목", 
    title: "아웃리치팀 전체를 위한 기도",
    prayer: "1. 우리의 사역이 인간의 열심이 아닌, 오직 하나님의 살아계심과 영광만을 드러내는 복된 시간이 되게 하옵소서!\n2. 사역의 현장에 가기 전, 먼저 기도로 무장하게 하시고 모든 팀원이 영적으로 하나 되어 기쁨으로 준비하게 하옵소서!\n3. 불안정한 국제 정세와 가파르게 오르는 재정적 부담 앞에 위축되지 않게 하시고, 하나님을 신뢰하며 믿음으로 전진할 담대함을 주옵소서!\n4. 서로의 부족함을 채워주며, 사랑과 헌신으로 섬기는 아름다운 팀워크를 허락하옵소서!\n5. 필리핀 사역에 필요한 재정들이 있습니다. 하늘의 보고를 열어주셔서 필요한 모든 재정이 채워지게 하소서!"
  },
  {
    category: "행정팀",
    title: "행정팀을 위한 기도",
    prayer: "1. 아웃리치의 모든 일정과 행정 준비가 주님의 은혜와 섭리 가운데 질서 있게 진행되게 하옵소서.\n2. 주님의 은혜 가운데 한 사람도 소외되지 않게 하시고, 모든 지체가 기쁨으로 함께 참여하게 하옵소서.\n3. 이동하는 모든 길과 사역의 모든 과정 가운데 주님께서 친히 동행하여 주옵소서.\n4. 행정팀이 보이지 않는 자리에서도 감사와 기쁨으로 섬기게 하시고, 우리의 수고가 드러나기보다 주님의 이름만 높아지게 하옵소서."
  },
  {
    category: "중보기도팀",
    title: "중보기도팀을 위한 기도",
    prayer: "1. 아웃리치 준비와 진행 모두에 있어 무엇보다 기도로 하나님의 지혜와 능력을 구하는 시간이 될 수 있도록\n2. 모든 팀들이 모일 때마다 기도로 시작하고 기도로 마무리할 수 있도록\n3. 매주 화요일 온라인 기도모임이 비록 함께 대면하지 못하지만 점점 더 주님의 역사하심을 경험하는 시간이 되도록\n4. 중보기도 어플을 통해 우리의 기도가 일상이 되고 일상이 기도가 되는 훌륭한 도구로 사용되도록"
  },
  {
    category: "농구팀",
    title: "농구팀을 위한 기도",
    prayer: "1. 저희에게 필리핀에 대한 소망과 비전을 품게 하시고 그 과정 가운데 함께하심에 감사합니다.\n2. 필리핀 땅에 복음을 심고 사람들의 마음에 하나님의 사랑이 전해질 수 있는 통로가 되기를 원합니다.\n3. 오직 하나님만 영광 받고 하나님만 드러날 수 있는 아웃리치가 될 수 있기를 간절히 소망합니다.\n4. 아웃리치 과정에서 한 명도 다치지 않고 안전한 농구사역이 될 수 있게 지켜주소서.\n5. 이번 아웃리치를 통해 하나님에 대한 사랑이 더 견고해지게 하여 주소서."
  },
  {
    category: "차세대팀",
    title: "차세대팀을 위한 기도",
    prayer: "1. 필리핀 구루앗 어린이, 청소년, 청년 등 다음세대가 복음을 듣고 예수님을 구원자로 믿는 역사가 나타나게 하소서\n2. 다음세대가 복음의 능력으로 하나님의 꿈을 꾸고 주의 비전을 발견할 수 있게 하소서\n3. 사역을 통해 만나게 되는 모든 이들이 하나님의 사랑을 경험하게 하소서\n4. 현지 아이들이 교회는 즐겁고 기쁨이 가득한 곳이며, 예수님은 좋은 분이라는 사실을 알게 하소서\n5. 팀의 준비하는 과정과 사역 현장 가운데 한 마음으로 나아가며 영광이 드러나게 하소서"
  },
  {
    category: "의료팀",
    title: "의료팀을 위한 기도",
    prayer: "준비 중"
  },
  {
    category: "드라마팀",
    title: "드라마팀을 위한 기도",
    prayer: "준비 중"
  },
  {
    category: "음악팀",
    title: "음악팀을 위한 기도",
    prayer: "1. 차세대 자녀들이 지루하거나 힘들지 않고 즐겁게 연습에 참여할 수 있도록\n2. 사역 현장과 음악팀 구성에 맞는 좋은 선곡에 귀한 감동 주시길\n3. 소외되거나 자신감이 결여되지 않게 음악팀 구성원 모두에게 합당한 역할이 주어질 수 있도록\n4. 이번에 함께할 차세대 친구들 모두 음악공연을 준비하며 사역의 주인공이 되게 하시길\n5. 처음부터 마지막까지 특히 어린 자녀들의 안전과 건강을 지켜주시길"
  },
  {
    category: "워십팀",
    title: "워십팀을 위한 기도",
    prayer: "1. 필리핀 아웃리치에 가기 전, 기도로 준비하길 원합니다. 많이 기도하게 하시고 성실히 준비하게 하소서.\n2. 워십 동작을 다 외우게 하시고, 기쁨으로 찬양할 수 있도록 기도해주세요!\n3. 필리핀 땅을 향한 하나님의 마음을 부어주시고, 맡은 사역과 주어진 일들을 기쁨과 순종으로 할 수 있도록\n4. 필리핀 아웃리치에서 저희와 아이들이 하나님을 깊이 만나는 시간 될 수 있도록\n5. 공연을 볼 아이들이 함께 기뻐하며 예수님 만날 수 있게 지혜를 사용하여 주세요.\n6. 직장에서 지혜롭게 잘 처리하고 지치지 않는 새 힘 주시길 기도합니다."
  },
  {
    category: "블레싱팀",
    title: "블레싱팀을 위한 기도",
    prayer: "1. 섬기는 필리핀 청년들이 삶 속에서 하나님을 만나서 하나님의 비전과 꿈을 꾸기를 기도합니다.\n2. 스태프 한 사람 한 사람이 예수님의 사랑을 온몸으로 전하는 통로가 되게 하시고, 팀 간의 협력과 섬김의 마음이 흐트러지지 않도록 지켜주시기를 기도합니다.\n3. 물놀이, 레크레이션, 세족식, 축복기도의 모든 순간에 안전사고 없이 진행되게 하시고, 청년들의 마음이 열려 하나님의 사랑을 진하게 경험하게 하시기를 기도합니다."
  },
  {
    category: "촬영팀",
    title: "촬영팀을 위한 기도",
    prayer: "1. 촬영팀이 즐겁게 사역할 수 있도록\n2. 주님께서 모든 일정을 친히 인도하시길\n3. 전체 사역을 축복하고 은혜로운 순간들을 잘 포착할 수 있기를"
  },
  {
    category: "디자인팀",
    title: "디자인팀을 위한 기도",
    prayer: "1. 필리핀 구루앗을 사랑하는 마음으로 나아가며, 맘껏 누리고 느끼고 돌아오길 원합니다.\n2. 모두 아픈 사람, 다치는 사람 없이 무사히 돌아올 수 있도록\n3. 필리핀 땅을 향한 하나님의 마음을 부어주시고 기쁨과 순종으로 할 수 있도록\n4. 걱정과 두려움보다 하나님께서 행하실 일을 기대하며 믿음으로 나아가도록\n5. 분주한 마음으로 집중하지 못했던 예배를 사모하고, 하나님을 갈망하는 마음으로 준비할 수 있길"
  },
  {
    category: "식사팀",
    title: "식사팀을 위한 기도",
    prayer: "1. 오직 감사함과 기쁨으로 일하게 해주세요~\n2. 아웃리치 계획하고 준비하는 모든 여정 가운데 하나님께서 함께하여 주세요~\n3. 모든 팀원들이 사고 없이 건강하게 아웃리치를 마칠 수 있도록 해주세요."
  },
  {
    category: "키즈케어팀",
    title: "키즈케어팀을 위한 기도",
    prayer: "1. 많은 아이들이 함께하는 아웃리치입니다. 함께하는 아동들의 안전을 책임져 주셔서 눈동자 같이 지켜주시길 기도 부탁드립니다!\n2. 우리 아이들도 은혜받길 원합니다. 필리핀 아이들과 연합되며, 하나님 나라를 완성해 나가는 아웃리치가 되도록 기도 부탁드립니다!\n3. 키즈케어 팀원들을 두고 기도 부탁드립니다. 기도로 먼저 준비하게 하시고, 아이들을 사랑하는 마음으로 준비하되 우리의 미흡함과 부족함을 주님이 채워주세요."
  }
];

const OutreachPrayerAppScreen: React.FC<OutreachPrayerAppScreenProps> = ({ teamType, name, onBack }) => {
  const today = new Date();
  const dayIndex = (today.getDate() - 1) % PRAYER_TOPICS.length;
  const currentTopic = PRAYER_TOPICS[dayIndex];
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const [selectedDuration, setSelectedDuration] = useState(540);
  const [timer, setTimer] = useState(540);
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
      const duration = (timer === selectedDuration) ? selectedDuration : (selectedDuration - timer);
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

  const progress = ((selectedDuration - timer) / selectedDuration) * 100;

  const handleDurationChange = (minutes: number) => {
    const newSeconds = minutes * 60;
    setSelectedDuration(newSeconds);
    setTimer(newSeconds);
    setIsRunning(false);
  };

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
            {currentTopic.verse && (
              <div className="bg-gray-50 border-l-4 border-primary-500 py-3 px-4 rounded-r-xl mb-5">
                <p className="text-primary-800 text-[13px] leading-relaxed font-semibold">
                  {currentTopic.verse}
                </p>
              </div>
            )}
            <div className="text-gray-600 text-[15px] leading-relaxed break-keep space-y-2">
              {currentTopic.prayer.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Motivation Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[24px] p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center justify-center"
        >
          <div className="flex justify-center gap-3 mb-3">
            <span className="text-primary-300 text-[10px]">✦</span>
            <span className="text-primary-300 text-[10px]">✦</span>
            <span className="text-primary-300 text-[10px]">✦</span>
          </div>
          <h3 className="text-gray-900 text-[17px] font-extrabold leading-snug mb-3">
            여러분들의 기도가 쌓여<br />은혜로운 아웃리치를 만듭니다
          </h3>
          <p className="text-gray-500 text-[13px] font-medium mb-4">
            70명 × 30일 × 9분 = <span className="text-primary-600 font-bold">18,900분</span>의 기도
          </p>
          <div className="bg-primary-50 text-primary-700 text-[13px] font-bold py-2 px-4 rounded-full inline-block tracking-tight">
            오늘 당신의 기도가 아웃리치를 바꿉니다
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
          
          <div className="flex justify-center gap-2 mb-6">
            {[9].map(min => (
              <button
                key={min}
                onClick={() => handleDurationChange(min)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  selectedDuration === min * 60
                    ? 'bg-primary-50 text-primary-700 border-[1.5px] border-primary-400 shadow-sm'
                    : 'bg-white text-gray-400 border-[1.5px] border-gray-100 hover:bg-gray-50'
                }`}
              >
                {min}분
              </button>
            ))}
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
              onClick={() => { setTimer(selectedDuration); setIsRunning(false); }}
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
          <p className="text-center text-white/70 text-xs mt-2 font-medium">타이머 없이도 기도 완료를 기록할 수 있어요</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OutreachPrayerAppScreen;
