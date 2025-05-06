
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, X, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

const CameraMode = ({ onBack, onCapturedImages, capturedImages = [], onAnalyze, isAnalyzing }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' is rear camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera access when component mounts
  useEffect(() => {
    requestCameraAccess();
    return () => {
      // Cleanup: stop the camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update stream when facing mode changes
  useEffect(() => {
    if (cameraActive) {
      stopCamera();
      startCamera();
    }
  }, [facingMode]);

  const requestCameraAccess = async () => {
    try {
      // First check if we have permission already
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(permissionStatus.state);
      
      if (permissionStatus.state === 'granted') {
        startCamera();
      }
      
    } catch (error) {
      console.error("Error checking camera permissions:", error);
      // Try directly starting camera
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: facingMode }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraPermission('granted');
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission('denied');
      toast.error("Camera access denied. Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    // Create a canvas element to capture the image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw the video frame to the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Update captured images and callback to parent
    const newImages = [...capturedImages, dataUrl];
    onCapturedImages(newImages);
    
    // Show success toast
    toast.success("Photo captured!");
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
        <h2 className="text-2xl font-bold ml-2">Camera Mode</h2>
      </div>
      
      {/* Camera Section */}
      <div className="mb-6">
        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden shadow-lg">
          {cameraPermission === 'denied' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <div className="bg-red-500 rounded-full p-3 mb-4">
                <X size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
              <p className="text-center text-white/80 mb-4">
                Please enable camera access in your browser settings to use this feature.
              </p>
              <button 
                className="btn-primary"
                onClick={requestCameraAccess}
              >
                Try Again
              </button>
            </div>
          ) : cameraPermission === 'prompt' && !cameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <div className="bg-primary rounded-full p-3 mb-4">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Camera Access</h3>
              <p className="text-center text-white/80 mb-4">
                We need access to your camera to capture images for analysis.
              </p>
              <button 
                className="btn-primary"
                onClick={startCamera}
              >
                Enable Camera
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Camera Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <motion.button 
                  className="bg-white/30 backdrop-blur-md rounded-full p-3 text-white"
                  onClick={toggleCamera}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw size={24} />
                </motion.button>
                
                <motion.button 
                  className="bg-white rounded-full p-4 shadow-lg"
                  onClick={captureImage}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera size={28} className="text-primary" />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Captured Images */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Captured Images ({capturedImages.length})</h3>
        
        <div className="flex items-center overflow-x-auto gap-4 pb-2">
          <AnimatePresence>
            {capturedImages.map((img, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-700"
              >
                <img 
                  src={img} 
                  alt={`Captured image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-0 right-0 bg-black/50 rounded-bl-lg p-1"
                  onClick={() => removeImage(index)}
                >
                  <X size={16} className="text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {capturedImages.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 py-4 w-full text-center">
              No images captured yet
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

export default CameraMode;
