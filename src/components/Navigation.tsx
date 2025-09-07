'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Lightbulb, Users, ChevronDown } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHintsDropdownOpen, setIsHintsDropdownOpen] = useState(false)
  const [userCount] = useState(2847)
  const [hintCount] = useState(15392)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleHintsDropdown = () => setIsHintsDropdownOpen(!isHintsDropdownOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHintsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
            
            {/* Today's Hints Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleHintsDropdown}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <span>Today&apos;s Hints</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isHintsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a
                    href="/real-hints"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsHintsDropdownOpen(false)}
                  >
                    Wordle Hints
                  </a>
                  <a
                    href="/connections"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsHintsDropdownOpen(false)}
                  >
                    NYT Connections
                  </a>
                  <a
                    href="/strands"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsHintsDropdownOpen(false)}
                  >
                    NYT Strands 🎯
                  </a>
                </div>
              )}
            </div>
            
            <a href="/game" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Play Wordle
            </a>
            <a href="/online" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Online Hints
            </a>
            <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Wordle Blog
            </a>
            <a href="/games" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Games Hub
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
              
              {/* Mobile Today's Hints Dropdown */}
              <div>
                <button
                  onClick={toggleHintsDropdown}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  <span>Today&apos;s Hints</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isHintsDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a
                      href="/real-hints"
                      className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                      onClick={() => {
                        setIsHintsDropdownOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      Wordle Hints
                    </a>
                    <a
                      href="/connections"
                      className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                      onClick={() => {
                        setIsHintsDropdownOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      NYT Connections
                    </a>
                    <a
                      href="/strands"
                      className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                      onClick={() => {
                        setIsHintsDropdownOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      NYT Strands 🎯
                    </a>
                  </div>
                )}
              </div>
              
              <a href="/game" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Play Wordle
              </a>
              <a href="/online" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Online Hints
              </a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Wordle Blog
              </a>
              <a href="/games" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Games Hub
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