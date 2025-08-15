'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface GameBoardProps {
  targetWord: string
  maxAttempts: number
  onGameEnd: (won: boolean, attempts: number) => void
}

export default function GameBoard({ targetWord, maxAttempts, onGameEnd }: GameBoardProps) {
  const [guesses] = useState<string[]>([])
  const [currentGuess] = useState('')
  const [gameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [attempts] = useState(0)

  useEffect(() => {
    if (gameStatus !== 'playing') {
      onGameEnd(gameStatus === 'won', attempts)
    }
  }, [gameStatus, attempts, onGameEnd])





  const getLetterStatus = (letter: string, position: number) => {
    if (targetWord[position] === letter) return 'correct'
    if (targetWord.includes(letter)) return 'misplaced'
    return 'incorrect'
  }

  const renderCell = (letter: string, position: number) => {
    const status = getLetterStatus(letter, position)
    
    return (
      <div
        key={position}
        className={`
          w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold
          ${status === 'correct' ? 'bg-green-500 border-green-600 text-white' : ''}
          ${status === 'misplaced' ? 'bg-yellow-500 border-yellow-600 text-white' : ''}
          ${status === 'incorrect' ? 'bg-gray-500 border-gray-600 text-white' : ''}
          ${!letter ? 'border-gray-300 bg-white' : ''}
        `}
      >
        {letter}
      </div>
    )
  }

  const renderRow = (guess: string, index: number) => (
    <div key={index} className="flex gap-2 mb-2">
      {targetWord.split('').map((_, position) => 
        renderCell(guess[position] || '', position)
      )}
    </div>
  )

  const renderCurrentRow = () => (
    <div className="flex gap-2 mb-2">
      {targetWord.split('').map((_, position) => (
        <div
          key={position}
          className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold bg-white"
        >
          {currentGuess[position] || ''}
        </div>
      ))}
    </div>
  )

  const renderEmptyRows = () => {
    const remainingRows = maxAttempts - guesses.length - (currentGuess ? 1 : 0)
    return Array.from({ length: remainingRows }, (_, index) => (
      <div key={`empty-${index}`} className="flex gap-2 mb-2">
        {targetWord.split('').map((_, position) => (
          <div
            key={position}
            className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold bg-white"
          />
        ))}
      </div>
    ))
  }

  return (
    <div className="game-board">
      <div className="mb-6">
        {guesses.map(renderRow)}
        {currentGuess && renderCurrentRow()}
        {renderEmptyRows()}
      </div>
      
      {gameStatus === 'won' && (
        <div className="text-center text-green-600 text-xl font-bold flex items-center justify-center">
          <CheckCircle className="w-6 h-6 mr-2" />
          Congratulations! You won in {attempts} attempts!
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="text-center text-red-600 text-xl font-bold flex items-center justify-center">
          <XCircle className="w-6 h-6 mr-2" />
          Game Over! The word was {targetWord}
        </div>
      )}
      
      {gameStatus === 'playing' && (
        <div className="text-center text-blue-600 text-lg flex items-center justify-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Type your guess and press Enter
        </div>
      )}
    </div>
  )
} 