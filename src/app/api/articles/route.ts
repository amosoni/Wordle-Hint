import { NextRequest, NextResponse } from "next/server"
import { ArticleManager } from '@/utils/articleManager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleManager = ArticleManager.getInstance()
    
    // Initialize article manager to ensure storage is loaded
    await articleManager.initialize()

    // Ensure today's articles exist in this cold start context
    await articleManager.ensureTodayArticles()
    
    // Get query parameters
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'recent' // recent, popular, recent, popular
    
    let articles = []
    
    // Handle different query types
    if (search) {
      articles = await articleManager.searchArticles(search)
    } else if (category) {
      articles = await articleManager.getArticlesByCategory(category)
    } else if (tag) {
      // Note: getArticlesByTag method needs to be implemented in ArticleManager
      articles = await articleManager.getArticlesByCategory('all') // Fallback for now
    } else if (type === 'popular') {
      articles = await articleManager.getPopularArticles(limit)
    } else {
      // Default to recent articles
      articles = await articleManager.getRecentArticles(limit)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        articles,
        total: articles.length,
        query: {
          category,
          tag,
          search,
          limit,
          type
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, word, date } = body
    
    const articleManager = ArticleManager.getInstance()
    
    switch (action) {
      case 'generate':
        if (!word) {
          return NextResponse.json({
            success: false,
            error: 'Word is required for generation'
          }, { status: 400 })
        }
        
        // Get word data
        const wordResponse = await articleManager['apiService'].getWordForDate(date || new Date().toISOString().split('T')[0])
        const wordData = wordResponse.success && wordResponse.data ? wordResponse.data : {
          word: word.toUpperCase(),
          wordNumber: 1,
          date: date || new Date().toISOString().split('T')[0],
          source: 'Manual Generation',
          isReal: false
        }
        
        const result = await articleManager.generateArticlesForWord(word, wordData)
        
        return NextResponse.json({
          success: result.success,
          data: result.articles,
          message: result.message,
          error: result.error
        })
        
      case 'regenerate':
        if (!word) {
          return NextResponse.json({
            success: false,
            error: 'Word is required for regeneration'
          }, { status: 400 })
        }
        
        const regenerateResult = await articleManager.forceRegenerateArticles(word)
        
        return NextResponse.json({
          success: regenerateResult.success,
          data: regenerateResult.articles,
          message: regenerateResult.message,
          error: regenerateResult.error
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: generate, regenerate'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in articles POST:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 