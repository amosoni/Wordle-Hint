'use client'

import { useState } from 'react'
import { Zap, CheckCircle, XCircle, RefreshCw, Globe } from 'lucide-react'

interface ApiTestResult {
  endpoint: string
  status: 'testing' | 'success' | 'failed'
  responseTime?: number
  error?: string
  data?: Record<string, unknown>
}

export default function ApiTestPage() {
  const [isTesting, setIsTesting] = useState(false)
  const [results, setResults] = useState<ApiTestResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'idle' | 'success' | 'partial' | 'failed'>('idle')

  const testAllApis = async () => {
    setIsTesting(true)
    setResults([])
    setOverallStatus('idle')

    const endpoints = [
      'https://wordle-api.vercel.app/api/today',
      'https://wordle-api.vercel.app/api/word',
      'https://wordle-api.vercel.app/api',
      'https://wordle-api.herokuapp.com/today',
      'https://wordle-api.herokuapp.com/word'
    ]

    const newResults: ApiTestResult[] = []
    let successCount = 0

    for (const endpoint of endpoints) {
      const result: ApiTestResult = {
        endpoint,
        status: 'testing'
      }
      
      newResults.push(result)
      setResults([...newResults])

      try {
        const startTime = Date.now()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(`${endpoint}/today`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Wordle-Hint-Pro/1.0'
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        if (response.ok) {
          const data = await response.json()
          result.status = 'success'
          result.responseTime = responseTime
          result.data = data
          successCount++
        } else {
          result.status = 'failed'
          result.error = `HTTP ${response.status}: ${response.statusText}`
        }
      } catch (error) {
        result.status = 'failed'
        if (error instanceof Error) {
          result.error = error.message
        } else {
          result.error = 'Unknown error'
        }
      }

      setResults([...newResults])
    }

    // 设置整体状态
    if (successCount === 0) {
      setOverallStatus('failed')
    } else if (successCount === endpoints.length) {
      setOverallStatus('success')
    } else {
      setOverallStatus('partial')
    }

    setIsTesting(false)
  }

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'testing':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Globe className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'testing':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Globe className="w-10 h-10 text-blue-600 mr-3" />
              Wordle API 连接测试
            </h1>
            <p className="text-lg text-gray-600">
              测试所有可用的Wordle API端点，确保系统能获取真实的游戏数据
            </p>
          </div>

          {/* Test Button */}
          <div className="text-center mb-8">
            <button
              onClick={testAllApis}
              disabled={isTesting}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              <Zap className="w-5 h-5 mr-2" />
              {isTesting ? '测试中...' : '开始测试所有API'}
            </button>
          </div>

          {/* Overall Status */}
          {overallStatus !== 'idle' && (
            <div className="mb-8">
              <div className={`p-4 rounded-xl border-2 ${
                overallStatus === 'success' ? 'border-green-300 bg-green-50' :
                overallStatus === 'partial' ? 'border-yellow-300 bg-yellow-50' :
                'border-red-300 bg-red-50'
              }`}>
                <h3 className="text-lg font-semibold mb-2">
                  {overallStatus === 'success' ? '🎉 所有API都工作正常' :
                   overallStatus === 'partial' ? '⚠️ 部分API工作正常' :
                   '❌ 所有API都无法连接'}
                </h3>
                <p className="text-sm text-gray-600">
                  {overallStatus === 'success' ? '系统可以获取真实的Wordle数据' :
                   overallStatus === 'partial' ? '系统将使用可用的API，必要时回退到本地数据' :
                   '系统将使用本地备用数据，建议检查网络连接'}
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">测试结果</h2>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <span className="font-mono text-sm text-gray-700">{result.endpoint}</span>
                    </div>
                    {result.responseTime && (
                      <span className="text-sm text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                  </div>

                  {result.status === 'success' && result.data && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">API响应数据:</h4>
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.status === 'failed' && result.error && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">错误信息:</h4>
                      <p className="text-xs text-red-700">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="space-y-3 text-gray-600">
              <p>• 点击&ldquo;开始测试所有API&rdquo;按钮来测试所有可用的Wordle API端点</p>
              <p>• 绿色表示API工作正常，红色表示连接失败</p>
              <p>• 如果所有API都无法连接，系统将使用本地备用数据</p>
              <p>• 建议定期运行此测试以确保数据源的可靠性</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 