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
      toast.error('Please enter a draft bullet point to optimize.')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const data = await apiService.optimizeBullet(draftBullet, targetRole)
      setResult(data)
      toast.success('Bullet point transformed with high-impact variations!')
    } catch (err) {
      console.error('Optimization error:', err)
      toast.error(err.message || 'Optimization failed. Please verify connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied bullet to clipboard!')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const presetExamples = [
    "Built a python web scraper for collecting jobs data",
    "Worked on React frontend components and fixed UI bugs",
    "Responsible for managing MySQL database and running queries",
    "Helped customer support team resolve tickets faster",
  ]

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Resume Bullet Point Rewriter
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                Groq AI Engine
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Transform passive or generic statements into quantifiable, action-verb driven bullet points
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/25 px-3 py-1 rounded-full">
          ATS High-Impact Syntax
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleOptimize} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Draft Resume Bullet</label>
            <input
              type="text"
              value={draftBullet}
              onChange={(e) => setDraftBullet(e.target.value)}
              placeholder="e.g. Worked on database performance and reduced latency..."
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Preset quick examples */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">Quick presets:</span>
          {presetExamples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDraftBullet(ex)}
              className="px-2.5 py-1 text-[11px] text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-700/60 rounded-lg transition-colors truncate max-w-[280px]"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !draftBullet.trim()}
          className="btn-primary-glow flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold w-full sm:w-auto transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Optimizing with Groq AI...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate 3 Optimized Bullet Variations</span>
            </>
          )}
        </button>
      </form>

      {/* Result Cards */}
      {result && (
        <div className="space-y-4 pt-4 border-t border-gray-800/80 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Primary action verb detected: <strong className="text-purple-300">{result.action_verb_used || 'Engineered'}</strong></span>
            <span>Click any version to copy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Metric / Impact Variation */}
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/25 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Metric & Impact
                  </span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {result.impact_bullet}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.impact_bullet, 'impact')}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/25 transition-colors"
              >
                {copiedKey === 'impact' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'impact' ? 'Copied!' : 'Copy Impact Bullet'}
              </button>
            </div>

            {/* 2. Technical Stack Variation */}
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/25 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Technical Stack
                  </span>
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {result.technical_bullet}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.technical_bullet, 'technical')}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/25 transition-colors"
              >
                {copiedKey === 'technical' ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'technical' ? 'Copied!' : 'Copy Tech Bullet'}
              </button>
            </div>

            {/* 3. Executive / Leadership Variation */}
            <div className="glass-card p-5 rounded-2xl border border-purple-500/25 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    Executive Scope
                  </span>
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {result.executive_bullet}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.executive_bullet, 'executive')}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/25 transition-colors"
              >
                {copiedKey === 'executive' ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'executive' ? 'Copied!' : 'Copy Executive Bullet'}
              </button>
            </div>

          </div>

          {/* Improvement tips */}
          {result.improvement_tips && result.improvement_tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 space-y-1.5">
              <span className="font-bold text-gray-300 block">Pro Tips:</span>
              <ul className="list-disc pl-4 space-y-1">
                {result.improvement_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
