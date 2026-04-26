import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronDown } from 'lucide-react';

interface HomeScreenProps {
  onOpenAdmin?: () => void;
  isActive?: boolean;
}

const outreachTeam = {
  leaders: [
    { role: '담당 교역자', name: '배주원' },
    { role: '담당 장로', name: '김승준' },
    { role: '행정팀장', name: '정지혜' },
    { role: '회계', name: '임지영' },
  ],
  members: [
    ['배주원', '이지은', '배이안'],
    ['김승준', '김규도'],
    ['이성재', '이정안'],
    ['지석민', '정지혜', '지윤호', '지윤나'],
    ['조성국', '임지영', '조수빈', '조수영'],
    ['조재범', '한가영', '조제인', '조제니'],
    ['박원유', '김은혜', '박시윤', '박시아'],
    ['심지영', '김기천', '김아인', '김이안'],
    ['최인', '이미리'],
    ['김사무엘', '이미영', '김희상'],
    ['백산', '백민경', '백하루', '백하율', '백하임'],
    ['김의태', '김길문'],
    ['박상욱', '박주아'],
    ['송나래', '김석', '김율'],
    ['김진수', '유재경', '김차율'],
    ['정진아', '김루카스', '김재스퍼'],
    ['김민우', '김도윤'],
    ['안지원', '송유섭', '전영지', '신종원', '신대환'],
    ['김요한', '장한울', '오준호', '조성수', '김기환'],
    ['천에녹', '양승호', '서민경'],
  ],
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAdmin, isActive = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [teamOpen, setTeamOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.muted = true;
      video.pause();
    }
  }, [isActive]);

  const handleAdminLockClick = () => {
    const pwd = window.prompt("관리자 비밀번호를 입력하세요: (힌트: 0000)");
    if (pwd === '0000' && onOpenAdmin) {
      onOpenAdmin();
    } else if (pwd !== null) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col min-h-full pb-8"
    >
      {/* Banner Section */}
      <div className="relative h-72 w-full">
        <img
          src={`${import.meta.env.BASE_URL}main_banner.png`}
          alt="Children smiling"
          className="w-full h-full object-cover rounded-b-[40px] shadow-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[40px]" />

        {/* Admin Lock Button */}
        <button
          onClick={handleAdminLockClick}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm z-10"
        >
          <Lock size={12} className="text-white/50" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.p
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="text-white/90 text-sm font-medium mb-1 drop-shadow-md"
          >
            2026 필리핀 아웃리치
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="text-white text-4xl font-bold drop-shadow-md leading-tight mb-1"
          >
            The Sender
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="text-white/85 text-base font-medium drop-shadow-md"
          >
            당신이 보내는 선교사입니다!
          </motion.p>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-10 flex-1 pb-10">
        {/* Welcome Text */}
        <section>
          <h3
            className="text-4xl mb-3 text-primary-600"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Welcome!
          </h3>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            보내는 선교사로 이 사역을 함께해 주셔서 감사합니다.
            현장의 생생한 소식을 이곳에서 확인하고, 기도로 동역해 주세요.
          </p>
        </section>

        {/* Home Video Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-black relative"
        >
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}home_video.mp4`}
            autoPlay loop muted playsInline
            className="w-full object-cover"
            style={{ maxHeight: '240px' }}
          />
        </motion.section>

        {/* Vision Section */}
        <section className="bg-primary-50/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-100 rounded-full opacity-50 blur-xl" />
          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            아웃리치 비전
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed relative z-10">
            사랑이 흘러가는 곳마다 회복이 일어납니다. 우리는 필리핀 땅에 예수 그리스도의 조건 없는 사랑을 전하고, 그곳의 다음 세대들에게 희망의 씨앗을 심기 위해 나아갑니다.
          </p>
        </section>

        {/* Team Section (Leaders + Members, collapsible) */}
        <section>
          <button
            onClick={() => setTeamOpen(prev => !prev)}
            className="w-full flex items-center justify-between mb-4 px-1 text-left"
          >
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Outreach Team</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total {outreachTeam.members.flat().length} members
              </span>
            </div>
            <motion.div
              animate={{ rotate: teamOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
            >
              <ChevronDown size={16} className="text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {teamOpen && (
              <motion.div
                key="team-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden space-y-4"
              >
                {/* Leaders */}
                <div>
                  <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-2 px-1">Core Leaders</p>
                  <div className="grid grid-cols-2 gap-2">
                    {outreachTeam.leaders.map((leader, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-center"
                      >
                        <p className="text-[10px] text-primary-600 font-bold leading-none mb-1.5">{leader.role}</p>
                        <p className="text-sm font-bold text-gray-900">{leader.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Members */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Members</p>
                  <div className="grid grid-cols-1 gap-0.5">
                    {outreachTeam.members.map((names, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50/50 border border-gray-100/50 rounded-xl py-1.5 px-3"
                      >
                        <div className="flex flex-wrap gap-2">
                          {names.map((name, nIdx) => (
                            <span
                              key={nIdx}
                              className="text-sm font-semibold text-gray-900"
                            >
                              {name}{nIdx < names.length - 1 && <span className="text-gray-200 ml-2 font-normal">|</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
