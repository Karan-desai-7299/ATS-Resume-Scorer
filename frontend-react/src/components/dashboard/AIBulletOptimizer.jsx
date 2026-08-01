import React, { useState } from 'react'
import { Sparkles, Copy, Check, Wand2, Zap, Award, Target, ArrowRight } from 'lucide-react'
import { apiService } from '../../services/apiService'
import toast from 'react-hot-toast'

export default function AIBulletOptimizer() {
  const [draftBullet, setDraftBullet] = useState('')
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)

  const handleOptimize = async (e) => {
    e?.preventDefault()
    if (!draftBullet.trim()) {
      toast.error('Please enter a bullet point to optimize.')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const data = await apiService.optimizeBullet(draftBullet, targetRole)
      setResult(data)
      toast.success('Bullet point optimized with Groq LLaMA 3.3!')
    } catch (err) {
      console.error('Optimization error:', err)
      toast.error(err.message || 'Optimization failed. Ensure you are signed in.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const presetExamples = [
    "Built a python web scraper for collecting jobs data",
    "Worked on React frontend components and fixed UI bugs",
    "Responsible for managing MySQL database and running queries",
  ]

  return (
    <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-600/30">
          <Wand2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ✨ AI Resume Bullet Rewriter & Optimizer
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
              LLaMA 3.3 70B
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            Paste any weak or generic bullet point to transform it into 3 metric-driven, ATS-optimized variations.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleOptimize} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Draft Bullet Point
            </label>
            <input
              type="text"
              value={draftBullet}
              onChange={(e) => setDraftBullet(e.target.value)}
              placeholder="e.g., Developed API endpoints using FastAPI and PostgreSQL..."
              className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Target Job Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Full Stack Software Engineer">Full Stack Engineer</option>
              <option value="Frontend React Developer">Frontend Developer</option>
              <option value="Backend Python Developer">Backend Developer</option>
              <option value="Data Engineer / AI Engineer">Data / AI Engineer</option>
              <option value="DevOps & Cloud Engineer">DevOps Engineer</option>
            </select>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 text-[11px]">Try preset:</span>
          {presetExamples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDraftBullet(ex)}
              className="px-2.5 py-1 text-[11px] font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/20 rounded-lg transition-colors truncate max-w-[220px]"
            >
              "{ex.slice(0, 30)}..."
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !draftBullet.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Optimizing with Groq AI...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Transform Bullet Point
            </>
          )}
        </button>
      </form>

      {/* Result Cards */}
      {result && (
        <div className="space-y-4 pt-2 animate-fade-in">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> AI Rewritten Bullet Options
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {/* Impact Metric Bullet */}
            {result.impact_bullet && (
              <div className="p-4 rounded-xl bg-gray-900/80 border border-emerald-500/30 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> 📈 Metric & Impact Driven
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.impact_bullet, 'impact')}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    {copiedKey === 'impact' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'impact' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                  • {result.impact_bullet}
                </p>
              </div>
            )}

            {/* Technical Bullet */}
            {result.technical_bullet && (
              <div className="p-4 rounded-xl bg-gray-900/80 border border-indigo-500/30 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> 🛠️ Technical & Architecture Dense
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.technical_bullet, 'tech')}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    {copiedKey === 'tech' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tech' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                  • {result.technical_bullet}
                </p>
              </div>
            )}

            {/* Executive Bullet */}
            {result.executive_bullet && (
              <div className="p-4 rounded-xl bg-gray-900/80 border border-purple-500/30 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 💼 Executive & Business Outcome
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.executive_bullet, 'exec')}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    {copiedKey === 'exec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'exec' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                  • {result.executive_bullet}
                </p>
              </div>
            )}
          </div>

          {/* Improvement Tips */}
          {result.improvement_tips && result.improvement_tips.length > 0 && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
              <div className="font-bold flex items-center gap-1">💡 Pro Tips:</div>
              {result.improvement_tips.map((tip, idx) => (
                <div key={idx} className="text-[11px] text-gray-300">• {tip}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
