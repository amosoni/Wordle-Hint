'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, CheckCircle, XCircle, RefreshCw, Globe } from 'lucide-react'

interface RealHint {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
  tip: string
  isOfficial: boolean
  source: string
}

interface RealHintsData {
  word: string
  wordNumber: number
  date: string
  hints: RealHint[]
  source: string
  isReal: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  officialHintsAvailable: boolean
}

export default function RealHintsPage() {
  const [hintsData, setHintsData] = useState<RealHintsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchRealHints()
  }, [])

  const fetchRealHints = async () => {
    try {
      setLoading(true)
      setError(null)

      // Prefer requesting Cloudflare Worker directly (browser can access the internet)
      const WORKER_URL = 'https://sparkling-cake-35ce.vnvgtktbcx.workers.dev/today'

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        console.log('🌐 Requesting Cloudflare Worker for today\'s data...')
        const resp = await fetch(WORKER_URL, { signal: controller.signal })
        clearTimeout(timer)
        if (resp.ok) {
          const nyt = await resp.json() as Record<string, unknown>
          // Expected fields: solution, id, print_date
          const solution = typeof nyt.solution === 'string' ? nyt.solution : ''
          const wordNumber = typeof nyt.id === 'number' ? nyt.id : Number(nyt.id)
          const dateStr = typeof nyt.print_date === 'string' ? nyt.print_date : new Date().toISOString().slice(0, 10)

          if (solution && solution.length >= 5) {
            const upper = solution.toUpperCase()
            const difficulty: 'easy' | 'medium' | 'hard' = upper.match(/[AEIOU]/g)?.length && (upper.match(/[AEIOU]/g) as RegExpMatchArray).length >= 2 ? 'easy' : 'medium'

            // Generate 6 official-style hints
            const letters = upper.split('')
            const first = letters[0]
            const last = letters[letters.length - 1]
            const uniqueCount = new Set(letters).size
            const containsCommon = ['E','A','R','T','O','N','L','S','I'].some(c => upper.includes(c))

            const hints: RealHint[] = [
              {
                level: 1,
                title: 'Letter Count',
                description: `Today\'s word has ${letters.length} letters.`,
                badge: 'Basic',
                color: 'blue',
                example: `${'_ '.repeat(letters.length).trim()}`,
                tip: 'Start with common vowels or high-frequency consonants.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 2,
                title: 'Starting Letter',
                description: `The word begins with ${first}.`,
                badge: 'Starter',
                color: 'teal',
                example: `${first}${'_ '.repeat(letters.length - 1).trim()}`,
                tip: `Try common English words that start with ${first}.`,
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 3,
                title: 'Ending Letter',
                description: `The word ends with ${last}.`,
                badge: 'Closer',
                color: 'purple',
                example: `${'_ '.repeat(letters.length - 1).trim()}${last}`,
                tip: `Consider common endings like -ED, -ER, -ING.`,
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 4,
                title: 'Common Letters',
                description: containsCommon ? 'Contains high-frequency letters (E/A/R/T/O/N/...).' : 'Does not strongly rely on common letters.',
                badge: 'Frequency',
                color: 'orange',
                example: containsCommon ? 'Examples: REACT, ROAST' : 'Examples: MYTHS, GLYPH',
                tip: 'Adjust your strategy based on letter frequency.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 5,
                title: 'Repeated Letters',
                description: uniqueCount < letters.length ? 'This word contains repeated letters.' : 'This word has no repeated letters.',
                badge: 'Pattern',
                color: 'red',
                example: uniqueCount < letters.length ? 'Example: LETTER has double T.' : 'Example: CRANE has no repeats.',
                tip: 'If repeats exist, avoid wasting position checks.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 6,
                title: 'Difficulty',
                description: `Overall difficulty: ${difficulty.toUpperCase()}.`,
                badge: 'Summary',
                color: 'green',
                example: 'Use 3–4 broad-coverage guesses to narrow down.',
                tip: 'Combine placement patterns and common collocations.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              }
            ]

            const data: RealHintsData = {
              word: upper,
              wordNumber: Number.isFinite(wordNumber) && wordNumber > 0 ? wordNumber : 0,
              date: dateStr,
              hints,
              source: 'Cloudflare Worker (NYT official JSON)',
              isReal: true,
              difficulty,
              officialHintsAvailable: true
            }
            setHintsData(data)
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.warn('Direct Worker request failed, falling back to local API', e)
      }

      // Fallback: local /api/wordle
      console.log('🔍 Fetching real Wordle hints (fallback)...')
      const response = await fetch('/api/wordle?refresh=true')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        console.log('✅ Got hints from fallback local API:', result.data)
        setHintsData(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch hints')
      }
    } catch (err) {
      console.error('❌ Failed to fetch real hints:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const refreshHints = async () => {
    setIsRefreshing(true)
    await fetchRealHints()
    setIsRefreshing(false)
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      teal: 'from-teal-500 to-teal-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      green: 'from-green-500 to-green-600'
    }
    return colorMap[color] || 'from-gray-500 to-gray-600'
  }

  const getColorEmoji = (color: string) => {
    const emojiMap: Record<string, string> = {
      blue: '💡',
      teal: '🔍',
      purple: '🎯',
      orange: '⚡',
      red: '🔥',
      green: '✅'
    }
    return emojiMap[color] || '❓'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Fetching real Wordle hints...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">❌ Failed to load hints</h2>
            <p className="text-sm mb-4">{error}</p>
            <button 
              onClick={refreshHints}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!hintsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No hints available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-blue-600 mr-3" />
              Real Wordle Hints
            </h1>
            <p className="text-lg text-gray-600 mb-4">Connected to official Wordle data via Cloudflare Worker</p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4">
              {hintsData.isReal ? (
                <span className="bg-green-100 text-green-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Real Data
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  Local Fallback
                </span>
              )}
            </div>

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

          {/* Today's Word Info */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Wordle</h2>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 inline-block">
                <div className="text-sm text-gray-600 mb-2">Today&apos;s Word</div>
                <div className="text-6xl font-bold text-blue-600">{hintsData.word}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Word #{hintsData.wordNumber} • {hintsData.date}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Source: {hintsData.source}</p>
                <p>Difficulty: {(hintsData.difficulty || 'medium').toUpperCase()}</p>
                <p>Official Hints: {hintsData.officialHintsAvailable ? '✅ Available' : '❌ Unavailable'}</p>
              </div>
            </div>
          </div>

          {/* Real Hints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hintsData.hints.map((hint, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(hint.color)} rounded-xl flex items-center justify-center text-white`}>
                    <span className="text-lg font-bold">{getColorEmoji(hint.color)}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{hint.badge}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{hint.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{hint.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 font-medium mb-1">Example:</p>
                  <p className="text-xs text-gray-600">{hint.example}</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-medium mb-1">Tip:</p>
                  <p className="text-xs text-gray-600">{hint.tip}</p>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className={hint.isOfficial ? 'text-green-600' : 'text-yellow-600'}>
                    {hint.isOfficial ? '✅ Official-style' : '🔄 Smart-generated'}
                  </span>
                  <span>Level {hint.level}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Data Source Information */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-6 h-6 text-blue-600 mr-3" />
              Data Source
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Authenticity:</span>
                    <span className={hintsData.isReal ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      {hintsData.isReal ? 'Real Data' : 'Local Fallback'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Official Hints:</span>
                    <span className={hintsData.officialHintsAvailable ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      {hintsData.officialHintsAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="text-gray-900 font-medium">{hintsData.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900 font-medium">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Hint Quality</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Hints:</span>
                    <span className="text-gray-900 font-medium">{hintsData.hints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Official-style:</span>
                    <span className="text-green-600 font-medium">{hintsData.hints.filter(h => h.isOfficial).length} / {hintsData.hints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="text-gray-900 font-medium">{(hintsData.difficulty || 'medium').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Length:</span>
                    <span className="text-gray-900 font-medium">{hintsData.word.length} letters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 