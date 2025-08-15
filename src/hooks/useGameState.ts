'use client'

import { useState, useCallback, useEffect } from 'react'

interface GameState {
  targetWord: string
  guesses: string[]
  currentGuess: string
  status: 'playing' | 'won' | 'lost'
  attempts: number
  maxAttempts: number
}

interface GameStats {
  currentStreak: number
  bestStreak: number
  totalGames: number
  winRate: number
}

export function useGameState(initialWord: string = 'HELLO') {
  const [gameState, setGameState] = useState<GameState>({
    targetWord: initialWord,
    guesses: [],
    currentGuess: '',
    status: 'playing',
    attempts: 0,
    maxAttempts: 6
  })

  const [stats, setStats] = useState<GameStats>({
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    winRate: 0
  })

  const updateGameStats = useCallback((won: boolean) => {
    setStats(prev => {
      const newTotalGames = prev.totalGames + 1
      const newWins = won ? Math.floor(prev.winRate * prev.totalGames / 100) + 1 : Math.floor(prev.winRate * prev.totalGames / 100)
      const newWinRate = Math.round((newWins / newTotalGames) * 100)
      
      const newCurrentStreak = won ? prev.currentStreak + 1 : 0
      const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak)
      
      return {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        totalGames: newTotalGames,
        winRate: newWinRate
      }
    })
  }, [])

  const addLetter = useCallback((letter: string) => {
    if (gameState.status !== 'playing' || gameState.currentGuess.length >= gameState.targetWord.length) {
      return
    }
    
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess + letter.toUpperCase()
    }))
  }, [gameState.status, gameState.currentGuess.length, gameState.targetWord.length])

  const removeLetter = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1)
    }))
  }, [])

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== gameState.targetWord.length) {
      return
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess]
    const newAttempts = gameState.attempts + 1
    const won = gameState.currentGuess === gameState.targetWord
    const lost = newAttempts >= gameState.maxAttempts

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      attempts: newAttempts,
      status: won ? 'won' : lost ? 'lost' : 'playing'
    }))

    if (won || lost) {
      updateGameStats(won)
    }
  }, [gameState.currentGuess, gameState.targetWord, gameState.guesses, gameState.attempts, gameState.maxAttempts, updateGameStats])

  const resetGame = useCallback((newWord?: string) => {
    setGameState({
      targetWord: newWord || initialWord,
      guesses: [],
      currentGuess: '',
      status: 'playing',
      attempts: 0,
      maxAttempts: 6
    })
  }, [initialWord])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.status !== 'playing') return

      if (event.key === 'Enter') {
        submitGuess()
      } else if (event.key === 'Backspace') {
        removeLetter()
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        addLetter(event.key)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.status, submitGuess, removeLetter, addLetter])

  return {
    gameState,
    stats,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame
  }
} 