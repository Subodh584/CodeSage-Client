
import { motion } from 'framer-motion';
import { Camera, Upload } from 'lucide-react';

const ModeSelection = ({ onModeSelect }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="text-center mb-10"
        variants={item}
      >
        <h2 className="text-3xl font-bold mb-4">Select Mode</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Choose how you want to capture text for AI detection
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer card-shadow border border-gray-100 dark:border-gray-700"
          onClick={() => onModeSelect('camera')}
        >
          <div className="h-40 flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera size={36} className="text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Camera Mode</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
            Take photos using your device's camera
          </p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer card-shadow border border-gray-100 dark:border-gray-700"
          onClick={() => onModeSelect('upload')}
        >
          <div className="h-40 flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <Upload size={36} className="text-secondary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Upload Mode</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
            Select images from your device storage
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModeSelection;
