import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Target, Home, BarChart3, History, BookOpen, 
  LogIn, LogOut, Menu, X, User, Sparkles, Info, ExternalLink 
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import AuthModal from '../auth/AuthModal'

export default function Navbar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('signin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'ATS Scorer', path: '/scorer', icon: BarChart3 },
    { name: 'History', path: '/history', icon: History },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
  ]

  const openAuth = (tab) => {
    setAuthTab(tab)
    setIsAuthOpen(true)
    setMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    setUserDropdownOpen(false)
    setMobileMenuOpen(false)
    await signOut()
  }

  const shortEmail = user?.email
    ? user.email.length > 22
      ? user.email.slice(0, 10) + '...' + user.email.slice(user.email.lastIndexOf('@'))
      : user.email
    : ''

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-[#080c14]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-tight">ATS Resume Scorer</span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" /> PRO AI
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 -mt-0.5 hidden sm:inline">AI Resume Intelligence</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right Action / Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800/80 border border-gray-700/60 transition-colors text-xs text-gray-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[120px] truncate font-medium">{shortEmail}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0d1322] border border-gray-800 shadow-xl py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-gray-800/60">
                        <p className="text-[11px] text-gray-400">Signed in as</p>
                        <p className="font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-indigo-400" /> Analysis History
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuth('signin')}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="btn-primary-glow px-4 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Get Started Free
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/80 bg-[#080c14]/98 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Auth Bar */}
            <div className="pt-3 border-t border-gray-800/80">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-1.5 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Account</span>
                    <span className="font-semibold text-white truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openAuth('signin')}
                    className="py-2.5 rounded-xl bg-gray-900 border border-gray-700/60 text-xs font-bold text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="btn-primary-glow py-2.5 rounded-xl text-xs font-bold text-center"
                  >
                    Get Started Free
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialTab={authTab}
        />
      )}
    </>
  )
}
