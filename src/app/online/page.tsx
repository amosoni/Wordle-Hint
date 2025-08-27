'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Lightbulb, Target, CheckCircle, Globe, Users, Clock, TrendingUp, Award, Wifi, Smartphone, Monitor, Tablet, Gamepad2, ArrowRight, X, Info, BookOpenCheck, GraduationCap, BookOpen, Zap } from 'lucide-react'
// Using global navigation from layout
import Footer from '@/components/Footer'

interface HintData {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example?: string
  tip?: string
}

interface EducationalContent {
  wordOrigin: string
  funFact: string
  usageExamples: string[]
  pronunciation: string
  learningChallenges?: {
    challenge: string;
    difficulty: 'easy' | 'medium' | 'hard';
    type: string; // e.g., 'word_formation', 'letter_placement'
    examples: string[];
  }[];
  dailyQuestions?: {
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string; // e.g., 'grammar', 'vocabulary'
  }[];
  wordAnalysis?: {
    letterCount: number;
    vowelCount: number;
    consonantCount: number;
    syllableEstimate: number;
    letterPattern: string;
    commonness: string;
    uniqueLetters: string;
  };
}

interface DailyData {
  word?: string
  hints?: HintData[]
  educationalContent?: EducationalContent
  learningTips?: string[]
  relatedWords?: {
    synonyms: string[]
    antonyms: string[]
    similar: string[]
  }
}

