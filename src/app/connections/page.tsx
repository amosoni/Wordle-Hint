"use client"

import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'

interface ConnectionsApiData {
  puzzle: {
    id: string
    date: string
    words: string[]
    categories: Array<{ name: string; words: string[]; color: string; difficulty: number; description: string }>
    hints: Array<{ level: number; title: string; description: string; type: string; content: string; color: string }>
    source: string
    isReal: boolean
  }
  educationalContent: unknown
}

export default function ConnectionsPage() {
  const [data, setData] = useState<ConnectionsApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/connections', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && json.data) {
          setData(json.data)
        } else {
          setError(json.error || 'Failed to load connections data')
        }
      } catch {
        setError('Failed to load connections data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading NYT Connections…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <p className="text-red-200 text-lg">{error || 'No data'}</p>
      </div>
    )
  }

  const badgeClass = data.puzzle.isReal
    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
    : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900">
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NYT Wordle Connections Hints</h1>
            <p className="text-purple-100">Progressive hints and learning for today&apos;s NYT Connections puzzle.</p>
            <div className={`inline-block mt-4 px-3 py-1 rounded-full text-sm ${badgeClass}`}>
              {data.puzzle.isReal ? 'Real NYT Data' : 'Sample Data'} • {data.puzzle.source}
            </div>
          </div>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Words</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.puzzle.words.map((w, i) => (
                <div key={i} className="text-center font-semibold text-white bg-white/20 rounded-lg py-3 border border-white/30">
                  {w}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Hints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.puzzle.hints.map(h => (
                <div key={h.level} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Level {h.level}</span>
                    <span className="text-white/70 text-sm">{h.type}</span>
                  </div>
                  <div className="text-white font-semibold mb-1">{h.title}</div>
                  <div className="text-white/80 text-sm">{h.description}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
} 