import React, { useState, useRef, useEffect } from 'react';
import { GradeLevel, Subject, Language, CameraSolution } from '../types';
import { playTextToSpeech, stopTextToSpeech } from '../utils/speech';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';
import { SubjectSelect } from './SubjectSelect';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Award, 
  FileText, 
  Download, 
  Lightbulb, 
  Layers, 
  BookOpen,
  ArrowRight,
  Mic,
  MicOff,
  SwitchCamera,
  Scan,
  Book,
  Smartphone
} from 'lucide-react';

interface CameraHomeworkHelperProps {
  grade: GradeLevel;
  language: Language;
  onAwardXp: (amount: number, reason: string) => void;
  onSaveOffline: (solution: CameraSolution & { id: string; image: string; date: string }) => void;
}

export const CameraHomeworkHelper: React.FC<CameraHomeworkHelperProps> = ({
  grade,
  language,
  onAwardXp,
  onSaveOffline
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Math');
  const [userQuery, setUserQuery] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanMode, setScanMode] = useState<'problem' | 'chapter'>('problem');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<CameraSolution | null>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'hints' | 'quiz' | 'metaphor'>('steps');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice speech-to-text recognition
  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition((text) => {
    setUserQuery(text);
  });

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  // Sample homework presets based on Grade Level
  const sampleImages = [
    {
      title: grade === 'KG' ? 'Counting Apples & Oranges 🍎' : 'Visual Fraction Slice 🍕',
      subject: 'Math' as Subject,
      src: grade === 'KG'
        ? 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      query: grade === 'KG' ? 'How many apples do we see here? Count them with me!' : 'What fraction of the pizza is remaining?'
    },
    {
      title: grade === 'Grade 9-12' || grade === 'Higher Ed' ? 'Calculus & Physics Equations 📐' : 'Plant Cell Photosynthesis 🍃',
      subject: (grade === 'Grade 9-12' || grade === 'Higher Ed' ? 'Math' : 'Science') as Subject,
      src: grade === 'Grade 9-12' || grade === 'Higher Ed'
        ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
      query: grade === 'Grade 9-12' || grade === 'Higher Ed' ? 'Solve for the derivative step-by-step.' : 'Explain the photosynthesis cycle shown in this plant diagram.'
    }
  ];

  // Camera initialization with facing mode toggle
  const startCamera = async (overrideFacing?: 'environment' | 'user') => {
    setIsCameraActive(true);
    setErrorMessage(null);
    const targetFacing = overrideFacing || cameraFacingMode;
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: targetFacing } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMessage('Could not open camera stream. Please allow camera permissions or upload an image.');
      setIsCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        // Auto analyze in Chapter Scan mode
        if (scanMode === 'chapter') {
          analyzeHomework(dataUrl);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process homework image with AI API
  const analyzeHomework = async (imageToAnalyze?: string, customPrompt?: string) => {
    const targetImg = imageToAnalyze || capturedImage;
    if (!targetImg) {
      setErrorMessage('Please capture a photo or upload an image first!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSolution(null);
    setQuizScore(null);
    setSelectedAnswers({});
    setRevealedHintIndex(0);

    try {
      const response = await fetch('/api/tutor/camera-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImg,
          mimeType: 'image/jpeg',
          query: customPrompt || userQuery,
          mode: scanMode,
          grade,
          subject: selectedSubject,
          language
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setSolution(resData.data);
        onAwardXp(scanMode === 'chapter' ? 75 : 50, scanMode === 'chapter' ? 'Chapter Page AI Analysis' : 'Camera Homework Analysis');
        if (grade === 'KG' && resData.data.kgVisualMetaphor) {
          setActiveTab('metaphor');
        } else {
          setActiveTab('steps');
        }
      } else {
        setErrorMessage(resData.error || 'Failed to process homework. Please try again.');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setErrorMessage('Connection error. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Read Aloud
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopTextToSpeech();
      setIsSpeaking(false);
    } else if (solution) {
      const textToRead = solution.audioNarrative || solution.explanation;
      setIsSpeaking(true);
      playTextToSpeech(textToRead, language, () => setIsSpeaking(false));
    }
  };

  useEffect(() => {
    return () => {
      stopTextToSpeech();
      stopCamera();
    };
  }, []);

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (!solution || !solution.practiceQuestions) return;
    let score = 0;
    solution.practiceQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    setQuizScore(score);
    if (score === solution.practiceQuestions.length) {
      onAwardXp(100, 'Perfect Homework Quiz Score!');
    } else {
      onAwardXp(40, 'Homework Quiz Attempt');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-800/50 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Real-Time Vision Helper
            </span>
            <span className="text-xs text-indigo-200">Grade: {grade} • Language: {language}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Snap Your Homework or Worksheet 📸
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Point your camera or upload any math equation, science diagram, or book question. Aura AI breaks it down step-by-step with interactive hints and audio guidance tailored for <strong className="text-amber-300">{grade}</strong>!
          </p>
        </div>

        {/* Rich Subject List & Manual Enter Box Selector */}
        <div className="w-full md:w-80 bg-slate-900/90 p-3 rounded-2xl border border-slate-700 shadow-xl shrink-0">
          <SubjectSelect
            value={selectedSubject}
            onChange={(s) => setSelectedSubject(s)}
            language={language}
            label="Subject (All Lists + Manual Enter):"
          />
        </div>
      </div>

      {/* Main Workspace Grid: Left Image Capture / Right Interactive Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Camera Feed / File Upload & Sample Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Visual Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden space-y-3">
            {/* Mode Switcher & Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setScanMode('problem')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    scanMode === 'problem'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Single Problem
                </button>
                <button
                  onClick={() => setScanMode('chapter')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    scanMode === 'chapter'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Chapter & Page Scanner
                </button>
              </div>

              {capturedImage && (
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setSolution(null);
                    stopCamera();
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Clear Image
                </button>
              )}
            </div>

            {/* Video Feed / Image Display Area */}
            <div className="relative min-h-[270px] max-h-[360px] bg-slate-950 rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <div className="relative w-full h-full min-h-[270px] flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl" />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Chapter Scanning Frame Overlay */}
                  {scanMode === 'chapter' && (
                    <div className="absolute inset-4 border-2 border-indigo-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3 bg-indigo-950/10 backdrop-blur-[1px]">
                      <div className="flex justify-between text-[10px] text-indigo-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded w-fit">
                        📚 Chapter Target Frame Mode ({cameraFacingMode === 'environment' ? 'Back Camera' : 'Front Cam'})
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse my-auto"></div>
                      <div className="text-center text-xs text-amber-300 font-bold bg-slate-950/80 py-1 px-3 rounded-lg mx-auto border border-amber-400/30">
                        Align textbook page or chapter diagram in box
                      </div>
                    </div>
                  )}

                  {/* Camera Control Bar Over Feed */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 px-3">
                    <button
                      onClick={toggleCameraFacing}
                      title="Switch Camera (Back / Front)"
                      className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 p-2.5 rounded-xl shadow-lg flex items-center gap-1 text-xs font-bold"
                    >
                      <SwitchCamera className="w-4 h-4 text-indigo-400" />
                      <span className="hidden sm:inline">{cameraFacingMode === 'environment' ? 'Back Cam' : 'Front Cam'}</span>
                    </button>

                    <button
                      onClick={captureFrame}
                      className="bg-gradient-to-r from-amber-400 to-indigo-500 hover:brightness-110 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs sm:text-sm scale-105 transition-transform"
                    >
                      <Scan className="w-4 h-4 text-slate-950" />
                      {scanMode === 'chapter' ? 'Scan Chapter Page' : 'Snap Problem'}
                    </button>

                    {isSupported && (
                      <button
                        onClick={toggleVoiceInput}
                        title={isListening ? 'Stop Voice Command' : 'Speak Voice Question'}
                        className={`p-2.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-1 ${
                          isListening
                            ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                            : 'bg-slate-900/90 border-slate-700 text-amber-300 hover:bg-slate-800'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}

                    <button
                      onClick={stopCamera}
                      className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : capturedImage ? (
                <div className="relative w-full h-full">
                  <img src={capturedImage} alt="Homework snap" className="w-full h-auto max-h-[320px] object-contain mx-auto rounded-lg" />
                  {isLoading && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-300 p-4">
                      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="font-bold text-sm text-center">
                        {scanMode === 'chapter' ? 'Aura AI Analyzing Chapter Section...' : 'Aura AI Analyzing Homework...'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Adapting for {grade} • {language}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                    {scanMode === 'chapter' ? <BookOpen className="w-8 h-8 text-indigo-400" /> : <Camera className="w-8 h-8 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {scanMode === 'chapter' ? 'Ready to Scan Textbook Chapter' : 'No Homework Image Loaded'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {scanMode === 'chapter'
                        ? 'Point back camera at chapter headings, formulas, or reading pages.'
                        : 'Snap a photo with webcam or upload a worksheet file.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      onClick={() => startCamera('environment')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                      Back Camera Live
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" /> Upload File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Question Prompt Input with Voice Recognition Button */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Ask question or describe problem by voice/text:
                </label>
                {isSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isListening ? 'Stop Listening' : 'Voice Command 🎙️'}</span>
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isListening
                      ? '🎙️ Listening to your spoken query...'
                      : scanMode === 'chapter'
                      ? 'e.g. Explain section 2 or summarize key vocabulary'
                      : grade === 'KG'
                      ? 'e.g. Help me count the yellow stars!'
                      : 'e.g. Find the value of x or explain step 2'
                  }
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-9"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => analyzeHomework()}
              disabled={!capturedImage || isLoading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                capturedImage && !isLoading
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600 text-slate-950 font-extrabold hover:brightness-110 shadow-amber-500/20 cursor-pointer scale-[1.01]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Analyzing with AI...' : 'Analyze with AI Tutor'}
            </button>

            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Sample Homework Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Try Ready-To-Test Homework Samples:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {sampleImages.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCapturedImage(sample.src);
                    setUserQuery(sample.query);
                    setSelectedSubject(sample.subject);
                    analyzeHomework(sample.src, sample.query);
                  }}
                  className="group bg-slate-950 border border-slate-800 hover:border-amber-400/60 rounded-xl p-2.5 text-left transition-all hover:bg-slate-800/50"
                >
                  <img src={sample.src} alt={sample.title} className="w-full h-20 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                  <p className="text-xs font-bold text-white group-hover:text-amber-300 line-clamp-1">{sample.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sample.subject}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Explanation, Steps, Hints & Practice Quiz (7 cols) */}
        <div className="lg:col-span-7">
          {solution ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-white">
              {/* Solution Header & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {solution.detectedTopic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      Difficulty: {solution.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {solution.problemText || 'Analyzed Homework Solution'}
                  </h3>
                </div>

                {/* Top Action Bar: Audio Speech & Offline Save */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSpeech}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSpeaking
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud 🔊'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (solution && capturedImage) {
                        onSaveOffline({
                          ...solution,
                          id: 'sol-' + Date.now(),
                          image: capturedImage,
                          date: new Date().toLocaleDateString()
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Offline</span>
                  </button>
                </div>
              </div>

              {/* KG Visual Story Metaphor Banner if available */}
              {solution.kgVisualMetaphor && (
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 border-2 border-amber-400/50 rounded-2xl p-4 flex items-start gap-3">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">
                      KG Magic Story Metaphor:
                    </h4>
                    <p className="text-sm font-medium text-amber-100 mt-1 leading-relaxed">
                      "{solution.kgVisualMetaphor}"
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Sub-Tabs */}
              <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
                {solution.kgVisualMetaphor && (
                  <button
                    onClick={() => setActiveTab('metaphor')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'metaphor'
                        ? 'bg-amber-400 text-slate-950 font-extrabold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Story View
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('steps')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'steps'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Step-by-Step ({solution.stepByStep?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'hints'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> Interactive Hints ({solution.hints?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Practice Quiz ({solution.practiceQuestions?.length || 0})
                </button>
              </div>

              {/* TAB CONTENT 1: Step-by-Step Breakdown */}
              {activeTab === 'steps' && (
                <div className="space-y-4">
                  {/* Primary Explanation Overview */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Main Concept Explanation:
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {solution.explanation}
                    </p>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Detailed Solution Sequence:
                    </h4>
                    {solution.stepByStep?.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 hover:border-indigo-500/50 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Key Concepts Tags */}
                  {solution.keyConcepts && solution.keyConcepts.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Key Learning Takeaways:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.keyConcepts.map((concept, i) => (
                          <span
                            key={i}
                            className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs px-2.5 py-1 rounded-lg font-medium"
                          >
                            ✓ {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT 2: Progressive Reveal Hints */}
              {activeTab === 'hints' && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200">
                    💡 <strong>Socratic Hint Mode:</strong> Don't look at the whole solution immediately! Challenge yourself by revealing hints one step at a time.
                  </div>

                  <div className="space-y-3">
                    {solution.hints?.map((hint, idx) => {
                      const isRevealed = idx <= revealedHintIndex;
                      return (
                        <div
                          key={idx}
                          className={`border rounded-xl p-4 transition-all ${
                            isRevealed
                              ? 'bg-slate-950 border-amber-400/40 text-amber-100'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" /> Hint #{idx + 1}
                            </span>
                            {!isRevealed && (
                              <button
                                onClick={() => setRevealedHintIndex(idx)}
                                className="text-xs text-amber-300 font-bold hover:underline"
                              >
                                Reveal Hint
                              </button>
                            )}
                          </div>
                          {isRevealed ? (
                            <p className="text-sm pt-1 leading-relaxed">{hint}</p>
                          ) : (
                            <p className="text-xs italic text-slate-600">Locked hint — click to reveal when stuck.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: Practice Quiz */}
              {activeTab === 'quiz' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between bg-indigo-950/60 border border-indigo-800/60 rounded-xl p-3 text-xs text-indigo-200">
                    <span className="font-semibold">🎯 Reinforce your understanding with instant practice:</span>
                    <span className="font-bold text-amber-300">+100 XP Bonus</span>
                  </div>

                  {solution.practiceQuestions?.map((q, qIdx) => (
                    <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-bold text-white">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          const isSubmitted = quizScore !== null;
                          const isCorrect = q.answer === optIdx;

                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                          if (isSelected && !isSubmitted) {
                            btnStyle = 'bg-indigo-600 border-indigo-500 text-white font-bold';
                          } else if (isSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isSubmitted}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [qIdx]: optIdx
                                }))
                              }
                              className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizScore !== null && (
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 mt-2">
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between">
                    {quizScore !== null ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>You scored {quizScore} / {solution.practiceQuestions?.length || 0}! XP Awarded!</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State / Prompting user */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-4 text-slate-400 min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-2">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Waiting for Homework Image</h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Snap a photo using your webcam or pick one of our sample worksheets on the left. Aura AI will instantly generate step-by-step guidance tailored to <strong className="text-amber-300">{grade}</strong>!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
