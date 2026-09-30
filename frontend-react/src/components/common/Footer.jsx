import React from 'react'
import { Link } from 'react-router-dom'
import { Target, Heart, ExternalLink, Sparkles, Home, BarChart3, History, BookOpen, Info, ShieldCheck, Cpu } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-gray-800/80 bg-[#080c14]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">ATS Resume Scorer</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enterprise-grade resume intelligence engine built to evaluate formatting, keyword frequency, skill validation, and job description alignment.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">API Online & Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home Overview', to: '/', icon: Home },
                { name: 'ATS Resume Scorer', to: '/scorer', icon: BarChart3 },
                { name: 'Analysis History', to: '/history', icon: History },
                { name: 'ATS Resources & Tips', to: '/resources', icon: BookOpen },
                { name: 'About & Technology', to: '/about', icon: Info },
              ].map(link => {
                const Icon = link.icon
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-400 transition-colors font-medium"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-500" />
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Core Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Engine Stack</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Groq High-Speed LLMs</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>spaCy NLP Entity & Text Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>RapidFuzz Semantic Matching</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase Secure JWT Auth</span>
              </li>
            </ul>
          </div>

          {/* Creator Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Created By</h4>
            <div className="glass-card p-4 rounded-2xl border border-indigo-500/25 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm border-2 border-indigo-400/40">
                  K
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Karansinh Desai</p>
                  <p className="text-[11px] text-gray-400">Full Stack & AI Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.linkedin.com/in/karansinh-desai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-300 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 rounded-xl transition-all"
                >
                  <ExternalLink className="w-3 h-3" /> LinkedIn
                </a>
                <a
                  href="https://karansinh-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-300 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 rounded-xl transition-all"
                >
                  <Sparkles className="w-3 h-3" /> Portfolio
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            &copy; {year} ATS Resume Scorer Pro &bull; Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" /> by{' '}
            <a
              href="https://www.linkedin.com/in/karansinh-desai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Karansinh Desai
            </a>
          </p>
          <div className="flex items-center gap-3 font-medium">
            <span className="text-gray-400">Production Ready</span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-gray-400">Vercel Cloud</span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-gray-400">FastAPI</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
