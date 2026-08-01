import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Target, Home, BarChart2, History, BookOpen, LogIn, LogOut, Menu, X, User, ChevronDown, Info } from 'lucide-react'
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
    { name: 'ATS Scorer', path: '/scorer', icon: BarChart2 },
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
    await signOut()
  }

  // Abbreviated email for display
  const shortEmail = user?.email
    ? user.email.length > 22
      ? user.email.slice(0, 10) + '…' + user.email.slice(user.email.lastIndexOf('@'))
      : user.email
    : ''

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800/80"
        style={{ background: 'rgba(9, 13, 22, 0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">ATS Resume Scorer</span>
                <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded">
                  PRO AI
                </span>
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
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Auth / User */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700/80 hover:border-indigo-500/40 transition-all text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-200 text-xs max-w-[130px] truncate">{shortEmail}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-800 shadow-2xl z-50 overflow-hidden"
                      style={{ background: 'rgba(13, 17, 30, 0.98)', backdropFilter: 'blur(16px)' }}>
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                        <p className="text-xs text-white font-semibold truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuth('signin')}
                    className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 border border-gray-700/80 rounded-xl transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                  >
                    <LogIn className="w-4 h-4" /> Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 px-4 pt-2 pb-5 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {link.name}
                </Link>
              )
            })}
            <div className="pt-3 border-t border-gray-800/80 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs text-gray-300 truncate max-w-[200px]">{user.email}</span>
                  </div>
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => openAuth('signin')} className="py-2.5 text-sm font-semibold text-gray-200 bg-gray-800 rounded-xl">
                    Sign In
                  </button>
                  <button onClick={() => openAuth('signup')} className="py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Click-outside to close user dropdown */}
      {userDropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialTab={authTab} />
    </>
  )
}
