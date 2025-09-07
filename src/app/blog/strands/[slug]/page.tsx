'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
}

export default function StrandsBlogPost({ params }: { params: { slug: string } }) {
  void params
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateBlogPost()
  }, [])

  const generateBlogPost = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog/generate', {
        method: 'GET'
      })
      
      const data = await response.json()
      
      if (data.success && data.data.blogPost) {
        setBlogPost(data.data.blogPost)
      } else {
        setError(data.error || 'Failed to generate blog post')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error generating blog post:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Generating blog post...</div>
      </div>
    )
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white">
      <div className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-yellow-300 mb-4">{blogPost.title}</h1>
            <div className="flex items-center space-x-4 text-blue-200 text-sm">
              <span>📅 {new Date(blogPost.date).toLocaleDateString()}</span>
              <span>🏷️ {blogPost.category}</span>
              <span>⭐ Featured</span>
            </div>
            <p className="text-blue-200 mt-4 text-lg">{blogPost.excerpt}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/10 rounded-lg p-8 mb-8">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: blogPost.content
                  .replace(/\n/g, '<br>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code class="bg-white/20 px-2 py-1 rounded">$1</code>')
                  .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-yellow-300 mb-4">$1</h1>')
                  .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-blue-300 mb-3">$1</h2>')
                  .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-green-300 mb-2">$1</h3>')
                  .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                  .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>')
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="/strands"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Play Strands Game
            </a>
            <a
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              More Blog Posts
            </a>
            <button
              onClick={generateBlogPost}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate New Post
            </button>
          </div>

          {/* Related Links */}
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">Related Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/real-hints"
                className="block p-4 bg-blue-600/30 rounded-lg hover:bg-blue-600/50 transition-colors"
              >
                <h4 className="font-bold text-white">Wordle Hints</h4>
                <p className="text-blue-200 text-sm">Daily Wordle hints and answers</p>
              </a>
              <a
                href="/connections"
                className="block p-4 bg-green-600/30 rounded-lg hover:bg-green-600/50 transition-colors"
              >
                <h4 className="font-bold text-white">NYT Connections</h4>
                <p className="text-green-200 text-sm">Group words by category</p>
              </a>
              <a
                href="/online"
                className="block p-4 bg-purple-600/30 rounded-lg hover:bg-purple-600/50 transition-colors"
              >
                <h4 className="font-bold text-white">Online Games</h4>
                <p className="text-purple-200 text-sm">More word games and puzzles</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
