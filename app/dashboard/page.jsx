'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Image as ImageIcon, Zap, History, Settings, LogOut, 
  Crown, ChevronDown, Copy, Check, Sparkles, BarChart3, 
  Clock, FileJson, Loader2, AlertCircle, Palette
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/context/AuthContext';
import VisionModelSelector, { useVisionModelSelection } from '../../components/VisionModelSelector';
import BrandSettings from '../../components/BrandSettings';
import BrandPreview from '../../components/BrandPreview';
import { getVisionUsageStats } from '../../lib/ai/usage';

// Plan badges
const PLAN_BADGES = {
  free: { label: 'Free', color: 'stone', icon: Sparkles },
  lite: { label: 'Lite', color: 'warm', icon: Zap },
  standard: { label: 'Standard', color: 'amber', icon: Zap },
  creator: { label: 'Creator', color: 'earth', icon: Crown },
  business: { label: 'Business', color: 'dark', icon: Crown },
};



const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('analyze');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedBrand, setCopiedBrand] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [fallbackNotification, setFallbackNotification] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [visionUsageStats, setVisionUsageStats] = useState(null);
  
  // Vision model selection hook - Requirements 1.1, 1.2
  const { selectedModel, onModelChange, isLoaded: modelSelectionLoaded } = useVisionModelSelection();
  
  // Check if user is paid (basic, pro, creator, business) - Requirement 1.3
  const isPaidUser = user?.plan && ['basic', 'pro', 'creator', 'business'].includes(user.plan);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Load brand profile on mount - Requirement 3.1
  useEffect(() => {
    if (user?.id && isPaidUser) {
      fetch('/api/brand')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.profile) {
            setBrandProfile(data.profile);
          }
        })
        .catch(() => {
          // Silently fail - brand profile is optional
        });
    }
  }, [user?.id, isPaidUser]);

  // Load vision usage stats - Requirement 5.4
  useEffect(() => {
    if (user?.id) {
      const stats = getVisionUsageStats(user.id, user.plan || 'free');
      setVisionUsageStats(stats);
    }
  }, [user?.id, user?.plan, analysisResult]);


  const planBadge = PLAN_BADGES[user?.plan || 'free'];
  const PlanIcon = planBadge.icon;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Requirement 1.2, 1.5, 3.1: Analyze image using vision API
  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFallbackNotification(null);
    
    try {
      const response = await fetch('/api/ai/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage,
          modelId: selectedModel,
          userId: user?.id || 'anonymous',
          userTier: user?.plan || 'free',
          brandProfile: brandProfile,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle usage limit errors - Requirement 1.5
        if (data.alternatives && data.alternatives.length > 0) {
          setAnalysisError(`${data.error}. Try: ${data.alternatives.slice(0, 3).join(', ')}`);
        } else {
          setAnalysisError(data.error || 'Analysis failed');
        }
        setIsAnalyzing(false);
        return;
      }
      
      // Check for fallback notification - Requirement 1.5
      if (data.fallbackUsed) {
        setFallbackNotification(`Model unavailable. Used ${data.modelUsed || 'default model'} instead.`);
      }
      
      setAnalysisResult(data.result);
      
      // Refresh usage stats after analysis
      if (user?.id) {
        const stats = getVisionUsageStats(user.id, user.plan || 'free');
        setVisionUsageStats(stats);
      }
    } catch (error) {
      setAnalysisError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyPrompt = () => {
    if (analysisResult?.prompt) {
      navigator.clipboard.writeText(analysisResult.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Copy brand-adjusted prompt - Requirement 3.4
  const copyBrandPrompt = () => {
    if (analysisResult?.brandAdjustedPrompt) {
      navigator.clipboard.writeText(analysisResult.brandAdjustedPrompt);
      setCopiedBrand(true);
      setTimeout(() => setCopiedBrand(false), 2000);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setFallbackNotification(null);
  };

  // Usage stats (mock data)
  const usageStats = {
    today: user?.usageToday || 0,
    month: user?.usageMonth || 0,
    limit: user?.plan === 'free' ? 10 : user?.plan === 'lite' ? 50 : user?.plan === 'standard' ? 100 : user?.plan === 'creator' ? 200 : 'Unlimited',
    dailyLimit: user?.plan === 'free' ? 3 : 'Unlimited',
  };

  const badgeColors = {
    stone: 'from-stone-700 to-stone-900',
    warm: 'from-stone-600 to-stone-800',
    amber: 'from-amber-600 to-amber-800',
    earth: 'from-amber-700 to-stone-900',
    dark: 'from-stone-800 to-stone-950',
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-stone-900/50 border-r border-stone-800 p-6 hidden lg:flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
            <Zap size={20} />
          </div>
          <span className="font-bold text-xl">VIMA</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'analyze', label: 'Analyze', icon: ImageIcon },
            { id: 'history', label: 'History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-amber-600 text-white' 
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          {/* Plan Badge */}
          <Link 
            href="/pricing" 
            className={`block p-4 rounded-xl bg-gradient-to-r ${badgeColors[planBadge.color]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <PlanIcon size={16} />
              <span className="font-bold">{planBadge.label} Plan</span>
            </div>
            <p className="text-sm text-white/60">
              {user?.plan === 'free' ? 'Upgrade for more' : 'Manage subscription'}
            </p>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Sign out
          </button>
        </div>
      </aside>


      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/" className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </Link>
            </div>

            <h1 className="text-xl font-bold hidden lg:block">
              {activeTab === 'analyze' && 'Analyze Image'}
              {activeTab === 'history' && 'Analysis History'}
              {activeTab === 'settings' && 'Settings'}
            </h1>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-stone-800/50 hover:bg-stone-800 rounded-xl px-4 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block">{user?.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl"
                  >
                    <div className="p-4 border-b border-stone-800">
                      <p className="font-bold">{user?.name}</p>
                      <p className="text-sm text-stone-400">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/pricing" className="block px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors">
                        Upgrade Plan
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-800 text-red-400 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex border-b border-stone-800 px-4">
          {[
            { id: 'analyze', label: 'Analyze', icon: ImageIcon },
            { id: 'history', label: 'History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === item.id 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-stone-500'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'analyze' && (
            <div className="max-w-5xl mx-auto">
              {/* Usage Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Today', value: usageStats.today, limit: usageStats.dailyLimit, icon: Clock },
                  { label: 'This Month', value: usageStats.month, limit: usageStats.limit, icon: BarChart3 },
                  { label: 'Plan', value: planBadge.label, icon: PlanIcon },
                  { label: 'Credits', value: user?.credits || 0, icon: Sparkles },
                ].map((stat, index) => (
                  <div key={index} className="bg-stone-900/50 rounded-2xl p-4 border border-stone-800">
                    <div className="flex items-center gap-2 text-stone-400 mb-2">
                      <stat.icon size={16} />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {stat.value}
                      {stat.limit && <span className="text-sm font-normal text-stone-500">/{stat.limit}</span>}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vision Model Selector - Requirements 1.1, 1.3 */}
              {isPaidUser && modelSelectionLoaded && (
                <div className="mb-6 bg-stone-900/50 rounded-2xl p-4 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-400 mb-2">
                      <Zap size={16} />
                      <span className="text-sm font-medium">Vision Model</span>
                    </div>
                  </div>
                  <VisionModelSelector
                    selectedModel={selectedModel}
                    onModelChange={onModelChange}
                    userTier={user?.plan || 'free'}
                    disabled={isAnalyzing}
                  />
                </div>
              )}

              {/* Error Message Display */}
              {analysisError && (
                <div className="mb-6 bg-red-900/30 border border-red-700 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-300 font-medium">Analysis Error</p>
                    <p className="text-red-400 text-sm mt-1">{analysisError}</p>
                  </div>
                </div>
              )}

              {/* Fallback Notification - Requirement 1.5 */}
              {fallbackNotification && (
                <div className="mb-6 bg-amber-900/30 border border-amber-700 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-amber-300 font-medium">Model Fallback</p>
                    <p className="text-amber-400 text-sm mt-1">{fallbackNotification}</p>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {!uploadedImage ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-colors ${
                    dragActive 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-stone-700 hover:border-stone-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center">
                    <Upload size={36} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Drop your image here</h3>
                  <p className="text-stone-400 mb-6">
                    or click to browse from your computer
                  </p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-colors"
                  >
                    Select Image
                  </button>
                  
                  <p className="text-stone-500 text-sm mt-6">
                    Supports: JPG, PNG, WebP • Max: {user?.plan === 'free' ? '1080p' : '4K+'}
                  </p>
                </motion.div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Image Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-stone-900/50 rounded-3xl p-6 border border-stone-800"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Uploaded Image</h3>
                      <button
                        onClick={resetAnalysis}
                        className="text-stone-400 hover:text-white text-sm"
                      >
                        Change image
                      </button>
                    </div>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full rounded-2xl"
                    />
                    
                    {!analysisResult && (
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="animate-spin" size={24} />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap size={24} />
                            Analyze Image
                          </>
                        )}
                      </button>
                    )}
                  </motion.div>


                  {/* Results */}
                  <AnimatePresence>
                    {analysisResult && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-stone-900/50 rounded-3xl p-6 border border-stone-800"
                      >
                        <div className="flex items-center gap-2 mb-6">
                          <FileJson size={20} className="text-amber-400" />
                          <h3 className="font-bold">Analysis Result</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                          {Object.entries(analysisResult).filter(([key]) => 
                            key !== 'prompt' && key !== 'colorPalette' && key !== 'brandAdjustedPrompt'
                          ).map(([key, value]) => (
                            <div key={key}>
                              <label className="text-xs text-stone-400 uppercase tracking-wider">{key}</label>
                              <p className="text-white mt-1">{value}</p>
                            </div>
                          ))}
                          
                          {/* Color Palette */}
                          <div>
                            <label className="text-xs text-stone-400 uppercase tracking-wider">Color Palette</label>
                            <div className="flex gap-2 mt-2">
                              {analysisResult.colorPalette?.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-10 h-10 rounded-lg"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Brand Color Palette - Requirement 3.4 */}
                          {brandProfile && brandProfile.colorPalette && (
                            <div>
                              <label className="text-xs text-stone-400 uppercase tracking-wider flex items-center gap-2">
                                <Palette size={12} />
                                Your Brand Colors
                              </label>
                              <div className="flex gap-2 mt-2">
                                {brandProfile.colorPalette.map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-10 h-10 rounded-lg border-2 border-amber-500/50"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Original Prompt - Requirement 3.4 */}
                        <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-stone-400 uppercase tracking-wider">
                              {analysisResult.brandAdjustedPrompt ? 'Original Prompt' : 'Generated Prompt'}
                            </label>
                            <button
                              onClick={copyPrompt}
                              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-amber-400 font-mono text-sm leading-relaxed">
                            {analysisResult.prompt}
                          </p>
                        </div>

                        {/* Brand-Adjusted Prompt - Requirement 3.4 */}
                        {analysisResult.brandAdjustedPrompt && (
                          <div className="bg-gradient-to-br from-amber-950/50 to-stone-950 rounded-xl p-4 border border-amber-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={12} />
                                Brand-Adjusted Prompt
                              </label>
                              <button
                                onClick={copyBrandPrompt}
                                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
                              >
                                {copiedBrand ? <Check size={16} /> : <Copy size={16} />}
                                {copiedBrand ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-amber-300 font-mono text-sm leading-relaxed">
                              {analysisResult.brandAdjustedPrompt}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto text-center py-20">
              <History size={64} className="mx-auto text-stone-700 mb-6" />
              <h2 className="text-2xl font-bold mb-2">No analysis history yet</h2>
              <p className="text-stone-400 mb-6">
                Your previous analyses will appear here
              </p>
              <button
                onClick={() => setActiveTab('analyze')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Start Analyzing
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Account Settings */}
              <div className="bg-stone-900/50 rounded-3xl p-6 border border-stone-800 space-y-6">
                <div>
                  <h3 className="font-bold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-stone-400">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full mt-1 bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-stone-400">Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full mt-1 bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-800">
                  <h3 className="font-bold mb-4">Subscription</h3>
                  <div className="flex items-center justify-between p-4 bg-stone-800/50 rounded-xl">
                    <div>
                      <p className="font-bold">{planBadge.label} Plan</p>
                      <p className="text-sm text-stone-400">
                        {user?.plan === 'free' ? 'Free forever' : 'Billed monthly'}
                      </p>
                    </div>
                    <Link
                      href="/pricing"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {user?.plan === 'free' ? 'Upgrade' : 'Manage'}
                    </Link>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-800">
                  <h3 className="font-bold mb-4 text-red-400">Danger Zone</h3>
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Vision Usage Stats - Requirement 5.4 */}
              {visionUsageStats && (
                <div className="bg-stone-900/50 rounded-3xl p-6 border border-stone-800">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={20} className="text-amber-400" />
                    <h3 className="font-bold">Vision Model Usage</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(visionUsageStats).map(([providerKey, stats]) => {
                      const dailyPercent = stats.limits.daily === Infinity 
                        ? 0 
                        : (stats.usage.daily / stats.limits.daily) * 100;
                      const monthlyPercent = stats.limits.monthly === Infinity 
                        ? 0 
                        : (stats.usage.monthly / stats.limits.monthly) * 100;
                      const isApproachingLimit = dailyPercent >= 80 || monthlyPercent >= 80;
                      const isAtLimit = dailyPercent >= 100 || monthlyPercent >= 100;
                      
                      return (
                        <div 
                          key={providerKey} 
                          className={`p-4 rounded-xl border ${
                            isAtLimit 
                              ? 'bg-red-900/20 border-red-700' 
                              : isApproachingLimit 
                                ? 'bg-amber-900/20 border-amber-700' 
                                : 'bg-stone-800/50 border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{stats.name}</span>
                            {isAtLimit && <AlertCircle size={16} className="text-red-400" />}
                            {isApproachingLimit && !isAtLimit && <AlertCircle size={16} className="text-amber-400" />}
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <div className="flex justify-between text-stone-400 mb-1">
                                <span>Daily</span>
                                <span>
                                  {stats.usage.daily}/{stats.limits.daily === Infinity ? '∞' : stats.limits.daily}
                                </span>
                              </div>
                              {stats.limits.daily !== Infinity && (
                                <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      dailyPercent >= 100 ? 'bg-red-500' : dailyPercent >= 80 ? 'bg-amber-500' : 'bg-amber-400'
                                    }`}
                                    style={{ width: `${Math.min(dailyPercent, 100)}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex justify-between text-stone-400 mb-1">
                                <span>Monthly</span>
                                <span>
                                  {stats.usage.monthly}/{stats.limits.monthly === Infinity ? '∞' : stats.limits.monthly}
                                </span>
                              </div>
                              {stats.limits.monthly !== Infinity && (
                                <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      monthlyPercent >= 100 ? 'bg-red-500' : monthlyPercent >= 80 ? 'bg-amber-500' : 'bg-amber-400'
                                    }`}
                                    style={{ width: `${Math.min(monthlyPercent, 100)}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand Profile Settings - Requirements 2.1, 2.5 */}
              <div className="bg-stone-900/50 rounded-3xl p-6 border border-stone-800">
                <div className="flex items-center gap-2 mb-6">
                  <Palette size={20} className="text-amber-400" />
                  <h3 className="font-bold">Brand Profile</h3>
                </div>
                <BrandSettings 
                  userId={user?.id} 
                  userTier={user?.plan || 'free'}
                />
                {/* Brand Preview - shown alongside settings for paid users */}
                {isPaidUser && brandProfile && (
                  <div className="mt-6 pt-6 border-t border-stone-700">
                    <BrandPreview
                      colorPalette={brandProfile.colorPalette}
                      primaryFont={brandProfile.fonts?.primary}
                      secondaryFont={brandProfile.fonts?.secondary}
                      brandName={brandProfile.name}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
