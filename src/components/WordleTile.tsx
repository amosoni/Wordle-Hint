'use client'

interface WordleTileProps {
  letter: string
  isCurrentRow: boolean
  isSubmitted: boolean
  position: number
  targetWord: string
}

export function WordleTile({ 
  letter, 
  isCurrentRow, 
  isSubmitted, 
  position, 
  targetWord 
}: WordleTileProps) {
  const getTileStatus = () => {
    if (!isSubmitted || !targetWord) return 'empty'
    
    const targetLetter = targetWord[position]
    if (letter === targetLetter) return 'correct'
    if (targetWord.includes(letter)) return 'present'
    return 'absent'
  }

  const status = getTileStatus()
  const isFilled = letter.length > 0

  return (
    <div
      className={`
        relative flex h-16 w-16 items-center justify-center rounded-lg border-2 text-2xl font-bold uppercase transition-all duration-300
        ${status === 'correct' ? 'border-success-500 bg-success-500 text-white shadow-lg scale-105' : ''}
        ${status === 'present' ? 'border-warning-500 bg-warning-500 text-white shadow-lg scale-105' : ''}
        ${status === 'absent' ? 'border-gray-500 bg-gray-500 text-white shadow-lg scale-105' : ''}
        ${status === 'empty' ? 'border-gray-300 bg-white text-gray-400 hover:border-blue-300 hover:bg-blue-50' : ''}
        ${isCurrentRow && isFilled ? 'animate-bounce-in border-blue-400 bg-blue-50' : ''}
        ${isSubmitted ? 'animate-fade-in' : ''}
        ${isFilled ? 'shadow-md' : ''}
      `}
      style={{
        animationDelay: isSubmitted ? `${position * 0.1}s` : '0s'
      }}
    >
      {/* Letter content */}
      <span className="relative z-10">{letter}</span>
      
      {/* Background decoration */}
      {status === 'correct' && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg opacity-80"></div>
      )}
      {status === 'present' && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg opacity-80"></div>
      )}
      {status === 'absent' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg opacity-80"></div>
      )}
      
      {/* Glow effect */}
      {status !== 'empty' && (
        <div className={`absolute inset-0 rounded-lg ${
          status === 'correct' ? 'shadow-lg shadow-green-400/50' :
          status === 'present' ? 'shadow-lg shadow-yellow-400/50' :
          'shadow-lg shadow-gray-400/50'
        }`}></div>
      )}
      
      {/* Current row indicator */}
      {isCurrentRow && isFilled && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>
  )
} 