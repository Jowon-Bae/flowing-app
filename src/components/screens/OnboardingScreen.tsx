import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const slides = [
  {
    id: 1,
    image: `${import.meta.env.BASE_URL}onboarding_1.png`,
    title: 'Go! or Send!',
    description: '보내는 선교사, 당신의 또 다른 이름입니다.'
  },
  {
    id: 2,
    image: `${import.meta.env.BASE_URL}onboarding_2.png`,
    title: '당신의 마음이 흐를 때,\n필리핀에 희망이 피어납니다',
    description: '멈춰있던 곳에 사랑이 흐르도록 당신의 마음을 보태주세요. 보내는 선교사인 당신의 정성은 필리핀 땅의 메마른 곳을 적시는 가장 귀한 물줄기가 됩니다.'
  },
  {
    id: 3,
    image: `${import.meta.env.BASE_URL}onboarding_3.png`,
    title: '기도로 함께하는 아웃리치',
    description: '현장의 긴급한 기도 제목을 확인하고 \'기도하기\' 버튼으로 영적인 힘을 보태주세요. 우리는 하나입니다.'
  }
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col h-full">
      {/* Skip button area */}
      <div className="absolute top-6 right-6 z-50">
        {currentIndex < slides.length - 1 && (
          <button 
            onClick={onFinish}
            className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* Image Area */}
      <div className="relative h-3/5 w-full overflow-hidden bg-gray-50">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.img
            key={currentIndex}
            src={currentSlide.image}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full object-cover rounded-b-[40px] shadow-sm"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-8 pt-8 pb-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center flex-1"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 whitespace-pre-line">{currentSlide.title}</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              {currentSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Area */}
        <div className="flex flex-col items-center mt-auto">
          {/* Indicators */}
          <div className="flex items-center gap-2 mb-8">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-primary-600' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold text-lg shadow-[0_4px_14px_rgba(22,163,74,0.39)] flex items-center justify-center transition-colors hover:bg-primary-700"
          >
            {currentIndex === slides.length - 1 ? '시작하기' : '다음'}
            {currentIndex < slides.length - 1 && <ChevronRight size={20} className="ml-1" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
