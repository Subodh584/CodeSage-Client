import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload } from 'lucide-react';
import ModeSelection from '@/components/ModeSelection';
import CameraMode from '@/components/CameraMode';
import UploadMode from '@/components/UploadMode';
import ResultsView from '@/components/ResultsView';
import { toast } from 'sonner';

const Index = () => {
  const [activeView, setActiveView] = useState('mode-selection');
  const [capturedImages, setCapturedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleModeSelect = (mode) => {
    setActiveView(mode);
  };

  const handleCapturedImages = (images) => {
    setCapturedImages(images);
  };

  const handleBackToModes = () => {
    setActiveView('mode-selection');
    setCapturedImages([]);
    setResults(null);
  };

  const handleBackToCapture = () => {
    setResults(null);
    // Go back to the previous mode (camera or upload)
    if (activeView.includes('results')) {
      setActiveView(activeView.replace('-results', ''));
    }
  };

  const handleAnalyze = async () => {
    if (capturedImages.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      
      // Process all images sequentially
      for (let index = 0; index < capturedImages.length; index++) {
        const img = capturedImages[index];
        
        // If it's a file, just append it
        if (img instanceof File) {
          formData.append('images', img);
        } 
        // If it's a blob/dataURL, convert to file first
        else if (img.startsWith('data:')) {
          const blob = await fetch(img).then(r => r.blob());
          const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
          formData.append('images', file);
        }
      }

      // Debug environment variable
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.log('Using API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Check if response body is empty
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON response:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success) {
        setResults(data.results);
        setActiveView(`${activeView}-results`);
      } else {
        // Handle error
        console.error('Analysis failed:', data.error);
        // Display error to user
        toast.error('Analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
      // Display error to user
      toast.error('Error analyzing images: ' + (error.message || 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.header 
        className="p-4 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-md mr-3">
            <svg 
              className="w-6 h-6" 
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
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-codesage-purple to-codesage-purple/80">
            CodeSage
          </h1>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 pb-20 pt-4">
        {activeView === 'mode-selection' && (
          <ModeSelection onModeSelect={handleModeSelect} />
        )}
        
        {activeView === 'camera' && (
          <CameraMode 
            onBack={handleBackToModes} 
            onCapturedImages={handleCapturedImages}
            capturedImages={capturedImages}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {activeView === 'upload' && (
          <UploadMode 
            onBack={handleBackToModes} 
            onCapturedImages={handleCapturedImages}
            capturedImages={capturedImages}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {(activeView === 'camera-results' || activeView === 'upload-results') && (
          <ResultsView 
            results={results}
            images={capturedImages}
            onBack={handleBackToCapture}
            onNewAnalysis={handleBackToModes}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
