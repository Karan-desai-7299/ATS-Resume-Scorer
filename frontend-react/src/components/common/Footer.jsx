import React from 'react'
import { Link } from 'react-router-dom'
import { Target, Mail, Heart, ExternalLink, Sparkles } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-gray-800/80"
      style={{ background: 'rgba(9, 13, 22, 0.95)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Main footer content */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">ATS Resume Scorer</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
              AI-powered resume intelligence platform built with Groq LLaMA 3.3, spaCy NLP, and SentenceTransformers.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-semibold">API Online</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Navigate</h4>
            <ul className="space-y-2">
              {[
                { name: '🏠 Home', to: '/' },
                { name: '🎯 ATS Scorer', to: '/scorer' },
                { name: '📊 History', to: '/history' },
                { name: '📚 Resources', to: '/resources' },
                { name: '👤 About', to: '/about' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Built by</h4>
            <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-base border-2 border-gray-800">
                  K
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Karansinh Desai</p>
                  <p className="text-[11px] text-gray-400">Full Stack · AI Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/karansinh-desai-a249a0289/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-300 bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/25 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> LinkedIn
                </a>
                <Link
                  to="/about"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-300 bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/25 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600">
          <span>
            © {year} ATS Resume Scorer · Built with{' '}
            <Heart className="inline w-3 h-3 text-rose-500 fill-rose-500" /> by{' '}
            <a
              href="https://www.linkedin.com/in/karansinh-desai-a249a0289/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Karansinh Desai
            </a>
          </span>
          <span className="flex items-center gap-3">
            <span className="text-gray-700">Powered by</span>
            <span className="font-semibold text-purple-400">Groq LLaMA 3.3</span>
            <span className="text-gray-700">·</span>
            <span className="font-semibold text-sky-400">spaCy NLP</span>
            <span className="text-gray-700">·</span>
            <span className="font-semibold text-emerald-400">FastAPI</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
