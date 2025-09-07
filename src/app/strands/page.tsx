'use client'

import { useState, useEffect } from 'react'
import { StrandsGameState, StrandsHint, GridPosition } from '@/types/strands'
import Footer from '@/components/Footer'

export default function StrandsPage() {
  const [gameState, setGameState] = useState<StrandsGameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCells, setSelectedCells] = useState<GridPosition[]>([])
  const [currentHint, setCurrentHint] = useState<StrandsHint | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [incorrectGuess, setIncorrectGuess] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchPuzzle()
  }, [])

  const fetchPuzzle = async () => {
    try {
      setLoading(true)
      
      // Add timeout to prevent long loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch('/api/strands', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (data.success && data.data.puzzle) {
        const puzzle = data.data.puzzle
        setGameState({
          puzzle,
          foundWords: [],
          selectedCells: [],
          gameStatus: 'playing',
          hintsUsed: 0,
          maxHints: puzzle.hints.length
        })
      } else {
        setError(data.error || 'Failed to fetch puzzle')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - please try again')
      } else {
        setError('Network error')
      }
      console.error('Error fetching puzzle:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return

    const isAlreadySelected = selectedCells.some(
      (cell) => cell.row === row && cell.col === col
    )

    if (isAlreadySelected) {
      // Remove if already selected
      setSelectedCells(prev => 
        prev.filter(cell => !(cell.row === row && cell.col === col))
      )
    } else {
      // Check if the new cell is adjacent to the last selected cell
      if (selectedCells.length > 0) {
        const lastSelected = selectedCells[selectedCells.length - 1]
        const isAdjacent = 
          Math.abs(lastSelected.row - row) <= 1 && 
          Math.abs(lastSelected.col - col) <= 1 &&
          !(lastSelected.row === row && lastSelected.col === col)

        if (!isAdjacent) {
          // If not adjacent, start a new selection
          setSelectedCells([{ row, col }])
          return
        }
      }
      setSelectedCells(prev => [...prev, { row, col }])
    }
  }

  const checkWord = async () => {
    if (!gameState || selectedCells.length === 0) return

    try {
      // Convert selected cells to word
      const word = selectedCells
        .sort((a, b) => a.row - b.row || a.col - b.col)
        .map(cell => gameState.puzzle.grid[cell.row][cell.col])
        .join('')
        .toUpperCase()

      // Check if word is already found
      if (gameState.foundWords.includes(word)) {
        setIncorrectGuess(true)
        setTimeout(() => setIncorrectGuess(false), 1500)
        setSelectedCells([])
        return
      }

      // Check if word exists in puzzle
      const foundWord = gameState.puzzle.words.find(w => w.word.toUpperCase() === word)
      
      if (foundWord && !foundWord.found) {
        // Mark word as found
        const updatedPuzzle = { ...gameState.puzzle }
        const wordIndex = updatedPuzzle.words.findIndex(w => w.word.toUpperCase() === word)
        if (wordIndex !== -1) {
          updatedPuzzle.words[wordIndex].found = true
        }

        const newFoundWords = [...gameState.foundWords, word]
        const allWordsFound = updatedPuzzle.words.every(w => w.found)
        
        setGameState({
          ...gameState,
          puzzle: updatedPuzzle,
          foundWords: newFoundWords,
          gameStatus: allWordsFound ? 'won' : 'playing'
        })
        
        setSelectedCells([])
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      } else {
        // Incorrect word
        setIncorrectGuess(true)
        setTimeout(() => {
          setIncorrectGuess(false)
          setSelectedCells([])
        }, 1500)
      }
    } catch (err) {
      console.error('Error checking word:', err)
      setIncorrectGuess(true)
      setTimeout(() => setIncorrectGuess(false), 1500)
    }
  }

  const requestHint = async () => {
    if (!gameState || gameState.hintsUsed >= gameState.maxHints) return

    try {
      const response = await fetch('/api/strands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getHint',
          puzzleId: gameState.puzzle.id,
          foundWords: gameState.foundWords,
          hintsUsed: gameState.hintsUsed
        })
      })

      const data = await response.json()
      
      if (data.success && data.data.hint) {
        setCurrentHint(data.data.hint)
        setShowHint(true)
        setGameState({
          ...gameState,
          hintsUsed: gameState.hintsUsed + 1
        })
      } else {
        setError(data.error || 'Failed to get hint')
      }
    } catch (err) {
      console.error('Error getting hint:', err)
      setError('Error requesting hint')
    }
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col)
  }

  const isCellInFoundWord = (row: number, col: number) => {
    if (!gameState) return false
    return gameState.puzzle.words.some(word => 
      word.found && word.positions.some(pos => pos.row === row && pos.col === col)
    )
  }

  const isCellInSpangram = (row: number, col: number) => {
    if (!gameState) return false
    const spangram = gameState.puzzle.spangram.toUpperCase()
    const foundSpangram = gameState.foundWords.includes(spangram)
    
    if (!foundSpangram) return false
    
    const spangramWord = gameState.puzzle.words.find(w => w.word.toUpperCase() === spangram)
    return spangramWord?.positions.some(pos => pos.row === row && pos.col === col) || false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NYT Strands</h1>
          <p className="text-blue-200">Find all words related to the theme</p>
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">Today&apos;s Theme</h2>
            <p className="text-lg text-white">{gameState.puzzle.theme}</p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{gameState.foundWords.length}</div>
            <div className="text-blue-200">Found</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{gameState.puzzle.words.length}</div>
            <div className="text-blue-200">Total Words</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{gameState.hintsUsed}</div>
            <div className="text-blue-200">Hints Used</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{gameState.maxHints - gameState.hintsUsed}</div>
            <div className="text-blue-200">Remaining</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {gameState.puzzle.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected = isCellSelected(rowIndex, colIndex)
                const isFound = isCellInFoundWord(rowIndex, colIndex)
                const isSpangram = isCellInSpangram(rowIndex, colIndex)
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={isFound || isSpangram}
                    className={`
                      w-12 h-12 flex items-center justify-center text-lg font-bold rounded
                      transition-all duration-200 transform hover:scale-105
                      ${isSpangram
                        ? 'bg-yellow-400 text-black shadow-lg ring-2 ring-yellow-300'
                        : isFound
                        ? 'bg-green-400 text-black shadow-md'
                        : isSelected
                        ? 'bg-blue-400 text-white ring-2 ring-blue-300 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:shadow-md'
                      }
                      ${isFound || isSpangram ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    {cell}
                  </button>
                )
              })
            )}
          </div>
          
          {/* Current Selection */}
          {selectedCells.length > 0 && (
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
                Selected: {selectedCells
                  .sort((a, b) => a.row - b.row || a.col - b.col)
                  .map(cell => gameState.puzzle.grid[cell.row][cell.col])
                  .join('')
                }
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {incorrectGuess && (
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg animate-pulse">
                ❌ Incorrect Word! Try again.
              </div>
            </div>
          )}
          
          {showSuccess && (
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg animate-bounce">
                ✅ Great! Word found!
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={checkWord}
              disabled={selectedCells.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              Check Word
            </button>
            <button
              onClick={requestHint}
              disabled={gameState.hintsUsed >= gameState.maxHints}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              Get Hint ({gameState.maxHints - gameState.hintsUsed})
            </button>
            <button
              onClick={() => setSelectedCells([])}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Found Words */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Found Words</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.foundWords.map((word, index) => {
              const isSpangram = word.toUpperCase() === gameState.puzzle.spangram.toUpperCase()
              return (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isSpangram
                      ? 'bg-yellow-400 text-black ring-2 ring-yellow-300'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {word} {isSpangram && '⭐'}
                </span>
              )
            })}
            {gameState.foundWords.length === 0 && (
              <span className="text-gray-400">No words found yet</span>
            )}
          </div>
        </div>

        {/* Hint Modal */}
        {showHint && currentHint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">{currentHint.title}</h3>
              <p className="text-gray-700 mb-4">{currentHint.content}</p>
              {currentHint.example && (
                <p className="text-sm text-gray-600 mb-4">Example: {currentHint.example}</p>
              )}
              {currentHint.tip && (
                <p className="text-sm text-blue-600 mb-4">Tip: {currentHint.tip}</p>
              )}
              <button
                onClick={() => setShowHint(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Game Complete */}
        {gameState.gameStatus === 'won' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">Congratulations!</h2>
              <p className="text-gray-700 mb-6">You successfully found all words!</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

