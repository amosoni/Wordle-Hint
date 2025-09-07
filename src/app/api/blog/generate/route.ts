import { NextResponse } from 'next/server'
import { StrandsApiService } from '@/utils/strandsApi'
import { BlogGenerator } from '@/utils/blogGenerator'

export async function GET() {
  try {
    console.log('🚀 Generating Strands blog articles...')
    
    // Get today's Strands puzzle
    const strandsApi = StrandsApiService.getInstance()
    const puzzleResponse = await strandsApi.getTodayPuzzle()
    
    if (!puzzleResponse.success || !puzzleResponse.data) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch today\'s Strands puzzle'
      }, { status: 500 })
    }

    const puzzle = puzzleResponse.data
    console.log(`📝 Generating articles for theme: ${puzzle.theme}`)

    // Generate articles using the new system
    const blogGenerator = BlogGenerator.getInstance()
    const articles = await blogGenerator.generateArticlesForPuzzle(puzzle)
    
    // Store articles
    await blogGenerator.storeArticles(puzzle)
    
    console.log(`✅ Successfully generated and stored ${articles.length} Strands articles`)
    
    return NextResponse.json({
      success: true,
      data: {
        articles: articles.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          category: article.category,
          tags: article.tags,
          publishedAt: article.publishedAt
        })),
        puzzle: {
          theme: puzzle.theme,
          spangram: puzzle.spangram,
          wordCount: puzzle.words.length,
          date: puzzle.date
        }
      }
    })

  } catch (error) {
    console.error('❌ Error generating Strands blog articles:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}