import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface HomeScreenProps {
  onOpenAdmin?: () => void;
  isActive?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAdmin, isActive = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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

      <div className="px-6 pt-8 space-y-8 flex-1">
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

        {/* Team Introduction */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-1">팀 멤버</h3>
          <p className="text-gray-400 text-xs mb-4">팀원 모집중</p>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-2xl mb-3">
              🙋🏻‍♀️
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">
              아웃리치 팀원 모집
            </h4>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              함께 필리핀 땅에 사랑을 전할 팀 멤버를 모집합니다!
            </p>
            
            <a 
              href="https://forms.gle/5PCea7MyB6i5jbEk7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
            >
              아웃리치 신청 링크
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
