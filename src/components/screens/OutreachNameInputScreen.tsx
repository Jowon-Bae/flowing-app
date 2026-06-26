import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OutreachNameInputScreenProps {
  teamType: 'outreach' | 'intercessory';
  onSubmit: (name: string) => void;
  onBack: () => void;
}

const OutreachNameInputScreen: React.FC<OutreachNameInputScreenProps> = ({ teamType, onSubmit, onBack }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-50 z-40 flex flex-col p-6 min-h-[100dvh]">
      <button 
        onClick={onBack} 
        className="self-start text-gray-500 hover:text-gray-700 font-medium text-sm py-2 px-1 transition-colors"
      >
        ← 팀 다시 선택하기
      </button>

      <div className="flex-1 flex flex-col justify-center items-center pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center mb-10"
        >
          <div className="text-5xl mb-6">{teamType === 'outreach' ? '✈️' : '🙏'}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {teamType === 'outreach' ? '아웃리치 팀' : '중보기도 팀'}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            기도 어플에 사용할<br/>
            이름을 입력해주세요.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="이름 입력"
            className="w-full bg-white text-gray-900 py-4 px-6 rounded-2xl border border-gray-200 text-center text-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          />
          
          <button 
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex justify-center items-center ${
              name.trim() 
                ? 'bg-primary-600 text-white shadow-[0_4px_14px_rgba(22,163,74,0.39)] hover:bg-primary-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            시작하기
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default OutreachNameInputScreen;
