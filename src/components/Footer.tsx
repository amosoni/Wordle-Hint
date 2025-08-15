import { 
  Lightbulb, 
  MessageCircle, 
  Mail, 
  Github 
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <a href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">WordleHint Pro</span>
            </a>
            <p className="text-gray-600 text-sm">
              We&apos;re here to help you master Wordle with intelligent hints and strategies.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/hints" className="text-blue-100 hover:text-white transition-colors">Today&apos;s Hints</a></li>
              <li><a href="/online" className="text-blue-100 hover:text-white transition-colors">Online Games</a></li>
              <li><a href="/game" className="text-blue-100 hover:text-white transition-colors">Play Game</a></li>
              <li><a href="/#features" className="text-blue-100 hover:text-white transition-colors">Features</a></li>
              <li><a href="/#about" className="text-blue-100 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Wordle Strategies</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Daily Tips</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Community Forum</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-700 pt-8 text-center">
          <p className="text-blue-200">
            © 2024 WordleHint Pro. All rights reserved. Made with ❤️ for Wordle enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
} 