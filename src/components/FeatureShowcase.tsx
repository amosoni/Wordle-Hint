'use client'

import { useState } from 'react'
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Trophy, 
  CheckCircle,
  ChevronDown,
  Zap
} from 'lucide-react'

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "智能AI提示",
      description: "基于机器学习的智能分析，提供个性化的游戏建议",
      details: [
        "分析您的游戏模式",
        "识别常见错误",
        "提供针对性建议"
      ],
      color: "blue",
      demo: {
        title: "AI分析示例",
        content: "系统检测到您经常在第三位使用元音字母，建议尝试辅音字母组合。"
      }
    },
    {
      icon: Lightbulb,
      title: "渐进式提示系统",
      description: "从模糊到具体，让您逐步掌握解题技巧",
      details: [
        "3级提示系统",
        "智能难度调节",
        "学习进度跟踪"
      ],
      color: "purple",
      demo: {
        title: "提示级别说明",
        content: "Level 1: 模式提示 | Level 2: 字母提示 | Level 3: 位置提示"
      }
    },
    {
      icon: Target,
      title: "技能培养",
      description: "通过数据分析帮助您提升Wordle解题能力",
      details: [
        "词汇模式识别",
        "策略优化建议",
        "长期进步追踪"
      ],
      color: "green",
      demo: {
        title: "学习建议",
        content: "根据您的游戏数据，建议重点练习包含 'TH' 和 'CH' 的单词。"
      }
    },
    {
      icon: Trophy,
      title: "成就系统",
      description: "丰富的成就和排行榜，激励持续进步",
      details: [
        "每日挑战",
        "连胜记录",
        "社区排名"
      ],
      color: "yellow",
      demo: {
        title: "今日成就",
        content: "恭喜！您解锁了 '速度之王' 成就，在3次尝试内完成谜题。"
      }
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        icon: 'bg-blue-500',
        text: 'text-blue-600'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-50',
        icon: 'bg-purple-500',
        text: 'text-purple-600'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        icon: 'bg-green-500',
        text: 'text-green-600'
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50',
        icon: 'bg-yellow-500',
        text: 'text-yellow-600'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Features List */}
      <div className="space-y-6">
        {features.map((feature, index) => {
          const colors = getColorClasses(feature.color)
          const isActive = activeFeature === index
          
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isActive
                  ? `${colors.border} ${colors.bg} shadow-lg scale-105`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                  isActive ? `${colors.icon} scale-110` : 'bg-gray-100'
                }`}>
                  <feature.icon className={`w-6 h-6 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isActive ? colors.text : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  {isActive && (
                    <div className="space-y-2 animate-fade-in">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isActive ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Demo Panel */}
      <div className="lg:pl-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-full">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-600" />
            智能提示系统演示
          </h3>
          
          {/* Active Feature Demo */}
          {activeFeature !== null && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                {features[activeFeature].demo.title}
              </div>
              <div className="text-gray-800">
                {features[activeFeature].demo.content}
              </div>
            </div>
          )}
          
          {/* System Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">分析游戏模式</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-gray-700">生成个性化提示</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-gray-700">跟踪学习进度</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <span className="text-gray-700">优化解题策略</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">提示准确率</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">3.2s</div>
                <div className="text-sm text-gray-600">平均响应时间</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 