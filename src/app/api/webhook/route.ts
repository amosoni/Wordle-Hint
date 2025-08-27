import { NextRequest, NextResponse } from 'next/server'
import { ArticleManager } from '@/utils/articleManager'

// Simple token validation. Set WEBHOOK_TOKEN in environment for production
function isAuthorized(req: NextRequest): boolean {
  const headerToken = req.headers.get('x-webhook-token') || ''
  const queryToken = req.nextUrl.searchParams.get('token') || ''
  const envToken = process.env.WEBHOOK_TOKEN || ''
  if (!envToken) {
    // If no env token configured, allow only localhost (dev) requests
    const host = req.headers.get('host') || ''
    return host.startsWith('localhost') || host.startsWith('127.0.0.1')
  }
  return headerToken === envToken || queryToken === envToken
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    const word = typeof body.word === 'string' ? body.word.toUpperCase() : ''
    const wordNumber = typeof body.wordNumber === 'number' ? body.wordNumber : 0
    const date = typeof body.date === 'string' ? body.date : new Date().toISOString().split('T')[0]
    const source = typeof body.source === 'string' ? body.source : 'Webhook'

    const articleManager = ArticleManager.getInstance()

    if (word && word.length >= 5) {
      const wordData = {
        word,
        wordNumber: wordNumber || 0,
        date,
        source: `${source} (Cloudflare Worker)`,
        isReal: true
      }
      const result = await articleManager.generateArticlesForWord(
        word,
        wordData as { word: string; wordNumber: number; date: string; source: string; isReal: boolean }
      )
      return NextResponse.json({ success: result.success, generated: result.articles?.length || 0, message: result.message })
    }

    // Fallback: no word provided → ensure today articles (will use server-side API logic)
    await articleManager.ensureTodayArticles()
    return NextResponse.json({ success: true, message: 'Ensured today articles via fallback' })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
} 