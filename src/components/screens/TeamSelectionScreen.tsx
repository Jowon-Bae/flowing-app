import React from 'react';
import { motion } from 'framer-motion';

interface TeamSelectionScreenProps {
  onSelectTeam: (team: 'outreach' | 'intercessory') => void;
}

const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({ onSelectTeam }) => {
  return (
    <div className="absolute inset-0 bg-gray-50 z-40 flex flex-col items-center justify-center p-6 min-h-[100dvh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center mb-10"
      >
        <img 
          src={`${import.meta.env.BASE_URL}load_logo_black.png`} 
          alt="Seoul Dream Church Logo" 
          className="w-16 h-16 rounded-2xl mx-auto mb-6 drop-shadow-sm object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">환영합니다</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          어떤 팀으로 사역하시나요?<br/>
          팀을 선택해 주세요.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <button 
          onClick={() => onSelectTeam('intercessory')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-2xl font-bold text-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          🙏 중보기도 팀
        </button>
        
        <button 
          onClick={() => onSelectTeam('outreach')}
          className="w-full bg-primary-50 text-primary-700 py-4 px-6 rounded-2xl font-bold text-lg border border-primary-200 flex items-center justify-center hover:bg-primary-100 transition-colors"
        >
          ✈️ 아웃리치 팀
        </button>
      </motion.div>
    </div>
  );
};

export default TeamSelectionScreen;
