'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, RefreshCw, Copy, Share2, ArrowUp } from 'lucide-react'
import Footer from '@/components/Footer'
import { RealWordleHintsService, RealWordleData } from '@/utils/realWordleHints'

export default function RealHintsPage() {
  const [hintsData, setHintsData] = useState<RealWordleData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toast, setToast] = useState('')
  const [copyOk, setCopyOk] = useState<boolean>(false)

  const [hint1Revealed, setHint1Revealed] = useState(false)
  const [hint2Revealed, setHint2Revealed] = useState(false)
  const [hint3Revealed, setHint3Revealed] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [hintHistory, setHintHistory] = useState<{hint: string, timestamp: Date}[]>([])

  useEffect(() => {
    const fetchHints = async () => {
      try {
        const service = RealWordleHintsService.getInstance()
        const data = await service.getTodayHints()
        setHintsData(data)
      } catch (error) {
        console.error('Failed to fetch hints:', error)
      }
    }

    fetchHints()
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '1' && !hint1Revealed) {
        setHint1Revealed(true)
        addToHintHistory('Hint 1: ' + getProgressiveHint1())
      } else if (event.key === '2' && !hint2Revealed) {
        setHint2Revealed(true)
        addToHintHistory('Hint 2: ' + getProgressiveHint2())
      } else if (event.key === '3' && !hint3Revealed) {
        setHint3Revealed(true)
        addToHintHistory('Hint 3: ' + getProgressiveHint3())
      } else if (event.key === 'a' && !showAnswer) {
        setShowAnswer(true)
        addToHintHistory('Answer: ' + hintsData?.word)
      } else if (event.key === 'r') {
        refreshHints()
      } else if (event.key === 's') {
        toggleStats()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hint1Revealed, hint2Revealed, hint3Revealed, showAnswer, hintsData])

  const refreshHints = async () => {
    setIsRefreshing(true)
    try {
      const service = RealWordleHintsService.getInstance()
      const data = await service.getTodayHints()
      setHintsData(data)
      // Reset hint states when refreshing
          setHint1Revealed(false)
    setHint2Revealed(false)
    setHint3Revealed(false)
    setShowAnswer(false)
      showToast('Hints refreshed successfully!')
    } catch (error) {
      console.error('Failed to refresh hints:', error)
      showToast('Failed to refresh hints')
    } finally {
      setIsRefreshing(false)
    }
  }

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2200)
  }

  const copyWord = async () => {
    if (hintsData?.word) {
      try {
        await navigator.clipboard.writeText(hintsData.word)
        setCopyOk(true)
        showToast('Word copied to clipboard!')
        setTimeout(() => setCopyOk(false), 2000)
      } catch {
        showToast('Failed to copy word')
      }
    }
  }

  const sharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wordle Hints',
          url: window.location.href
        })
      } catch {
        showToast('Failed to share page')
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        showToast('Page URL copied to clipboard!')
      } catch {
        showToast('Failed to copy page URL')
      }
    }
  }

  const addToHintHistory = (hint: string) => {
    setHintHistory(prev => [...prev, { hint, timestamp: new Date() }])
  }

  const toggleStats = () => {
    setShowStats(!showStats)
  }

  const getWordStats = () => {
    if (!hintsData?.word) return null
    const word = hintsData.word.toLowerCase()
    const vowels = word.match(/[aeiou]/g)?.length || 0
    const consonants = word.length - vowels
    const uniqueLetters = new Set(word).size
    return { vowels, consonants, uniqueLetters, length: word.length }
  }

  // Generate progressive hints based on real data
  const getProgressiveHint1 = () => {
    if (!hintsData?.word) return "Loading hint..."
    const word = hintsData.word.toLowerCase()
    if (word.includes('a') || word.includes('e') || word.includes('i') || word.includes('o') || word.includes('u')) {
      return "This word contains common vowels that appear in many English words."
    }
    return "This word follows common English letter patterns."
  }

  const getProgressiveHint2 = () => {
    if (!hintsData?.word) return "Loading hint..."
    const word = hintsData.word.toLowerCase()
    if (word.length === 5) {
      return "This is a 5-letter word, which is the standard Wordle length."
    }
    return "Consider the word length and common letter combinations."
  }

  const getProgressiveHint3 = () => {
    if (!hintsData?.word) return "Loading hint..."
    const word = hintsData.word.toLowerCase()
    const commonEndings = ['ing', 'ed', 'er', 'ly', 's']
    const hasCommonEnding = commonEndings.some(ending => word.endsWith(ending))
    if (hasCommonEnding) {
      return "This word has a common English suffix or ending."
    }
    return "Look for patterns in the letter arrangement."
  }

  if (!hintsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading hints...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" id="top">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Real Wordle Hints</h1>
              <p className="text-lg text-gray-600">Connected to official Wordle data via Cloudflare Worker</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">Keyboard Shortcuts:</p>
                <p className="text-xs text-blue-700">Press <kbd className="px-1 py-0.5 bg-white border rounded text-xs">1</kbd>, <kbd className="px-1 py-0.5 bg-white border rounded text-xs">2</kbd>, <kbd className="px-1 py-0.5 bg-white border rounded text-xs">3</kbd> for hints, <kbd className="px-1 py-0.5 bg-white border rounded text-xs">A</kbd> for answer, <kbd className="px-1 py-0.5 bg-white border rounded text-xs">R</kbd> to refresh, <kbd className="px-1 py-0.5 bg-white border rounded text-xs">S</kbd> for stats</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
              
              {/* Auto-Sync Status */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Sync Status</h2>
                <p className="text-lg text-gray-600 mb-4">Current Analysis: *****</p>
                <p className="text-gray-500">Hints automatically sync with the word being analyzed</p>
              </div>

              {/* Quick actions */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  onClick={copyWord}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" /> {copyOk ? 'Copied' : "Copy Today&apos;s Word"}
                </button>
                <button
                  onClick={toggleStats}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" /> {showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
                <button
                  onClick={sharePage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-3 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>

              {/* Word Statistics */}
              {showStats && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">Word Statistics</h3>
                  {getWordStats() && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{getWordStats()?.length}</div>
                        <div className="text-sm text-gray-600">Letters</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{getWordStats()?.vowels}</div>
                        <div className="text-sm text-gray-600">Vowels</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{getWordStats()?.consonants}</div>
                        <div className="text-sm text-gray-600">Consonants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{getWordStats()?.uniqueLetters}</div>
                        <div className="text-sm text-gray-600">Unique</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Toast */}
              {toast && (
                <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm mb-4">{toast}</div>
              )}

              {/* Refresh Button */}
              <button
                onClick={refreshHints}
                disabled={isRefreshing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Hints'}
              </button>

            </div>

            {/* Real Hints Grid - Dark Theme */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Crack the NYT Wordle Without the Answer</h2>
                <p className="text-blue-200 text-lg">Debug: Data loaded - {hintsData ? 'Yes' : 'No'}, Word: {hintsData?.word ? 'Loaded' : 'Not loaded'}</p>
              </div>

              {/* 3 Progressive Hints Grid - Vertical Stack */}
              <div className="space-y-8 mb-12 max-w-4xl mx-auto">
                {/* Hint 1 */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">*****</div>
                    <h3 className="text-xl font-bold text-white mb-2">Wordle Answer Hint 1</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-blue-100 mb-6 text-lg">
                      {hint1Revealed ? getProgressiveHint1() : "Click to reveal the first hint"}
                    </p>
                    <button 
                      onClick={() => {
                        setHint1Revealed(!hint1Revealed)
                        if (!hint1Revealed) {
                          addToHintHistory('Hint 1: ' + getProgressiveHint1())
                        }
                      }}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {hint1Revealed ? 'Hide Hint' : 'Reveal Hint'}
                    </button>
                  </div>
                </div>

                {/* Hint 2 */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">*****</div>
                    <h3 className="text-xl font-bold text-white mb-2">Wordle Answer Hint 2</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-blue-100 mb-6 text-lg">
                      {hint2Revealed ? getProgressiveHint2() : "Click to reveal the second hint"}
                    </p>
                    <button 
                      onClick={() => {
                        setHint2Revealed(!hint2Revealed)
                        if (!hint2Revealed) {
                          addToHintHistory('Hint 2: ' + getProgressiveHint2())
                        }
                      }}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {hint2Revealed ? 'Hide Hint' : 'See Group'}
                    </button>
                  </div>
                </div>

                {/* Hint 3 - Most Direct */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">*****</div>
                    <h3 className="text-xl font-bold text-white mb-2">Wordle Answer Hint 3</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-blue-100 mb-6 text-lg">
                      {hint3Revealed ? getProgressiveHint3() : "Click to reveal the final hint"}
                    </p>
                    <button 
                      onClick={() => {
                        setHint3Revealed(!hint3Revealed)
                        if (!hint3Revealed) {
                          addToHintHistory('Hint 3: ' + getProgressiveHint3())
                        }
                      }}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {hint3Revealed ? 'Hide Hint' : 'Reveal Hint'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wordle Answer Card - Hidden by default */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Wordle Answer</h3>
                  <p className="text-lg text-blue-100">Click to reveal today&apos;s answer</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 text-center border-2 border-blue-200">
                    <div className="text-6xl font-bold text-gray-800 mb-4 tracking-wider">
                      {showAnswer ? hintsData.word : '*****'}
                    </div>
                    <p className="text-lg text-gray-600 mb-6">Today&apos;s Wordle Answer</p>
                    <button 
                      onClick={() => {
                        setShowAnswer(!showAnswer)
                        if (!showAnswer) {
                          addToHintHistory('Answer: ' + hintsData.word)
                        }
                      }}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>





            {/* Real Hints Grid from API */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Today&apos;s Real Hints</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hintsData.hints.map((hint, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-blue-800">Hint {index + 1}</h3>
                      <span className="text-2xl">💡</span>
                    </div>
                    <p className="text-gray-700 mb-4">{hint.description}</p>
                    <div className="text-xs text-gray-500">
                      <p><strong>Title:</strong> {hint.title}</p>
                      <p><strong>Level:</strong> {hint.level}</p>
                      <p><strong>Type:</strong> {hint.badge}</p>
                      {hint.isOfficial && <p className="text-green-600 font-semibold">✅ Official Hint</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Information */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Word Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Basic Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Word:</span>
                      <span className="text-blue-600 font-mono text-lg font-bold">*****</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Word Number:</span>
                      <span className="text-blue-600 font-mono">#{hintsData.wordNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Date:</span>
                      <span className="text-blue-600">{hintsData.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Difficulty:</span>
                      <span className="text-blue-600 capitalize">{hintsData.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Data Source</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Source:</span>
                      <span className="text-green-600 text-xs">{hintsData.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Real-time:</span>
                      <span className={hintsData.isReal ? 'text-green-600' : 'text-yellow-600'}>
                        {hintsData.isReal ? '✅ Yes' : '⚠️ No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Official Hints:</span>
                      <span className={hintsData.officialHintsAvailable ? 'text-green-600' : 'text-red-600'}>
                        {hintsData.officialHintsAvailable ? '✅ Available' : '❌ Unavailable'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Hints:</span>
                      <span className="text-green-600">{hintsData.hints.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint History */}
            {hintHistory.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hint History</h2>
                <div className="space-y-3">
                  {hintHistory.map((entry, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">{entry.hint}</p>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={() => setHintHistory([])}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
} 