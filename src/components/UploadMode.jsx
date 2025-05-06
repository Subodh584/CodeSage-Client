
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, Check, File } from 'lucide-react';
import { toast } from 'sonner';

const UploadMode = ({ onBack, onCapturedImages, capturedImages = [], onAnalyze, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      toast.error("Please select image files only");
      return;
    }
    
    // Create object URLs for preview
    const newImages = [...capturedImages];
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        // If this is the last file, update state
        if (newImages.length === capturedImages.length + imageFiles.length) {
          onCapturedImages(newImages);
          toast.success(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} added`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    onCapturedImages(newImages);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold ml-2">Upload Mode</h2>
      </div>
      
      {/* Upload Area */}
      <div className="mb-6">
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-700 hover:border-primary/70'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Upload size={28} className="text-secondary" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Upload Images</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto">
              Drag and drop image files here, or click to select files from your device
            </p>
            
            <button className="btn-secondary">
              Select Images
            </button>
          </div>
        </div>
      </div>
      
      {/* Selected Images */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Selected Images ({capturedImages.length})</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {capturedImages.map((img, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-700"
              >
                <img 
                  src={img} 
                  alt={`Selected image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                  onClick={() => removeImage(index)}
                >
                  <X size={16} className="text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {capturedImages.length === 0 && (
            <div className="col-span-full text-gray-400 dark:text-gray-500 py-4 text-center">
              No images selected yet
            </div>
          )}
        </div>
      </div>
      
      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          disabled={capturedImages.length === 0 || isAnalyzing}
          onClick={onAnalyze}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Check size={18} />
              Analyze Images
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default UploadMode;
