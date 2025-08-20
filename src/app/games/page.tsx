'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Game {
  id: string
  title: string
  description: string
  category: string
  playCount: number
  rating: number
  voteCount: number
  difficulty: string
  featured: boolean
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const embedSrc = ''

  const defaultSrc = 'https://www.miniplay.com/embed/wordle'
  const [src, setSrc] = useState<string>(embedSrc || defaultSrc)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (embedSrc) setSrc(embedSrc)
  }, [embedSrc])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const reloadIframe = () => {
    setSrc((prev) => prev + '')
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      } else if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch (e) {
      console.error('Fullscreen error:', e)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/games')
      const data = await response.json()
      
      if (data.success) {
        setGames(data.data.games)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayGame = async (gameId: string) => {
    try {
      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'play', gameData: { id: gameId } })
      })
      fetchGames()
    } catch (error) {
      console.error('Error updating play count:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50">
        <Navigation />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading games...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50">
      <Navigation />
      <div className="mt-16"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12" id="play-now">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">Play Wordle Now</h2>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white/70 backdrop-blur">
                <div className="text-sm text-gray-600">Play directly on this page without leaving.</div>
                <div className="flex items-center gap-2">
                  <button onClick={reloadIframe} className="px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100">Reload</button>
                  <button onClick={toggleFullscreen} className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </button>
                </div>
              </div>
              <div ref={containerRef} className="relative">
                <iframe
                  ref={iframeRef}
                  src={src}
                  title="Wordle Game"
                  className="w-full"
                  style={{ height: isFullscreen ? '100vh' : 'min(92vh, 1100px)' as unknown as string }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {games.filter(g => g.featured).length > 0 && (
          <div className="mb-8" id="featured">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.filter(g => g.featured).map(game => (
                <div key={game.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-6xl text-white">{game.title.charAt(0)}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{game.rating}</span>
                      </div>
                      <button
                        onClick={() => handlePlayGame(game.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map(game => (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <div className="text-4xl text-white">{game.title.charAt(0)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {formatNumber(game.playCount)} plays
                    </div>
                    <button
                      onClick={() => handlePlayGame(game.id)}
                      className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
                    >
                      Play
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 