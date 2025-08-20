import { NextRequest, NextResponse } from "next/server"
import { ArticleManager } from '@/utils/articleManager'
import { ArticleScheduler } from '@/utils/scheduler'

export async function GET() {
  try {
    const articleManager = ArticleManager.getInstance()
    const scheduler = ArticleScheduler.getInstance()
    
    // Get system status
    const [articleStatus, schedulerStatus, healthCheck] = await Promise.all([
      articleManager.getStatus(),
      scheduler.getStatus(),
      scheduler.healthCheck()
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        system: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development'
        },
        articles: articleStatus,
        scheduler: schedulerStatus,
        health: healthCheck
      }
    })
    
  } catch (error) {
    console.error('Error getting admin status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get system status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body
    
    const articleManager = ArticleManager.getInstance()
    const scheduler = ArticleScheduler.getInstance()
    
    switch (action) {
      case 'start_scheduler':
        await scheduler.start()
        return NextResponse.json({
          success: true,
          message: 'Scheduler started successfully'
        })
        
      case 'stop_scheduler':
        scheduler.stop()
        return NextResponse.json({
          success: true,
          message: 'Scheduler stopped successfully'
        })
        
      case 'generate_articles':
        const { word, date } = params
        if (!word) {
          return NextResponse.json({
            success: false,
            error: 'Word is required for article generation'
          }, { status: 400 })
        }
        
        const result = await articleManager.generateArticlesForWord(word, {
          word: word.toUpperCase(),
          wordNumber: 1,
          date: date || new Date().toISOString().split('T')[0],
          source: 'Admin Manual',
          isReal: false
        })
        
        return NextResponse.json({
          success: result.success,
          message: result.message,
          error: result.error,
          articles: result.articles
        })
        
      case 'regenerate_all_articles':
        // Regenerate articles for common words
        const commonWords = ['ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT']
        const results = []
        
        for (const word of commonWords) {
          try {
            const result = await articleManager.generateArticlesForWord(word, {
              word: word.toUpperCase(),
              wordNumber: 1,
              date: new Date().toISOString().split('T')[0],
              source: 'Admin Regeneration',
              isReal: false
            })
            results.push({ word, success: result.success, articlesCount: result.articles.length })
          } catch (error) {
            results.push({ word, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
          }
        }
        
        return NextResponse.json({
          success: true,
          message: 'Regeneration completed',
          results
        })
        
      case 'restore_test_articles':
        // Restore the TEST articles that were shown in the test
        const testWord = 'TEST'
        const testResult = await articleManager.generateArticlesForWord(testWord, {
          word: testWord,
          wordNumber: 1523,
          date: new Date().toISOString().split('T')[0],
          source: 'Admin Restore',
          isReal: false
        })
        
        return NextResponse.json({
          success: testResult.success,
          message: 'Test articles restored',
          articles: testResult.articles
        })
        
      case 'clear_caches':
        articleManager.clearCaches()
        return NextResponse.json({
          success: true,
          message: 'All caches cleared successfully'
        })
        
      case 'cleanup_caches':
        articleManager.cleanExpiredCaches()
        return NextResponse.json({
          success: true,
          message: 'Expired cache entries cleaned successfully'
        })
        
      case 'force_today_generation':
        await scheduler.triggerManualGeneration()
        return NextResponse.json({
          success: true,
          message: 'Today articles generation triggered successfully'
        })
        
      case 'update_scheduler_options':
        const { schedulerOptions } = params
        if (schedulerOptions) {
          scheduler.updateOptions(schedulerOptions)
          return NextResponse.json({
            success: true,
            message: 'Scheduler options updated successfully'
          })
        } else {
          return NextResponse.json({
            success: false,
            error: 'Scheduler options are required'
          }, { status: 400 })
        }
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: start_scheduler, stop_scheduler, generate_articles, regenerate_all_articles, restore_test_articles, clear_caches, cleanup_caches, force_today_generation, update_scheduler_options'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in admin POST:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process admin request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 