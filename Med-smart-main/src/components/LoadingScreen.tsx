import React from 'react';
import { motion } from 'motion/react';
import GccLogo from './GccLogo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <motion.div
        animate={{ 
          scale: [1, 1.08, 1],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 md:w-36 md:h-36"
      >
        <GccLogo />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex flex-col items-center text-center px-4"
      >
        <h2 className="text-xl font-black text-slate-900 tracking-normal antialiased">
          شركة جي سي سي للمقاولات
        </h2>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 font-mono tracking-[0.2em] mt-2 uppercase">
          GCC COMPANY FOR CONTRACTING
        </p>
        <div className="mt-4 flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
