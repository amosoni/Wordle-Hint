'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Target, History, BookOpen, Zap, Star, X, Info, GraduationCap } from 'lucide-react'
import Footer from '@/components/Footer'

interface HintData {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
  tip: string
}

interface HintHistory {
  date: string
  word: string
  level: number
  used: boolean
}

interface EducationalContent {
  wordOrigin: string
  funFact: string
  usageExamples: string[]
  pronunciation: string
  dailyQuestions?: string[]
  wordAnalysis?: {
    letterCount: number;
    vowelCount: number;
    consonantCount: number;
    syllableEstimate: number;
    letterPattern: string;
    commonness: string;
    uniqueLetters: number;
  };
  learningChallenges?: {
    challenge: string;
    examples: string[];
    type: string;
    difficulty: string;
  }[];
  relatedTopics?: {
    title: string;
    description: string;
    relatedWords: string[];
  }[];
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

export default function HintsPage() {
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [hintHistory, setHintHistory] = useState<HintHistory[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        setLoading(true)

        // 1) Try Cloudflare Worker directly in browser to get the real solution
        const WORKER_URL = 'https://sparkling-cake-35ce.vnvgtktbcx.workers.dev/today'
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 5000)
        try {
          const resp = await fetch(WORKER_URL, { signal: controller.signal })
          clearTimeout(timer)
          if (resp.ok) {
            const nyt = await resp.json() as Record<string, unknown>
            const solution = typeof nyt.solution === 'string' ? nyt.solution : ''

            if (solution && solution.length >= 5) {
              const upper = solution.toUpperCase()
              const letters = upper.split('')
              const first = letters[0]
              const last = letters[letters.length - 1]
              const uniqueCount = new Set(letters).size
              const containsCommon = ['E','A','R','T','O','N','L','S','I'].some(c => upper.includes(c))

              const hints: HintData[] = [
                {
                  level: 1,
                  title: 'Letter Count',
                  description: `Today\'s word has ${letters.length} letters.`,
                  badge: 'Basic',
                  color: 'blue',
                  example: `${'_ '.repeat(letters.length).trim()}`,
                  tip: 'Start with common vowels or high-frequency consonants.'
                },
                {
                  level: 2,
                  title: 'Starting Letter',
                  description: `The word begins with ${first}.`,
                  badge: 'Starter',
                  color: 'cyan',
                  example: `${first}${'_ '.repeat(letters.length - 1).trim()}`,
                  tip: `Try common words that start with ${first}.`
                },
                {
                  level: 3,
                  title: 'Ending Letter',
                  description: `The word ends with ${last}.`,
                  badge: 'Closer',
                  color: 'purple',
                  example: `${'_ '.repeat(letters.length - 1).trim()}${last}`,
                  tip: 'Consider common endings like -ED, -ER, -ING.'
                },
                {
                  level: 4,
                  title: 'Common Letters',
                  description: containsCommon ? 'Contains high-frequency letters.' : 'Does not strongly rely on common letters.',
                  badge: 'Frequency',
                  color: 'orange',
                  example: containsCommon ? 'Examples: REACT, ROAST' : 'Examples: MYTHS, GLYPH',
                  tip: 'Adjust your strategy based on letter frequency.'
                },
                {
                  level: 5,
                  title: 'Repeated Letters',
                  description: uniqueCount < letters.length ? 'This word contains repeated letters.' : 'No repeated letters.',
                  badge: 'Pattern',
                  color: 'red',
                  example: uniqueCount < letters.length ? 'Example: LETTER has double T.' : 'Example: CRANE has no repeats.',
                  tip: 'If repeats exist, avoid wasting position checks.'
                },
                {
                  level: 6,
                  title: 'Final Nudge',
                  description: 'Use prior feedback to lock positions and eliminate candidates.',
                  badge: 'Summary',
                  color: 'green',
                  example: 'Use 3–4 broad guesses to narrow down.',
                  tip: 'Combine placement patterns and common collocations.'
                }
              ]

              const generated: DailyData = {
                word: upper,
                hints,
                educationalContent: {
                  wordOrigin: 'Auto-generated from official data',
                  funFact: 'Wordle solution fetched via Cloudflare Worker (NYT JSON).',
                  usageExamples: [
                    `${upper} appears in today\'s Wordle.`,
                    `Try building words around ${first} and ${last}.`
                  ],
                  pronunciation: upper.toLowerCase(),
                  dailyQuestions: [
                    `What words start with ${first}?`,
                    `What words end with ${last}?`
                  ]
                },
                learningTips: [
                  'Start with high coverage opener words.',
                  'Use letter frequency to guide guesses.',
                  'Lock positions before exploring alternatives.'
                ],
                relatedWords: { synonyms: [], antonyms: [], similar: [] }
              }

              setDailyData(generated)
              setError(null)
              setLoading(false)
              return
            }
          }
        } catch {
          // fall through to backend API
        }
        
        // 2) Fallback to existing server API with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        })
        const fetchPromise = fetch('/api/wordle')
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setDailyData(result.data)
            setError(null)
          } else {
            setError('Failed to load data')
          }
        } else {
          setError(`API Error: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to fetch daily data:', error)
        if (error instanceof Error && error.message === 'Request timeout') {
          // Try explicit local fallback
          try {
            const localResponse = await fetch('/api/wordle?refresh=false')
            if (localResponse.ok) {
              const localResult = await localResponse.json()
              if (localResult.success) {
                setDailyData(localResult.data)
                setError(null)
                return
              }
            }
          } catch {}
          setError('Request timeout - using cached data')
        } else {
          setError('Failed to load daily data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDailyData()

    // Mock hint history data
    setHintHistory([
      { date: '2024-01-15', word: 'BRAVE', level: 1, used: true },
      { date: '2024-01-14', word: 'SMART', level: 2, used: false },
      { date: '2024-01-13', word: 'HAPPY', level: 3, used: true },
    ])
  }, [])

  const handleHintSelect = (level: number) => {
    setSelectedLevel(level)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedLevel(null)
  }

  const getSelectedHint = () => {
    return dailyData?.hints?.find(hint => hint.level === selectedLevel)
  }

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

  const getColorEmoji = (color: string) => {
    switch (color) {
      case 'blue': return '💡'
      case 'cyan': return '🔍'
      case 'purple': return '🎯'
      case 'orange': return '⚡'
      case 'red': return '🔥'
      case 'green': return '✅'
      default: return '💡'
    }
  }

  // 如果有数据，优先显示内容，即使有错误
  if (dailyData && !loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <main className="pt-20 pb-16">
            <div className="container mx-auto px-4">
              {/* 如果有错误但数据已加载，显示警告横幅 */}
              {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-2">⚠️</span>
                    <div>
                      <p className="font-medium">{error}</p>
                      <p className="text-sm">Showing cached data - hints are still available!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 主要内容 */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Today&apos;s Wordle Hints
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Get progressive help for today&apos;s Wordle puzzle
                </p>
                {dailyData.word && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                    <p className="text-sm text-gray-500 mb-2">Today&apos;s Word</p>
                    <p className="text-3xl font-bold text-blue-600">{dailyData.word}</p>
                  </div>
                )}
              </div>

            {/* Hints Grid */}
            {dailyData?.hints && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {dailyData.hints.map((hint) => (
                  <div
                    key={hint.level}
                    onClick={() => handleHintSelect(hint.level)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(hint.color)} rounded-xl flex items-center justify-center text-white mb-4`}>
                      <span className="text-2xl font-bold">{getColorEmoji(hint.color)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        hint.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        hint.color === 'cyan' ? 'bg-cyan-100 text-cyan-800' :
                        hint.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                        hint.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        hint.color === 'red' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {hint.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hint.title}</h3>
                    <p className="text-gray-600 mb-4">{hint.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      <span>Click to see details</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily Questions Section */}
            {dailyData?.educationalContent?.dailyQuestions && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-2xl mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Daily Learning Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dailyData.educationalContent.dailyQuestions.map((question, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          QUESTION {index + 1}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">Learning</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{question}</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 font-medium mb-2">Think about it:</p>
                        <p className="text-gray-700">Reflect on this question and how it relates to today&apos;s word.</p>
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
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Hint Demo</h2>
                <p className="text-lg text-gray-600">See how our progressive hint system works in action</p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use Hints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-blue-600">1</span>
                      </div>
                      <p className="text-sm text-gray-600">Start with Level 1 for gentle guidance</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-purple-600">2</span>
                      </div>
                      <p className="text-sm text-gray-600">Progress to higher levels if needed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-green-600">3</span>
                      </div>
                      <p className="text-sm text-gray-600">Learn and improve your strategy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(getSelectedHint()?.color || 'gray')} rounded-xl flex items-center justify-center text-white`}>
                  <span className="text-lg font-bold">{getColorEmoji(getSelectedHint()?.color || 'gray')}</span>
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{getSelectedHint()?.title}</h2>
                  <p className="text-gray-600">{getSelectedHint()?.description}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Hint Details */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Info className="w-5 h-5 text-blue-600 mr-2" />
                    Hint Details
                  </h3>
                                          <p className="text-gray-700 font-medium">&ldquo;{getSelectedHint()?.example}&rdquo;</p>
                </div>

                {/* Learning Tip */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                    Learning Tip
                  </h3>
                  <p className="text-gray-700">{getSelectedHint()?.tip}</p>
                </div>

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

        <Footer />
      </div>
    </>
  )
}

// 如果没有数据但有错误，显示错误页面
if (error && !dailyData) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">⚠️ Loading Error</h2>
            <p className="text-sm mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                🔄 Retry
              </button>
              <div className="text-xs text-gray-500">
                <p>• The system is using local fallback data</p>
                <p>• Daily hints are still available</p>
                <p>• Try refreshing the page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 默认加载状态
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading today&apos;s hints...</p>
      </div>
    </div>
  </div>
)
}