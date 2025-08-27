'use client'

import { useState, useEffect } from 'react'
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
}

// DailyData interface removed as it's not used

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch('/api/wordle')
        const data = await response.json()
        if (data.success && data.data.articles) {
          const foundArticle = data.data.articles.find((a: Article) => a.slug === params.slug)
          setArticle(foundArticle)
        }
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  if (loading) {
    return (
      <>
        {/* Global navigation from layout */}
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!article) {
    return (
      <>
        {/* Global navigation from layout */}
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
              <a href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Blog
              </a>
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
        <div className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {article.readingTime}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                article.qualityScore >= 80 ? 'bg-green-100 text-green-800' :
                article.qualityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Quality: {article.qualityScore}%
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Custom styles for article content */}
            <style jsx global>{`
              .prose h2 {
                color: #1f2937;
                font-size: 2rem;
                font-weight: 700;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 0.5rem;
              }
              
              .prose h3 {
                color: #374151;
                font-size: 1.5rem;
                font-weight: 600;
                margin-top: 2rem;
                margin-bottom: 1rem;
                color: #3b82f6;
              }
              
              .prose h4 {
                color: #4b5563;
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                color: #059669;
              }
              
              .prose p {
                color: #4b5563;
                line-height: 1.7;
                margin-bottom: 1.25rem;
                font-size: 1.1rem;
              }
              
              .prose ul, .prose ol {
                margin-bottom: 1.25rem;
                padding-left: 1.5rem;
              }
              
              .prose li {
                color: #4b5563;
                line-height: 1.6;
                margin-bottom: 0.5rem;
                font-size: 1.05rem;
              }
              
              .prose strong {
                color: #1f2937;
                font-weight: 600;
              }
              
              .prose .step {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #3b82f6;
              }
              
              .prose .strategy-step {
                background: #f0f9ff;
                border: 1px solid #bae6fd;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #0ea5e9;
              }
              
              .prose .learning-step {
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #10b981;
              }
              
              .prose .technique, .prose .activity, .prose .expansion-method {
                background: #fef3c7;
                border: 1px solid #fde68a;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #f59e0b;
              }
              
              .prose .overview, .prose .practical-applications, .prose .learning-tips,
              .prose .advanced-techniques, .prose .common-mistakes, .prose .practice-exercises,
              .prose .vocabulary-expansion, .prose .practice-activities, .prose .progress-tracking {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
              }
              
              .prose .word-foundation, .prose .step-by-step-learning {
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #ef4444;
              }
              
              .prose .strategy-overview, .prose .step-by-step-strategy {
                background: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 4px solid #2563eb;
              }
            `}</style>
          </div>

          {/* Back to Blog Link */}
          <div className="text-center mt-8">
            <a 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              ← Back to Blog
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 