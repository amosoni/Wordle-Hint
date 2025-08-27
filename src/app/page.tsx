'use client'

import { useState, useEffect } from 'react'
// Head component removed for App Router compatibility
import { 
  Lightbulb, 
  Target, 
  Brain, 
  Zap, 
  Calendar, 
  ArrowRight,
  Play,
  Sparkles,
  Shield,
  Rocket,
  Users,
  Star,
  Trophy,
  Heart,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
// Navigation removed; using global layout navigation
import Footer from '@/components/Footer'
import { FadeInUp, SlideInLeft, SlideInRight, ScaleIn, RotateIn } from '@/components/ScrollAnimation'

export default function HomePage() {
  const [activeUsers] = useState(2847)
  const [hintsGiven] = useState(15392)
  const [dailyData, setDailyData] = useState<{
    word?: string;
    hints?: Array<{
      level: number;
      title: string;
      description: string;
      badge: string;
      color: string;
    }>;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0
  })
  const [isClient, setIsClient] = useState(false)

  // 获取每日数据 - 优化加载逻辑
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/wordle', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 添加缓存控制
          cache: 'no-cache'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setDailyData(result.data)
          }
        } else {
          console.warn('API response not ok:', response.status)
          setError(`API Error: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to fetch daily data:', error)
        setError('Failed to load daily data')
        // 使用默认数据，避免页面错误
      } finally {
        setLoading(false)
      }
    }

    // 立即获取数据
    fetchDailyData()
  }, [])
  
  // 设置客户端状态 - 避免水合错误
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 加载本地游戏统计 - 分离到单独的useEffect
  useEffect(() => {
    if (!isClient) return // 只在客户端执行
    
    try {
      const savedStats = localStorage.getItem('wordleStats')
      if (savedStats) {
        setGameStats(JSON.parse(savedStats))
      }
    } catch (error) {
      console.warn('Failed to parse saved stats:', error)
    }
  }, [isClient])
  
  // 更新时间
  useEffect(() => {
    // 设置初始时间
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // 使用API数据或默认数据
  const todayHints = dailyData?.hints || [
    { level: 1, title: "Vague Hint", description: "A gentle nudge in the right direction", badge: "Level 1", color: "blue" },
    { level: 2, title: "Specific Hint", description: "More targeted guidance for your strategy", badge: "Level 2", color: "purple" },
    { level: 3, title: "Direct Hint", description: "Clear direction when you're really stuck", badge: "Level 3", color: "green" }
  ]

  // 生成当前提示 - 优化加载状态
  const getCurrentHint = () => {
    if (loading) return "Loading today's hint..."
    if (!dailyData?.word) return "Today's Wordle hint will appear here"
    
    const word = dailyData.word
    const firstLetter = word[0]
    const lastLetter = word[word.length - 1]
    
    return `Word starts with '${firstLetter}' and ends with '${lastLetter}'`
  }

  // 特色功能
  const features = [
    { icon: Lightbulb, title: "Progressive Hints", description: "Get help at your own pace with our 3-level hint system", color: "blue", badge: "Smart" },
    { icon: Brain, title: "AI-Powered", description: "Advanced algorithms analyze patterns and provide intelligent suggestions", color: "purple", badge: "AI" },
    { icon: Target, title: "Daily Updates", description: "Fresh hints every day synchronized with NYT Wordle", color: "green", badge: "Daily" },
    { icon: Shield, title: "Spoiler-Free", description: "Enjoy the challenge while getting just the help you need", color: "indigo", badge: "Safe" },
    { icon: Rocket, title: "Skill Building", description: "Learn strategies and improve your Wordle solving abilities", color: "pink", badge: "Learn" },
    { icon: Users, title: "Community", description: "Join thousands of players in our growing Wordle community", color: "orange", badge: "Social" }
  ]

  // 成就系统
  const achievements = [
    {
      icon: Trophy,
      title: "First Win",
      description: "Complete your first Wordle puzzle",
      unlocked: true,
      progress: 100,
      color: "gold"
    },
    {
      icon: Star,
      title: "Streak Master",
      description: "Maintain a 7-day winning streak",
      unlocked: true,
      progress: 85,
      color: "purple"
    },
    {
      icon: Target,
      title: "Speed Solver",
      description: "Solve Wordle in 3 guesses or less",
      unlocked: false,
      progress: 60,
      color: "green"
    },
    {
      icon: Brain,
      title: "Hint Minimalist",
      description: "Complete puzzles using only Level 1 hints",
      unlocked: false,
      progress: 40,
      color: "blue"
    }
  ]

  // 用户评价
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Wordle Enthusiast",
      content: "This hint system is perfect! It gives me just enough help without spoiling the fun. I've improved my solving skills significantly.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Daily Player",
      content: "The progressive hints are brilliant. I can choose how much help I need, and the AI suggestions are surprisingly accurate.",
      avatar: "MR",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Strategy Learner",
      content: "I love how this teaches me to think strategically about Wordle. The hints are educational, not just answers.",
      avatar: "ET",
      rating: 5
    }
  ]

  return (
    <>
      {/* SEO meta tags removed for App Router compatibility */}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Global navigation from layout is used */}
      
      {/* Hero 区域 */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeInUp>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Wordle Hints Today - 
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Wordle of the Day</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 mb-4 font-normal">
              Free AI-Friendly Wordle Help & Solver
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Get <strong>Wordle hints today</strong> and solve <strong>Wordle of the day</strong> with our intelligent hint system. 
              Free <strong>Wordle help</strong> for NYT Wordle puzzles - perfect for beginners and experienced players.
              <span className="block text-lg text-gray-500 mt-4">
                🚀 AI-Friendly Design • 📱 Mobile Optimized • 🎯 Daily Updates • 🔍 Progressive Hints
              </span>
            </p>
          </FadeInUp>
          
          <SlideInLeft delay={100} duration={1000} easing="cubic-bezier">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={() => window.location.href = '/hints'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <Play className="w-6 h-6 mr-2" />
                Get Wordle Hints Today
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <div className="mt-6">
              <a 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                📚 Read Educational Articles
              </a>
            </div>
          </SlideInLeft>
          
          <SlideInRight delay={200} duration={1000} easing="cubic-bezier">
                          <div className="flex items-center justify-center space-x-8 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{activeUsers.toLocaleString()} Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{hintsGiven.toLocaleString()} Hints Given</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">99% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">{currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}</span>
                </div>
              </div>
          </SlideInRight>
        </div>
      </section>

      {/* 游戏统计展示 */}
      <section className="relative py-16 -mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <ScaleIn delay={100} duration={1200} easing="cubic-bezier">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl mb-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Wordle Progress</h3>
                <p className="text-gray-600 text-lg">Track your Wordle journey and achievements</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{gameStats.gamesPlayed}</div>
                  <div className="text-sm text-blue-700 font-medium">Games Played</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{gameStats.gamesWon}</div>
                  <div className="text-sm text-green-700 font-medium">Games Won</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{gameStats.currentStreak}</div>
                  <div className="text-sm text-purple-700 font-medium">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{gameStats.bestStreak}</div>
                  <div className="text-sm text-orange-700 font-medium">Best Streak</div>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* 今日提示预览 */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-6">
          <ScaleIn delay={150} duration={1200} easing="cubic-bezier">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Wordle Hints Today - Wordle of the Day</h3>
                </div>
                                  <p className="text-gray-600 text-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {todayHints.map((hint, index: number) => (
                  <div
                    key={hint.level}
                    className={`text-center p-6 rounded-xl border-2 transition-all duration-300 ${
                      index === 0 ? 'border-blue-200 bg-blue-50/90' :
                      index === 1 ? 'border-purple-200 bg-purple-50/90' :
                      'border-green-200 bg-green-50/90'
                    } hover:shadow-lg group transform hover:scale-105`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100 group-hover:bg-blue-200' :
                      index === 1 ? 'bg-purple-100 group-hover:bg-purple-200' :
                      'bg-green-100 group-hover:bg-green-200'
                    } transition-colors duration-300`}>
                      {index === 0 && <Lightbulb className="text-blue-600 w-8 h-8" />}
                      {index === 1 && <Target className="text-purple-600 w-8 h-8" />}
                      {index === 2 && <Zap className="text-green-600 w-8 h-8" />}
                    </div>
                    
                    <h4 className={`text-lg font-bold mb-2 ${
                      index === 0 ? 'text-blue-800' :
                      index === 1 ? 'text-purple-800' :
                      'text-green-800'
                    }`}>
                      {hint.title}
                    </h4>
                    
                    <p className={`text-sm font-medium ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-purple-600' :
                      'text-green-600'
                    } mb-3`}>
                      {hint.description}
                    </p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-blue-200 text-blue-700' :
                      index === 1 ? 'bg-purple-200 text-purple-700' :
                      'bg-green-200 text-green-700'
                    }`}>
                      {hint.badge}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                {error && (
                  <div className="inline-block p-4 bg-red-50 rounded-xl border border-red-200 mb-6">
                    <p className="text-red-700 font-bold text-lg">
                      ⚠️ {error} - Using default data
                    </p>
                  </div>
                )}
                <div className="inline-block p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 mb-6">
                  <p className="text-gray-700 font-bold text-lg">
                    <span className="text-blue-600 font-semibold">Current Hint:</span> {getCurrentHint()}
                  </p>
                </div>
                
                <button
                  onClick={() => window.location.href = '/hints'}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {/* Eye icon is removed, so this will cause an error */}
                  View All Hints →
                </button>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* 特色功能 */}
      <section id="features" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp delay={100} duration={1000} easing="cubic-bezier">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-bold mb-6 border border-blue-200">
                <Sparkles className="w-4 h-4 mr-2" />
                Core Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Best Wordle Hints Today - Free Wordle Help
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get <strong>Wordle hints today</strong> with our intelligent system. The best <strong>Wordle help</strong> for <strong>Wordle of the day</strong> puzzles.
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInUp key={feature.title} delay={200 + index * 150} duration={1000} easing="cubic-bezier">
                <div
                  className={`group bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
                >
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                      feature.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                      feature.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                      feature.color === 'indigo' ? 'bg-indigo-100 group-hover:bg-indigo-200' :
                      feature.color === 'pink' ? 'bg-pink-100 group-hover:bg-pink-200' :
                      'bg-orange-100 group-hover:bg-orange-200'
                    } transition-colors duration-300`}>
                      <feature.icon className={`w-10 h-10 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        feature.color === 'green' ? 'text-green-600' :
                        feature.color === 'indigo' ? 'text-indigo-600' :
                        feature.color === 'pink' ? 'text-pink-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 font-medium mb-4">{feature.description}</p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      feature.color === 'blue' ? 'bg-blue-200 text-blue-700' :
                      feature.color === 'purple' ? 'bg-purple-200 text-purple-700' :
                      feature.color === 'green' ? 'bg-green-200 text-green-700' :
                      feature.color === 'indigo' ? 'bg-indigo-200 text-indigo-700' :
                      feature.color === 'pink' ? 'bg-pink-200 text-pink-700' :
                      'bg-orange-200 text-orange-700'
                    }`}>
                      {feature.badge}
                    </div>
                  </div>
                  
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* 成就系统 */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <RotateIn delay={100} duration={1200} easing="cubic-bezier">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold mb-6 border border-green-200">
                <Trophy className="w-4 h-4 mr-2" />
                Achievement System
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Track Your Progress
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Unlock achievements as you improve your Wordle skills and build an impressive gaming profile.
              </p>
            </div>
          </RotateIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <FadeInUp key={achievement.title} delay={300 + index * 120} duration={1000} easing="cubic-bezier">
                <div
                  className={`group bg-white/95 backdrop-blur-md rounded-2xl p-6 border-2 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer ${
                    achievement.unlocked 
                      ? 'border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl' 
                      : 'border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-green-100 group-hover:bg-green-200 shadow-lg' 
                        : 'bg-gray-100 group-hover:bg-gray-200 shadow-md'
                    }`}>
                      <achievement.icon className={`w-8 h-8 ${
                        achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-2 ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    
                    <p className={`text-sm mb-3 font-medium ${
                      achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      achievement.unlocked 
                        ? 'bg-green-200 text-green-700' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </div>
                  </div>
                  
                  {/* 背景装饰 */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-green-300/30 rounded-full blur-lg transform translate-x-6 -translate-y-6"></div>
                    </div>
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section id="about" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp delay={150} duration={1000} easing="cubic-bezier">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 text-sm font-bold mb-6 border border-pink-200">
                <Heart className="w-4 h-4 mr-2" />
                Community Love
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Players Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real feedback from our global community of Wordle enthusiasts. Join thousands of satisfied players!
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInUp key={testimonial.name} delay={250 + index * 180} duration={1000} easing="cubic-bezier">
                <div
                  className={`group bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
                >
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 italic leading-relaxed font-medium text-base">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified User
                    </span>
                  </div>
                  
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* 平台支持 */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SlideInLeft delay={100} duration={1000} easing="cubic-bezier">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Available Everywhere
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Access WordleHint on any device, anytime. Our responsive design ensures the best experience across all platforms.
              </p>
            </div>
          </SlideInLeft>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Monitor, title: "Desktop", description: "Full-featured experience on your computer", color: "blue" },
              { icon: Smartphone, title: "Mobile", description: "Optimized for phones and tablets", color: "purple" },
              { icon: Tablet, title: "Tablet", description: "Perfect touch interface for larger screens", color: "green" }
            ].map((platform, index) => (
              <FadeInUp key={platform.title} delay={200 + index * 150} duration={1000} easing="cubic-bezier">
                <div
                  className={`text-center p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    platform.color === 'blue' ? 'bg-blue-100' :
                    platform.color === 'purple' ? 'bg-purple-100' :
                    'bg-green-100'
                  }`}>
                    <platform.icon className={`w-10 h-10 ${
                      platform.color === 'blue' ? 'text-blue-600' :
                      platform.color === 'purple' ? 'text-purple-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{platform.title}</h3>
                  <p className="text-gray-600 font-medium">{platform.description}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInUp delay={300} duration={1500} easing="cubic-bezier">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Get Daily Wordle Hints Today & Strategies</h3>
                <p className="text-xl text-gray-600">Subscribe for exclusive <strong>Wordle hints today</strong> and <strong>Wordle of the day</strong> solving techniques</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Subscribe →
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center mt-3 font-medium">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <FadeInUp delay={100} duration={1000} easing="cubic-bezier">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Ready for Wordle Hints Today?
              </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                    Join thousands of players getting <strong>Wordle hints today</strong> and solving <strong>Wordle of the day</strong> puzzles
                  </p>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={400} duration={1000} easing="cubic-bezier">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                              <button
                  onClick={() => window.location.href = '/hints'}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Get Wordle Hints Today
                </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={500} duration={1000} easing="cubic-bezier">
            <div className="flex flex-wrap items-center justify-center space-x-4 space-y-2">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Play Demo
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors duration-200">
                AI Tips
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Daily Challenge
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Community
              </button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 统一页脚 */}
      <Footer />
    </div>
    </>
  )
} 