import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Volume2, VolumeX } from 'lucide-react';

interface HomeScreenProps {
  onOpenAdmin?: () => void;
}

const teamMembers = [
  { name: '팀장', role: '인솔 및 전체 리더십', emoji: '👑' },
  { name: '부팀장', role: '사역 코디네이션', emoji: '🌟' },
  { name: '총무', role: '재정 및 행정', emoji: '📋' },
  { name: '찬양팀', role: '워십 리딩', emoji: '🎵' },
  { name: '어린이팀', role: 'VBS & 어린이 사역', emoji: '🎨' },
  { name: '청년팀', role: '청년 사역 & 힐링캠프', emoji: '🔥' },
  { name: '의료팀', role: '의료 봉사', emoji: '🏥' },
  { name: '미디어팀', role: '촬영 & 기록', emoji: '📷' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAdmin }) => {
  const [isMuted, setIsMuted] = useState(false);

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
            className="text-white text-3xl font-bold drop-shadow-md leading-tight"
          >
            Flowing <br />with Love
          </motion.h2>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8 flex-1">
        {/* Welcome Text */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-2">환영합니다!</h3>
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
            src={`${import.meta.env.BASE_URL}home_video.mp4`}
            autoPlay loop muted={isMuted} playsInline
            className="w-full object-cover"
            style={{ maxHeight: '240px' }}
          />
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
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
          <h3 className="text-lg font-bold text-gray-900 mb-1">함께 가는 팀</h3>
          <p className="text-gray-400 text-xs mb-4">2026 필리핀 아웃리치 팀원을 소개합니다</p>
          <div className="grid grid-cols-2 gap-3">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-lg shrink-0">
                  {member.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                  <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-300 mt-3">총 XX명의 팀원이 함께 합니다</p>
        </section>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
