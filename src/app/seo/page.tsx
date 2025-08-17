'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BookOpen, Zap, Target, Lightbulb, TrendingUp } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface EducationalContent {
  wordOrigin: string
  funFact: string
  usageExamples: string[]
  pronunciation: string
  dailyQuestions?: {
    question: string;
    answer: string;
    category: string;
    difficulty: string;
  }[];
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
  hints?: {
    level: number;
    title: string;
    description: string;
    badge: string;
    color: string;
    example: string;
    tip: string;
  }[]
  educationalContent?: EducationalContent
  learningTips?: string[]
  relatedWords?: {
    synonyms: string[]
    antonyms: string[]
    similar: string[]
  }
}

export default function SEOPage() {
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)

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
        }
      } catch (error) {
        console.error('Failed to fetch daily data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyData()
  }, [])

  if (loading) {
    return (
      <>
        <Head>
          <title>Wordle Learning Resources - Daily Questions & Analysis | Wordle Hint Pro</title>
          <meta name="description" content="Explore comprehensive Wordle learning resources including daily questions, word analysis, learning challenges, and educational content to improve your vocabulary and puzzle-solving skills." />
          <meta name="keywords" content="wordle learning, wordle questions, wordle analysis, vocabulary building, word games, educational content, daily word challenges" />
          <meta property="og:title" content="Wordle Learning Resources - Daily Questions & Analysis" />
          <meta property="og:description" content="Comprehensive Wordle learning resources with daily questions, word analysis, and educational content." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Wordle Learning Resources" />
          <meta name="twitter:description" content="Daily Wordle questions, analysis, and learning challenges." />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Navigation />
          <main className="pt-20 pb-16">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">Loading learning resources...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Wordle Learning Resources - Daily Questions & Analysis | Wordle Hint Pro</title>
        <meta name="description" content="Explore comprehensive Wordle learning resources including daily questions, word analysis, learning challenges, and educational content to improve your vocabulary and puzzle-solving skills." />
        <meta name="keywords" content="wordle learning, wordle questions, wordle analysis, vocabulary building, word games, educational content, daily word challenges" />
        <meta property="og:title" content="Wordle Learning Resources - Daily Questions & Analysis" />
        <meta property="og:description" content="Comprehensive Wordle learning resources with daily questions, word analysis, and educational content." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wordle Learning Resources" />
        <meta name="twitter:description" content="Daily Wordle questions, analysis, and learning challenges." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Wordle Learning Resources",
            "description": "Comprehensive Wordle learning resources with daily questions, word analysis, and educational content",
            "url": "https://wordle-hint.help/seo",
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What are Wordle learning challenges?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wordle learning challenges include anagram exercises, word building activities, and context usage practice to improve vocabulary and puzzle-solving skills."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does word analysis help with Wordle?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Word analysis provides insights into letter patterns, vowel-consonant distribution, and syllable structure, helping players make more informed guesses."
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
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Wordle Learning Resources
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Master Wordle with our comprehensive learning system featuring daily questions, word analysis, 
                learning challenges, and educational content designed to improve your vocabulary and puzzle-solving skills.
              </p>
              {dailyData?.word && (
                <div className="mt-6 inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-full">
                  <span className="font-semibold">Today&apos;s Word: {dailyData.word}</span>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">6</h3>
                <p className="text-gray-600">Hint Levels</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">5</h3>
                <p className="text-gray-600">Daily Questions</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
                <p className="text-gray-600">Learning Challenges</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily</h3>
                <p className="text-gray-600">Updates</p>
              </div>
            </div>

            {/* Daily Questions Section */}
            {dailyData?.educationalContent?.dailyQuestions && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200 shadow-2xl mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Daily Learning Questions</h2>
                  <p className="text-lg text-gray-600">
                    Test your knowledge about today&apos;s word with these interactive questions designed to improve your vocabulary!
                  </p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Comprehensive Word Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Interactive Learning Challenges</h2>
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

            {/* Educational Content Section */}
            {dailyData?.educationalContent && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-2xl mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Word Learning Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
                      Word Origin & History
                    </h3>
                    <p className="text-gray-700 mb-4">{dailyData.educationalContent.wordOrigin}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Fun Fact:</h4>
                    <p className="text-gray-600">{dailyData.educationalContent.funFact}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Zap className="w-6 h-6 text-indigo-600 mr-2" />
                      Usage & Pronunciation
                    </h3>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Pronunciation:</h4>
                      <p className="text-gray-600 font-mono">{dailyData.educationalContent.pronunciation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Usage Examples:</h4>
                      <ul className="text-gray-600 space-y-1">
                        {dailyData.educationalContent.usageExamples.map((example, index) => (
                          <li key={index} className="text-sm">&ldquo;{example}&rdquo;</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Tips Section */}
            {dailyData?.learningTips && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200 shadow-2xl mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">General Learning Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dailyData.learningTips.map((tip, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Lightbulb className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Words Section */}
            {dailyData?.relatedWords && dailyData.relatedWords.similar.length > 0 && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-200 shadow-2xl mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Vocabulary Expansion</h2>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Words</h3>
                  <div className="flex flex-wrap gap-3">
                    {dailyData.relatedWords.similar.map((word, index) => (
                      <span key={index} className="px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Wordle Skills?</h2>
              <p className="text-xl mb-6 opacity-90">
                Start using our progressive hint system and daily learning resources today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/hints'}
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Today&apos;s Hints
                </button>
                <button 
                  onClick={() => window.location.href = '/game'}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Play Wordle Game
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
} 