'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Lightbulb, Target, CheckCircle, History, BookOpen, Zap, Star } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface HintData {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
}

interface HintHistory {
  date: string
  word: string
  level: number
  used: boolean
}

export default function HintsPage() {
  const [dailyData, setDailyData] = useState<{
    word?: string;
    hints?: HintData[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [hintHistory, setHintHistory] = useState<HintHistory[]>([])

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
    
    // Mock hint history data
    setHintHistory([
      { date: '2024-01-15', word: 'BRAVE', level: 1, used: true },
      { date: '2024-01-14', word: 'SMART', level: 2, used: false },
      { date: '2024-01-13', word: 'QUICK', level: 3, used: true },
    ])
  }, [])

  // Use only API data - no local implementation
  const todayWord = dailyData?.word || 'Loading...'
  const todayHints = dailyData?.hints || []

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'green': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleHintSelect = (level: number) => {
    setSelectedLevel(level)
    // Here you would typically unlock the hint or show more details
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading today&apos;s hints...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
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
        <title>Wordle Hint Today - Wordle of the Day Hints | Wordle Hint Pro</title>
        <meta name="description" content="Get today's Wordle hints! Wordle of the day with progressive help system. Wordle hint today for the daily puzzle. Start gentle, get specific when needed, and master Wordle with smart strategies!" />
        <meta name="keywords" content="wordle of the day, wordle hint today, wordle hints, daily Wordle hints, Wordle help, progressive hints, Wordle strategy, Wordle tips, Wordle solver, Wordle puzzle help, Wordle learning, Wordle practice, Wordle challenge, Wordle vocabulary, Wordle brain game, Wordle word game, Wordle daily hints, Wordle assistance, Wordle guidance, Wordle clues, Wordle answers, Wordle solutions, Wordle techniques, Wordle methods, Wordle approach, Wordle skills, Wordle improvement, today's Wordle, Wordle today, Wordle daily, Wordle hint system" />
        <meta name="author" content="Wordle Hint Pro" />
        <meta name="creator" content="Wordle Hint Pro" />
        <meta name="publisher" content="Wordle Hint Pro" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wordle Hint Today - Wordle of the Day Hints" />
        <meta property="og:description" content="Get today's Wordle hints! Wordle of the day with progressive help system. Wordle hint today for the daily puzzle." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wordle-hint-pro.com/hints" />
        <meta property="og:image" content="/hints-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Wordle Hint Pro - Progressive Hint System" />
        <meta property="og:site_name" content="Wordle Hint Pro" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wordle Hint Today - Wordle of the Day Hints" />
        <meta name="twitter:description" content="Get today's Wordle hints! Wordle of the day with progressive help system. Wordle hint today for the daily puzzle." />
        <meta name="twitter:image" content="/hints-og-image.jpg" />
        <meta name="twitter:creator" content="@wordlehintpro" />
        <meta name="twitter:site" content="@wordlehintpro" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://wordle-hint-pro.com/hints" />
        <meta name="category" content="Games" />
        <meta name="classification" content="Educational Game" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="daily" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Wordle Hint Today - Wordle of the Day Hints",
            "description": "Get today's Wordle hints! Wordle of the day with progressive help system. Wordle hint today for the daily puzzle.",
            "url": "https://wordle-hint-pro.com/hints",
            "applicationCategory": "Game",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "Wordle Hint Pro"
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does the progressive hint system work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our progressive hint system offers three levels of help: Level 1 provides gentle nudges, Level 2 gives strategic guidance, and Level 3 offers direct clues when you're really stuck."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are the hints updated daily?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide fresh hints every day for the current Wordle puzzle, ensuring you always have up-to-date assistance."
                  }
                }
              ]
            }
          })}
        </script>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wordle Hint Today
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get today&apos;s Wordle hints! Today&apos;s word: <strong className="text-blue-600">{todayWord}</strong> - Word #{Math.floor((new Date().getTime() - new Date('2021-06-19').getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>

          {/* Hint Strategy Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Hint Strategy Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {todayHints.map((hint) => (
                <div
                  key={hint.level}
                  className={`text-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedLevel === hint.level 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleHintSelect(hint.level)}
                >
                  <div className={`inline-block p-4 bg-gradient-to-r ${getColorClasses(hint.color)} rounded-xl text-white mb-4`}>
                    <span className="text-sm font-medium">{hint.badge}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{hint.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{hint.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 font-medium">Example:</p>
                    <p className="text-sm text-gray-600 italic">&quot;{hint.example}&quot;</p>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-xs text-gray-500">Click to select this hint level</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hint History */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Your Hint History</h2>
              <History className="w-8 h-8 text-gray-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hintHistory.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.word}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.used ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.used ? 'Used' : 'Unused'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{item.date}</span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Level {item.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 交互式提示演示 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Interactive Hint Demo</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Try Our Progressive Hint System</h3>
                  <p className="text-gray-600 mb-4">Experience how our hints work step by step</p>
                  
                  {/* 今日单词显示 */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Today&apos;s Wordle Challenge</p>
                    <div className="grid grid-cols-5 gap-2 justify-center mx-auto" style={{width: 'fit-content'}}>
                      {todayWord.split('').map((letter, index) => (
                        <div key={index} className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600 bg-gray-50">
                          {letter}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Word #{Math.floor((new Date().getTime() - new Date('2021-06-19').getTime()) / (1000 * 60 * 60 * 24))}</p>
                  </div>
                  
                  {/* 提示选择按钮 */}
                  <div className="flex space-x-4 justify-center mb-6">
                    <button 
                      onClick={() => setSelectedLevel(1)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🔵 Level 1 Hint
                    </button>
                    <button 
                      onClick={() => setSelectedLevel(2)}
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🟣 Level 2 Hint
                    </button>
                    <button 
                      onClick={() => setSelectedLevel(3)}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🟢 Level 3 Hint
                    </button>
                  </div>
                  
                  {/* 动态提示显示 */}
                  {selectedLevel && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg animate-fadeIn">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                          selectedLevel === 1 ? 'bg-blue-500' :
                          selectedLevel === 2 ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}>
                          Level {selectedLevel} Hint
                        </span>
                        <button 
                          onClick={() => setSelectedLevel(null)}
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-700 font-medium text-lg mb-3">
                        {todayHints.find(hint => hint.level === selectedLevel)?.example || "Loading hint..."}
                      </p>
                      <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">
                        💡 <strong>Strategy Tip:</strong> {selectedLevel === 1 ? "Start thinking from vowel letters and common consonants" : 
                                  selectedLevel === 2 ? "Focus on letter patterns and word structure" : 
                                  "This is the complete letter position information"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hint Tips and Tricks */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-200 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Pro Tips for Using Hints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Start Small</h3>
                    <p className="text-gray-600 text-sm">Always begin with Level 1 hints. They often give you just enough direction without spoiling the challenge.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Build Strategy</h3>
                    <p className="text-gray-600 text-sm">Use Level 2 hints to develop your approach. Think about word patterns and common letter combinations.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Save the Best</h3>
                    <p className="text-gray-600 text-sm">Reserve Level 3 hints for when you&apos;re truly stuck. They&apos;re powerful but should be used strategically.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Learn Patterns</h3>
                    <p className="text-gray-600 text-sm">Pay attention to the types of hints that help you most. This will improve your future Wordle skills.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 快速行动区域 */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Ready to Play?</h2>
            <p className="text-gray-600 text-lg text-center mb-8">Put your hint knowledge to the test with our enhanced Wordle game!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Practice with Hints</h3>
                <p className="text-sm text-gray-600 mb-4">Use our progressive hint system to improve your skills</p>
                <button 
                  onClick={() => window.location.href = '/game'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Play Game →
                </button>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Online Features</h3>
                <p className="text-sm text-gray-600 mb-4">Explore our online platform and advanced features</p>
                <button 
                  onClick={() => window.location.href = '/online'}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Online →
                </button>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Learn More</h3>
                <p className="text-sm text-gray-600 mb-4">Discover advanced strategies and Wordle techniques</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Go Home →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  )
} 