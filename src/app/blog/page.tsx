'use client'

import { useState, useEffect } from 'react'
import { Search, ArrowRight } from 'lucide-react'
// Using global navigation from layout
import Footer from '@/components/Footer'

interface Article {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readingTime: string
  difficulty: string
  qualityScore: number
  word: string
  wordNumber: number
  publishedAt: string
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedQuality, setSelectedQuality] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 获取当前应该使用的单词（与real-hints页面保持一致）
        const getGlobalCurrentWord = (dateStr: string): string => {
          const dateSeed = parseInt(dateStr.replace(/-/g, ''), 10)
          const commonWords = [
            'CRANE', 'STARE', 'SHARE', 'SPARE', 'SCARE', 'SNARE', 'SWARE', 'SLATE', 'STATE', 'SKATE',
            'BRAVE', 'DREAM', 'FLAME', 'GRACE', 'HAPPY', 'JOLLY', 'KNIFE', 'LIGHT', 'MAGIC', 'NIGHT',
            'OCEAN', 'PEACE', 'QUICK', 'RADIO', 'SMART', 'TRAIN', 'UNITE', 'VOICE', 'WATER', 'YOUTH'
          ]
          const wordIndex = (dateSeed * 7 + 13) % commonWords.length
          return commonWords[wordIndex]
        }
        
        const currentDate = new Date().toISOString().slice(0, 10)
        const currentWord = getGlobalCurrentWord(currentDate)
        // console.log(`🌐 Blog: Using global current word: ${currentWord} for date: ${currentDate}`)
        
        // 生成多天的文章数据（今天、昨天、前天）
        const generateMultiDayArticles = async () => {
          const dates = []
          for (let i = 0; i < 3; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            dates.push(date.toISOString().slice(0, 10))
          }
          
          // console.log(`📅 Generating articles for dates: ${dates.join(', ')}`)
          
          // 为每天生成文章
          for (const dateStr of dates) {
            const wordForDate = getGlobalCurrentWord(dateStr)
            console.log(`📝 Generating articles for ${dateStr}: ${wordForDate}`)
            
            try {
              await fetch('/api/webhook?token=' + encodeURIComponent(process.env.WEBHOOK_TOKEN || ''), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  word: wordForDate, 
                  wordNumber: 0, 
                  date: dateStr, 
                  source: 'Multi-Day Generation' 
                })
              })
            } catch (webhookError) {
              console.error(`Blog: Webhook error for ${dateStr}:`, webhookError)
            }
          }
        }
        
        // 先尝试生成多天文章
        await generateMultiDayArticles()
        
        // Fetch all articles (time-ordered) and group by date
        const response = await fetch('/api/articles?type=all&limit=200')
        const data = await response.json()
        if (data.success && data.data?.articles) {
          setArticles(data.data.articles)
        }

        // 检查当前文章是否匹配今天的单词
        if (Array.isArray(data.data?.articles)) {
          const latest = data.data.articles[0]
          const latestWord = typeof latest?.word === 'string' ? latest.word : ''
          
          if (currentWord !== latestWord) {
            console.log(`🔄 Blog: Word mismatch! Current: ${currentWord}, Latest article: ${latestWord}`)
            console.log(`🔄 Blog: Triggering webhook to generate articles for ${currentWord}`)
            
            // 触发webhook生成新文章
            try {
              await fetch('/api/webhook?token=' + encodeURIComponent(process.env.WEBHOOK_TOKEN || ''), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  word: currentWord, 
                  wordNumber: 0, 
                  date: currentDate, 
                  source: 'Global Word Sync' 
                })
              })
              
              // 重新获取文章
              const re = await fetch('/api/articles?type=all&limit=200')
              const reData = await re.json()
              if (reData.success && reData.data?.articles) {
                setArticles(reData.data.articles)
                // console.log(`✅ Blog: Successfully updated articles for word: ${currentWord}`)
              }
            } catch (webhookError) {
              console.error('Blog: Webhook error:', webhookError)
            }
          } else {
            // console.log(`✅ Blog: Articles already match current word: ${currentWord}`)
          }
        }

        // 原有的Worker检查逻辑（保留作为备用）
        try {
          const WORKER_URL = 'https://sparkling-cake-35ce.vnvgtktbcx.workers.dev/today'
          const r = await fetch(WORKER_URL)
          if (r.ok) {
            const nyt = await r.json() as Record<string, unknown>
            const real = typeof nyt.solution === 'string' ? (nyt.solution as string).toUpperCase() : ''
            if (real && Array.isArray(data.data?.articles)) {
              const latest = data.data.articles[0]
              const latestWord = typeof latest?.word === 'string' ? latest.word : ''
              if (real !== latestWord) {
                // trigger webhook to generate and then refetch
                await fetch('/api/webhook?token=' + encodeURIComponent(process.env.WEBHOOK_TOKEN || ''), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ word: real, wordNumber: Number(nyt.id || 0), date: String(nyt.print_date || new Date().toISOString().slice(0,10)), source: 'NYT' })
                }).catch(() => {})
                // refetch
                const re = await fetch('/api/articles?type=all&limit=200')
                const reData = await re.json()
                if (reData.success && reData.data?.articles) {
                  setArticles(reData.data.articles)
                }
              }
            }
          }
        } catch {
          // ignore and keep current list
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    const matchesDifficulty = !selectedDifficulty || article.difficulty === selectedDifficulty
    
    let matchesQuality = true
    if (selectedQuality) {
      const quality = parseInt(selectedQuality)
      matchesQuality = article.qualityScore >= quality
    }
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesQuality
  })

  // 格式化日期显示
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
      } else {
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }
    } catch {
      return dateString
    }
  }

  // 获取Wordle日期信息
  const getWordleDateInfo = (word: string, wordNumber: number): string => {
    if (wordNumber > 0) {
      return `Wordle #${wordNumber}`
    }
    return 'Daily Word'
  }

  if (loading) {
    return (
      <>
        {/* Global navigation from layout */}
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading educational articles...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* Global navigation from layout */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Educational Articles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover comprehensive guides, strategies, and vocabulary building resources to improve your Wordle skills and language knowledge.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Word Analysis">Word Analysis</option>
                <option value="Strategy">Strategy</option>
                <option value="Vocabulary Building">Vocabulary Building</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Quality Filter */}
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Qualities</option>
                <option value="80">80%+ (Excellent)</option>
                <option value="60">60%+ (Good)</option>
                <option value="40">40%+ (Fair)</option>
              </select>
            </div>
          </div>

          {/* Group by Wordle date */}
          {(() => {
            const groups: Record<string, Article[]> = {}
            filteredArticles.forEach(a => {
              // 按Wordle日期分组，而不是文章生成日期
              const wordleDate = a.word && a.wordNumber ? 
                // 如果有Wordle编号，计算对应的日期
                (() => {
                  try {
                    // Wordle从2021-06-19开始，每天一个编号
                    const epoch = new Date('2021-06-19')
                    const targetDate = new Date(epoch)
                    targetDate.setDate(epoch.getDate() + (a.wordNumber - 1))
                    return targetDate.toISOString().slice(0, 10)
                  } catch {
                    return a.publishedAt.slice(0, 10)
                  }
                })() :
                // 否则使用文章发布日期
                a.publishedAt.slice(0, 10)
              
              groups[wordleDate] = groups[wordleDate] || []
              groups[wordleDate].push(a)
            })
            
            const dates = Object.keys(groups).sort((a,b) => a < b ? 1 : -1)
            return dates.map(date => (
              <div key={date} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {formatDate(date)} - {date}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groups[date].map((article) => (
                    <div key={article.slug} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      {/* 日期和Wordle信息 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 font-medium">
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {getWordleDateInfo(article.word, article.wordNumber)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {article.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.qualityScore >= 80 ? 'bg-green-100 text-green-800' :
                          article.qualityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Quality: {article.qualityScore}%
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">{article.readingTime}</span>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{article.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <a 
                        href={`/blog/${article.slug}`} 
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center group"
                      >
                        Read Article 
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          })()}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
} 