import React, { useState } from 'react'
import { Target, CheckCircle2, XCircle, AlertTriangle, Copy, Check, ClipboardList } from 'lucide-react'
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

  const matchColor = matchPct >= 75 ? '#34d399' : matchPct >= 50 ? '#fbbf24' : '#f87171'
  const semanticColor = semantic >= 0.7 ? '#34d399' : semantic >= 0.45 ? '#fbbf24' : '#f87171'

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
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-400" /> 🎯 Job Description Match Analysis
      </h3>

      {/* Score gauges row */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Keyword Match', value: Math.round(matchPct), suffix: '%', color: matchColor, desc: 'Keywords from JD found in resume' },
          { label: 'Semantic Similarity', value: Math.round(semantic * 100), suffix: '%', color: semanticColor, desc: 'Overall content alignment score' },
        ].map(({ label, value, suffix, color, desc }) => (
          <div key={label} className="glass-card p-5 rounded-2xl border border-gray-800 text-center space-y-3">
            <div className="text-3xl font-extrabold tabular-nums" style={{ color }}>
              {value}<span className="text-lg">{suffix}</span>
            </div>
            <p className="text-xs font-bold text-gray-300">{label}</p>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full progress-bar-inner"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}50` }} />
            </div>
            <p className="text-[10px] text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Matched Keywords */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> ✅ Matched Keywords ({matched.length})
          </div>
        </div>
        {matched.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No keywords matched yet. Try adding relevant terms from the JD.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {matched.slice(0, 20).map((kw, idx) => (
              <span key={idx}
                className="px-2.5 py-0.5 text-[11px] font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ✓ {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Keywords + Skills Gap — side by side with copy button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Keywords */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <XCircle className="w-4 h-4" /> Missing Keywords ({missing.length})
            </div>
            {missing.length > 0 && (
              <button
                onClick={handleCopyMissing}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                {copiedMissing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMissing ? 'Copied!' : 'Copy All'}
              </button>
            )}
          </div>
          {missing.length === 0 ? (
            <p className="text-xs text-emerald-400 italic flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All key terms are present!
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500">💡 Add these to your resume skills section or bullet points:</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {missing.slice(0, 12).map((kw, idx) => (
                  <span key={idx}
                    className="px-2.5 py-0.5 text-[11px] font-semibold rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 cursor-pointer hover:bg-rose-500/20 transition-colors"
                    onClick={() => { navigator.clipboard.writeText(kw); toast.success(`Copied: "${kw}"`) }}
                    title="Click to copy"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills Gap */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Skills Gap ({gap.length})
            </div>
            {gap.length > 0 && (
              <button
                onClick={handleCopyGap}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                {copiedGap ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedGap ? 'Copied!' : 'Copy All'}
              </button>
            )}
          </div>
          {gap.length === 0 ? (
            <p className="text-xs text-emerald-400 italic flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> No significant skills gap!
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {gap.slice(0, 12).map((skill, idx) => (
                <span key={idx}
                  className="px-2.5 py-0.5 text-[11px] font-semibold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors"
                  onClick={() => { navigator.clipboard.writeText(skill); toast.success(`Copied: "${skill}"`) }}
                  title="Click to copy"
                >
                  ⚠ {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action tip */}
      {(missing.length > 0 || gap.length > 0) && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2 text-xs text-indigo-300">
          <ClipboardList className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Pro tip:</strong> Click any keyword to copy it individually, or use "Copy All" to get the full list.
            Paste these directly into your resume's skills section or use the <strong>AI Bullet Optimizer</strong> to weave them into your experience bullets.
          </span>
        </div>
      )}
    </div>
  )
}
