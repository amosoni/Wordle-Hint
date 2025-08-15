'use client'

import { useState } from 'react'

interface KeyboardProps {
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
  guessedLetters: Set<string>
  correctLetters: Set<string>
  misplacedLetters: Set<string>
}

export default function Keyboard({ 
  onKeyPress, 
  onEnter, 
  onBackspace, 
  guessedLetters, 
  correctLetters, 
  misplacedLetters 
}: KeyboardProps) {
  const [isVisible] = useState(true)

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ]

  const getKeyStatus = (key: string) => {
    if (correctLetters.has(key)) return 'correct'
    if (misplacedLetters.has(key)) return 'misplaced'
    if (guessedLetters.has(key)) return 'incorrect'
    return 'unused'
  }

  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      onEnter()
    } else if (key === 'BACKSPACE') {
      onBackspace()
    } else {
      onKeyPress(key)
    }
  }

  if (!isVisible) return null

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = getKeyStatus(key)
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE'
            
            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`keyboard-key ${status} ${isSpecialKey ? 'special-key' : ''}`}
                disabled={status === 'unused'}
              >
                {key === 'BACKSPACE' ? '⌫' : key === 'ENTER' ? '↵' : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
} 