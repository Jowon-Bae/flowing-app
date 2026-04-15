import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface HomeScreenProps {
  onOpenAdmin?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAdmin }) => {
  const currentAmount = 850;
  const goalAmount = 1000;
  const progressPercent = Math.min((currentAmount / goalAmount) * 100, 100);

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
          src="/main_banner.png" 
          alt="Children smiling" 
          className="w-full h-full object-cover rounded-b-[40px] shadow-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[40px]"></div>
        
        {/* Admin Lock Button */}
        <button 
          onClick={handleAdminLockClick}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm z-10"
        >
          <Lock size={12} className="text-white/50" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-sm font-medium mb-1 drop-shadow-md"
          >
            2026 필리핀 아웃리치
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-3xl font-bold drop-shadow-md leading-tight"
          >
            Flowing <br/>with Love
          </motion.h2>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8 flex-1">
        {/* Welcome Text */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-2">환영합니다!</h3>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            보내는 선교사로 기꺼이 동참해 주시는 후원자 여러분들께 감사드립니다. 
            현장의 생생한 은혜를 이곳에서 실시간으로 확인하고 기도로 동역해 주세요.
          </p>
        </section>

        {/* Progress Bar Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50"
        >
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">현재 후원 진행률</p>
              <h4 className="text-2xl font-bold text-gray-900">{progressPercent.toFixed(0)}%</h4>
            </div>
            <p className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              목표 달성 임박!
            </p>
          </div>
          
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
              className="h-full bg-primary-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
            <span>시작</span>
            <span>기도와 물질 100%</span>
          </div>
        </motion.section>

        {/* Vision / Info */}
        <section className="bg-primary-50/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-100 rounded-full opacity-50 blur-xl"></div>
          <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            아웃리치 비전
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed relative z-10">
            사랑이 흘러가는 곳마다 회복이 일어납니다. 우리는 필리핀 땅에 예수 그리스도의 조건 없는 사랑을 전하고, 그곳의 다음 세대들에게 희망의 씨앗을 심기 위해 나아갑니다. 보내는 손길과 나아가는 발걸음이 하나되어 놀라운 기적이 일어날 것입니다.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
