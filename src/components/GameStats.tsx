'use client'

import { Trophy } from 'lucide-react'

interface GameStatsProps {
  currentStreak: number
  bestStreak: number
  totalGames: number
  winRate: number
}

export default function GameStats({ currentStreak, bestStreak, totalGames, winRate }: GameStatsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Game Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{bestStreak}</div>
          <div className="text-sm text-gray-600">Best Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{totalGames}</div>
          <div className="text-sm text-gray-600">Total Games</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{winRate}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
      </div>
    </div>
  )
} 