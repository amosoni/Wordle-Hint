'use client'

import { Users, Star, CheckCircle, Heart, TrendingUp, Trophy, Clock, Target } from 'lucide-react'

interface StatsDisplayProps {
  variant?: 'default' | 'compact' | 'hero'
}

export default function StatsDisplay({ variant = 'default' }: StatsDisplayProps) {
  const stats = [
    { label: "活跃玩家", value: "50K+", icon: Users, color: "text-blue-600" },
    { label: "平均胜率", value: "78%", icon: Star, color: "text-green-600" },
    { label: "提示准确率", value: "95%", icon: CheckCircle, color: "text-purple-600" },
    { label: "用户满意度", value: "4.9/5", icon: Heart, color: "text-pink-600" }
  ]

  const achievements = [
    { icon: Trophy, title: "首次胜利", value: "100%", color: "bg-yellow-500" },
    { icon: TrendingUp, title: "连胜记录", value: "15次", color: "bg-green-500" },
    { icon: Clock, title: "最快完成", value: "2次", color: "bg-blue-500" },
    { icon: Target, title: "词汇掌握", value: "2K+", color: "bg-purple-500" }
  ]

  if (variant === 'hero') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="text-center transform hover:scale-110 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          玩家成就统计
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${achievement.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
              <div className="text-lg font-bold text-gray-700">{achievement.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 