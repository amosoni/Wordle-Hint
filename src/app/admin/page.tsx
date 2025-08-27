'use client'

import { useState, useEffect } from 'react'

interface SystemStatus {
  timestamp: string
  system: {
    status: string
    uptime: number
    memory: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
    }
    version: string
  }
  articles: {
    totalArticles: number
    todayWord: string
    isGenerating: boolean
    storage: string
  }
  scheduler: {
    isRunning: boolean
    nextDailyRun?: string
    cacheCleanupInterval: number
    wordleCacheRefreshInterval: number
    healthCheckInterval: number
    lastDailyRun?: string
    lastWordleRefresh?: string
    health: {
      healthy: boolean
      issues: string[]
      cacheStats: {
        totalEntries: number
        expiredEntries: number
        validEntries: number
      }
    }
  }
  wordle: {
    cache: {
      totalEntries: number
      expiredEntries: number
      validEntries: number
    }
    lastRefresh?: string
    apiStatus: string
  }
  nextActions: {
    dailyGeneration?: string
    cacheCleanup: string
    wordleRefresh: string
    healthCheck: string
  }
}

export default function AdminPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin')
      if (!response.ok) throw new Error('Failed to fetch status')
      
      const data = await response.json()
      if (data.success) {
        setStatus(data)
        setLastUpdate(new Date())
        setError(null)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setLoading(false)
    }
  }

  const performAction = async (action: string, params?: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params })
      })
      
      if (!response.ok) throw new Error('Action failed')
      
      const data = await response.json()
      if (data.success) {
        // Refresh status after action
        await fetchStatus()
        alert(`Action completed: ${data.message}`)
      } else {
        throw new Error(data.error || 'Action failed')
      }
    } catch (err) {
      alert(`Action failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never'
    return new Date(isoString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading system status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong> {error}
            <button 
              onClick={fetchStatus}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            🚀 Real-Time System Monitor
          </h1>
          <p className="text-center text-gray-600">
            Monitor and control your Wordle hint system in real-time
          </p>
          {lastUpdate && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>

        {status && (
          <div className="space-y-6">
            {/* System Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                💻 System Overview
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  status.system.status === 'operational' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.system.status}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatUptime(status.system.uptime)}
                  </div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatMemory(status.system.memory.heapUsed)}
                  </div>
                  <div className="text-sm text-gray-600">Memory Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {status.system.version}
                  </div>
                  <div className="text-sm text-gray-600">Node Version</div>
                </div>
              </div>
            </div>

            {/* Articles Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Articles Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-700">
                    Total Articles: <span className="text-blue-600">{status.articles.totalArticles}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Today&apos;s Word: <span className="text-green-600">{status.articles.todayWord || 'None'}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Storage: <span className="text-purple-600">{status.articles.storage}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => performAction('generate-articles')}
                    disabled={status.articles.isGenerating}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {status.articles.isGenerating ? 'Generating...' : 'Generate Articles'}
                  </button>
                </div>
              </div>
            </div>

            {/* Scheduler Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                ⏰ Scheduler Status
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  status.scheduler.isRunning 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.scheduler.isRunning ? 'Running' : 'Stopped'}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <div>Daily Generation: <span className="font-mono">{status.nextActions.dailyGeneration || 'Not scheduled'}</span></div>
                    <div>Cache Cleanup: <span className="font-mono">{status.nextActions.cacheCleanup}</span></div>
                    <div>Wordle Refresh: <span className="font-mono">{status.nextActions.wordleRefresh}</span></div>
                    <div>Health Check: <span className="font-mono">{status.nextActions.healthCheck}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Last Runs</h3>
                  <div className="space-y-2 text-sm">
                    <div>Daily Generation: <span className="font-mono">{formatDate(status.scheduler.lastDailyRun)}</span></div>
                    <div>Wordle Refresh: <span className="font-mono">{formatDate(status.scheduler.lastWordleRefresh)}</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => performAction('start-scheduler')}
                  disabled={status.scheduler.isRunning}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Start Scheduler
                </button>
                <button
                  onClick={() => performAction('stop-scheduler')}
                  disabled={!status.scheduler.isRunning}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Stop Scheduler
                </button>
              </div>
            </div>

            {/* Wordle Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Wordle Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Cache Status</h3>
                  <div className="space-y-2 text-sm">
                    <div>Total Entries: <span className="font-mono">{status.wordle.cache.totalEntries}</span></div>
                    <div>Valid Entries: <span className="font-mono text-green-600">{status.wordle.cache.validEntries}</span></div>
                    <div>Expired Entries: <span className="font-mono text-red-600">{status.wordle.cache.expiredEntries}</span></div>
                    <div>API Status: <span className="font-mono text-orange-600">{status.wordle.apiStatus}</span></div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => performAction('refresh-wordle')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                  >
                    Refresh Wordle Data
                  </button>
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                💓 System Health
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  status.scheduler.health.healthy 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.scheduler.health.healthy ? 'Healthy' : 'Issues Detected'}
                </span>
              </h2>
              {status.scheduler.health.issues.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Issues Found:</h3>
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    {status.scheduler.health.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">✅ All systems are operating normally</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => performAction('clear-caches')}
                  className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700"
                >
                  🧹 Clear All Caches
                </button>
                <button
                  onClick={() => performAction('health-check')}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  💓 Run Health Check
                </button>
                <button
                  onClick={() => performAction('test-wordle-api')}
                  className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700"
                >
                  🌐 Test API Connection
                </button>
                <button
                  onClick={fetchStatus}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                >
                  🔄 Refresh Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 