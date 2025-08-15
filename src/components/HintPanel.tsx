'use_client'

import { Lightbulb, Info } from 'lucide-react'

interface HintPanelProps {
  currentHint: string
  hintLevel: number
  onRequestHint: () => void
  disabled: boolean
}

export function HintPanel({ 
  currentHint, 
  hintLevel, 
  onRequestHint, 
  disabled 
}: HintPanelProps) {
  const hintDescriptions = [
    'Subtle clue about word patterns',
    'More specific letter information',
    'Direct letter position hints'
  ]

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-warning-500" />
        <h3 className="text-lg font-semibold text-gray-900">Smart Hints</h3>
      </div>
      
      <div className="space-y-4">
        {/* Current Hint */}
        {currentHint && (
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary-900 mb-1">
                  Hint Level {hintLevel}
                </p>
                <p className="text-sm text-primary-700">{currentHint}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Hint Level Info */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Hint Level {hintLevel}/3:</strong> {hintDescriptions[hintLevel - 1] || 'No hints used'}
          </p>
          <p className="text-xs text-gray-500">
            Each hint provides more specific information to help you solve the puzzle.
          </p>
        </div>
        
        {/* Hint Button */}
        <button
          onClick={onRequestHint}
          disabled={disabled || hintLevel >= 3}
          className="btn btn-primary w-full"
        >
          {hintLevel >= 3 ? 'No More Hints' : `Get Hint (${3 - hintLevel} left)`}
        </button>
      </div>
    </div>
  )
} 