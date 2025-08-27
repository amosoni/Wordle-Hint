import { NextRequest, NextResponse } from 'next/server'
import { ArticleManager } from '@/utils/articleManager'
import { ArticleScheduler } from '@/utils/scheduler'
import { WordleApiService } from '@/utils/wordleApi'

export async function GET() {
  try {
    const articleManager = ArticleManager.getInstance()
    const scheduler = ArticleScheduler.getInstance()
    const wordleApi = WordleApiService.getInstance()
    
    // Get system status
    const articleStatus = await articleManager.getStatus()
    const schedulerStatus = scheduler.getStatus()
    const wordleCacheStats = wordleApi.getCacheStats()
    const schedulerHealth = await scheduler.healthCheck()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        status: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      },
      articles: {
        ...articleStatus,
        storage: 'file-system'
      },
      scheduler: {
        ...schedulerStatus,
        health: schedulerHealth
      },
      wordle: {
        cache: wordleCacheStats,
        lastRefresh: schedulerStatus.lastWordleRefresh,
        apiStatus: 'fallback' // Since external API is failing
      },
      nextActions: {
        dailyGeneration: schedulerStatus.nextDailyRun,
        cacheCleanup: `Every ${schedulerStatus.cacheCleanupInterval} hours`,
        wordleRefresh: `Every ${schedulerStatus.wordleCacheRefreshInterval} hours`,
        healthCheck: `Every ${schedulerStatus.healthCheckInterval} minutes`
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()
    
    const articleManager = ArticleManager.getInstance()
    const scheduler = ArticleScheduler.getInstance()
    const wordleApi = WordleApiService.getInstance()
    
    switch (action) {
      case 'start-scheduler':
        await scheduler.start()
        return NextResponse.json({
          success: true,
          message: 'Scheduler started successfully',
          status: scheduler.getStatus()
        })
        
      case 'stop-scheduler':
        scheduler.stop()
        return NextResponse.json({
          success: true,
          message: 'Scheduler stopped successfully',
          status: scheduler.getStatus()
        })
        
      case 'generate-articles':
        const word = params.word
        if (word) {
          await articleManager.forceRegenerateArticles(word)
          return NextResponse.json({
            success: true,
            message: `Articles regenerated for word: ${word}`,
            word: word
          })
        } else {
          await scheduler.triggerManualGeneration()
          return NextResponse.json({
            success: true,
            message: 'Daily articles generated successfully'
          })
        }
        
      case 'refresh-wordle':
        await scheduler.forceRefreshWordleData()
        return NextResponse.json({
          success: true,
          message: 'Wordle data refreshed successfully',
          cacheStats: wordleApi.getCacheStats()
        })
        
      case 'clear-caches':
        wordleApi.clearCache()
        articleManager.cleanExpiredCaches()
        return NextResponse.json({
          success: true,
          message: 'All caches cleared successfully'
        })
        
      case 'update-scheduler':
        const { generationTime, cacheCleanupInterval, wordleCacheRefreshInterval, healthCheckInterval } = params
        scheduler.updateOptions({
          generationTime,
          cacheCleanupInterval,
          wordleCacheRefreshInterval,
          healthCheckInterval
        })
        return NextResponse.json({
          success: true,
          message: 'Scheduler options updated successfully',
          options: scheduler.getStatus().options
        })
        
      case 'health-check':
        const health = await scheduler.healthCheck()
        return NextResponse.json({
          success: true,
          health: health
        })
        
      case 'test-wordle-api':
        try {
          const wordleApi = WordleApiService.getInstance()
          const connectivity = await wordleApi.testApiConnectivity()
          
          return NextResponse.json({
            success: true,
            action: 'test-wordle-api',
            result: connectivity,
            message: connectivity.isConnected 
              ? `API连接成功！可用端点: ${connectivity.workingEndpoints.length}`
              : '所有API端点都连接失败，使用本地备用数据'
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            action: 'test-wordle-api',
            error: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 })
        }
        
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: [
            'start-scheduler',
            'stop-scheduler', 
            'generate-articles',
            'refresh-wordle',
            'clear-caches',
            'update-scheduler',
            'health-check'
          ]
        }, { status: 400 })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 