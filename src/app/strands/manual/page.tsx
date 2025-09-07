'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'

export default function ManualStrandsPage() {
  const [formData, setFormData] = useState({
    theme: '',
    spangram: '',
    words: '',
    grid: '',
    date: new Date().toISOString().split("T")[0]
  })
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // 解析输入数据
      const words = formData.words.split(',').map(w => w.trim()).filter(w => w.length > 0)
      const grid = formData.grid.split('\n').map(row => row.trim().split('').filter(char => char.length > 0))

      if (words.length === 0) {
        throw new Error('Please enter at least one word')
      }

      if (grid.length !== 7 || grid.some(row => row.length !== 7)) {
        throw new Error('Grid must be exactly 7x7')
      }

      const response = await fetch('/api/strands/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: formData.theme,
          spangram: formData.spangram,
          words,
          grid,
          date: formData.date
        })
      })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await response.json() as any

      if (data.success) {
        setResult(data.data.puzzle)
      } else {
        setError(data.error || 'Failed to process data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const generateSampleGrid = () => {
    const sampleGrid = [
      'SWEATER',
      'BLANKET',
      'BOOTIES',
      'SOCKSMI',
      'TTENSKN',
      'ITTINGP',
      'ROJECTS'
    ]
    setFormData(prev => ({
      ...prev,
      grid: sampleGrid.join('\n')
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white">
      <div className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-yellow-300">Manual Strands Data Input</h1>
          <p className="text-blue-200 text-center mb-8">Input real NYT Strands data manually</p>

          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  placeholder="e.g., Knitting Projects"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Spangram</label>
                <input
                  type="text"
                  name="spangram"
                  value={formData.spangram}
                  onChange={handleInputChange}
                  placeholder="e.g., KNITTINGPROJECT"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Words (comma-separated)</label>
                <input
                  type="text"
                  name="words"
                  value={formData.words}
                  onChange={handleInputChange}
                  placeholder="e.g., SWEATER, BLANKET, BOOTIES, SOCKS, MITTENS"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Grid (7x7, one row per line)</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={generateSampleGrid}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Sample
                  </button>
                </div>
                <textarea
                  name="grid"
                  value={formData.grid}
                  onChange={handleInputChange}
                  placeholder="SWEATER&#10;BLANKET&#10;BOOTIES&#10;SOCKSMI&#10;TTENSKN&#10;ITTINGP&#10;ROJECTS"
                  rows={7}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Generate Puzzle'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-green-300 mb-4">Generated Puzzle</h3>
              <div className="space-y-4">
                <div>
                  <strong>Theme:</strong> {result.theme}
                </div>
                <div>
                  <strong>Spangram:</strong> {result.spangram}
                </div>
                <div>
                  <strong>Words:</strong> {result.words.map((w: any) => w.word).join(', ')}
                </div>
                <div>
                  <strong>Source:</strong> {result.source}
                </div>
                <div>
                  <strong>Is Real:</strong> {result.isReal ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Grid Preview:</h4>
                <div className="grid grid-cols-7 gap-1 bg-white/10 p-2 rounded">
                  {result.grid.map((row: string[], rowIndex: number) =>
                    row.map((cell: string, colIndex: number) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-white/20 rounded"
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/strands"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Play This Puzzle
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
