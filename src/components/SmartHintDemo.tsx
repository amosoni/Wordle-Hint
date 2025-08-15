'use client'

import { useState } from 'react'
import { Lightbulb, Brain, Shield, Rocket, ChevronRight, ChevronLeft } from 'lucide-react'

interface HintData {
  level: number
  title: string
  description: string
  badge: string
  color: string
}

export default function SmartHintDemo() {
  const [currentHint, setCurrentHint] = useState<number>(0)


  const hints: HintData[] = [
    {
      level: 1,
      title: "Vague Hint",
      description: "This word has 5 letters and contains common letters like A, E, R",
      badge: "Level 1",
      color: "blue"
    },
    {
      level: 2,
      title: "Specific Hint",
      description: "Starts with 'S', ends with 'E', and has 2 vowels",
      badge: "Level 2",
      color: "purple"
    },
    {
      level: 3,
      title: "Direct Hint",
      description: "Letters: 'S' at position 1, 'A' at position 2",
      badge: "Level 3",
      color: "green"
    }
  ]

  const nextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
  }

  const prevHint = () => {
    if (currentHint > 0) {
      setCurrentHint(currentHint - 1)
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600'
      case 'purple': return 'from-purple-500 to-purple-600'
      case 'green': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Hint System Demo
        </h2>
        <p className="text-lg text-gray-600">
          Experience our progressive hint system that adapts to your needs
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-2xl">
        {/* Current Hint Display */}
        <div className="text-center mb-8">
          <div className={`inline-block p-4 bg-gradient-to-r ${getColorClasses(hints[currentHint].color)} rounded-xl text-white mb-4`}>
            <span className="text-sm font-medium">{hints[currentHint].badge}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {hints[currentHint].title}
          </h3>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {hints[currentHint].description}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={prevHint}
            disabled={currentHint === 0}
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex space-x-2">
            {hints.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHint(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentHint ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextHint}
            disabled={currentHint === hints.length - 1}
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Hint Explanation */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            How This Hint Helps
          </h4>
          
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Level {hints[currentHint].level}</strong> hints are designed to provide just the right amount of help without spoiling the challenge.
            </p>
            
            {hints[currentHint].level === 1 && (
              <p>This gentle nudge gives you a sense of the word&apos;s structure without revealing too much.</p>
            )}
            
            {hints[currentHint].level === 2 && (
              <p>More specific guidance helps you focus your strategy on the most likely letter combinations.</p>
            )}
            
            {hints[currentHint].level === 3 && (
              <p>When you&apos;re really stuck, this direct hint gives you the boost you need to continue.</p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "AI-Powered", description: "Advanced algorithms analyze patterns" },
            { icon: Shield, title: "Spoiler-Free", description: "Enjoy the challenge while getting help" },
            { icon: Rocket, title: "Progressive", description: "Hints adapt to your skill level" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-2">{feature.title}</h5>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 