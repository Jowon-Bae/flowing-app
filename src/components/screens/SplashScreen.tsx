import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-16 h-16 mb-8 relative"
        >
          <img 
            src={`${import.meta.env.BASE_URL}load_logo_black.png`} 
            alt="Seoul Dream Church" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-gray-400 text-sm tracking-widest uppercase mb-2 font-medium">Seoul Dream Church</h2>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            2026 Philippines Outreach
            <br />
            <span className="text-primary-600">Flowing with Love</span>
          </h1>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pb-12"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
