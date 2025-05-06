
import { motion } from "framer-motion";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-codesage-purple to-codesage-purple/70 flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl"
          animate={{ 
            boxShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 30px rgba(255,255,255,0.7)", "0px 0px 0px rgba(255,255,255,0)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg 
            className="w-16 h-16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 3L4 9V21H20V9L12 3Z" 
              stroke="#4F46E5" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9 14.5L11 16.5L15.5 12" 
              stroke="#06B6D4" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          CodeSage
        </motion.h1>
        <motion.p
          className="text-white/80 text-sm max-w-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Extract text from images and detect AI-generated content
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
