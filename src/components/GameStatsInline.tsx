'use client'

import { TrendingUp } from 'lucide-react'

interface GameStatsInlineProps {
  currentStreak: number
  bestStreak: number
  totalGames: number
  winRate: number
}

export default function GameStatsInline({ currentStreak, bestStreak, totalGames, winRate }: GameStatsInlineProps) {
  return (
    <div className="flex items-center justify-between bg-white/95 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{currentStreak}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{bestStreak}</div>
          <div className="text-xs text-gray-600">Best</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{totalGames}</div>
          <div className="text-xs text-gray-600">Games</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{winRate}%</div>
          <div className="text-xs text-gray-600">Win Rate</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-gray-500">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm">Stats</span>
      </div>
    </div>
  )
} 