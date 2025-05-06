import { motion } from 'framer-motion';
import { ArrowLeft, Copy, RefreshCw, Share2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const ResultsView = ({ results, images, onBack, onNewAnalysis }) => {
  // If we don't have results yet, show loading
  if (!results || !images) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading results...</p>
      </div>
    );
  }

  const copyTextToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
        toast.error('Failed to copy text');
      });
  };

  const handleShare = async (result) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeSage Analysis Result',
          text: `CodeSage AI Detection: ${result.humanPercentage}% human, ${result.aiPercentage}% AI\n\n${result.extractedText}`,
        });
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        if (error.name !== 'AbortError') {
          toast.error('Failed to share result');
        }
      }
    } else {
      copyTextToClipboard(`CodeSage AI Detection: ${result.humanPercentage}% human, ${result.aiPercentage}% AI\n\n${result.extractedText}`);
    }
  };

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
      className="max-w-4xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold ml-2">Analysis Results</h2>
        </div>
        
        <button 
          className="btn-secondary flex items-center gap-2"
          onClick={onNewAnalysis}
        >
          <RefreshCw size={16} />
          New Analysis
        </button>
      </div>
      
      {/* Results */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {results.map((result, index) => (
          <motion.div 
            key={index}
            variants={item}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="md:flex">
              {/* Image Thumbnail */}
              <div className="md:w-1/3 bg-gray-100 dark:bg-gray-900 p-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={images[index]} 
                    alt={`Result ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Result Content */}
              <div className="p-6 md:w-2/3">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">AI Detection Result</h3>
                  
                  {/* AI Detection Meter */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600 dark:text-green-400">Human: {result.humanPercentage}%</span>
                      <span className="text-red-600 dark:text-red-400">AI: {result.aiPercentage}%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${result.humanPercentage}%`,
                          background: `linear-gradient(to right, 
                            ${result.humanPercentage > 70 ? '#10B981' : '#F59E0B'}, 
                            ${result.humanPercentage > 70 ? '#34D399' : '#FBBF24'})`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Extracted Text */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2">Extracted Text</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {result.extractedText}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyTextToClipboard(result.extractedText)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Copy Text
                    </button>
                    <button
                      onClick={() => handleShare(result)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ResultsView;
