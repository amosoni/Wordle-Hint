'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Target, CheckCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface HintData {
  level: number
  title: string
  description: string
  badge: string
  color: string
}

export default function HintsPage() {
  const [dailyData, setDailyData] = useState<{
    word?: string;
    hints?: HintData[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    { level: 1, title: "Vague Hint", description: "A gentle nudge in the right direction", badge: "Level 1", color: "blue" },
    { level: 2, title: "Specific Hint", description: "More targeted guidance for your strategy", badge: "Level 2", color: "purple" },
    { level: 3, title: "Direct Hint", description: "Clear direction when you're really stuck", badge: "Level 3", color: "green" }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'green': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Today&apos;s Wordle Hints
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get progressive hints to help you solve today&apos;s Wordle puzzle. Choose the level of help you need!
            </p>
          </div>

          {/* Hints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {todayHints.map((hint) => (
              <div
                key={hint.level}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
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

          {/* How to Use */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How to Use These Hints</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start with Level 1</h3>
                <p className="text-gray-600">Begin with the gentlest hint to get a sense of direction</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress to Level 2</h3>
                <p className="text-gray-600">Get more specific guidance when you need it</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Level 3 Sparingly</h3>
                <p className="text-gray-600">Save the strongest hints for when you&apos;re really stuck</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 