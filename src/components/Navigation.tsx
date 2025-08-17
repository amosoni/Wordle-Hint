'use client'

import { useState } from 'react'
import { Menu, X, Lightbulb, Users } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userCount] = useState(2847)
  const [hintCount] = useState(15392)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">WordleHint</span>
              <span className="text-sm text-gray-500">.help</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Home
            </a>
            <a href="/hints" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Hints
            </a>
            <a href="/game" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Game
            </a>
            <a href="/online" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Online
            </a>
            <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Blog
            </a>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{userCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lightbulb className="w-4 h-4" />
              <span>{hintCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Home
              </a>
              <a href="/hints" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Hints
              </a>
              <a href="/game" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Game
              </a>
              <a href="/online" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Online
              </a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Blog
              </a>
            </div>
            
            {/* Mobile Stats */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{userCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lightbulb className="w-4 h-4" />
                <span>{hintCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 