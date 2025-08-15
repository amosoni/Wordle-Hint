'use client'

import { Lightbulb, Target, Clock, CheckCircle, ArrowLeft, Home, Gamepad2, XCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function GamePage() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 -z-10">
        {/* 多层渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(236,72,153,0.3),transparent_50%)]"></div>
        
        {/* 大型浮动几何图形 */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* 装饰性网格和图案 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* 动态粒子效果 */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-500/60 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-pink-500/60 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      {/* 统一导航栏 */}
      <Navigation />

      <div className="relative z-10 pt-24">
        {/* 顶部导航 */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
              <a
                href="/hints"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Hints
              </a>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
                                  <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* 页面标题 */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold mb-6 border border-green-200">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Wordle Game
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Play Wordle
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the classic Wordle game with our enhanced interface. Test your skills and see how you perform!
            </p>
          </div>
        </div>

        {/* 游戏区域 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Wordle Game</h2>
              <p className="text-gray-600 text-lg">Guess the 5-letter word in 6 attempts</p>
            </div>
            
            {/* 游戏统计 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-600">Games Played</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-green-600">Win Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-600">Current Streak</div>
              </div>
            </div>

            {/* 游戏板 */}
            <div className="space-y-2 mb-8">
              {[...Array(6)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-2">
                  {[...Array(5)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center font-bold text-lg bg-white"
                    >
                      {/* 这里可以添加字母显示逻辑 */}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* 游戏控制 */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter 5-letter word"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                  maxLength={5}
                />
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200">
                  Submit
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.href = '/hints'}
                  disabled={false}
                  className="btn btn-primary text-lg px-8 py-4 group hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get Hints (3 left)
                </button>
                
                <button className="px-6 py-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-200">
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 游戏说明 */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Green Tile</h4>
                <p className="text-sm text-gray-600">Letter is in the correct position</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Yellow Tile</h4>
                <p className="text-sm text-gray-600">Letter is in the word but wrong position</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Gray Tile</h4>
                <p className="text-sm text-gray-600">Letter is not in the word</p>
              </div>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">Get smart hints to improve your Wordle skills without spoiling the fun!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => window.location.href = '/hints'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Lightbulb className="w-6 h-6 mr-2" />
                Get Daily Hints
              </button>
              <button
                onClick={() => window.location.href = '/online'}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 统一页脚 */}
      <Footer />
    </div>
  )
} 