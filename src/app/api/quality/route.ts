import { NextRequest, NextResponse } from "next/server"
import { ArticleManager } from '@/utils/articleManager'
import { ContentQualityAnalyzer } from '@/utils/qualityAnalyzer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleManager = ArticleManager.getInstance()
    
    // Get query parameters
    const word = searchParams.get('word')
    const category = searchParams.get('category')
    const minScore = parseInt(searchParams.get('minScore') || '70')
    
    let articles = []
    
    if (word) {
      articles = await articleManager.getArticlesForWord(word)
    } else if (category) {
      articles = await articleManager.getArticlesByCategory(category)
    } else {
      articles = await articleManager.getRecentArticles(20)
    }
    
    // Analyze quality for each article
    const qualityReports = articles.map(article => {
      const keywords = [article.word.toLowerCase(), 'wordle', 'vocabulary', 'learning']
      const qualityMetrics = ContentQualityAnalyzer.analyzeContent(
        article.content,
        article.title,
        keywords
      )
      
      return {
        id: article.id,
        title: article.title,
        word: article.word,
        category: article.category,
        currentQualityScore: article.qualityScore,
        analyzedQualityScore: qualityMetrics.overallScore,
        qualityRating: ContentQualityAnalyzer.getQualityRating(qualityMetrics.overallScore),
        metrics: {
          readability: qualityMetrics.readabilityScore,
          seo: qualityMetrics.seoScore,
          engagement: qualityMetrics.engagementScore,
          overall: qualityMetrics.overallScore
        },
        issues: qualityMetrics.issues,
        suggestions: qualityMetrics.suggestions,
        needsImprovement: qualityMetrics.overallScore < minScore,
        improvementPriority: calculateImprovementPriority(qualityMetrics)
      }
    })
    
    // Filter by minimum score if specified
    const filteredReports = minScore > 0 
      ? qualityReports.filter(report => report.analyzedQualityScore >= minScore)
      : qualityReports
    
    // Calculate overall statistics
    const totalArticles = qualityReports.length
    const highQualityArticles = qualityReports.filter(r => r.analyzedQualityScore >= 80).length
    const mediumQualityArticles = qualityReports.filter(r => r.analyzedQualityScore >= 70 && r.analyzedQualityScore < 80).length
    const lowQualityArticles = qualityReports.filter(r => r.analyzedQualityScore < 70).length
    
    const averageScore = totalArticles > 0 
      ? Math.round(qualityReports.reduce((sum, r) => sum + r.analyzedQualityScore, 0) / totalArticles)
      : 0
    
    return NextResponse.json({
      success: true,
      data: {
        qualityReports: filteredReports,
        statistics: {
          totalArticles,
          highQualityArticles,
          mediumQualityArticles,
          lowQualityArticles,
          averageScore,
          qualityDistribution: {
            excellent: qualityReports.filter(r => r.analyzedQualityScore >= 90).length,
            veryGood: qualityReports.filter(r => r.analyzedQualityScore >= 80 && r.analyzedQualityScore < 90).length,
            good: qualityReports.filter(r => r.analyzedQualityScore >= 70 && r.analyzedQualityScore < 80).length,
            fair: qualityReports.filter(r => r.analyzedQualityScore >= 60 && r.analyzedQualityScore < 70).length,
            poor: qualityReports.filter(r => r.analyzedQualityScore < 60).length
          }
        },
        recommendations: generateRecommendations(qualityReports)
      }
    })
    
  } catch (error) {
    console.error('Error analyzing content quality:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze content quality',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, content, title, keywords } = body
    
    switch (action) {
      case 'analyze':
        if (!content || !title) {
          return NextResponse.json({
            success: false,
            error: 'Content and title are required for analysis'
          }, { status: 400 })
        }
        
        const qualityMetrics = ContentQualityAnalyzer.analyzeContent(
          content,
          title,
          keywords || ['wordle', 'vocabulary', 'learning']
        )
        
        return NextResponse.json({
          success: true,
          data: {
            qualityMetrics,
            qualityRating: ContentQualityAnalyzer.getQualityRating(qualityMetrics.overallScore),
            isValid: ContentQualityAnalyzer.validateContent(qualityMetrics),
            recommendations: generateSingleArticleRecommendations(qualityMetrics)
          }
        })
        
      case 'bulk_improve':
        // Trigger quality improvement for low-quality articles
        const articleManager = ArticleManager.getInstance()
        const allArticles = await articleManager.getRecentArticles(50)
        
        const improvementResults = []
        for (const article of allArticles) {
          const keywords = [article.word.toLowerCase(), 'wordle', 'vocabulary', 'learning']
          const qualityMetrics = ContentQualityAnalyzer.analyzeContent(
            article.content,
            article.title,
            keywords
          )
          
          if (qualityMetrics.overallScore < 70) {
            improvementResults.push({
              articleId: article.id,
              title: article.title,
              currentScore: qualityMetrics.overallScore,
              issues: qualityMetrics.issues,
              suggestions: qualityMetrics.suggestions
            })
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Found ${improvementResults.length} articles that need improvement`,
          data: improvementResults
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: analyze, bulk_improve'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in quality POST:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process quality request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper functions
type QualityMetricsLite = { overallScore: number; readabilityScore?: number; seoScore?: number; engagementScore?: number; issues?: string[] }

function calculateImprovementPriority(metrics: QualityMetricsLite): 'High' | 'Medium' | 'Low' {
  if (metrics.overallScore < 60) return 'High'
  if (metrics.overallScore < 75) return 'Medium'
  return 'Low'
}

type QualityReport = { analyzedQualityScore: number; issues: string[] }
function generateRecommendations(qualityReports: QualityReport[]): Record<string, unknown> {
  const recommendations = {
    immediateActions: [] as string[],
    longTermImprovements: [] as string[],
    trainingNeeds: [] as string[]
  }
  
  const lowQualityCount = qualityReports.filter(r => r.analyzedQualityScore < 70).length
  const avgScore = qualityReports.reduce((sum, r) => sum + r.analyzedQualityScore, 0) / qualityReports.length
  
  if (lowQualityCount > 0) {
    recommendations.immediateActions.push(`Improve ${lowQualityCount} low-quality articles (score < 70)`)
  }
  
  if (avgScore < 75) {
    recommendations.immediateActions.push('Review and improve content generation templates')
  }
  
  if (qualityReports.some(r => r.issues.includes('Content is too complex'))) {
    recommendations.trainingNeeds.push('Improve readability and simplify language')
  }
  
  if (qualityReports.some(r => r.issues.includes('SEO optimization needed'))) {
    recommendations.trainingNeeds.push('Enhance SEO optimization techniques')
  }
  
  if (qualityReports.some(r => r.issues.includes('Content is too short'))) {
    recommendations.longTermImprovements.push('Expand content depth and add more examples')
  }
  
  return recommendations
}

function generateSingleArticleRecommendations(metrics: QualityMetricsLite): Record<string, unknown> {
  const recommendations = {
    priority: metrics.overallScore < 70 ? 'High' : 'Medium',
    actions: [] as string[],
    estimatedTime: '15-30 minutes'
  }
  
  if ((metrics.readabilityScore ?? 0) < 70) {
    recommendations.actions.push('Simplify sentence structure and vocabulary')
  }
  
  if ((metrics.seoScore ?? 0) < 70) {
    recommendations.actions.push('Optimize keyword usage and content structure')
  }
  
  if ((metrics.engagementScore ?? 0) < 70) {
    recommendations.actions.push('Add more interactive elements and practical examples')
  }
  
  if ((metrics.issues ?? []).includes('Content is too short')) {
    recommendations.estimatedTime = '30-45 minutes'
    recommendations.actions.push('Expand content with detailed explanations')
  }
  
  return recommendations
} 