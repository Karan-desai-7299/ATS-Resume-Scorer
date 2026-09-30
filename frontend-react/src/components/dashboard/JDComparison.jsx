import React, { useState } from 'react'
import { Target, CheckCircle2, XCircle, AlertTriangle, Copy, Check, Sparkles, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JDComparison({ jdComparison }) {
  if (!jdComparison) return null

  const [copiedMissing, setCopiedMissing] = useState(false)
  const [copiedGap, setCopiedGap] = useState(false)

  const matchPct = Number(jdComparison?.match_percentage || 0)
  const semantic = Number(jdComparison?.semantic_similarity || 0)
  const matched = jdComparison?.matched_keywords || []
  const missing = jdComparison?.missing_keywords || []
  const gap = jdComparison?.skills_gap || []

  const matchColor = matchPct >= 75 ? '#10b981' : matchPct >= 50 ? '#f59e0b' : '#f43f5e'
  const semanticColor = semantic >= 0.7 ? '#10b981' : semantic >= 0.45 ? '#f59e0b' : '#f43f5e'

  const handleCopyMissing = () => {
    if (!missing.length) return
    navigator.clipboard.writeText(missing.join(', '))
    setCopiedMissing(true)
    toast.success('Missing keywords copied to clipboard!')
    setTimeout(() => setCopiedMissing(false), 2000)
  }

  const handleCopyGap = () => {
    if (!gap.length) return
    navigator.clipboard.writeText(gap.join(', '))
    setCopiedGap(true)
    toast.success('Skills gap copied to clipboard!')
    setTimeout(() => setCopiedGap(false), 2000)
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/25 space-y-6">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Job Description Match Intelligence</h3>
            <p className="text-xs text-gray-400">Direct alignment comparison between your resume and the target role</p>
          </div>
        </div>

        <span className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
          AI Role Match
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { 
            label: 'Keyword Overlap Match', 
            value: Math.round(matchPct), 
            suffix: '%', 
            color: matchColor, 
            desc: 'Percentage of critical target JD keywords detected in resume' 
          },
          { 
            label: 'Semantic Similarity Alignment', 
            value: Math.round(semantic * 100), 
            suffix: '%', 
            color: semanticColor, 
            desc: 'Contextual similarity score between resume text and role expectations' 
          },
        ].map(({ label, value, suffix, color, desc }) => (
          <div key={label} className="glass-card p-5 rounded-2xl border border-gray-800 text-center space-y-2">
            <div className="text-3xl font-extrabold tabular-nums" style={{ color }}>
              {value}<span className="text-lg">{suffix}</span>
            </div>
            <p className="text-xs font-bold text-gray-200">{label}</p>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="h-full rounded-full progress-bar-inner"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} 
              />
            </div>
            <p className="text-[11px] text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Matched Keywords Cloud */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({matched.length})
          </div>
        </div>
        {matched.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No direct keywords matched yet. Incorporate key skills from the target description.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {matched.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Keywords Cloud */}
      <div className="glass-card p-5 rounded-2xl border border-rose-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
            <XCircle className="w-4 h-4" /> Missing Target Keywords ({missing.length})
          </div>
          {missing.length > 0 && (
            <button
              type="button"
              onClick={handleCopyMissing}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copiedMissing ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedMissing ? 'Copied!' : 'Copy Missing'}
            </button>
          )}
        </div>
        {missing.length === 0 ? (
          <p className="text-xs text-emerald-400 italic flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Great job! All primary target keywords were detected in your resume.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {missing.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" /> {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Skills Gap Analysis */}
      {gap.length > 0 && (
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Identified Skills Gap ({gap.length})
            </div>
            <button
              type="button"
              onClick={handleCopyGap}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copiedGap ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedGap ? 'Copied!' : 'Copy Gap List'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {gap.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] font-medium text-amber-200 bg-amber-950/40 border border-amber-500/30 rounded-lg"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