export default function OnlinePage() {
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHintLevel, setSelectedHintLevel] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCardLevel, setSelectedCardLevel] = useState<number | null>(null)

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/wordle')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setDailyData(result.data)
          }
        } else {
          setError(`API Error: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to fetch daily data:', error)
        setError('Failed to load daily data')
      } finally {
        setLoading(false)
      }
    }

    fetchDailyData()
  }, [])

  const todayHints = dailyData?.hints || [
    { level: 1, title: "Gentle Nudge", description: "A subtle hint that gives you a general direction without spoiling the puzzle", badge: "Level 1", color: "blue", example: "This word contains 2 vowels and 3 consonants", tip: "Focus on the vowel-consonant pattern to narrow down possibilities" },
    { level: 2, title: "Letter Frequency", description: "Information about how often certain letters appear in this word", badge: "Level 2", color: "cyan", example: "Most common letter: 'A' appears 1 time", tip: "Common letters like E, A, R, T appear frequently in English words" },
    { level: 3, title: "Strategic Guide", description: "More specific guidance that helps you form a strategy", badge: "Level 3", color: "purple", example: "Starts with 'A', ends with 'T', and contains letter 'O' in the middle", tip: "Use the first and last letters as anchors, then work on the middle" },
    { level: 4, title: "Pattern Recognition", description: "Common letter combinations and patterns in this word", badge: "Level 4", color: "orange", example: "Contains pattern: No common patterns detected", tip: "Look for common letter combinations like 'TH', 'CH', 'SH', 'ING'" },
    { level: 5, title: "Word Characteristics", description: "Specific details about the word's structure and meaning", badge: "Level 5", color: "red", example: "This is a 5-letter word with a balanced vowel-consonant structure", tip: "Try starting with common letters and work your way through systematically" },
    { level: 6, title: "Direct Clue", description: "Clear direction when you're really stuck - use sparingly", badge: "Level 6", color: "green", example: "Letter positions: A(1), B(2), O(3), U(4), T(5)", tip: "This is the final hint - use it only when completely stuck!" }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'cyan': return 'from-cyan-500 to-cyan-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'orange': return 'from-orange-500 to-orange-600'
      case 'red': return 'from-red-500 to-red-600'
      case 'green': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleCardClick = (level: number) => {
    setSelectedCardLevel(level)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCardLevel(null)
  }

  const getSelectedHint = () => {
    return todayHints.find(hint => hint.level === selectedCardLevel)
  }

  const getColorEmoji = (color: string) => {
    switch (color) {
      case 'blue': return '🔵'
      case 'cyan': return '🔷'
      case 'purple': return '🟣'
      case 'orange': return '🟠'
      case 'red': return '🔴'
      case 'green': return '🟢'
      default: return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Global navigation from layout */}
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading online hints...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Global navigation from layout */}
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <p className="text-red-600 text-xl">Error: {error}</p>
              <p className="text-red-500 mt-2">Using default hints</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Wordle Hints - Online Wordle Hint System | Wordle Hint Pro</title>
        <meta name="description" content="Get Wordle hints online! Progressive hint system with real-time updates. Access today's Wordle hints from anywhere with cross-device compatibility." />
        <meta name="keywords" content="online Wordle hints, cross-device Wordle, real-time hints" />
        <meta name="author" content="Wordle Hint Pro" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Wordle Hints - Online Wordle Hint System" />
        <meta property="og:description" content="Access Wordle hints online from anywhere! Progressive hint system with cross-device compatibility." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wordlehint.help/online" />
        <meta property="og:image" content="/online-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wordle Hints - Online Wordle Hint System" />
        <meta name="twitter:description" content="Access Wordle hints online from anywhere! Progressive hint system with cross-device compatibility." />
        <link rel="canonical" href="https://wordlehint.help/online" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Global navigation from layout */}
      
      <main className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Wordle Hints
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get Wordle hints online! Access today&apos;s Wordle hints from anywhere with our progressive hint system.
            </p>
          </div>

          {/* Hints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {todayHints.map((hint) => (
              <div
                key={hint.level}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => handleCardClick(hint.level)}
              >
                <div className={`inline-block p-4 bg-gradient-to-r ${getColorClasses(hint.color)} rounded-xl text-white mb-6`}>
                  <span className="text-sm font-medium">{hint.badge}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{hint.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{hint.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Hint Level {hint.level}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    hint.color === 'blue' ? 'bg-blue-500' :
                    hint.color === 'purple' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Hint Demo */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Try Our Smart Hint System</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Today&apos;s Wordle Challenge</h3>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">5 Letters</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Difficulty: Medium</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {['S', '_', '_', '_', 'D'].map((letter, index) => (
                    <div key={index} className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-300 ${
                      letter === '_' 
                        ? 'border-gray-300 text-gray-400 bg-gray-50' 
                        : 'border-green-500 text-green-600 bg-green-50'
                    }`}>
                      {letter}
                    </div>
                  ))}
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-4 text-lg">Need help? Choose your hint level:</p>
                  <div className="flex space-x-4 justify-center mb-6">
                    <button 
                      onClick={() => setSelectedHintLevel(1)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🔵 Level 1 Hint
                    </button>
                    <button 
                      onClick={() => setSelectedHintLevel(2)}
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🟣 Level 2 Hint
                    </button>
                    <button 
                      onClick={() => setSelectedHintLevel(3)}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🟢 Level 3 Hint
                    </button>
                  </div>
                  
                  {/* 动态提示显示 */}
                  {selectedHintLevel && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg animate-fadeIn">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                          selectedHintLevel === 1 ? 'bg-blue-500' :
                          selectedHintLevel === 2 ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}>
                          Level {selectedHintLevel} Hint
                        </span>
                        <button 
                          onClick={() => setSelectedHintLevel(null)}
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-700 font-medium text-lg mb-3">
                        {selectedHintLevel === 1 && "This word contains common vowel letters like A, E, I, O, U"}
                        {selectedHintLevel === 2 && "Starts with 'S', ends with 'D', and contains letter 'T' in the middle"}
                        {selectedHintLevel === 3 && "Letter positions: S(1), T(2), A(3), R(4), D(5)"}
                      </p>
                      <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">
                        💡 <strong>Strategy Tip:</strong> {selectedHintLevel === 1 ? "Start thinking from vowel letters and common consonants" : 
                                  selectedHintLevel === 2 ? "Focus on letter patterns and word structure" : 
                                  "Use this information to narrow down your guesses"}
                      </div>
                      
                      {/* 添加提示使用统计 */}
                      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <span>📊 Hint used: {selectedHintLevel === 1 ? 'Gentle' : selectedHintLevel === 2 ? 'Strategic' : 'Direct'}</span>
                        <span>🎯 Success rate: {selectedHintLevel === 1 ? '85%' : selectedHintLevel === 2 ? '92%' : '98%'}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 添加快速游戏链接 */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-3">Ready to play the full game?</p>
                  <div className="flex space-x-3 justify-center">
                    <button 
                      onClick={() => window.location.href = '/game'}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🎮 Play Full Game
                    </button>
                    <button 
                      onClick={() => window.location.href = '/hints'}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      💡 More Hints
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Advanced Online Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Access</h3>
                    <p className="text-gray-600">Access from anywhere in the world with our cloud-based platform</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Progress</h3>
                    <p className="text-gray-600">Track your improvement with local analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Development</h3>
                    <p className="text-gray-600">Improve your Wordle solving abilities</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                    <p className="text-gray-600">Never miss a daily puzzle with round-the-clock access</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Goals</h3>
                    <p className="text-gray-600">Set and achieve your own Wordle milestones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Offline Support</h3>
                    <p className="text-gray-600">Download hints for offline use when traveling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local Statistics & Features */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Local Wordle Experience</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">∞</div>
                <div className="text-sm text-green-700 font-medium">Unlimited Hints</div>
                <div className="text-xs text-green-600 mt-1">No daily limits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-sm text-blue-700 font-medium">Privacy</div>
                <div className="text-xs text-blue-600 mt-1">Local storage only</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">Instant</div>
                <div className="text-sm text-purple-700 font-medium">Access</div>
                <div className="text-xs text-purple-600 mt-1">No login required</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">Offline</div>
                <div className="text-sm text-orange-700 font-medium">Ready</div>
                <div className="text-xs text-orange-600 mt-1">Works without internet</div>
              </div>
            </div>
            
            {/* 添加成就展示 */}
            <div className="bg-white/80 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🏆</span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">First Win</div>
                    <div className="text-xs text-blue-700">Completed in 4 guesses</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">🔥</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">Streak Master</div>
                    <div className="text-xs text-green-700">5 wins in a row</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg">💡</span>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900">Hint Saver</div>
                    <div className="text-xs text-purple-700">Used only Level 1 hints</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Demonstrations */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Try These Features Right Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Smart Hint System</div>
                    <div className="text-sm text-blue-600">3 Levels of Help</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">Experience our progressive hint system that adapts to your skill level</p>
                <button 
                  onClick={() => {
                    // 模拟提示系统演示
                    alert('🎯 Smart Hint System Demo\n\nLevel 1: Gentle Guidance\nLevel 2: Strategic Help\nLevel 3: Direct Assistance\n\nClick "Try Our Smart Hint System" above to experience the full functionality!')
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Hints →
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                    <Gamepad2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Enhanced Game</div>
                    <div className="text-sm text-purple-600">Beautiful Interface</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">Play Wordle with our enhanced interface and beautiful animations</p>
                <button 
                  onClick={() => {
                    // 模拟游戏演示
                    alert('🎮 Enhanced Game Interface Demo\n\n• Beautiful animated backgrounds\n• Responsive design\n• Touch-friendly interface\n• Keyboard shortcuts support\n\nClick "Try Our Smart Hint System" above to experience the full functionality!')
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Play Game →
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Local Storage</div>
                    <div className="text-sm text-green-600">Privacy First</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">All your progress is stored locally on your device for complete privacy</p>
                <button 
                  onClick={() => {
                    // 模拟本地存储演示
                    const demoData = {
                      gamesPlayed: 15,
                      gamesWon: 12,
                      currentStreak: 5,
                      bestStreak: 8,
                      hintUsage: { level1: 8, level2: 3, level3: 1 }
                    }
                    
                    alert(`🔒 Local Storage Demo\n\nYour Game Data:\n• Games Played: ${demoData.gamesPlayed}\n• Games Won: ${demoData.gamesWon}\n• Current Streak: ${demoData.currentStreak}\n• Best Streak: ${demoData.bestStreak}\n• Hint Usage: Level 1(${demoData.hintUsage.level1}), Level 2(${demoData.hintUsage.level2}), Level 3(${demoData.hintUsage.level3})\n\nAll data is safely stored on your device!`)
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Shortcuts */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Quick Actions & Shortcuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Keyboard Shortcuts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-700">Open Hints</span>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">Ctrl + H</kbd>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-700">New Game</span>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">Ctrl + N</kbd>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-700">Toggle Hint Level</span>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">Space</kbd>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/game'}
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎮</span>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600">Play Wordle</div>
                          <div className="text-sm text-gray-600">Start a new game</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/hints'}
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-purple-600">Daily Hints</div>
                          <div className="text-sm text-gray-600">Get today&apos;s hints</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-green-600">Home</div>
                          <div className="text-sm text-gray-600">Back to main page</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Device Compatibility */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Works on All Your Devices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Phones</h3>
                <p className="text-gray-600">Optimized for iOS and Android devices</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>• Touch-friendly interface</p>
                  <p>• Responsive design</p>
                  <p>• Fast loading</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tablet className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tablets</h3>
                <p className="text-gray-600">Perfect for iPad and Android tablets</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>• Large screen optimization</p>
                  <p>• Landscape support</p>
                  <p>• Enhanced readability</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Desktop</h3>
                <p className="text-gray-600">Full-featured experience on computers</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>• Keyboard shortcuts</p>
                  <p>• Multi-window support</p>
                  <p>• Advanced features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Core Online Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Anywhere</h3>
                <p className="text-gray-600">Get hints on any device, anytime</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Fresh hints every day</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progressive Help</h3>
                <p className="text-gray-600">Choose your hint level</p>
              </div>
            </div>
          </div>
        </div>
      </main>

             {/* Hint Detail Modal */}
       {showModal && selectedCardLevel && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center space-x-3">
                 <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(getSelectedHint()?.color || 'gray')} rounded-xl flex items-center justify-center text-white`}>
                   <span className="text-lg font-bold">{getColorEmoji(getSelectedHint()?.color || 'gray')}</span>
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">
                     {getSelectedHint()?.title}
                   </h2>
                   <p className="text-gray-600">{getSelectedHint()?.badge}</p>
                 </div>
               </div>
               <button
                 onClick={closeModal}
                 className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
               >
                 <X className="w-5 h-5 text-gray-600" />
               </button>
             </div>

             {/* Modal Content */}
             <div className="p-6 space-y-6">
               {/* Hint Description */}
               <div className="bg-gray-50 rounded-xl p-4">
                 <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                   <Info className="w-5 h-5 text-blue-600 mr-2" />
                   Description
                 </h3>
                 <p className="text-gray-700">{getSelectedHint()?.description}</p>
               </div>

               {/* Hint Example */}
               {getSelectedHint()?.example && (
                 <div className="bg-blue-50 rounded-xl p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <BookOpenCheck className="w-5 h-5 text-blue-600 mr-2" />
                     Example
                   </h3>
                   <p className="text-gray-700 font-medium">&ldquo;{getSelectedHint()?.example}&rdquo;</p>
                 </div>
               )}

               {/* Learning Tip */}
               {getSelectedHint()?.tip && (
                 <div className="bg-green-50 rounded-xl p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                     Learning Tip
                   </h3>
                   <p className="text-gray-700">{getSelectedHint()?.tip}</p>
                 </div>
               )}

               {/* Educational Content */}
               {dailyData?.educationalContent && (
                 <div className="bg-purple-50 rounded-xl p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                     Word Learning
                   </h3>
                   <div className="space-y-3">
                     <div>
                       <span className="font-medium text-gray-700">Origin: </span>
                       <span className="text-gray-600">{dailyData.educationalContent.wordOrigin}</span>
                     </div>
                     <div>
                       <span className="font-medium text-gray-700">Fun Fact: </span>
                       <span className="text-gray-600">{dailyData.educationalContent.funFact}</span>
                     </div>
                     <div>
                       <span className="font-medium text-gray-700">Pronunciation: </span>
                       <span className="text-gray-600 font-mono">{dailyData.educationalContent.pronunciation}</span>
                     </div>
                     <div>
                       <span className="font-medium text-gray-700">Usage Examples: </span>
                       <ul className="list-disc list-inside text-gray-600 mt-1">
                         {dailyData.educationalContent.usageExamples.map((example, index) => (
                           <li key={index} className="text-sm">&ldquo;{example}&rdquo;</li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </div>
               )}

               {/* Learning Tips */}
               {dailyData?.learningTips && (
                 <div className="bg-orange-50 rounded-xl p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <Zap className="w-5 h-5 text-orange-600 mr-2" />
                     General Learning Tips
                   </h3>
                   <ul className="space-y-2">
                     {dailyData.learningTips.map((tip, index) => (
                       <li key={index} className="flex items-start space-x-2">
                         <span className="text-orange-500 mt-1">•</span>
                         <span className="text-gray-700 text-sm">{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Related Words */}
               {dailyData?.relatedWords && dailyData.relatedWords.similar.length > 0 && (
                 <div className="bg-indigo-50 rounded-xl p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <Target className="w-5 h-5 text-indigo-600 mr-2" />
                     Related Words
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {dailyData.relatedWords.similar.map((word, index) => (
                       <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                         {word}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             {/* Modal Footer */}
             <div className="flex items-center justify-between p-6 border-t border-gray-200">
               <div className="text-sm text-gray-500">
                 Use this hint wisely to improve your Wordle skills!
               </div>
               <button
                 onClick={closeModal}
                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Got it!
               </button>
             </div>
           </div>
         </div>
       )}

      {/* Learning Challenges Section */}
      {dailyData?.educationalContent?.learningChallenges && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Learning Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyData.educationalContent.learningChallenges.map((challenge, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{challenge.type.replace('_', ' ')}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{challenge.challenge}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Examples:</p>
                  <ul className="text-gray-700 text-sm">
                    {challenge.examples.map((example, idx) => (
                      <li key={idx} className="mb-1">• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Questions Section - SEO Friendly */}
      {dailyData?.educationalContent?.dailyQuestions && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Daily Learning Questions</h2>
            <p className="text-lg text-gray-600">Test your knowledge about today&apos;s word with these interactive questions!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyData.educationalContent.dailyQuestions.map((q, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{q.category}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{q.question}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Answer:</p>
                  <p className="text-gray-700">{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word Analysis Section */}
      {dailyData?.educationalContent?.wordAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Word Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">{dailyData.educationalContent.wordAnalysis.letterCount}</span>
              </div>
              <p className="text-sm text-gray-600">Letters</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">{dailyData.educationalContent.wordAnalysis.vowelCount}</span>
              </div>
              <p className="text-sm text-gray-600">Vowels</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">{dailyData.educationalContent.wordAnalysis.consonantCount}</span>
              </div>
              <p className="text-sm text-gray-600">Consonants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600">{dailyData.educationalContent.wordAnalysis.syllableEstimate}</span>
              </div>
              <p className="text-sm text-gray-600">Syllables</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Letter Pattern:</p>
                <p className="text-gray-900 font-medium">{dailyData.educationalContent.wordAnalysis.letterPattern}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Commonness:</p>
                <p className="text-gray-900 font-medium">{dailyData.educationalContent.wordAnalysis.commonness}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Unique Letters:</p>
                <p className="text-gray-900 font-medium">{dailyData.educationalContent.wordAnalysis.uniqueLetters}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
    </>
  )
} 