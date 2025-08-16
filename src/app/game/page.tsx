'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Lightbulb, Target, Clock, CheckCircle, ArrowLeft, Home, Gamepad2, XCircle, Trophy, Star, TrendingUp, Award } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function GamePage() {
  const [dailyData, setDailyData] = useState<{
    word?: string;
    hints?: Array<{
      level: number;
      title: string;
      description: string;
      badge: string;
      color: string;
      example: string;
    }>;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageGuesses: 0
  })
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  
  // 游戏状态
  const [gameBoard, setGameBoard] = useState<string[][]>(Array(6).fill(null).map(() => Array(5).fill('')))
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [targetWord, setTargetWord] = useState('') // 将从API获取真实单词
  const [gameHistory, setGameHistory] = useState<string[]>([])

  useEffect(() => {
    // 获取每日Wordle数据
    const fetchDailyData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/wordle')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setDailyData(result.data)
            setTargetWord(result.data.word) // 设置今日的真实单词
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

    // 加载本地游戏统计
    const savedStats = localStorage.getItem('wordleStats')
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats))
      } catch {
        console.warn('Failed to parse saved stats')
      }
    }

    // 设置初始时间
    setCurrentTime(new Date())

    // 更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // 游戏处理函数
  const handleTileClick = (row: number, col: number) => {
    if (row === currentRow && col < 5) {
      setCurrentCol(col)
    }
  }

  const handleKeyPress = (letter: string) => {
    if (currentCol < 5 && gameStatus === 'playing') {
      const newBoard = [...gameBoard]
      newBoard[currentRow][currentCol] = letter
      setGameBoard(newBoard)
      setCurrentCol(currentCol + 1)
    }
  }

  const handleBackspace = () => {
    if (currentCol > 0) {
      const newBoard = [...gameBoard]
      newBoard[currentRow][currentCol - 1] = ''
      setGameBoard(newBoard)
      setCurrentCol(currentCol - 1)
    }
  }

  const handleEnter = () => {
    if (currentCol === 5) {
      const currentGuess = gameBoard[currentRow].join('')
      if (currentGuess === targetWord) {
        setGameStatus('won')
        // 更新游戏统计
        const newStats = { ...gameStats, gamesWon: gameStats.gamesWon + 1, currentStreak: gameStats.currentStreak + 1 }
        setGameStats(newStats)
        localStorage.setItem('wordleStats', JSON.stringify(newStats))
      } else if (currentRow === 5) {
        setGameStatus('lost')
        // 更新游戏统计
        const newStats = { ...gameStats, currentStreak: 0 }
        setGameStats(newStats)
        localStorage.setItem('wordleStats', JSON.stringify(newStats))
      } else {
        setCurrentRow(currentRow + 1)
        setCurrentCol(0)
      }
      setGameHistory([...gameHistory, currentGuess])
    }
  }

  const resetGame = () => {
    setGameBoard(Array(6).fill(null).map(() => Array(5).fill('')))
    setCurrentRow(0)
    setCurrentCol(0)
    setGameStatus('playing')
    setGameHistory([])
    // 使用今日的真实单词
    if (dailyData?.word) {
      setTargetWord(dailyData.word)
    }
  }

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading today&apos;s Wordle...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <p className="text-red-600 text-xl">Error: {error}</p>
              <p className="text-red-500 mt-2">Failed to load today&apos;s Wordle data</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
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
        <title>Wordle of the Day - Play Today&apos;s Wordle Game | Wordle Hint Pro</title>
        <meta name="description" content="Play today's Wordle! Enhanced interface with statistics tracking and smart hints. Test your skills and master the daily Wordle puzzle." />
        <meta name="keywords" content="play Wordle online, Wordle game, Wordle interface, Wordle statistics, Wordle strategy" />
        <meta name="author" content="Wordle Hint Pro" />
        <meta name="creator" content="Wordle Hint Pro" />
        <meta name="publisher" content="Wordle Hint Pro" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wordle of the Day - Play Today's Wordle Game" />
        <meta property="og:description" content="Play today's Wordle! Enhanced interface with statistics tracking and smart hints." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wordle-hint-pro.com/game" />
        <meta property="og:image" content="/game-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Wordle Hint Pro - Enhanced Online Wordle Game" />
        <meta property="og:site_name" content="Wordle Hint Pro" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wordle of the Day - Play Today's Wordle Game" />
        <meta name="twitter:description" content="Play today's Wordle! Enhanced interface with statistics tracking and smart hints." />
        <meta name="twitter:image" content="/game-og-image.jpg" />
        <meta name="twitter:creator" content="@wordlehintpro" />
        <meta name="twitter:site" content="@wordlehintpro" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://wordle-hint-pro.com/game" />
        <meta name="category" content="Games" />
        <meta name="classification" content="Educational Game" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="1 day" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Wordle of the Day - Play Today&apos;s Wordle Game",
            "description": "Play today's Wordle! Enhanced interface with statistics tracking and smart hints",
            "url": "https://wordle-hint-pro.com/game",
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
            }
          })}
        </script>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 -z-10">
        {/* 多层渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(236,72,153,0.3),transparent_50%)]"></div>
        
        {/* 大型浮动几何图形 */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* 装饰性网格和图案 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* 动态粒子效果 */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-500/60 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-pink-500/60 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      {/* 统一导航栏 */}
      <Navigation />

      <div className="relative z-10 pt-24">
        {/* 顶部导航 */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
              <a
                href="/hints"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Hints
              </a>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}</span>
            </div>
          </div>
        </div>

        {/* 页面标题 */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold mb-6 border border-green-200">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Wordle Game
            </div>
                          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Wordle of the Day
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Play today&apos;s Wordle! Today&apos;s word: <strong className="text-blue-600">{targetWord}</strong> - Word #{Math.floor((new Date().getTime() - new Date('2021-06-19').getTime()) / (1000 * 60 * 60 * 24))}
              </p>
          </div>
        </div>

        {/* 游戏区域 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Wordle Game</h2>
              <p className="text-gray-600 text-lg mb-4">Guess the 5-letter word in 6 attempts</p>
              
              {/* 游戏状态显示 */}
              {gameStatus === 'won' && (
                <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full text-lg font-bold mb-4">
                  🎉 Congratulations! You won in {currentRow + 1} guesses!
                </div>
              )}
              {gameStatus === 'lost' && (
                <div className="inline-flex items-center px-6 py-3 bg-red-100 text-red-800 rounded-full text-lg font-bold mb-4">
                  😔 Game Over! The word was: <span className="ml-2 font-mono">{targetWord}</span>
                </div>
              )}
              {gameStatus === 'playing' && (
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-lg font-bold mb-4">
                  🎯 Attempt {currentRow + 1} of 6
                </div>
              )}
            </div>
            
            {/* 游戏统计 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{gameStats.gamesPlayed}</div>
                <div className="text-sm text-blue-600">Games Played</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%</div>
                <div className="text-sm text-green-600">Win Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{gameStats.currentStreak}</div>
                <div className="text-sm text-purple-600">Current Streak</div>
              </div>
            </div>

            {/* 交互式游戏板 */}
            <div className="space-y-2 mb-8">
              {[...Array(6)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-2">
                  {[...Array(5)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center font-bold text-lg bg-white hover:border-blue-400 transition-all duration-200 cursor-pointer"
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                    >
                      {gameBoard[rowIndex]?.[colIndex] || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* 虚拟键盘 */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Virtual Keyboard</h4>
              <div className="space-y-2">
                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center space-x-1">
                    {row.split('').map((letter) => (
                      <button
                        key={letter}
                        className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-200"
                        onClick={() => handleKeyPress(letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="flex justify-center space-x-2 mt-2">
                  <button
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-200 font-medium"
                    onClick={handleBackspace}
                  >
                    ← Backspace
                  </button>
                  <button
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-200 font-medium"
                    onClick={handleEnter}
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>

            {/* 游戏控制 */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter 5-letter word"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                  maxLength={5}
                />
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200">
                  Submit
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.href = '/hints'}
                  disabled={false}
                  className="btn btn-primary text-lg px-8 py-4 group hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get Hints (3 left)
                </button>
                
                <button 
                  onClick={resetGame}
                  className="px-6 py-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 游戏历史记录 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Game History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Recent Achievements
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">Best Streak</span>
                    <span className="text-lg font-bold text-yellow-600">{gameStats.bestStreak}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Win Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Total Games</span>
                    <span className="text-lg font-bold text-blue-600">{gameStats.gamesPlayed}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Performance Trends
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">Current Streak</span>
                    <span className="text-lg font-bold text-purple-600">{gameStats.currentStreak}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-800">Games Won</span>
                    <span className="text-lg font-bold text-orange-600">{gameStats.gamesWon}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm font-medium text-indigo-800">Avg Guesses</span>
                    <span className="text-lg font-bold text-indigo-600">{gameStats.averageGuesses || '--'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 当前游戏历史 */}
            {gameHistory.length > 0 && (
              <div className="mt-8 bg-white rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Current Game Attempts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameHistory.map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attempt {index + 1}</span>
                      <span className="font-mono text-lg font-bold text-gray-900">{attempt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 游戏说明 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Green Tile</h4>
                <p className="text-sm text-gray-600">Letter is in the correct position</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Yellow Tile</h4>
                <p className="text-sm text-gray-600">Letter is in the word but wrong position</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Gray Tile</h4>
                <p className="text-sm text-gray-600">Letter is not in the word</p>
              </div>
            </div>
          </div>
        </div>

        {/* 游戏策略提示 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pro Tips & Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Starting Words
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">Best Starting Words</p>
                    <p className="text-xs text-yellow-700 mt-1">Words with common letters like E, A, R, T, S</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Vowel Strategy</p>
                    <p className="text-xs text-green-700 mt-1">Start with words containing multiple vowels</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Consonant Mix</p>
                    <p className="text-xs text-blue-700 mt-1">Include common consonants like R, S, T, L, N</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-500" />
                  Advanced Techniques
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">Elimination Strategy</p>
                    <p className="text-xs text-purple-700 mt-1">Use gray tiles to eliminate impossible letters</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-800 font-medium">Position Analysis</p>
                    <p className="text-xs text-indigo-700 mt-1">Pay attention to yellow tile positions</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-800 font-medium">Pattern Recognition</p>
                    <p className="text-xs text-pink-700 mt-1">Look for common word patterns and endings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">Get smart hints to improve your Wordle skills without spoiling the fun!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => window.location.href = '/hints'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Lightbulb className="w-6 h-6 mr-2" />
                Get Daily Hints
              </button>
              <button
                onClick={() => window.location.href = '/online'}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 统一页脚 */}
      <Footer />
    </div>
    </>
  )
} 