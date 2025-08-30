import { ArticleManager } from '@/utils/articleManager'
import { ArticleScheduler } from '@/utils/scheduler'

export async function initializeArticleSystem() {
  try {
    // console.log('🚀 Initializing Wordle Hint Pro Article System...')
    
    // Initialize article manager
    const articleManager = ArticleManager.getInstance()
    await articleManager.initialize()
    
    // Start scheduler
    const scheduler = ArticleScheduler.getInstance()
    await scheduler.start()
    
    // console.log('🎉 Article system initialization completed successfully!')
    
  } catch (error) {
    console.error('Failed to initialize article system:', error)
    throw error
  }
} 